import os
from dotenv import load_dotenv

load_dotenv()

TORTOISE_ORM = {
    "connections": {"default": os.environ.get("DATABASE_URL")},
    "apps": {
        "models": {
            "models": [
                "models.user",
                "models.company",
                "models.project",
                "models.task",
                "aerich.models"
            ],
            "default_connection": "default",
        },
    },
}
