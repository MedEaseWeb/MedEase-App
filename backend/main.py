from fastapi import FastAPI
from src.database import database
from src.routes.auth import auth_router
from src.routes.medication import medication_router
from src.routes.general import general_router
from src.routes.google import google_oauth_router
from src.routes.caregiver import caregiver_router
from src.routes.simplify import router as simplify_router
from fastapi.middleware.cors import CORSMiddleware

import socketio
from src.socket_server import register_socketio_events

# Socket.IO AsyncServer instance
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["http://localhost:5173", "https://medease.pages.dev"], 
    logger=False, 
    engineio_logger=False
)

api_app = FastAPI()

# CORS on api_app
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://medease.pages.dev", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_app.include_router(auth_router, prefix="/auth")
api_app.include_router(medication_router, prefix="/medication")
api_app.include_router(general_router, prefix="/general")
api_app.include_router(google_oauth_router, prefix="/google")
api_app.include_router(caregiver_router, prefix="/caregiver")
api_app.include_router(simplify_router, prefix="/simplify")

# Define HTTP routes on the FastAPI app.
@api_app.get("/")
def hello_world():
    return {"message": "Hello World"}

register_socketio_events(sio)

# Wrap FastAPI app with the Socket.IO ASGI app
app = socketio.ASGIApp(sio, other_asgi_app=api_app, socketio_path="/ws/socket.io")
