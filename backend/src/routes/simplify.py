from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from src.models.request_model import SimplifyRequest
from src.services.simplify_service import stream_simplified_response, stream_and_capture
from src.services.dummy_simplify_service import dummy_stream_response
from fastapi.responses import StreamingResponse, JSONResponse
from src.services.classifier_service import stream_classification_result
from src.models.simplificationModel import MedicalReport
from src.database import medical_report_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/stream")
async def simplify_text(request: SimplifyRequest):
    return StreamingResponse(stream_simplified_response(request.text), media_type="text/plain")

@router.post("/dummy-stream")
async def dummy_simplify_text():
    return StreamingResponse(dummy_stream_response(), media_type="text/plain")

@router.post("/classify")
async def classify_text(request: SimplifyRequest):
    return StreamingResponse(stream_classification_result(request.text), media_type="text/plain")

@router.post("/stream-and-save")
async def stream_and_save(request: SimplifyRequest):
    user_id = request.user_id
    user_email = request.user_email
    report_id = str(ObjectId())  # <-- generated here

    return StreamingResponse(
        stream_and_capture(request.text, user_id, report_id, user_email),
        media_type="text/plain"
    )


# TODO: DELETE this endpoint after testing
@router.post("/submit-report")
async def submit_medical_report(report: MedicalReport):
    report_dict = report.dict()
    # Optional: Convert datetime to ISO format or let MongoDB handle it
    report_dict["date_created"] = report.date_created or datetime.utcnow()

    inserted = await medical_report_collection.insert_one(report_dict)
    return JSONResponse({
        "message": "Medical report inserted successfully.",
        "inserted_id": str(inserted.inserted_id)
    })





