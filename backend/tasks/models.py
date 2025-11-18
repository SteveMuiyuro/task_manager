from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class TaskStatus(models.TextChoices):
    """Enum-like status choices for tasks."""
    TODO = "TODO", "Todo"
    IN_PROGRESS = "IN_PROGRESS", "In progress"
    COMPLETED = "COMPLETED", "Completed"


class Task(TimeStampedModel):
    """
    Core task model.

    Features:
    - Title, description, due date
    - Status (enum)
    - Priority (1 = high, 3 = low)
    - assigned_to: nullable FK (SET_NULL on user deletion)
    - created_by: required FK (task owner)
    """

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.TODO,
    )

    due_date = models.DateField(null=True, blank=True)

    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="tasks_assigned",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="tasks_created",
        on_delete=models.CASCADE,  # delete tasks if user is deleted
    )

    priority = models.PositiveSmallIntegerField(default=2)  # 1=High, 2=Normal, 3=Low

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
