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
    calendar_email: str

class CalendarEventRequest(BaseModel):
    summary: str
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: datetime  # ISO format
    end_time: datetime    # ISO format
    recurrence_days: Optional[int]