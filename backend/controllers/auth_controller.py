from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from uuid import UUID
from models.user import User
from helpers.auth import get_hash, verify_hash, create_token

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterReq(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    company_id: UUID

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class AuthRes(BaseModel):
    token: str
    user: dict

@router.post("/register", response_model=AuthRes, status_code=status.HTTP_201_CREATED)
async def register(req: RegisterReq):
    exists = await User.get_or_none(email=req.email)
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="email taken")
        
    user = await User.create(
        name=req.name,
        email=req.email,
        password_hash=get_hash(req.password),
        role=req.role,
        company_id=req.company_id
    )
    
    token = create_token({"sub": str(user.id)})
    return {"token": token, "user": {"id": str(user.id), "email": user.email, "role": user.role}}

@router.post("/login")
async def login(req: LoginReq):
    user = await User.get_or_none(email=req.email)
    if not user or not verify_hash(req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid credentials")
        
    token = create_token({"sub": str(user.id)})
    return {"token": token}
