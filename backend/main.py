from fastapi import FastAPI
from src.database import database
from src.routes.auth import auth_router
from src.routes.medication import medication_router
from src.routes.general import general_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://medease.pages.dev"],  # Frontend lUR
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_router, prefix="/auth")
app.include_router(medication_router, prefix="/medication")
app.include_router(general_router, prefix="/general")


@app.get("/")
def hello_world():
    return {"message": "Hello World"}
