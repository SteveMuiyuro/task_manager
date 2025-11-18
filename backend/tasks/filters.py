import django_filters
from .models import Task


class TaskFilter(django_filters.FilterSet):
    """
    Allows filtering on:
    - status: exact match
    - assigned_to: exact user ID
    - due_date: lt (before), gt (after)
    """

    class Meta:
        model = Task
        fields = {
            "status": ["exact"],
            "assigned_to": ["exact"],
            "due_date": ["lt", "gt"],
        }
