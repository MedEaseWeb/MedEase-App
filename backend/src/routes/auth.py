from fastapi import APIRouter, HTTPException, Depends, Response, Request
from src.database import user_collection
from src.models.userModel import UserCreate, UserResponse, UserInDB
from bson import ObjectId
from datetime import datetime
import bcrypt
from src.utils.jwtUtils import create_jwt, get_current_user

auth_router = APIRouter()

# User Registration
@auth_router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    """Register a new user"""
    existing_user = await user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

    new_user = UserInDB(
        user_id=str(ObjectId()),
        email=user.email,
        hashed_password=hashed_password,
        created_at=datetime.utcnow(),
        is_disabled=False
    )

    await user_collection.insert_one(new_user.dict())

    return UserResponse(user_id=new_user.user_id, email=user.email, created_at=new_user.created_at, is_disabled=new_user.is_disabled)

# User Login (JWT Issuance)
@auth_router.post("/login")
async def login(user: UserCreate, response: Response):
    existing_user = await user_collection.find_one({"email": user.email})

    if not existing_user or not bcrypt.checkpw(user.password.encode(), existing_user["hashed_password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if existing_user.get("is_disabled", False):
        raise HTTPException(status_code=403, detail="User account is disabled")

    token = create_jwt({
        "user_id": str(existing_user["user_id"]),
        "email": existing_user["email"]
    })

    # ✅ Set cookie with Max-Age and expiry
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # ✅ Change to True in production
        samesite="Lax",
        max_age=1800,  # ✅ 30 minutes
        expires=1800
    )

    return {"message": "Login successful"}


# User Logout
@auth_router.post("/logout")
async def logout(response: Response):
    """Clear the authentication token"""
    response.delete_cookie(key="access_token")  
    return {"message": "Logged out successfully"}

# Get current user
@auth_router.get("/user", response_model=UserResponse)
async def get_user(payload: dict = Depends(get_current_user)):
    user = await user_collection.find_one({"user_id": payload["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        user_id=user["user_id"],
        email=user["email"],
        created_at=user["created_at"],
        is_disabled=user.get("is_disabled", False)
    )
