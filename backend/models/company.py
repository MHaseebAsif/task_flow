from tortoise.models import Model
from tortoise import fields
import uuid

class Company(Model):
    id = fields.UUIDField(pk=True, default=uuid.uuid4)
    name = fields.CharField(max_length=255)
    subscription_plan = fields.CharField(max_length=50, default="free")
    is_deleted = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "companies"
