from tortoise.models import Model
from tortoise import fields
import uuid

class AuditLog(Model):
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    user_id = fields.UUIDField()
    action = fields.CharField(max_length=255)
    entity = fields.CharField(max_length=255)
    entity_id = fields.UUIDField()
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "audit_logs"
