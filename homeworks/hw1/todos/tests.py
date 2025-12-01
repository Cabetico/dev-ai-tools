from django.test import TestCase

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Todo

class TodoModelTest(TestCase):
    def test_create_todo_defaults(self):
        user = User.objects.create_user('u1', 'u1@example.com', 'pw')
        t = Todo.objects.create(title='Test', user=user)
        self.assertEqual(t.title, 'Test')
        self.assertFalse(t.completed)
        self.assertEqual(str(t), 'Test')

class TodoViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('u1', 'u1@example.com', 'pw')
        self.client.login(username='u1', password='pw')

    def test_list_requires_login(self):
        self.client.logout()
        resp = self.client.get(reverse('todo_list'))
        self.assertEqual(resp.status_code, 302)  # redirect to login

    def test_create_todo_via_post(self):
        resp = self.client.post(reverse('todo_create'), {'title': 'New', 'description': ''})
        self.assertEqual(resp.status_code, 302)
        self.assertTrue(Todo.objects.filter(title='New', user=self.user).exists())
# Create your tests here.
