from fastapi import APIRouter, HTTPException, Depends
from src.database import user_collection
from src.models.user import UserCreate, UserResponse, UserInDB
from bson import ObjectId
from datetime import datetime
import bcrypt

auth_router = APIRouter()

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

@auth_router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if the user already exists
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash the password before storing it
    hashed_password = hash_password(user.password)

    # Create new user document
    new_user = UserInDB(
        id=str(ObjectId()),  # Convert MongoDB ObjectId to string
        email=user.email,
        hashed_password=hashed_password,
        created_at=datetime.utcnow()
    )

    # Insert into MongoDB
    inserted_user = await user_collection.insert_one(new_user.dict())

    return UserResponse(id=str(inserted_user.inserted_id), email=user.email, created_at=new_user.created_at)
