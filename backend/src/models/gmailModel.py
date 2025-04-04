from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SendGmailRequest(BaseModel):
    to: str
    subject: str
    message: str

class GmailToken(BaseModel):
    user_id: str
    access_token: str
    refresh_token: Optional[str]
    scope: Optional[str]
    token_type: Optional[str] = "Bearer"
    expires_in: Optional[int]
    expiry_date: Optional[datetime]
