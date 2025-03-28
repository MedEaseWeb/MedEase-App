from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    """Schema for user registration input."""
    email: EmailStr
    password: str
 
class UserResponse(BaseModel):
    """Schema for API response when retrieving user info."""
    user_id: str
    email: EmailStr
    created_at: datetime
    is_disabled: bool

class UserInDB(UserResponse):
    """Schema for user storage in MongoDB (includes hashed password)."""
    hashed_password: str

