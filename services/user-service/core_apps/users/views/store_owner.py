from asgiref.sync import sync_to_async
from dependency_injector.wiring import Provide, inject
from django.http import JsonResponse
from django.views import View
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from config.container import Container
from core_apps.users.auth import KeycloakJWTAuthentication

from ..permissions import IsKeycloakAdminOrStaff
from ..schemas import CreateStoreUser
from ..services import UserService


class StoreListWithOwnersAsyncView(View):
    """Return stores with their owner details asynchronously."""

    async def get(self, request):
        drf_request = Request(
            request,
            authenticators=[KeycloakJWTAuthentication()],
        )

        try:
            await sync_to_async(lambda: drf_request.user)()
        except APIException as exc:
            return JsonResponse(
                {"detail": str(exc.detail)},
                status=exc.status_code,
            )

        permission = IsKeycloakAdminOrStaff()
        has_permission = await sync_to_async(permission.has_permission)(
            drf_request,
            self,
        )

        if not has_permission:
            return JsonResponse(
                {"detail": "You do not have permission to perform this action."},
                status=403,
            )

        user_service = Container.user_service()
        stores = await user_service.aget_stores_with_owners()

        return JsonResponse(stores, safe=False, status=200)


class StoreUserListCreateView(APIView):
    """Create a store user."""

    permission_classes = [IsKeycloakAdminOrStaff]

    @inject
    def get(self, request, user_service: UserService = Provide[Container.user_service]):
        users = user_service.get_store_users()
        return Response(users, status=status.HTTP_200_OK)

    @inject
    def post(self, request, user_service: UserService = Provide[Container.user_service]):
        data = CreateStoreUser.model_validate(request.data)

        user = user_service.create_store_user(data)

        return Response(
            {
                "id": user.id,
                "kc_id": str(user.kc_id),
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class StoreUserDetailView(APIView):
    """Retrieve, update, or delete a store user."""

    permission_classes = [IsKeycloakAdminOrStaff]

    def get(self, request, user_id: int):
        """Retrieve a store user's details."""
        return Response(
            {"detail": "Store user detail is not implemented yet."},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )

    def patch(self, request, user_id: int):
        """Partially update a store user."""
        return Response(
            {"detail": "Store user update is not implemented yet."},
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )

    @inject
    def delete(
        self,
        request,
        user_id: int,
        user_service: UserService = Provide[Container.user_service],
    ):
        user_service.delete_user(user_id)

        return Response(status=status.HTTP_204_NO_CONTENT)
