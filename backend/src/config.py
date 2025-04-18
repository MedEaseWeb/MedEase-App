import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
USERINFO_COLLECTION = os.getenv("USERINFO_COLLECTION")
MEDICAL_COLLECTION = os.getenv("MEDICATION_COLLECTION")
GOOGLE_CALENDAR_COLLECTION = os.getenv("GOOGLE_CALENDAR_COLLECTION")
GMAIL_COLLECTION = os.getenv("GMAIL_COLLECTION")  
PATIENT_KEY_COLLECTION = os.getenv("PATIENT_KEY_COLLECTION")
PATIENT_DATA_COLLECTION = os.getenv("PATIENT_DATA_COLLECTION")
PATIENT_DIARY_COLLECTION = os.getenv("PATIENT_DIARY_COLLECTION")
MEDICAL_REPORT_COLLECTION = os.getenv("MEDICAL_REPORT_COLLECTION")

SECRET_KEY = os.getenv("SECRET_KEY")
CHAT_GPT_API_KEY = os.getenv("CHAT_GPT_API_KEY")
GOOGLE_CLIENT_ID= os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET= os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
GOOGLE_GMAIL_REDIRECT_URI = os.getenv("GOOGLE_GMAIL_REDIRECT_URI")

AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION=os.getenv("AWS_REGION")
AWS_BUCKET_NAME=os.getenv("AWS_BUCKET_NAME")
