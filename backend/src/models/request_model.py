from pydantic import BaseModel

class SimplifyRequest(BaseModel):
    text: str
    user_id: str
    user_email: str
