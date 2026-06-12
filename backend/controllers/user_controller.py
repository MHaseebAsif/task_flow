from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from models.user import User
from helpers.get_current_user import get_current_user
from helpers.rbac import require_admin
from helpers.auth import get_hash

router = APIRouter(prefix="/users", tags=["users"])

class UserInvite(BaseModel):
    name: str
    email: EmailStr
    role: str
    password: str

@router.post("/invite", status_code=status.HTTP_201_CREATED)
async def invite_user(data: UserInvite, user: User = Depends(require_admin)):
    if data.role not in ["manager", "member"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="invalid role")
    exists = await User.get_or_none(email=data.email)
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="email taken")
    new_user = await User.create(
        name=data.name,
        email=data.email,
        password_hash=get_hash(data.password),
        role=data.role,
        company_id=user.company_id
    )
    return {"id": str(new_user.id), "email": new_user.email, "role": new_user.role}

@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "company_id": str(user.company_id)
    }

@router.get("/")
async def get_all(user: User = Depends(require_admin)):
    users = await User.all()
    return [{"id": str(u.id), "email": u.email, "role": u.role} for u in users]
