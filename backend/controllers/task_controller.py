from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import uuid
from models.task import Task
from models.project import Project
from models.user import User
from helpers.get_current_user import get_current_user
from helpers.rbac import require_manager_or_admin

router = APIRouter(prefix="/tasks", tags=["tasks"])

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    project_id: uuid.UUID
    assigned_to: Optional[uuid.UUID] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

class TaskAssign(BaseModel):
    assigned_to: uuid.UUID

class TaskStatus(BaseModel):
    status: str

class TaskResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str]
    status: str
    priority: str
    project_id: uuid.UUID
    assigned_to: Optional[uuid.UUID]
    created_by: uuid.UUID

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(data: TaskCreate, user: User = Depends(get_current_user)):
    project = await Project.get_or_none(id=data.project_id, company_id=user.company_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="project not found")
    
    task = await Task.create(
        title=data.title,
        description=data.description,
        status=data.status,
        priority=data.priority,
        project_id=data.project_id,
        assigned_to=data.assigned_to,
        created_by=user.id
    )
    return task

@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to: Optional[uuid.UUID] = None,
    project_id: Optional[uuid.UUID] = None,
    user: User = Depends(get_current_user)
):
    query = Task.filter()
    if project_id:
        project = await Project.get_or_none(id=project_id, company_id=user.company_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="project not found")
        query = query.filter(project_id=project_id)
    else:
        projects = await Project.filter(company_id=user.company_id).values_list("id", flat=True)
        query = query.filter(project_id__in=projects)
    
    if status:
        query = query.filter(status=status)
    if priority:
        query = query.filter(priority=priority)
    if assigned_to:
        query = query.filter(assigned_to=assigned_to)
        
    tasks = await query
    return tasks

@router.put("/{id}", response_model=TaskResponse)
async def update_task(id: uuid.UUID, data: TaskUpdate, user: User = Depends(get_current_user)):
    task = await Task.get_or_none(id=id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    
    project = await Project.get_or_none(id=task.project_id, company_id=user.company_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    if data.status is not None:
        task.status = data.status
    if data.priority is not None:
        task.priority = data.priority
        
    await task.save()
    return task

@router.post("/{id}/assign", response_model=TaskResponse)
async def assign_task(id: uuid.UUID, data: TaskAssign, user: User = Depends(require_manager_or_admin)):
    task = await Task.get_or_none(id=id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    
    project = await Project.get_or_none(id=task.project_id, company_id=user.company_id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    
    task.assigned_to = data.assigned_to
    await task.save()
    return task

@router.patch("/{id}/status", response_model=TaskResponse)
async def update_task_status(id: uuid.UUID, data: TaskStatus, user: User = Depends(get_current_user)):
    task = await Task.get_or_none(id=id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    
    if task.assigned_to != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="only assigned user can mark as done")
    
    task.status = data.status
    await task.save()
    return task
