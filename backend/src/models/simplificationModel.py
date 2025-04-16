from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MedicalReport(BaseModel):
    user_id: str
    report_id: str
    user_email: str
    original_report: str
    simplified_report: str
    date_created: datetime
