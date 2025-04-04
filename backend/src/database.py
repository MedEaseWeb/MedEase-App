from motor.motor_asyncio import AsyncIOMotorClient
from src.config import MONGO_URI, DB_NAME, USERINFO_COLLECTION, MEDICAL_COLLECTION, GOOGLE_CALENDAR_COLLECTION, PATIENT_KEY_COLLECTION, GMAIL_COLLECTION

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]

# Define collections
user_collection = database[USERINFO_COLLECTION]
medication_collection = database[MEDICAL_COLLECTION]
google_calendar_collection = database[GOOGLE_CALENDAR_COLLECTION]
gmail_collection = database[GMAIL_COLLECTION]
patient_key_collection = database[PATIENT_KEY_COLLECTION]