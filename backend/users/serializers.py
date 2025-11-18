from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


# -------------------------
# BASE USER SERIALIZER
# -------------------------
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating Users.
    Password is optional here so admin/manager can update user details without resetting password.
    """

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "role", "password")
        read_only_fields = ("id",)

    def create(self, validated_data):
        """Create a user with validated password handling."""
        password = validated_data.pop("password", None)
        user = User(**validated_data)

        if password:
            validate_password(password, user)
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save()
        return user

    def update(self, instance, validated_data):
        """Allow password updates while editing user profile."""
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            validate_password(password, instance)
            instance.set_password(password)

        instance.save()
        return instance


# -------------------------
# REGISTER SERIALIZER
# -------------------------
class RegisterSerializer(UserSerializer):
    """
    Registration serializer.
    - Public users always receive MEMBER role.
    - Only Admins can assign roles explicitly.
    """

    password = serializers.CharField(write_only=True)

    class Meta(UserSerializer.Meta):
        fields = ("id", "username", "email", "password", "role")

    def validate_role(self, value):
        request = self.context.get("request")

        # Unauthenticated users → always MEMBER
        if not request or not request.user.is_authenticated:
            return User._meta.get_field("role").default

        # Authenticated but not admin → cannot set roles
        if request.user.is_authenticated and not request.user.is_admin:
            raise serializers.ValidationError("Only admins can assign roles explicitly.")

        return value


# -------------------------
# CUSTOM JWT LOGIN SERIALIZER
# -------------------------
class UsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT authentication:
    - Uses Django authenticate()
    - Returns access/refresh token plus basic user info
    """

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"),
            username=username,
            password=password
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            },
        }
