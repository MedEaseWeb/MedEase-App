from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Model for google calendar tokens
class GoogleCalendarToken(BaseModel):
    user_id: str
    access_token: str
    refresh_token: Optional[str]
    scope: Optional[str]
    token_type: Optional[str] = "Bearer"
    expires_in: Optional[int]
    expiry_date: Optional[datetime]