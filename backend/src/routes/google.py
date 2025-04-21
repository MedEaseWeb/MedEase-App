from fastapi import APIRouter, HTTPException, Depends, Response, Request
from src.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_GMAIL_REDIRECT_URI
from src.database import google_calendar_collection, gmail_collection
from src.utils.jwtUtils import get_current_user
import httpx
from fastapi.responses import JSONResponse, RedirectResponse
from src.models.googleCalendarModel import GoogleCalendarToken, CalendarEventRequest
from src.models.gmailModel import GmailToken, SendGmailRequest
import urllib.parse
from datetime import datetime, timedelta
import base64

google_oauth_router = APIRouter()

### Google Calendar OAuth2.0 ###
# connect to Google Calendar
@google_oauth_router.get("/connect-google-calendar")
async def connect_google(request: Request, user_id: str = Depends(get_current_user)):
    """
    Redirect user to Google Calendar OAuth consent screen
    """
    query_params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email https://www.googleapis.com/auth/calendar",
        "access_type": "offline",
        "prompt": "consent",
        "state": user_id
    }

    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(query_params)}"
    return RedirectResponse(url)


# Redirect user to Google Calendar OAuth consent screen
@google_oauth_router.get("/oauth2callback")
async def oauth2callback(code: str, state: str):
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        # 2a) Exchange authorization code for tokens
        token_res = await client.post(token_url, data=data)
        token_data = token_res.json()
        if "access_token" not in token_data:
            return JSONResponse(
                status_code=400,
                content={"error": "Token exchange failed", "details": token_data},
            )

        access_token = token_data["access_token"]
        refresh_token = token_data.get("refresh_token")
        expires_in = token_data.get("expires_in", 3600)
        expiry_date = datetime.utcnow() + timedelta(seconds=expires_in)

        # 2b) Fetch the user’s email (must stay inside the same `client` context)
        userinfo_res = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        userinfo_data = userinfo_res.json()
        calendar_email = userinfo_data.get("email")
        if not calendar_email:
            raise HTTPException(
                status_code=500,
                detail="Could not fetch calendar email from Google userinfo",
            )
    
        # 2c) Build & upsert our token document (including calendar_email)
    google_token = GoogleCalendarToken(
        user_id=state,
        access_token=access_token,
        refresh_token=refresh_token,
        scope=token_data.get("scope"),
        token_type=token_data.get("token_type", "Bearer"),
        expires_in=expires_in,
        expiry_date=expiry_date,
        calendar_email=calendar_email,
    )
    await google_calendar_collection.update_one(
        {"user_id": state},
        {"$set": google_token.dict()},
        upsert=True,
    )

    # Redirect back to your frontend
    return RedirectResponse(url="http://localhost:5173/caregiver")


# simple check point
@google_oauth_router.get("/is-google-calendar-connected")
async def is_gmail_connected(user_id: str = Depends(get_current_user)):
    user_token = await google_calendar_collection.find_one({"user_id": user_id})
    if user_token:
        return {"isConnected": True}
    return {"isConnected": False}


@google_oauth_router.get("/view-google-calendar")
async def view_google_calendar(user_id: str = Depends(get_current_user)):
    token_data = await google_calendar_collection.find_one({"user_id": user_id})
    if not token_data:
        return JSONResponse(
            status_code=400,
            content={"error": "Google Calendar not connected for this user"},
        )

    calendar_email = token_data.get("calendar_email")
    if not calendar_email:
        raise HTTPException(500, "No calendar_email stored for this user")

    # authuser=email ensures the correct account session
    redirect_url = (
        "https://calendar.google.com/calendar/r"
        f"?authuser={urllib.parse.quote_plus(calendar_email)}"
    )
    return RedirectResponse(redirect_url)

# add an event to google calendar
@google_oauth_router.post("/add-calendar-event")
async def add_google_calendar_event(
    event: CalendarEventRequest,
    user_id: str = Depends(get_current_user)
):
    token_record = await google_calendar_collection.find_one({"user_id": user_id})
    if not token_record:
        return RedirectResponse(url="/connect-google-calendar")

    access_token = token_record.get("access_token")
    expiry_date = token_record.get("expiry_date")
    refresh_token = token_record.get("refresh_token")

    # Refresh token if expired
    if expiry_date and datetime.utcnow() >= expiry_date:
        if not refresh_token:
            return RedirectResponse(url="/connect-google-calendar")
        access_token, new_expiry = await refresh_access_token(refresh_token)
        await google_calendar_collection.update_one(
            {"user_id": user_id},
            {"$set": {"access_token": access_token, "expiry_date": new_expiry}}
        )

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    event_payload = {
        "summary": event.summary,
        "description": event.description or "",
        "location": event.location or "",
        "start": {
            "dateTime": event.start_time.isoformat(),
            "timeZone": "UTC"
        },
        "end": {
            "dateTime": event.end_time.isoformat(),
            "timeZone": "UTC"
        }
    }

    if event.recurrence_days:
    # DAILY recurrence, count = recurrence_days
        rrule = f"RRULE:FREQ=DAILY;COUNT={event.recurrence_days}"
        event_payload["recurrence"] = [rrule]


    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            headers=headers,
            json=event_payload
        )

    body = res.json()
    print("Google Calendar API error:", res.status_code, body)
    if res.status_code == 200 or res.status_code == 201:
        return {"message": "Event added successfully"}
    else:
        raise HTTPException(status_code=res.status_code, detail=body)


### Gmail OAuth2.0 ###
# Redirect to Gmail OAuth (Send messages only)
@google_oauth_router.get("/connect-gmail")
async def connect_gmail(request: Request, user_id: str = Depends(get_current_user)):
    """
    Redirect user to Gmail OAuth consent screen for sending messages.
    """
    query_params = {
        "client_id": GOOGLE_CLIENT_ID,
        # "redirect_uri": GOOGLE_GMAIL_REDIRECT_URI, 
        "redirect_uri": "http://localhost:8081/google/gmail-oauth2callback", 
        "response_type": "code",
        "scope": "https://www.googleapis.com/auth/gmail.send",
        "access_type": "offline",
        "prompt": "consent",
        "state": user_id
    }
    url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(query_params)}"
    return RedirectResponse(url)


@google_oauth_router.get("/gmail-oauth2callback")
async def gmail_oauth2callback(code: str, state: str):
    """
    Handle Google's redirect for Gmail: exchange code for tokens and store them.
    """
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        # "redirect_uri": GOOGLE_GMAIL_REDIRECT_URI, 
        "redirect_uri": "http://localhost:8081/google/gmail-oauth2callback",  
        "grant_type": "authorization_code"
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(token_url, data=data)
        token_data = res.json()

    if "access_token" not in token_data:
        return JSONResponse(status_code=400, content={"error": "Token exchange failed", "details": token_data})

    expires_in = token_data.get("expires_in", 3600)
    expiry_date = datetime.utcnow() + timedelta(seconds=expires_in)

    google_token = GmailToken(
        user_id=state,
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        scope=token_data.get("scope"),
        token_type=token_data.get("token_type", "Bearer"),
        expires_in=expires_in,
        expiry_date=expiry_date
    )

    # Upsert the Gmail token into the DB (or you could add a field to distinguish service type)
    await gmail_collection.update_one(
        {"user_id": state},
        {"$set": google_token.dict()},
        upsert=True
    )

    print("Gmail connected successfully for user:", state)
    return RedirectResponse(url="http://localhost:5173/caregiver")# TODO: Change this with deployed frontend URL

@google_oauth_router.get("/is-gmail-connected")
async def is_gmail_connected(user_id: str = Depends(get_current_user)):
    user_token = await gmail_collection.find_one({"user_id": user_id})
    if user_token:
        return {"isConnected": True}
    return {"isConnected": False}

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


@google_oauth_router.post("/send-gmail")
async def send_gmail_email(
    req: SendGmailRequest,
    user_id: str = Depends(get_current_user)
):
    to = req.to
    subject = req.subject
    message = req.message

    # Fetch the token from the correct collection for Gmail tokens
    user_token = await gmail_collection.find_one({"user_id": user_id})
    if not user_token:
        # Redirect the user to connect their Gmail account if token not found
        return RedirectResponse(url=f"/connect-gmail")

    access_token = user_token.get("access_token")
    expiry_date = user_token.get("expiry_date")
    refresh_token = user_token.get("refresh_token")

    # Refresh access token if expired
    if expiry_date and datetime.utcnow() >= expiry_date:
        if not refresh_token:
            return RedirectResponse(url=f"/connect-gmail")
        access_token, new_expiry = await refresh_access_token(refresh_token)
        await gmail_collection.update_one(
            {"user_id": user_id},
            {"$set": {"access_token": access_token, "expiry_date": new_expiry}}
        )

    # Compose email message compliant with RFC 2822
    email_content = f"""To: {to}
Subject: {subject}
Content-Type: text/plain; charset="UTF-8"

{message}
"""
    # Encode the email message as a base64url string
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


