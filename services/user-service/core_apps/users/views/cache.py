from asgiref.sync import async_to_sync
from dependency_injector.wiring import Provide, inject
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from config.container import Container
from core_apps.users.permissions import IsKeycloakAdmin


class ClearUserCacheView(APIView):
    permission_classes = [IsAuthenticated, IsKeycloakAdmin]

    @inject
    def post(
        self,
        request,
        cache_service=Provide[Container.cache_service],
    ):
        deleted = async_to_sync(cache_service.clear_namespace)("users:")

        return Response(
            {
                "success": True,
                "message": "User cache cleared.",
                "deleted_keys": deleted,
            }
        )
