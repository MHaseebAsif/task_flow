from fastapi import APIRouter, Depends
from models.audit_log import AuditLog
from models.user import User
from helpers.get_current_user import get_current_user
from helpers.rbac import require_admin
from uuid import UUID

router = APIRouter(prefix="/audit-logs", tags=["audit"])

async def log_action(user_id: UUID, action: str, entity: str, entity_id: UUID):
    await AuditLog.create(
        user_id=user_id,
        action=action,
        entity=entity,
        entity_id=entity_id
    )

@router.get("/")
async def get_logs(user: User = Depends(require_admin)):
    logs = await AuditLog.all().order_by("-created_at")
    return [
        {
            "id": str(log.id),
            "user_id": str(log.user_id),
            "action": log.action,
            "entity": log.entity,
            "entity_id": str(log.entity_id),
            "created_at": log.created_at
        }
        for log in logs
    ]
