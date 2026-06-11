from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from helpers.tortoise_config import TORTOISE_ORM
from controllers.auth_controller import router as auth_router
from controllers.user_controller import router as user_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(user_router)

register_tortoise(
    app,
    config=TORTOISE_ORM,
    generate_schemas=True,
    add_exception_handlers=True,
)
