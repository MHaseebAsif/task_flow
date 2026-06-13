# main.py
from dotenv import load_dotenv
load_dotenv()  # ← Must be FIRST, before all other imports

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise
from helpers.tortoise_config import TORTOISE_ORM
from controllers.auth_controller import router as auth_router
from controllers.user_controller import router as user_router
from controllers.company_controller import router as company_router
from controllers.project_controller import router as project_router
from controllers.task_controller import router as task_router
from controllers.audit_controller import router as audit_router
from controllers.dashboard_controller import router as dashboard_router
from controllers.admin_controller import router as admin_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(company_router)
app.include_router(project_router)
app.include_router(task_router)
app.include_router(audit_router)
app.include_router(dashboard_router)
app.include_router(admin_router)

register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)

