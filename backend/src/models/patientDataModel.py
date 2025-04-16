from pydantic import BaseModel
from typing import  List, Optional

class PatientData(BaseModel):
    patient_id: str
    caregiver_id: str
    patient_email: str
    patient_name: Optional[str] = None
    patient_phone: Optional[str] = None
    medical_reports: Optional[List[dict]] = None
    medication_note: Optional[List[dict]] = None
    caregiver_note: Optional[str] = None

class PatientDataRequest(BaseModel):
    patient_email: str
    generated_key: str
   