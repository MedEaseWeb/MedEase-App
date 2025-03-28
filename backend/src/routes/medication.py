from fastapi import APIRouter, HTTPException, Depends, Response, Request
from src.database import medication_collection, user_collection
from src.models.medicationModel import MedicationNoteInDB, MedicationSchedule, MedicationTextRequest, PharmacyInfo, PrescriptionDetails, SafetyInfo
from bson import ObjectId
from datetime import datetime
import bcrypt
from src.LLMmodel.ChatGPT import extract_medication_info
from src.utils.jwtUtils import get_current_user

medication_router = APIRouter()

@medication_router.post("/extract-medication", response_model=MedicationNoteInDB)
async def process_medication_text(request: MedicationTextRequest, user_id: str = Depends(get_current_user)):
    """Extracts medication details using ChatGPT and stores them in MongoDB."""
    text = request.text
    # print(f"User ID extracted from JWT: {user_id}")
    extracted_data = await extract_medication_info(text)

    # Validate user
    user = await user_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create medication note entry
    new_note = MedicationNoteInDB(
        user_id=user_id,  # Use the user_id passed to the function
        medication_id=str(ObjectId()),
        medication_name=extracted_data["medication_name"],
        common_name=extracted_data.get("common_name"),  # Optional
        purpose=extracted_data["purpose"],
        schedule=MedicationSchedule(
            dosage=extracted_data["schedule"]["dosage"],
            instructions=extracted_data["schedule"]["instructions"]
        ),
        prescription_details=PrescriptionDetails(
            start_date=extracted_data["prescription_details"]["start_date"],
            end_date=extracted_data["prescription_details"]["end_date"],
            prescribed_by=extracted_data["prescription_details"]["prescribed_by"],
            quantity=extracted_data["prescription_details"]["quantity"],
            duration=extracted_data["prescription_details"]["duration"],
            action_if_run_out=extracted_data["prescription_details"]["action_if_run_out"]
        ),
        pharmacy=PharmacyInfo(
            name=extracted_data["pharmacy"]["name"],
            location=extracted_data["pharmacy"]["location"],
            number=extracted_data["pharmacy"]["number"],
            pharmacy_tip=extracted_data["pharmacy"]["pharmacy_tip"]
        ),
        safety_info=SafetyInfo(
            addiction_risk=extracted_data["safety_info"]["addiction_risk"],
            side_effects=extracted_data["safety_info"]["side_effects"],
            overdose_symptoms=extracted_data["safety_info"]["overdose_symptoms"],
            disposal_instructions=extracted_data["safety_info"]["disposal_instructions"],
            storage_instructions=extracted_data["safety_info"]["storage_instructions"]
        ),
        is_disabled=False,
        created_at=datetime.utcnow()
    )

    # Insert new medication note into MongoDB
    await medication_collection.insert_one(new_note.dict())

    return new_note

# TODO: might not need this endpoint 
@medication_router.get("/latest", response_model=MedicationNoteInDB)
async def get_latest_medication_note(user_id: str = Depends(get_current_user)):
    """Fetch the latest medication note for a user."""
    note = await medication_collection.find_one(
        {"user_id": user_id}, 
        sort=[("created_at", -1)] 
    )
    
    if not note:
        raise HTTPException(status_code=404, detail="No medication notes found")
    
    return note
