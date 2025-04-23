# src/socket_server.py

import json
import socketio
import httpx
from openai import OpenAI

from src.config import CHAT_GPT_API_KEY
from src.agenticActions import tools
from http.cookies import SimpleCookie

# ───── OpenAI client ───────────────────────────
client = OpenAI(api_key=CHAT_GPT_API_KEY)

preprompt = (
    "You are a friendly and knowledgeable caregiver assistant. "
    "Help the user set reminders by gathering all necessary details: "
    "summary, start_time, end_time, and optional recurrence_days. "
    "Also, if the user asks for patient data, gather patient_email and generated_key and call get_patient_data. "
    "Keep asking follow-up questions until you have everything needed, then call the appropriate function."
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

# ───── In-memory session state ─────────────────
histories    = {}    # chat history per client sid
sid_to_token = {}    # MedEase JWT per client sid

@sio.event
async def connect(sid, environ, auth):
    # Grab the raw Cookie header
    raw = environ.get("HTTP_COOKIE", "")
    cookies = SimpleCookie(raw)

    # The name must match what you set in FastAPI:
    morsel = cookies.get("access_token")
    token = morsel.value if morsel else None

    print("🛡️  Extracted JWT from cookie:", token)
    sid_to_token[sid] = token
    histories[sid] = [{"role":"system","content":preprompt}]
    print(f"Client connected: {sid} – token: {token!r}")

@sio.event
async def disconnect(sid):
    histories.pop(sid, None)
    sid_to_token.pop(sid, None)
    print(f"Client disconnected: {sid}")

@sio.event
async def user_message(sid, data):
    # 1) Normalize & record user input
    user_text = data["content"] if isinstance(data, dict) and data.get("mode") in ("reminder","patient_data") else data
    histories[sid].append({"role":"user","content":user_text})

    # 2) Ask GPT for next action
    gpt_resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=histories[sid],
        functions=tools,
        function_call="auto",
    )
    msg = gpt_resp.choices[0].message

    # 3) Plain-text reply?
    if msg.content:
        histories[sid].append({"role":"assistant","content": msg.content})
        await sio.emit("bot-message", msg.content, room=sid)
        return

    # 4) Handle add_reminder
    if msg.function_call and msg.function_call.name == "add_reminder":
        args = json.loads(msg.function_call.arguments)
        payload = {
            "summary":       args.get("summary"),
            "description":   args.get("description"),
            "location":      args.get("location"),
            "start_time":    args.get("start_time"),
            "end_time":      args.get("end_time"),
            "recurrence_days": args.get("recurrence_days"),
        }
        # Ask again if missing
        missing = [f for f in ("summary","start_time","end_time") if not payload.get(f)]
        if missing:
            histories[sid].append({
                "role":"assistant",
                "function_call": msg.function_call
            })
            followup = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=histories[sid],
                functions=tools,
                function_call="auto",
            )
            question = followup.choices[0].message.content
            histories[sid].append({"role":"assistant","content": question})
            await sio.emit("bot-message", question, room=sid)
            return

        # In-process POST
        token   = sid_to_token.get(sid, "")
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        async with httpx.AsyncClient(app=api_app, base_url="http://localhost:8081", headers=headers) as client_http:
            resp = await client_http.post("/google/add-calendar-event", json=payload)

        func_resp = resp.json() if resp.status_code in (200,201) else {"error": resp.text}
        histories[sid].append({
            "role":"assistant",
            "function_call": msg.function_call
        })
        histories[sid].append({
            "role":"function",
            "name": msg.function_call.name,
            "content": json.dumps(func_resp)
        })

        final = client.chat.completions.create(model="gpt-4o-mini", messages=histories[sid])
        reply = final.choices[0].message.content
        histories[sid].append({"role":"assistant","content": reply})
        await sio.emit("bot-message", reply, room=sid)
        return

    # 5) Handle get_patient_data
    if msg.function_call and msg.function_call.name == "get_patient_data":
        args = json.loads(msg.function_call.arguments)
        payload = {
            "patient_email": args.get("patient_email"),
            "generated_key": args.get("generated_key"),
        }
        # Ask again if missing
        missing = [f for f in ("patient_email","generated_key") if not payload.get(f)]
        if missing:
            histories[sid].append({
                "role":"assistant",
                "function_call": msg.function_call
            })
            followup = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=histories[sid],
                functions=tools,
                function_call="auto",
            )
            question = followup.choices[0].message.content
            histories[sid].append({"role":"assistant","content": question})
            await sio.emit("bot-message", question, room=sid)
            return

        # In-process POST
        token   = sid_to_token.get(sid, "")
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        async with httpx.AsyncClient(app=api_app, base_url="http://localhost:8081", headers=headers) as client_http:
            resp = await client_http.post("/caregiver/patient-data", json=payload)

        func_resp = resp.json() if resp.status_code == 200 else {"error": resp.text}
        histories[sid].append({
            "role":"assistant",
            "function_call": msg.function_call
        })
        histories[sid].append({
            "role":"function",
            "name": msg.function_call.name,
            "content": json.dumps(func_resp)
        })

        final = client.chat.completions.create(model="gpt-4o-mini", messages=histories[sid])
        reply = final.choices[0].message.content
        histories[sid].append({"role":"assistant","content": reply})
        await sio.emit("bot-message", reply, room=sid)
        return

    # 6) Fallback
    fallback = "Sorry, I couldn't handle that."
    histories[sid].append({"role":"assistant","content": fallback})
    await sio.emit("bot-message", fallback, room=sid)
