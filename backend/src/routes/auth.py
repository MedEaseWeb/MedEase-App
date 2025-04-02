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
    """Authenticate and issue a JWT"""
    existing_user = await user_collection.find_one({"email": user.email})

    if not existing_user or not bcrypt.checkpw(user.password.encode(), existing_user["hashed_password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if existing_user.get("is_disabled", False):
        raise HTTPException(status_code=403, detail="User account is disabled")

    # Generate JWT token
    # Currently in production mode 
    token = create_jwt({"user_id": str(existing_user["user_id"]), "email": existing_user["email"]})

    # Set JWT in HttpOnly cookie
    # TODO: Set secure=True in production
    # response.set_cookie(key="access_token", value=token, httponly=True, secure=True, samesite="None") # Production Mode
    response.set_cookie(key="access_token", value=token, httponly=True, secure=False, samesite="Lax") # Developement Mode

    return {"message": "Login successful", "token": token}

# User Logout
@auth_router.post("/logout")
async def logout(response: Response):
    """Clear the authentication token"""
    response.delete_cookie(key="access_token")  
    return {"message": "Logged out successfully"}


# # Get User Info (Protected Route)
# @auth_router.get("/user", response_model=UserResponse)
# async def get_user(current_user: dict = Depends(get_current_user)):
#     """Fetch user details"""
#     user = await user_collection.find_one({"_id": ObjectId(current_user["user_id"])})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     return UserResponse(
#         id=str(user["_id"]),
#         email=user["email"],
#         created_at=user["created_at"],
#         is_disabled=user.get("is_disabled", False)
#     )

# # Delete User Account (Protected)
# @auth_router.delete("/delete")
# async def delete_user(current_user: dict = Depends(get_current_user)):
#     """Allow authenticated users to delete their account"""
#     delete_result = await user_collection.delete_one({"_id": ObjectId(current_user["user_id"])})

#     if delete_result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="User not found")

#     return {"message": "User account deleted successfully"}

