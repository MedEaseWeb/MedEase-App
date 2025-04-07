from fastapi import FastAPI
from src.database import database
from src.routes.auth import auth_router
from src.routes.medication import medication_router
from src.routes.general import general_router
from src.routes.google import google_oauth_router
from src.routes.caregiver import caregiver_router
from src.routes.simplify import router as simplify_router
from fastapi.middleware.cors import CORSMiddleware

# from src.socket_server import register_socketio_events
# from fastapi_socketio import SocketManager

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://medease.pages.dev", "http://localhost:5173"],  # Frontend lUR
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_router, prefix="/auth")
app.include_router(medication_router, prefix="/medication")
app.include_router(general_router, prefix="/general")
app.include_router(google_oauth_router, prefix="/google")
app.include_router(caregiver_router, prefix="/caregiver")
app.include_router(simplify_router, prefix="/simplify")

# Create SocketManager and register it
# socket_manager = SocketManager(app=app)

# Register events
# register_socketio_events(socket_manager)

@app.get("/")
def hello_world():
    return {"message": "Hello World"}
