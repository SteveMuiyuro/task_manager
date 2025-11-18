from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Task

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):
    """Lightweight nested user representation."""
    class Meta:
        model = User
        fields = ("id", "username", "email", "role")


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserLiteSerializer(read_only=True)

    # Writable FK field
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
            "assigned_to",
        )

    # ------------------------------------------------------------
    # VALIDATION LOGIC
    # ------------------------------------------------------------
    def validate_priority(self, value):
        """Ensure priority stays between 1 and 5 (or any range you allow)."""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Priority must be between 1 and 5.")
        return value

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")

        new_assignee = attrs.get("assigned_to") or getattr(self.instance, "assigned_to", None)

        # ------------------------------------------------------------
        # MEMBER PERMISSION RULES
        # ------------------------------------------------------------
        if user.is_member:

            # Members cannot assign tasks away from themselves
            if new_assignee and new_assignee != user:
                raise serializers.ValidationError(
                    {"assigned_to_id": "Members can only assign tasks to themselves."}
                )

            # Members cannot reassign tasks
            if "assigned_to" in attrs:
                raise serializers.ValidationError(
                    {"assigned_to_id": "Members cannot reassign tasks."}
                )

            # Members should not modify fields besides status
            if self.instance:  # on update
                invalid_fields = set(attrs.keys()) - {"status"}
                if invalid_fields:
                    raise serializers.ValidationError(
                        {"detail": "Members may only update the task status."}
                    )

        return attrs
