from fastapi import APIRouter, HTTPException, Depends, Response, Request
from src.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
from src.database import google_calendar_collection
from src.utils.jwtUtils import get_current_user
import httpx
from fastapi.responses import JSONResponse, RedirectResponse
from src.models.googleCalendarModel import GoogleCalendarToken
import urllib.parse
from datetime import datetime, timedelta
import base64

google_oauth_router = APIRouter()

# connect to Google Calendar
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


# Redirect user to Google Calendar OAuth consent screen
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

# Redirect to Gmail OAuth
@google_oauth_router.get("/connect-gmail")
async def connect_gmail(request: Request, user_id: str = Depends(get_current_user)):
    query_params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "https://www.googleapis.com/auth/gmail.send",
        "access_type": "offline",
        "prompt": "consent",
        "state": user_id
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(query_params)}"
    return RedirectResponse(url)


# Token refresh utility
async def refresh_access_token(refresh_token: str):
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(token_url, data=data)
        token_data = res.json()

    if "access_token" not in token_data:
        raise HTTPException(status_code=400, detail={"error": "Token refresh failed", "details": token_data})

    expires_in = token_data.get("expires_in", 3600)
    expiry_date = datetime.utcnow() + timedelta(seconds=expires_in)

    return token_data["access_token"], expiry_date


# Send email
@google_oauth_router.post("/send-gmail")
async def send_gmail_email(
    request: Request,
    to: str,
    subject: str,
    message: str,
    user_id: str = Depends(get_current_user)
):
    user_token = await google_calendar_collection.find_one({"user_id": user_id})

    if not user_token:
        return RedirectResponse(url=f"/connect-gmail")

    access_token = user_token.get("access_token")
    expiry_date = user_token.get("expiry_date")
    refresh_token = user_token.get("refresh_token")

    # Refresh access token if expired
    if expiry_date and datetime.utcnow() >= expiry_date:
        if not refresh_token:
            return RedirectResponse(url=f"/connect-gmail")
        access_token, new_expiry = await refresh_access_token(refresh_token)
        # Update the new token
        await google_calendar_collection.update_one(
            {"user_id": user_id},
            {"$set": {
                "access_token": access_token,
                "expiry_date": new_expiry
            }}
        )

    # Compose email
    email_content = f"""To: {to}
Subject: {subject}
Content-Type: text/plain; charset="UTF-8"

{message}
"""
    raw_encoded_email = base64.urlsafe_b64encode(email_content.encode("utf-8")).decode("utf-8")

    gmail_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    json_data = {
        "raw": raw_encoded_email
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(gmail_url, headers=headers, json=json_data)

    if response.status_code == 200:
        return {"message": "Email sent successfully"}
    else:
        raise HTTPException(status_code=response.status_code, detail=response.json())