# src/socket_server.py
#
# Thin Socket.IO layer. All business logic now lives in src/agents/.
# Responsibilities here: session lifecycle, JWT extraction, emit results.
#
# Streaming protocol (when agent sets stream=True):
#   Server emits: "bot-token" (str) per chunk, then "bot-done" (empty) when complete.
# Non-streaming:
#   Server emits: "bot-message" (str) with the full reply.

import socketio
from http.cookies import SimpleCookie
import jwt

from src.agents import Orchestrator, AgentContext

# ───── Socket.IO server setup ──────────────────
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=[
        "http://localhost:5173",
        "https://medease.pages.dev",
    ],
    cors_credentials=True,
)

# Injected at runtime by main.py after the FastAPI app is created
api_app = None

# ───── Orchestrator (single instance) ──────────
orchestrator = Orchestrator(api_app=None)

# ───── Per-session state ────────────────────────
# contexts[sid] → AgentContext  (history + metadata live here)
# sid_to_token[sid] → raw JWT string
contexts     = {}
sid_to_token = {}

_INITIAL_SYSTEM_PROMPT = (
    "You are a helpful assistant for MedEase, a healthcare and Emory DAS app. "
    "You can help with accommodation letters, DAS questions, medications, caregiver tasks, and reminders."
)


@sio.event
async def connect(sid, environ, auth):
    raw     = environ.get("HTTP_COOKIE", "")
    cookies = SimpleCookie(raw)
    morsel  = cookies.get("access_token")
    token   = morsel.value if morsel else None

    sid_to_token[sid] = token
    contexts[sid] = AgentContext(
        session_id=sid,
        user_id=None,
        token=token,
        history=[{"role": "system", "content": _INITIAL_SYSTEM_PROMPT}],
    )
    print(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    contexts.pop(sid, None)
    sid_to_token.pop(sid, None)
    print(f"Client disconnected: {sid}")


@sio.event
async def user_message(sid, data):
    # Normalise data — frontend sends either a plain string or {content, mode}
    if isinstance(data, dict):
        user_text = data.get("content", "")
    else:
        user_text = str(data)

    context = contexts.get(sid)
    if context is None:
        await sio.emit("bot-message", "Session expired. Please refresh.", room=sid)
        return

    # Always keep the token fresh (may have changed since connect)
    context.token = sid_to_token.get(sid)

    async def emit_step(step_id: str, label: str, state: str, **meta):
        await sio.emit("bot-pipeline", {"id": step_id, "label": label, "state": state, **meta}, room=sid)

    response = await orchestrator.handle(user_text, context, emit_step=emit_step)

    if response.stream and response.stream_gen is not None:
        # ── Streaming response ─────────────────────────────────────────────
        full_reply = ""
        async for token in response.stream_gen:
            full_reply += token
            await sio.emit("bot-token", token, room=sid)
        await sio.emit("bot-done", "", room=sid)
        await emit_step("generate", "Response complete", "done")

        # Append the completed turn to history
        contexts[sid].history.append({"role": "user",      "content": user_text})
        contexts[sid].history.append({"role": "assistant", "content": full_reply})

    else:
        # ── Non-streaming response ─────────────────────────────────────────
        if response.updated_context is not None:
            contexts[sid] = response.updated_context
        else:
            contexts[sid].history.append({"role": "user",      "content": user_text})
            contexts[sid].history.append({"role": "assistant", "content": response.content})

        await sio.emit("bot-message", response.content, room=sid)


def set_api_app(app) -> None:
    """Called by main.py once the FastAPI app instance exists."""
    global api_app
    api_app = app
    orchestrator.set_api_app(app)
