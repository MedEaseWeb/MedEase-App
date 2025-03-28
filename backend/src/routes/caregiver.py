from fastapi import APIRouter, HTTPException, Depends, Response, Request
from bson import ObjectId
from datetime import datetime
import bcrypt
from src.utils.jwtUtils import get_current_user

caregiver_router = APIRouter()

# @caregiver_router.post("/websocket")
@caregiver_router.get("/")
def hello_world():
    return {"message": "Hello World"}