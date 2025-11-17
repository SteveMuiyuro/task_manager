from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from tasks.models import Task, TaskStatus

User = get_user_model()


class TaskApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user('admin', 'admin@example.com', 'pass1234', role='ADMIN')
        self.member = User.objects.create_user('member', 'member@example.com', 'pass1234', role='MEMBER')
        self.client.force_authenticate(user=self.admin)

    def test_create_task_as_admin(self):
        url = reverse('task-list')
        payload = {'title': 'New Task', 'description': 'Test', 'status': TaskStatus.PENDING}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)

    def test_member_cannot_assign_others(self):
        self.client.force_authenticate(user=self.member)
        url = reverse('task-list')
        payload = {'title': 'New Task', 'assigned_to_id': self.admin.id}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        task = Task.objects.get()
        self.assertEqual(task.assigned_to, self.member)
