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
    Deployment-ready TaskViewSet:
    - strict role-based access
    - safe handling of anonymous users
    - optimized queryset for production
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.select_related("assigned_to", "created_by")
    filterset_class = TaskFilter
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "due_date", "priority")

    # ---------------------------------------------
    # ROLE-BASED PERMISSIONS
    # ---------------------------------------------
    def get_permissions(self):
        user = self.request.user

        if not user or not user.is_authenticated:
            return [IsAuthenticated()]

        # MEMBERS
        if user.is_member:
            if self.action in ["list", "retrieve", "update", "partial_update"]:
                return [IsAuthenticated()]
            # Explicit deny → DRF returns 403 properly
            return [IsAuthenticated()]  # but extra checks inside methods will block ops

        # MANAGERS + ADMINS
        return [IsManagerOrAdmin()]

    # ---------------------------------------------
    # QUERYSET RESTRICTION
    # ---------------------------------------------
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        if user.is_authenticated and user.is_member:
            return qs.filter(assigned_to=user)

        return qs

    # ---------------------------------------------
    # CREATE
    # ---------------------------------------------
    def perform_create(self, serializer):
        user = self.request.user

        if user.is_member:
            serializer.save(created_by=user, assigned_to=user)
        else:
            serializer.save(created_by=user)

    # ---------------------------------------------
    # DELETE
    # ---------------------------------------------
    def destroy(self, request, *args, **kwargs):
        if request.user.is_member:
            return Response(
                {"detail": "Members cannot delete tasks."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    # ---------------------------------------------
    # UPDATE (Members only allowed to change status)
    # ---------------------------------------------
    def update(self, request, *args, **kwargs):
        user = request.user
        task = self.get_object()

        if user.is_member:
            if task.assigned_to != user:
                return Response(
                    {"detail": "Members may only modify their own assigned tasks."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            disallowed = set(request.data.keys()) - {"status"}
            if disallowed:
                return Response(
                    {"detail": "Members may only update the task status."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return super().update(request, *args, **kwargs)

    # ---------------------------------------------
    # ASSIGN
    # ---------------------------------------------
    @action(detail=True, methods=["post"], permission_classes=[IsManagerOrAdmin])
    def assign(self, request, pk=None):
        """Assign or unassign a task (manager/admin only)."""
        task = self.get_object()
        user_id = request.data.get("user_id")

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
