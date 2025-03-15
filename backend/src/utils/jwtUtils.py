import jwt
from datetime import datetime, timedelta
from src.config import SECRET_KEY
from fastapi import HTTPException, Request
from fastapi.security import OAuth2PasswordBearer

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expires in 1 hour
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_jwt(data: dict, expires_delta: timedelta = None) -> str:
    """Generate a JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Function to get the current user id from the JWT token in the HttpOnly cookie
def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        print(f"Decoded user id: {user_id}") 
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")

# def decode_jwt(token: str):
#     """Decode and verify a JWT token."""
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return payload  # Returns user data if valid
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=401, detail="Token has expired")
#     except jwt.InvalidTokenError:
#         raise HTTPException(status_code=401, detail="Invalid token")

# async def get_current_user(request: Request):
#     """Extract user from JWT in request cookies."""
#     token = request.cookies.get("Authorization")  # JWT is stored in cookies
#     if not token:
#         raise HTTPException(status_code=401, detail="Authentication token missing")

#     return decode_jwt(token)  # Return decoded user data