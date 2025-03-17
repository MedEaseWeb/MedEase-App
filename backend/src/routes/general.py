from fastapi import APIRouter, HTTPException, Depends, Response, Request
from src.database import user_collection
from src.models.userModel import MedicationNoteInDB, MedicationSchedule, MedicationTextRequest, PharmacyInfo, PrescriptionDetails, SafetyInfo
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


