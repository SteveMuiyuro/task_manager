from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class TaskStatus(models.TextChoices):
    TODO = 'TODO', 'Todo'
    IN_PROGRESS = 'IN_PROGRESS', 'In progress'
    COMPLETED = 'COMPLETED', 'Completed'
  


class Task(TimeStampedModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=TaskStatus.choices, default=TaskStatus.TODO)
    due_date = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='tasks_assigned', on_delete=models.SET_NULL, null=True, blank=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='tasks_created', on_delete=models.CASCADE
    )
   

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
