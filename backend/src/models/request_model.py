from pydantic import BaseModel

class SimplifyRequest(BaseModel):
    text: str
