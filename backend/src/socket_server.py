# src/socket_server.py

import json
import socketio
import httpx
from openai import OpenAI

from src.config import CHAT_GPT_API_KEY
from src.agenticActions import tools

# ───── OpenAI client ───────────────────────────
client = OpenAI(api_key=CHAT_GPT_API_KEY)

preprompt = (
    "You are a friendly and knowledgeable caregiver assistant. "
    "Help the user set reminders by gathering all necessary details: "
    "summary, start_time, end_time, and optional recurrence_days. "
    "Keep asking until you have everything, then call add_reminder."
)

# ───── Socket.IO server setup ──────────────────
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=[
        "http://localhost:5173",
        "https://medease.pages.dev",
    ],
    cors_credentials=True,
)

# Placeholder for the FastAPI app, injected at runtime by main.py
api_app = None

# ───── In‑memory session state ─────────────────
histories    = {}    # chat history per client sid
sid_to_token = {}    # MedEase JWT per client sid

@sio.event
async def connect(sid, environ, auth):
    token = auth.get("token", "")
    sid_to_token[sid] = token
    histories[sid] = [{"role":"system","content":preprompt}]
    print(f"Client connected: {sid} – token: {token}")

@sio.event
async def disconnect(sid):
    histories.pop(sid, None)
    sid_to_token.pop(sid, None)
    print(f"Client disconnected: {sid}")

@sio.event
async def user_message(sid, data):
    # Normalize input
    user_text = data["content"] if isinstance(data, dict) and data.get("mode")=="reminder" else data

    # Append to history
    histories[sid].append({"role":"user","content":user_text})

    # Ask GPT
    gpt_resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=histories[sid],
        functions=tools,
        function_call="auto",
    )
    msg = gpt_resp.choices[0].message

    # Plain text reply?
    if msg.content:
        histories[sid].append({"role":"assistant","content":msg.content})
        await sio.emit("bot-message", msg.content, room=sid)
        return

    # Function call: add_reminder?
    if msg.function_call and msg.function_call.name=="add_reminder":
        args = json.loads(msg.function_call.arguments)
        payload = {
            "summary":         args.get("summary"),
            "description":     args.get("description"),
            "location":        args.get("location"),
            "start_time":      args.get("start_time"),
            "end_time":        args.get("end_time"),
            "recurrence_days": args.get("recurrence_days"),
        }
        # Missing check
        missing = [f for f in ("summary","start_time","end_time") if not payload.get(f)]
        if missing:
            histories[sid].append({
                "role":"assistant",
                "content":None,
                "function_call":msg.function_call
            })
            followup = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=histories[sid],
                functions=tools,
                function_call="auto",
            )
            ask = followup.choices[0].message.content
            histories[sid].append({"role":"assistant","content":ask})
            await sio.emit("bot-message", ask, room=sid)
            return

        # Dispatch into FastAPI (no real TCP)
        token   = sid_to_token.get(sid,"")
        headers = {"Authorization":f"Bearer {token}"} if token else {}

        async with httpx.AsyncClient(
            app=api_app,
            base_url="http://testserver",
            headers=headers
        ) as client_http:
            resp = await client_http.post(
                "/google/add-calendar-event",
                json=payload
            )

        func_response = resp.json() if resp.status_code in (200,201) else {"error":resp.text}

        # Feed back to GPT
        histories[sid].append({
            "role":"assistant",
            "content":None,
            "function_call":msg.function_call
        })
        histories[sid].append({
            "role":"function",
            "name":msg.function_call.name,
            "content":json.dumps(func_response)
        })
        final = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=histories[sid],
        )
        reply = final.choices[0].message.content
        histories[sid].append({"role":"assistant","content":reply})
        await sio.emit("bot-message", reply, room=sid)
        return

    # Fallback
    fallback = "Sorry, I couldn't handle that."
    histories[sid].append({"role":"assistant","content":fallback})
    await sio.emit("bot-message", fallback, room=sid)
