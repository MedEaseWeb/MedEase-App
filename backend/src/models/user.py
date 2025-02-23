from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """Schema for user registration input."""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """Schema for API response when retrieving user info."""
    id: str
    email: EmailStr
    created_at: datetime

class UserInDB(UserResponse):
    """Schema for user storage in MongoDB (includes hashed password)."""
    hashed_password: str
