from tortoise.models import Model
from tortoise import fields
import uuid

class Task(Model):
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    title = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    status = fields.CharField(max_length=50, default="todo")
    priority = fields.CharField(max_length=50, default="medium")
    project_id = fields.UUIDField()
    assigned_to = fields.UUIDField(null=True)
    created_by = fields.UUIDField()
    is_deleted = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "tasks"
