import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
secret_key = os.environ.get("SECRET_KEY")
algo = os.environ.get("ALGORITHM", "HS256")
expire_min = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

def get_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_hash(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expire_min)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=algo)

def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, secret_key, algorithms=[algo])
    except JWTError:
        return None
