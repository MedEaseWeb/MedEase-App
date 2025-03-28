from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# Model for medication note
class MedicationSchedule(BaseModel):
    dosage: str # how much in how long 
    instructions: List[str] # list of bullet points 

class PrescriptionDetails(BaseModel):
    start_date: datetime # the ealrliest date to get from pharmacy
    end_date: datetime # the latest date to get from pharmacy
    prescribed_by: str # name of the doctor
    quantity: str
    duration: str  # How long does this quantity lasts
    action_if_run_out: List[str]

class PharmacyInfo(BaseModel):
    name: str # name of pharmacy 
    location: str # address 
    number: str # phone number
    pharmacy_tip: List[str]

class SafetyInfo(BaseModel):
    addiction_risk: List[str]
    side_effects: List[str]
    overdose_symptoms: List[str]
    disposal_instructions: List[str]
    storage_instructions: List[str]

class MedicationNoteInDB(BaseModel):
    """Schema for structured medication note storage in MongoDB."""
    user_id: str  # Stores the `user_id` from users collection
    medication_id: str
    medication_name: str  # Professional name
    common_name: Optional[str] = None  # Widely recognized name
    purpose: str  # Two sentences explaining what it's for
    schedule: MedicationSchedule
    prescription_details: PrescriptionDetails
    pharmacy: PharmacyInfo
    safety_info: SafetyInfo
    is_disabled: bool
    created_at: datetime

class MedicationTextRequest(BaseModel):
    text: str