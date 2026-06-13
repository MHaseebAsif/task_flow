from fastapi import APIRouter, HTTPException, status, Form, File, UploadFile
from pydantic import BaseModel, EmailStr
from uuid import UUID
import os
import uuid
from models.user import User
from models.company import Company
from helpers.auth import get_hash, verify_hash, create_token

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class AuthRes(BaseModel):
    token: str
    user: dict

@router.post("/signup", response_model=AuthRes, status_code=status.HTTP_201_CREATED)
async def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    company_name: str = Form(...),
    logo: UploadFile = File(None),
):
    exists = await User.get_or_none(email=email)
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="email taken")

    logo_url = None
    if logo:
        os.makedirs("uploads/logos", exist_ok=True)
        filename = f"{uuid.uuid4()}{os.path.splitext(logo.filename)[1]}"
        filepath = os.path.join("uploads/logos", filename)
        with open(filepath, "wb") as f:
            f.write(await logo.read())
        logo_url = f"/uploads/logos/{filename}"
        
    company = await Company.create(name=company_name, subscription_plan="free", logo_url=logo_url)
    
    user = await User.create(
        name=name,
        email=email,
        password_hash=get_hash(password),
        role="admin",
        company_id=company.id
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
