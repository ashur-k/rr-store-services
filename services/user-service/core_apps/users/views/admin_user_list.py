from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsKeycloakAdmin


class AdminUserListView(APIView):
    """
    Admin endpoint to list Django users.
    Requires the 'admin' Keycloak role.
    """
    permission_classes = [IsAuthenticated, IsKeycloakAdmin]

    def get(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        users = User.objects.values(
            "id", "username", "email", "is_staff", "is_active",
            "date_joined",
        )[:100]
        return Response({"users": list(users)})
