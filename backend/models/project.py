from tortoise.models import Model
from tortoise import fields
import uuid

class Project(Model):
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    name = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    company_id = fields.UUIDField()
    created_by = fields.UUIDField()
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "projects"
