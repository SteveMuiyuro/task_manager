from django.contrib.auth import get_user_model
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from core.permissions import IsAdmin, IsManagerOrAdmin
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    UsernameTokenObtainPairSerializer,
)

User = get_user_model()


# ============================================================
# AUTHENTICATION VIEWS
# ============================================================

class LoginView(TokenObtainPairView):
    """Login using username + password to get access/refresh tokens."""
    serializer_class = UsernameTokenObtainPairSerializer


class RegisterView(APIView):
    """Public user registration endpoint."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )


class LogoutView(APIView):
    """Logout by blacklisting refresh token."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"detail": "Logged out successfully."})
        

# ============================================================
# USER MANAGEMENT
# ============================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    User management API:

    /users/           → Admin only
    /users/me/       → Any authenticated user
    /users/options/  → Manager/Admin (used for assigning tasks)
    """
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by("id")
    filterset_fields = ("role",)
    search_fields = ("username", "email")

    def get_permissions(self):
        action = self.action

        # Any logged-in user can access their own profile
        if action == "me":
            return [IsAuthenticated()]

        # Managers/Admins can list users for task-assign dropdown
        if action == "options":
            return [IsManagerOrAdmin()]

        # Everything else requires admin
        return [IsAdmin()]

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Return the profile of the logged-in user."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def options(self, request):
        """Return list of users (used by task assignment UI)."""
        users = self.get_queryset()
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
