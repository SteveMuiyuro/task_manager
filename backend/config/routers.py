from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet
from users.views import UserViewSet

# Explicitly disable trailing slashes for cleaner API URLs
router = DefaultRouter(trailing_slash=False)

router.register("tasks", TaskViewSet, basename="task")
router.register("users", UserViewSet, basename="user")
