from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    """Schema for user registration input."""
    email: EmailStr
    password: str
 
class UserResponse(BaseModel):
    """Schema for API response when retrieving user info."""
    user_id: str
    email: EmailStr
    created_at: datetime
    is_disabled: bool

class UserInDB(UserResponse):
    """Schema for user storage in MongoDB (includes hashed password)."""
    hashed_password: str



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
    medication_name: str  # Professional name
    common_name: Optional[str] = None  # Widely recognized name
    purpose: str  # Two sentences explaining what it's for
    schedule: MedicationSchedule
    prescription_details: PrescriptionDetails
    pharmacy: PharmacyInfo
    safety_info: SafetyInfo
    is_disabled: bool 

class MedicationTextRequest(BaseModel):
    text: str