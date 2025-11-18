from django.contrib import admin
from django.urls import path, include

from config.routers import router
from users.views import RegisterView, LoginView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # Authentication Endpoints
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", LoginView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/logout/", LogoutView.as_view(), name="logout"),

    # API Router
    path("api/", include(router.urls)),
]
