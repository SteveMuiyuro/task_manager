from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Task

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):
    """Lightweight user serializer used inside tasks."""
    class Meta:
        model = User
        fields = ("id", "username", "email", "role")


class TaskSerializer(serializers.ModelSerializer):
    """
    Full task serializer with:
    - assigned_to (nested and read-only)
    - assigned_to_id (writable foreign key)
    - permission-aware validation
    """

    assigned_to = UserLiteSerializer(read_only=True)

    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source="assigned_to",
        queryset=User.objects.all(),
        allow_null=True,
        required=False,
    )

    created_by = UserLiteSerializer(read_only=True)

    class Meta:
        model = Task
        fields = (
            "id",
            "title",
            "description",
            "status",
            "due_date",
            "priority",
            "assigned_to",
            "assigned_to_id",
            "created_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "created_by",
            "assigned_to",  # nested read-only
        )

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        # Extract the incoming assignment (may be None)
        assigned_user = attrs.get("assigned_to") or getattr(self.instance, "assigned_to", None)

        # --------------------------------------
        # MEMBERS RESTRICTIONS
        # --------------------------------------
        if user.is_member:

            # Members cannot assign a task to someone else
            if assigned_user and assigned_user != user:
                raise serializers.ValidationError(
                    {"assigned_to_id": "Members can only assign tasks to themselves."}
                )

            # Members cannot change assigned_to directly
            if "assigned_to" in attrs:
                raise serializers.ValidationError(
                    {"assigned_to_id": "Members cannot reassign tasks."}
                )

        return attrs
