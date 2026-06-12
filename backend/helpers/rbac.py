from fastapi import Depends, HTTPException, status
from models.user import User
from helpers.get_current_user import get_current_user

async def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="admin only")
    return user

async def require_manager_or_admin(user: User = Depends(get_current_user)) -> User:
    if user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="manager or admin only")
    return user

async def require_super_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "super_admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="super admin only")
    return user
