from motor.motor_asyncio import AsyncIOMotorClient
from src.config import MONGO_URI, DB_NAME, USERINFO_COLLECTION, MEDICAL_COLLECTION

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]

# Define collections
user_collection = database[USERINFO_COLLECTION]
medication_collection = database[MEDICAL_COLLECTION]