from fastapi import APIRouter, HTTPException, Query, Depends
from src.config import AWS_BUCKET_NAME
from src.models.diaryModel import DiaryEntryUploadRequest
from src.models.patientDataModel import PatientDataRequest, PatientData
from src.utils.jwtUtils import get_current_user
from src.database import patient_diary_collection, patient_key_collection, user_collection, patient_data_collection, medication_collection, medical_report_collection
from datetime import datetime
from pydantic import BaseModel
from src.utils.s3Connection import generate_presigned_url, generate_presigned_get_url

caregiver_router = APIRouter()

# Add this model to src/models/patientDataModel.py
class PatientUpdateRequest(BaseModel):
    patient_id: str
    name: str = None
    phone: str = None
    caregiver_note: str = None

@caregiver_router.put("/update-patient-info")
async def update_patient_info(
    request: PatientUpdateRequest,
    caregiver_id: str = Depends(get_current_user)
):
    """
    Update a patient's information (name, phone, caregiver's note)
    """
    # Check if patient exists in database
    patient_data = await patient_data_collection.find_one({"user_id": request.patient_id})
    if not patient_data:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )
    
    # Prepare update data
    update_data = {}
    if request.name is not None:
        update_data["name"] = request.name
    if request.phone is not None:
        update_data["phone"] = request.phone
    if request.caregiver_note is not None:
        update_data["caregiver_note"] = request.caregiver_note
    
    # Only update if there are changes
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        
        # Update the patient data
        result = await patient_data_collection.update_one(
            {"user_id": request.patient_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            # If no document was modified, it could be because the data is the same
            # or because the document wasn't found
            if not patient_data:
                raise HTTPException(
                    status_code=404,
                    detail="Patient not found"
                )
    
    # Return updated patient data
    updated_patient = await patient_data_collection.find_one({"user_id": request.patient_id})
    if not updated_patient:
        raise HTTPException(
            status_code=404,
            detail="Failed to retrieve updated patient data"
        )
    
    # Format the response
    return {
        "patient_id": request.patient_id,
        "patient_name": updated_patient.get("name"),
        "patient_phone": updated_patient.get("phone"),
        "caregiver_note": updated_patient.get("caregiver_note"),
        "updated_at": updated_patient.get("updated_at")
    }

# Keep your existing endpoints below...
@caregiver_router.get("/generate-upload-url")
def generate_upload_url(
    filename: str = Query(...),
    content_type: str = Query("image/jpeg")
):
    if not AWS_BUCKET_NAME:
        raise HTTPException(status_code=500, detail="Bucket name not configured.")
    
    url = generate_presigned_url(
        bucket_name=AWS_BUCKET_NAME,
        object_name=filename,
        content_type=content_type
    )

    if not url:
        raise HTTPException(status_code=500, detail="Could not generate presigned URL")

    return {
        "upload_url": url,
        "object_key": filename,
        "bucket": AWS_BUCKET_NAME
    }

@caregiver_router.post("/diary-entry-upload")
async def diary_entry_upload(
    diary_entry: DiaryEntryUploadRequest,
    current_user_id: str = Depends(get_current_user)
):
    try:
        diary_data = diary_entry.dict()
        diary_data["caregiver_id"] = str(current_user_id)
        diary_data["date_uploaded"] = datetime.utcnow()
        print(f"Diary entry data to insert: {diary_data}")

        result = await patient_diary_collection.insert_one(diary_data)

        if not result:
            raise HTTPException(status_code=500, detail="Failed to save diary entry")
        diary_data["_id"] = str(result.inserted_id)
        return {
            "message": "Diary entry saved successfully",
            "entry": diary_data
        }
    except Exception as e:
        print(f"Error saving diary entry: {e}")
        raise HTTPException(status_code=500, detail="Error saving diary entry: " + str(e))

@caregiver_router.get("/generate-view-url")
def generate_view_url(
    object_key: str = Query(...),
    expires_in: int = Query(3600)
):
    if not AWS_BUCKET_NAME:
        raise HTTPException(status_code=500, detail="Bucket name not configured.")
    
    view_url = generate_presigned_get_url(
        bucket_name=AWS_BUCKET_NAME,
        object_name=object_key,
        expiration=expires_in
    )

    if not view_url:
        raise HTTPException(status_code=500, detail="Could not generate view URL")

    return {
        "view_url": view_url
    }

@caregiver_router.post("/patient-data", response_model=PatientData)
async def get_patient_data(
    request: PatientDataRequest,
    caregiver_id: str = Depends(get_current_user)
):
    # 1. Look up the patient by email.
    patient_user = await user_collection.find_one({"email": request.patient_email})
    if not patient_user:
        raise HTTPException(
            status_code=404,
            detail="User with that email not found, please check if the email is correct"
        )
    patient_id = str(patient_user["user_id"])

    # 2. Validate the generated key.
    key_entry = await patient_key_collection.find_one({
        "user_id": patient_id,
        "generated_key": request.generated_key,
        "is_disabled": False
    })
    if not key_entry:
        raise HTTPException(
            status_code=403,
            detail="Invalid patient key for this user"
        )

    # 3. Ensure a patient record exists in patient_data_collection.
    existing_patient = await patient_data_collection.find_one({"user_id": patient_id})
    if not existing_patient:
        new_patient_data = {
            "user_id": patient_id,
            "email": request.patient_email,
            "name": None,          # To be updated later
            "phone": None,         # To be updated later
            "caregiver_note": None,  # To be updated later
            "medical_reports": [],
            "medication_note": [],
            "created_at": datetime.utcnow()
        }
        await patient_data_collection.insert_one(new_patient_data)
        patient_name = None
        patient_phone = None
        caregiver_note = None
    else:
        patient_name = existing_patient.get("name", None)
        patient_phone = existing_patient.get("phone", None)
        caregiver_note = existing_patient.get("caregiver_note", None)

    # 4. Retrieve medication notes for this patient.
    medication_notes = []
    medication_notes_cursor = medication_collection.find({
        "user_id": patient_id,
        "is_disabled": False
    })
    async for note in medication_notes_cursor:
        note.pop("user_id", None)
        note.pop("is_disabled", None)
        note.pop("_id", None)
        medication_notes.append(note)

    # 5. Retrieve medical reports for this patient.
    medical_reports = []
    medical_reports_cursor = medical_report_collection.find({
        "user_id": patient_id
    })
    async for report in medical_reports_cursor:
        report.pop("user_id", None)
        report.pop("_id", None)
        report.pop("user_email", None)
        medical_reports.append(report)

    # 6. Update the patient_data_collection document with the latest medication and report data.
    await patient_data_collection.update_one(
         {"user_id": patient_id},
         {"$set": {
             "medical_reports": medical_reports,
             "medication_note": medication_notes,
             "updated_at": datetime.utcnow()
         }}
    )

    # 7. Return the composite PatientData.
    return PatientData(
         patient_id=patient_id,
         caregiver_id=caregiver_id,
         patient_email=request.patient_email,
         patient_name=patient_name,
         patient_phone=patient_phone,
         medical_reports=medical_reports or None,
         medication_note=medication_notes or None,
         caregiver_note=caregiver_note,
    )