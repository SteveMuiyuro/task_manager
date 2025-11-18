from django.db import models


class TimeStampedModel(models.Model):
    """Reusable base model with timestamp fields."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AuditModel(TimeStampedModel):
    """
    Optional reusable audit model.
    Tracks who created an object.
    Using SET_NULL ensures data is preserved even if a user is deleted.
    """
    created_by = models.ForeignKey(
        "users.User",
        related_name="%(class)s_created",
        on_delete=models.SET_NULL,   # safer for productions
        null=True,
        blank=True
    )

    class Meta:
        abstract = True
