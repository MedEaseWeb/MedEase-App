from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class DiaryEntryUploadRequest(BaseModel):
    caregiver_id: Optional[str] = None
    patient_first_name: str
    patient_last_name: str
    patient_email: str
    caregiver_notes: str
    images: Optional[List[str]] = []
    date_uploaded: Optional[datetime] = None 
