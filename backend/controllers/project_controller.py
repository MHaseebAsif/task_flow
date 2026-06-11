from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import uuid
from models.project import Project
from models.company import Company
from models.user import User
from helpers.get_current_user import get_current_user
from helpers.rbac import require_admin, require_manager_or_admin

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    company_id: uuid.UUID
    created_by: uuid.UUID

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(data: ProjectCreate, user: User = Depends(require_manager_or_admin)):
    company = await Company.get_or_none(id=user.company_id)
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="company not found")
    
    project_count = await Project.filter(company_id=user.company_id).count()
    plan = company.subscription_plan
    
    if plan == "free" and project_count >= 2:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="free plan limit reached")
    if plan == "pro" and project_count >= 20:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="pro plan limit reached")
    
    project = await Project.create(
        name=data.name,
        description=data.description,
        company_id=user.company_id,
        created_by=user.id
    )
    return project

@router.get("/", response_model=List[ProjectResponse])
async def list_projects(user: User = Depends(get_current_user)):
    projects = await Project.filter(company_id=user.company_id)
    return projects

@router.put("/{id}", response_model=ProjectResponse)
async def update_project(id: uuid.UUID, data: ProjectUpdate, user: User = Depends(require_manager_or_admin)):
    project = await Project.get_or_none(id=id, company_id=user.company_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="project not found")
    
    if data.name is not None:
        project.name = data.name
    if data.description is not None:
        project.description = data.description
    
    await project.save()
    return project

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(id: uuid.UUID, user: User = Depends(require_admin)):
    project = await Project.get_or_none(id=id, company_id=user.company_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="project not found")
    
    await project.delete()
