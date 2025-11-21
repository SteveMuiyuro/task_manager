from django.contrib.auth import get_user_model, authenticate
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
    UsernameTokenObtainPairSerializer
)

User = get_user_model()


# -------------------------
# AUTHENTICATION VIEWS
# -------------------------

class LoginView(TokenObtainPairView):
    """Custom login view using custom serializer."""
    serializer_class = UsernameTokenObtainPairSerializer


class RegisterView(APIView):
    """Public user registration."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )


class LogoutView(APIView):
    """Blacklist refresh token."""
    def post(self, request):
        refresh = request.data.get('refresh')
        if refresh:
            try:
                token = RefreshToken(refresh)
                token.blacklist()
            except Exception:
                pass
        return Response({'detail': 'Logged out successfully.'})


# -------------------------
# USER MANAGEMENT (Admin Only)
# -------------------------

class UserViewSet(viewsets.ModelViewSet):
    """
    Admin-only user management.
    Extra routes:
        /users/me/        → any authenticated user
        /users/options/   → manager/admin only
    """
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('id')
    filterset_fields = ('role',)
    search_fields = ('username', 'email')

    def get_permissions(self):
        action = self.action

        if action == "me":
            return [IsAuthenticated()]

        if action == "options":
            return [IsManagerOrAdmin()]

        # Default: admin only
        return [IsAdmin()]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Return the logged-in user's profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def options(self, request):
        """Return all users to managers/admins."""
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)
