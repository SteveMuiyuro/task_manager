from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Task

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserLiteSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source='assigned_to',
        queryset=User.objects.all(),
        allow_null=True,
        required=False
    )
    created_by = UserLiteSerializer(read_only=True)

    class Meta:
        model = Task
        fields = (
            'id',
            'title',
            'description',
            'status',
            'due_date',
            'priority',
            'assigned_to',
            'assigned_to_id',
            'created_by',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'created_at',
            'updated_at',
            'created_by',
            'assigned_to',
        )

    def validate(self, attrs):
        request = self.context['request']

        # Members cannot change assigned_to
        if request.user.is_member and 'assigned_to' in attrs:
            raise serializers.ValidationError(
                "Members cannot reassign tasks."
            )

        # Extra safety: members cannot assign to other users on create/update
        assigned_user = attrs.get('assigned_to') or getattr(self.instance, 'assigned_to', None)

        if request.user.is_member:
            if assigned_user and assigned_user != request.user:
                raise serializers.ValidationError(
                    "Members can only assign tasks to themselves."
                )

        return attrs
