import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")
USERINFO_COLLECTION = os.getenv("USERINFO_COLLECTION")
MEDICAL_COLLECTION = os.getenv("MEDICATION_COLLECTION")
SECRET_KEY = os.getenv("SECRET_KEY")
CHAT_GPT_API_KEY = os.getenv("CHAT_GPT_API_KEY")