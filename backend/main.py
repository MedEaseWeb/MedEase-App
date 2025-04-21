# main.py
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

import src.socket_server as socket_server
# Create FastAPI app
api_app = FastAPI()

api_app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://medease.pages.dev",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
api_app.include_router(auth_router,         prefix="/auth")
api_app.include_router(medication_router,   prefix="/medication")
api_app.include_router(general_router,      prefix="/general")
api_app.include_router(google_oauth_router, prefix="/google")
api_app.include_router(caregiver_router,    prefix="/caregiver")
api_app.include_router(simplify_router,     prefix="/simplify")

@api_app.get("/")
def hello_world():
    return {"message":"Hello World"}

# Now inject api_app into socket_server
socket_server.api_app = api_app

# Wrap with Socket.IO
sio = socket_server.sio
app = socketio.ASGIApp(
    socketio_server = sio,
    other_asgi_app  = api_app,
    socketio_path   = "/ws/socket.io"
)