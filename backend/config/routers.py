from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet
from users.views import UserViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'users', UserViewSet, basename='user')
