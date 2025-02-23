from fastapi import FastAPI
from src.database import database
from src.routes.auth import auth_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth")

@app.get("/")
async def root():
    try:
        # Ping MongoDB to check if the connection is working
        server_status = await database.command("ping")
        return {"message": "MongoDB Connected!", "serverStatus": server_status}
    except Exception as e:
        return {"message": "MongoDB Connection Failed!", "error": str(e)}