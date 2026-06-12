import asyncio
from tortoise import Tortoise
from helpers.tortoise_config import TORTOISE_ORM
from models.user import User
from helpers.auth import get_hash

async def main():
    await Tortoise.init(config=TORTOISE_ORM)
    
    exists = await User.get_or_none(email="superadmin@taskflow.com")
    if exists:
        print("Super admin already exists. Skipping.")
    else:
        await User.create(
            name="Super Admin",
            email="superadmin@taskflow.com",
            password_hash=get_hash("admin123"),
            role="super_admin",
            company_id=None
        )
        print("Super admin created successfully.")
        
    await Tortoise.close_connections()

if __name__ == "__main__":
    asyncio.run(main())
