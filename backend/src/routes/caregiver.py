from fastapi import APIRouter, HTTPException, Depends, Response, Request
from bson import ObjectId
from datetime import datetime
import bcrypt
from src.utils.jwtUtils import get_current_user

caregiver_router = APIRouter()

# @caregiver_router.post("/websocket")
# add the logic to fetch patients by patient id 
@caregiver_router.get("patients")
def hello_world():
    return {"message": "Hello World"}