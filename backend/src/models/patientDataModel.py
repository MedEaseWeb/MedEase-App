from pydantic import BaseModel
from typing import  List

class PatientData(BaseModel):
    user_id: str
    patient_name: str
    patient_email: str
    generated_key: str
    simplified_report: List[str]
    medication_note: str

