from fastapi import APIRouter, Depends
from models.user import User
from helpers.get_current_user import get_current_user
from helpers.rbac import require_admin

router = APIRouter(prefix="/users", tags=["users"])

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
