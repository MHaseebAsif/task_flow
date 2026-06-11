from fastapi import APIRouter, Depends
from models.project import Project
from models.task import Task
from models.user import User
from helpers.get_current_user import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/")
async def get_dashboard(user: User = Depends(get_current_user)):
    projects_count = await Project.filter(company_id=user.company_id).count()
    project_ids = await Project.filter(company_id=user.company_id).values_list("id", flat=True)
    
    if project_ids:
        tasks_count = await Task.filter(project_id__in=project_ids).count()
        completed_tasks_count = await Task.filter(project_id__in=project_ids, status="done").count()
    else:
        tasks_count = 0
        completed_tasks_count = 0
        
    users_count = await User.filter(company_id=user.company_id).count()
    
    return {
        "projects": projects_count,
        "tasks": tasks_count,
        "completed_tasks": completed_tasks_count,
        "users": users_count
    }
