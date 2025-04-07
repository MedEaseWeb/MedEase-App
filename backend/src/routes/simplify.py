from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from src.models.request_model import SimplifyRequest
from src.services.simplify_service import stream_simplified_response
from src.services.dummy_simplify_service import dummy_stream_response

router = APIRouter()

@router.post("/stream")
async def simplify_text(request: SimplifyRequest):
    return StreamingResponse(stream_simplified_response(request.text), media_type="text/plain")




@router.post("/dummy-stream")
async def dummy_simplify_text():
    return StreamingResponse(dummy_stream_response(), media_type="text/plain")
