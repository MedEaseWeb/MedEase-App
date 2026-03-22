from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import datetime


class WaitlistEntry(BaseModel):
    name: str
    email: EmailStr
    role: Literal["patient", "caregiver", "other"]


class WaitlistEntryInDB(WaitlistEntry):
    created_at: datetime
