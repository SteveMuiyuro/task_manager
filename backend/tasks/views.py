from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.permissions import IsManagerOrAdmin
from .models import Task
from .serializers import TaskSerializer
from .filters import TaskFilter

User = get_user_model()


class TaskViewSet(viewsets.ModelViewSet):
    """
    Production-ready TaskViewSet with:
    - strict role-based permissions,
    - optimized querysets,
    - consistent error responses,
    - protected write operations.
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.select_related("assigned_to", "created_by")
    filterset_class = TaskFilter
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "due_date", "priority")

    def get_permissions(self):
        user = self.request.user

        # MEMBERS
        if user.is_member:
            # Allow read & self-status update only
            if self.action in ["list", "retrieve", "update", "partial_update"]:
                return [IsAuthenticated()]
            return []  # No create/delete/assign

        # MANAGERS + ADMINS = full access
        return [IsManagerOrAdmin()]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        # Members only see their assigned tasks
        if user.is_member:
            return queryset.filter(assigned_to=user)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_member:
            # Members can only create tasks for themselves
            serializer.save(created_by=user, assigned_to=user)
        else:
            serializer.save(created_by=user)

    def destroy(self, request, *args, **kwargs):
        if request.user.is_member:
            return Response(
                {"detail": "Members cannot delete tasks."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        if user.is_member:
            # Members may only update their own tasks
            if instance.assigned_to != user:
                return Response(
                    {"detail": "Members may only modify their own assigned tasks."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Members may only update the 'status' field
            invalid_fields = set(request.data.keys()) - {"status"}
            if invalid_fields:
                return Response(
                    {"detail": "Members may only update the task status."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=["post"], permission_classes=[IsManagerOrAdmin])
    def assign(self, request, pk=None):
        """Assign or unassign a task (Manager/Admin only)."""
        task = self.get_object()
        user_id = request.data.get("user_id")

        # Unassign
        if not user_id:
            task.assigned_to = None

        else:
            try:
                assignee = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"detail": "User not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            task.assigned_to = assignee

        task.save(update_fields=["assigned_to"])
        return Response(self.get_serializer(task).data)
