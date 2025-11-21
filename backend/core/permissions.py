from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Full access only for admins."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.is_admin
        )


class IsManagerOrAdmin(BasePermission):
    """Managers & Admins have elevated permissions."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and (request.user.is_manager or request.user.is_admin)
        )


class IsSelfOrAdmin(BasePermission):
    """Allow user to manage themselves or admin override."""
    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and (request.user.is_admin or obj == request.user)
        )


class ReadOnlyOrAdmin(BasePermission):
    """Allow read operations to everyone, write only to admin."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user.is_authenticated
            and request.user.is_admin
        )
