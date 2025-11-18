from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    """Full access only for admins."""
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user.is_authenticated
            and getattr(user, "is_admin", False)
        )


class IsManagerOrAdmin(BasePermission):
    """Managers and Admins have elevated permissions."""
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user.is_authenticated
            and (getattr(user, "is_manager", False) or getattr(user, "is_admin", False))
        )


class IsSelfOrAdmin(BasePermission):
    """
    Allow the user to access/modify their own object,
    or give full access to admins.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        return bool(
            user.is_authenticated
            and (getattr(user, "is_admin", False) or obj == user)
        )


class ReadOnlyOrAdmin(BasePermission):
    """
    Allow all users to perform SAFE (read-only) operations.
    Non-safe operations require admin.
    """
    def has_permission(self, request, view):
        user = request.user

        if request.method in SAFE_METHODS:
            return True

        return bool(
            user.is_authenticated
            and getattr(user, "is_admin", False)
        )
