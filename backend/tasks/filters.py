import django_filters
from .models import Task


class TaskFilter(django_filters.FilterSet):
    class Meta:
        model = Task
        fields = {
            'status': ['exact'],
            'assigned_to': ['exact'],
            'due_date': ['lt', 'gt'],
        }
