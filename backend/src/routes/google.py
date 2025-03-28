from fastapi import APIRouter, HTTPException, Depends, Response, Request
from src.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
from src.database import google_calendar_collection
from src.utils.jwtUtils import get_current_user
import httpx
from fastapi.responses import JSONResponse, RedirectResponse
from src.models.googleCalendarModel import GoogleCalendarToken
import urllib.parse
from datetime import datetime, timedelta

google_oauth_router = APIRouter()

@google_oauth_router.get("/connect-google")
async def connect_google(request: Request, user_id: str = Depends(get_current_user)):
    """
    Redirect user to Google Calendar OAuth consent screen
    """
    query_params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "https://www.googleapis.com/auth/calendar",
        "access_type": "offline",
        "prompt": "consent",
        "state": user_id
    }

    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(query_params)}"
    return RedirectResponse(url)


@google_oauth_router.get("/oauth2callback")
async def oauth2callback(code: str, state: str):
    """
    Handle Google's redirect with code; exchange it for access/refresh tokens and store them
    """
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(token_url, data=data)
        token_data = res.json()

    if "access_token" not in token_data:
        return JSONResponse(status_code=400, content={"error": "Token exchange failed", "details": token_data})

    # Calculate expiry_date from current time + expires_in
    expires_in = token_data.get("expires_in", 3600)
    expiry_date = datetime.utcnow() + timedelta(seconds=expires_in)

    # Create validated token model
    google_token = GoogleCalendarToken(
        user_id=state,
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        scope=token_data.get("scope"),
        token_type=token_data.get("token_type", "Bearer"),
        expires_in=expires_in,
        expiry_date=expiry_date
    )

    # Store in MongoDB (upsert = insert or update)
    await google_calendar_collection.update_one(
        {"user_id": state},
        {"$set": google_token.dict()},
        upsert=True
    )

    return JSONResponse(content={"message": "Google Calendar connected successfully!"})
