from fastapi import APIRouter, HTTPException, Query, Depends
from botocore.exceptions import ClientError
from src.utils.s3Connection import generate_presigned_url
from src.config import AWS_BUCKET_NAME
from src.models.diaryModel import DiaryEntryUploadRequest
from src.utils.jwtUtils import get_current_user
from src.database import patient_diary_collection
from datetime import datetime

caregiver_router = APIRouter()

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
