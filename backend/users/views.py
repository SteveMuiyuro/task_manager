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
# AUTHENTICATION
# ============================================================

class LoginView(TokenObtainPairView):
    """
    Login endpoint issuing access & refresh JWTs.
    Uses custom serializer for username/password auth.
    """
    serializer_class = UsernameTokenObtainPairSerializer


class RegisterView(APIView):
    """Public registration endpoint — always creates MEMBER users."""
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
    """Logout by blacklisting the refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
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
# USER MANAGEMENT (Admin / Manager Rules)
# ============================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    User management API:

    GET /users/         → Admin only
    GET /users/me/      → Any authenticated user
    GET /users/options/ → Manager/Admin (for task assignment)
    """
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by("id")
    filterset_fields = ("role",)
    search_fields = ("username", "email")

    def get_permissions(self):
        """
        Apply custom permission rules per action.
        """
        if self.action == "me":
            return [IsAuthenticated()]

        if self.action == "options":
            return [IsManagerOrAdmin()]

        return [IsAdmin()]

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Return logged-in user's profile."""
        return Response(
            self.get_serializer(request.user).data
        )

    @action(detail=False, methods=["get"])
    def options(self, request):
        """Return list of users for task assignment (Manager/Admin)."""
        users = self.get_queryset()
        return Response(
            self.get_serializer(users, many=True).data
        )
