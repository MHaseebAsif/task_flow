from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import uuid
from models.company import Company
from models.user import User
from models.project import Project
from models.task import Task
from helpers.rbac import require_super_admin

router = APIRouter(prefix="/admin", tags=["admin"])

class CompanyStatusUpdate(BaseModel):
    is_active: bool

class CompanySubscriptionUpdate(BaseModel):
    subscription_plan: str

class CompanyResponse(BaseModel):
    id: uuid.UUID
    name: str
    subscription_plan: str
    is_active: bool
    created_at: str
    user_count: int
    project_count: int
    task_count: int

class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: str

class CompanyDetailResponse(CompanyResponse):
    users: List[UserResponse]

@router.get("/companies", response_model=List[CompanyResponse])
async def list_companies(user: User = Depends(require_super_admin)):
    companies = await Company.filter(is_deleted=False)
    result = []
    for company in companies:
        user_count = await User.filter(company_id=company.id).count()
        project_count = await Project.filter(company_id=company.id, is_deleted=False).count()
        projects = await Project.filter(company_id=company.id).values_list("id", flat=True)
        task_count = 0
        if projects:
            task_count = await Task.filter(project_id__in=projects, is_deleted=False).count()
        result.append({
            "id": company.id,
            "name": company.name,
            "subscription_plan": company.subscription_plan,
            "is_active": company.is_active,
            "created_at": str(company.created_at),
            "user_count": user_count,
            "project_count": project_count,
            "task_count": task_count
        })
    return result

@router.get("/companies/{id}", response_model=CompanyDetailResponse)
async def get_company(id: uuid.UUID, user: User = Depends(require_super_admin)):
    company = await Company.get_or_none(id=id)
    if not company or company.is_deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="company not found")
        
    user_count = await User.filter(company_id=company.id).count()
    project_count = await Project.filter(company_id=company.id, is_deleted=False).count()
    projects = await Project.filter(company_id=company.id).values_list("id", flat=True)
    task_count = 0
    if projects:
        task_count = await Task.filter(project_id__in=projects, is_deleted=False).count()
        
    users = await User.filter(company_id=company.id)
    user_list = [
        {"id": u.id, "name": u.name, "email": u.email, "role": u.role}
        for u in users
    ]
        
    return {
        "id": company.id,
        "name": company.name,
        "subscription_plan": company.subscription_plan,
        "is_active": company.is_active,
        "created_at": str(company.created_at),
        "user_count": user_count,
        "project_count": project_count,
        "task_count": task_count,
        "users": user_list
    }

@router.patch("/companies/{id}/status", response_model=CompanyResponse)
async def update_company_status(id: uuid.UUID, data: CompanyStatusUpdate, user: User = Depends(require_super_admin)):
    company = await Company.get_or_none(id=id)
    if not company or company.is_deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="company not found")
        
    company.is_active = data.is_active
    await company.save()
    
    user_count = await User.filter(company_id=company.id).count()
    project_count = await Project.filter(company_id=company.id, is_deleted=False).count()
    projects = await Project.filter(company_id=company.id).values_list("id", flat=True)
    task_count = 0
    if projects:
        task_count = await Task.filter(project_id__in=projects, is_deleted=False).count()
        
    return {
        "id": company.id,
        "name": company.name,
        "subscription_plan": company.subscription_plan,
        "is_active": company.is_active,
        "created_at": str(company.created_at),
        "user_count": user_count,
        "project_count": project_count,
        "task_count": task_count
    }

@router.patch("/companies/{id}/subscription", response_model=CompanyResponse)
async def update_company_subscription(id: uuid.UUID, data: CompanySubscriptionUpdate, user: User = Depends(require_super_admin)):
    if data.subscription_plan not in ["free", "pro", "enterprise"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="invalid subscription plan")
        
    company = await Company.get_or_none(id=id)
    if not company or company.is_deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="company not found")
        
    company.subscription_plan = data.subscription_plan
    await company.save()
    
    user_count = await User.filter(company_id=company.id).count()
    project_count = await Project.filter(company_id=company.id, is_deleted=False).count()
    projects = await Project.filter(company_id=company.id).values_list("id", flat=True)
    task_count = 0
    if projects:
        task_count = await Task.filter(project_id__in=projects, is_deleted=False).count()
        
    return {
        "id": company.id,
        "name": company.name,
        "subscription_plan": company.subscription_plan,
        "is_active": company.is_active,
        "created_at": str(company.created_at),
        "user_count": user_count,
        "project_count": project_count,
        "task_count": task_count
    }

@router.get("/dashboard")
async def get_admin_dashboard(user: User = Depends(require_super_admin)):
    total_companies = await Company.filter(is_deleted=False).count()
    active_companies = await Company.filter(is_deleted=False, is_active=True).count()
    blocked_companies = await Company.filter(is_deleted=False, is_active=False).count()
    total_users = await User.all().count()
    total_projects = await Project.filter(is_deleted=False).count()
    total_tasks = await Task.filter(is_deleted=False).count()
    
    return {
        "total_companies": total_companies,
        "active_companies": active_companies,
        "blocked_companies": blocked_companies,
        "total_users": total_users,
        "total_projects": total_projects,
        "total_tasks": total_tasks
    }
