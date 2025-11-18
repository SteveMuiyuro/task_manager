from pathlib import Path
from decouple import config as env_config
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------------------------------
# Security
# -----------------------------------------------------
SECRET_KEY = env_config("DJANGO_SECRET_KEY")
DEBUG = env_config("DJANGO_DEBUG", default="False").lower() == "true"
ALLOWED_HOSTS = env_config("DJANGO_ALLOWED_HOSTS", default="localhost,127.0.0.1").split(",")

# -----------------------------------------------------
# Installed Apps
# -----------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "corsheaders",

    # Local apps
    "core",
    "users",
    "tasks",
]

# -----------------------------------------------------
# Middleware
# -----------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

# -----------------------------------------------------
# Templates
# -----------------------------------------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# -----------------------------------------------------
# Database
# -----------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env_config("POSTGRES_DB"),
        "USER": env_config("POSTGRES_USER"),
        "PASSWORD": env_config("POSTGRES_PASSWORD"),
        "HOST": env_config("POSTGRES_HOST", default="localhost"),
        "PORT": env_config("POSTGRES_PORT", default="5432"),
    }
}

# -----------------------------------------------------
# CORS
# -----------------------------------------------------
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = env_config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:5173"
).split(",")

# -----------------------------------------------------
# Password Validation
# -----------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# -----------------------------------------------------
# Internationalization
# -----------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# -----------------------------------------------------
# Static / Media (Deployment Critical)
# -----------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "users.User"

# -----------------------------------------------------
# REST Framework
# -----------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
        "rest_framework.filters.SearchFilter",
    ],
}

# -----------------------------------------------------
# JWT Settings
# -----------------------------------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(env_config("ACCESS_TOKEN_MINUTES", default="30"))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(env_config("REFRESH_TOKEN_DAYS", default="7"))
    ),
    "AUTH_HEADER_TYPES": ("Bearer",),
    "BLACKLIST_AFTER_ROTATION": True,
}

# -----------------------------------------------------
# Email
# -----------------------------------------------------
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
