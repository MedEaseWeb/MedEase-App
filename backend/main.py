from fastapi import FastAPI
from src.database import database
from src.routes.auth import auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],  # Frontend lURL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_router, prefix="/auth")

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

@app.get("/mongo")
async def root():
    try:
        # Ping MongoDB to check if the connection is working
        server_status = await database.command("ping")
        return {"message": "MongoDB Connected!", "serverStatus": server_status}
    except Exception as e:
        return {"message": "MongoDB Connection Failed!", "error": str(e)}