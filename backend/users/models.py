from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class Roles(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    MANAGER = "MANAGER", "Manager"
    MEMBER = "MEMBER", "Member"


def default_role():
    return Roles.MEMBER


class UserManager(BaseUserManager):
    """
    Custom manager for the User model.
    Ensures proper creation of regular users & superusers.
    """

    use_in_migrations = True

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("The username must be set")

        email = self.normalize_email(email) if email else None

        user = self.model(
            username=username,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", Roles.ADMIN)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model with:
    - unique username
    - unique email
    - role (Admin/Manager/Member)
    """

    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=default_role
    )

    objects = UserManager()

    REQUIRED_FIELDS = ["email"]  # required when creating superuser

    class Meta:
        ordering = ["id"]

    # ---- Role helpers ----
    @property
    def is_admin(self):
        return self.role == Roles.ADMIN

    @property
    def is_manager(self):
        return self.role == Roles.MANAGER

    @property
    def is_member(self):
        return self.role == Roles.MEMBER

    def __str__(self):
        return f"{self.username} ({self.role})"
