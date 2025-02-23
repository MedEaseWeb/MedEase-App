from fastapi import APIRouter, HTTPException
from src.database import user_collection
from src.models.user import UserCreate, UserResponse
from bson import ObjectId

auth_router = APIRouter()

@auth_router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = await user_collection.insert_one({"email": user.email, "password": user.password})
    return {"id": str(new_user.inserted_id), "email": user.email}
