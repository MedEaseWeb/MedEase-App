from fastapi import APIRouter, HTTPException, Depends, Response, Request
from src.database import patient_key_collection, user_collection
from src.models.userModel import UserKey, KeyRequest
from bson import ObjectId
from datetime import datetime
import bcrypt
from src.utils.jwtUtils import get_current_user

general_router = APIRouter()

@general_router.get("/email")
async def get_user_profile(user_id: str = Depends(get_current_user)):
    """Fetch user profile information from MongoDB."""
    user = await user_collection.find_one({"user_id": user_id}, {"hashed_password": 0})  # Exclude password
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"email": user["email"]}


@general_router.post("/generate-key")
async def generate_user_key(key_req: KeyRequest, user_id: str = Depends(get_current_user)):
    """Store the frontend-generated key for the user."""
    user = await user_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    created_at = datetime.utcnow()
    
    key_doc = {
        "user_id": user_id,
        "generated_key": key_req.generated_key,  
        "is_disabled": False,
        "created_at": created_at,
    }
    
    await patient_key_collection.insert_one(key_doc)
    
    return {
        "user_id": user_id,
        "generated_key": key_req.generated_key,
        "expires_in_seconds": 3600
    }
