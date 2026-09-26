from rest_framework import status
from rest_framework.test import APITestCase


class HealthViewTests(APITestCase):

    def test_health_check_returns_healthy(self):
        response = self.client.get("/users/health/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "healthy"})