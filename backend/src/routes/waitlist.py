from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from src.models.waitlistModel import WaitlistEntry
from src.database import waitlist_collection

waitlist_router = APIRouter()


@waitlist_router.post("/join", status_code=201)
async def join_waitlist(entry: WaitlistEntry):
    existing = await waitlist_collection.find_one({"email": entry.email})
    if existing:
        raise HTTPException(status_code=409, detail="This email is already on the waitlist.")

    doc = entry.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)

    await waitlist_collection.insert_one(doc)
    return {"message": "You're on the list! We'll be in touch soon."}
