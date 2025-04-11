from fastapi import APIRouter, HTTPException, Query, Depends
from botocore.exceptions import ClientError
from src.utils.s3Connection import generate_presigned_url, generate_presigned_get_url
from src.config import AWS_BUCKET_NAME
from src.models.diaryModel import DiaryEntryUploadRequest
from src.utils.jwtUtils import get_current_user
from src.database import patient_diary_collection
from datetime import datetime
from bson import ObjectId

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

# TODO: THIS IS NOT WORKING 
@caregiver_router.delete("/diary-entry-delete/{entry_id}")
async def delete_diary_entry(
    entry_id: str, 
    current_user_id: str = Depends(get_current_user)
):
    # Convert the entry id to an ObjectId if you're using Mongo's _id field.
    try:
        object_id = ObjectId(entry_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid diary entry ID format")
    
    result = await patient_diary_collection.delete_one({
        "_id": object_id,
        "caregiver_id": str(current_user_id)  # ensure that the user owns this diary entry
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Diary entry not found or not authorized")
    
    return {"message": "Diary entry deleted successfully"}