from pydantic import BaseModel

class PatientData(BaseModel):
    user_id: str
    patient_name: str
    patient_email: str
    generated_key: str
    simplified_report: str
    medication_note: str

