from motor.motor_asyncio import AsyncIOMotorClient
from src.config import MONGO_URI, DB_NAME, COLLECTION_NAME

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]

# Define collections
user_collection = database[COLLECTION_NAME]