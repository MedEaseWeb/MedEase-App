from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from src.models.request_model import SimplifyRequest
from src.services.simplify_service import stream_simplified_response, stream_and_capture, fetch_reports_by_user
from src.services.dummy_simplify_service import dummy_stream_response
from src.services.classifier_service import stream_classification_result
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
    report_id = str(ObjectId())

    return StreamingResponse(
        stream_and_capture(request.text, user_id, report_id, user_email),
        media_type="text/plain"
    )


@router.get("/reports/{user_id}")
async def get_reports_by_user(user_id: str):
    """Returns all saved reports for a given user ID."""
    reports = await fetch_reports_by_user(user_id)
    return {"reports": reports}
