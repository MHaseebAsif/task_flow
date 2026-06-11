from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import uuid
from models.company import Company
from models.user import User
from helpers.get_current_user import get_current_user
from helpers.rbac import require_admin

router = APIRouter(prefix="/companies", tags=["companies"])

class CompanyCreate(BaseModel):
    name: str
    subscription_plan: str = "free"

class CompanyResponse(BaseModel):
    id: uuid.UUID
    name: str
    subscription_plan: str

@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(data: CompanyCreate, user: User = Depends(require_admin)):
    company = await Company.create(name=data.name, subscription_plan=data.subscription_plan)
    return company

@router.get("/{id}", response_model=CompanyResponse)
async def get_company(id: uuid.UUID, user: User = Depends(get_current_user)):
    company = await Company.get_or_none(id=id)
    if not company or company.is_deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="company not found")
    return company
