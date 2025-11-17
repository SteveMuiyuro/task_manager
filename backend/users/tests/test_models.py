from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserModelTests(TestCase):
    def test_roles_flags(self):
        user = User.objects.create_user(username='member', email='m@example.com', password='pass1234')
        self.assertTrue(user.is_member)
        self.assertFalse(user.is_admin)

    def test_admin_flag(self):
        admin = User.objects.create_user(username='admin', email='a@example.com', password='pass1234', role='ADMIN')
        self.assertTrue(admin.is_admin)
        self.assertFalse(admin.is_member)
