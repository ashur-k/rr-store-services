from dependency_injector.wiring import Provide, inject
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from config.container import Container

from ..serializers import UserProfileSerializer
from ..services import UserProfileService


class UserProfileView(APIView):
    """Return the authenticated user's profile."""

    permission_classes = [IsAuthenticated]

    @inject
    def get(
            self,
            request,
            profile_service: UserProfileService = Provide[Container.user_profile_service],
        ):
        claims = getattr(request.user, "keycloak_claims", {})

        if isinstance(request.auth, dict):
            claims = request.auth

        profile = profile_service.get_profile(
            user=request.user,
            claims=claims,
        )

        serializer = UserProfileSerializer(profile)

        return Response(serializer.data)