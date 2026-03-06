import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def _require(name: str) -> str:
    """Return the env var value or raise at startup if missing."""
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Required environment variable '{name}' is not set.")
    return value


# MongoDB
MONGO_URI = _require("MONGO_URI")
DB_NAME = _require("DB_NAME")
USERINFO_COLLECTION = _require("USERINFO_COLLECTION")
MEDICAL_COLLECTION = _require("MEDICATION_COLLECTION")
GOOGLE_CALENDAR_COLLECTION = _require("GOOGLE_CALENDAR_COLLECTION")
GMAIL_COLLECTION = _require("GMAIL_COLLECTION")
PATIENT_KEY_COLLECTION = _require("PATIENT_KEY_COLLECTION")
PATIENT_DATA_COLLECTION = _require("PATIENT_DATA_COLLECTION")
PATIENT_DIARY_COLLECTION = _require("PATIENT_DIARY_COLLECTION")
MEDICAL_REPORT_COLLECTION = _require("MEDICAL_REPORT_COLLECTION")

# Auth
SECRET_KEY = _require("SECRET_KEY")

# External APIs
CHAT_GPT_API_KEY = _require("CHAT_GPT_API_KEY")
GOOGLE_CLIENT_ID = _require("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = _require("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = _require("GOOGLE_REDIRECT_URI")
GOOGLE_GMAIL_REDIRECT_URI = _require("GOOGLE_GMAIL_REDIRECT_URI")

# AWS
AWS_ACCESS_KEY_ID = _require("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = _require("AWS_SECRET_ACCESS_KEY")
AWS_REGION = _require("AWS_REGION")
AWS_BUCKET_NAME = _require("AWS_BUCKET_NAME")
