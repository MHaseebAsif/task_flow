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

class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    role: str | None = None


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
    users = await User.filter(company_id=user.company_id)
    print(f"Users found for company {user.company_id}: {len(users)}")
    return [{"id": str(u.id), "name": u.name, "email": u.email, "role": u.role} for u in users]

@router.patch("/{id}")
async def update_user(id: str, data: UserUpdate, current_user: User = Depends(require_admin)):
    target_user = await User.get_or_none(id=id, company_id=current_user.company_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
    if data.name: target_user.name = data.name
    if data.role: target_user.role = data.role
    if data.email: target_user.email = data.email
    await target_user.save()
    return {"status": "success"}

@router.delete("/{id}")
async def delete_user_route(id: str, current_user: User = Depends(require_admin)):
    target_user = await User.get_or_none(id=id, company_id=current_user.company_id)
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
    if str(target_user.id) == str(current_user.id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="cannot delete self")
    if target_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="cannot delete other admins")
    await target_user.delete()
    return {"status": "success"}
