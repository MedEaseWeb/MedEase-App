from motor.motor_asyncio import AsyncIOMotorClient
from src.config import (
    MONGO_URI, DB_NAME,
    USERINFO_COLLECTION, MEDICAL_COLLECTION, GOOGLE_CALENDAR_COLLECTION,
    PATIENT_KEY_COLLECTION, GMAIL_COLLECTION, PATIENT_DATA_COLLECTION,
    PATIENT_DIARY_COLLECTION, MEDICAL_REPORT_COLLECTION,
)
import certifi

# Initialize MongoDB client with explicit connection settings
client = AsyncIOMotorClient(
    MONGO_URI,
    tlsCAFile=certifi.where(),
    maxPoolSize=50,
    minPoolSize=5,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=10000,
    socketTimeoutMS=30000,
    retryWrites=True,
    w="majority",
)

database = client[DB_NAME]

# Define collections
user_collection = database[USERINFO_COLLECTION]
medication_collection = database[MEDICAL_COLLECTION]
google_calendar_collection = database[GOOGLE_CALENDAR_COLLECTION]
gmail_collection = database[GMAIL_COLLECTION]
patient_key_collection = database[PATIENT_KEY_COLLECTION]
patient_data_collection = database[PATIENT_DATA_COLLECTION]
patient_diary_collection = database[PATIENT_DIARY_COLLECTION]
medical_report_collection = database[MEDICAL_REPORT_COLLECTION]


async def create_indexes():
    """Create indexes for frequently queried fields."""
    await user_collection.create_index("user_id", unique=True)
    await user_collection.create_index("email", unique=True)
    await medication_collection.create_index([("user_id", 1), ("created_at", -1)])
    await medication_collection.create_index([("user_id", 1), ("medication_id", 1)], unique=True)
    await patient_key_collection.create_index("user_id")
    await patient_data_collection.create_index("user_id", unique=True)
    await patient_diary_collection.create_index([("user_id", 1), ("created_at", -1)])
    await medical_report_collection.create_index([("user_id", 1), ("report_id", 1)], unique=True)
    await google_calendar_collection.create_index("user_id", unique=True)
    await gmail_collection.create_index("user_id", unique=True)


async def ping_database():
    """Verify MongoDB connectivity."""
    await client.admin.command("ping")


def close_db_connection():
    """Close the MongoDB client connection."""
    client.close()
