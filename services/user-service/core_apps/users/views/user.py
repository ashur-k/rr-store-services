from dependency_injector.wiring import Provide, inject
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from config.container import Container

from ..models import User
from ..permissions import IsKeycloakAdminOrStaff, IsSelfOrAdminStaff
from ..schemas import CreateUser, UpdateUser, UserResponse
from ..services import UserService


def serialize_user(user: User) -> dict:
    """Serialize a Django user for an API response."""

    return UserResponse(
        id=user.id,
        kc_id=str(user.kc_id),
        email=user.email,
    ).model_dump(mode="json")


class UserListCreateView(APIView):
    """List and create users."""

    permission_classes = [IsKeycloakAdminOrStaff]

    @inject
    def get(self, request, user_service: UserService = Provide[Container.user_service]):
        users = user_service.get_users()

        return Response(
            [serialize_user(user) for user in users],
            status=status.HTTP_200_OK,
        )

    @inject
    def post(self, request, user_service: UserService = Provide[Container.user_service]):
        data = CreateUser.model_validate(request.data)

        user = user_service.create_user(data)

        return Response(
            serialize_user(user),
            status=status.HTTP_200_OK,
        )


class UserDetailView(APIView):
    """Retrieve, update, or delete a user."""

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsKeycloakAdminOrStaff()]

        return [IsSelfOrAdminStaff()]

    @inject
    def get(
        self,
        request,
        user_id: int,
        user_service: UserService = Provide[Container.user_service],
    ):
        user = user_service.get_user(user_id)

        return Response(
            serialize_user(user),
            status=status.HTTP_200_OK,
        )

    @inject
    def patch(
        self,
        request,
        user_id: int,
        user_service: UserService = Provide[Container.user_service],
    ):
        data = UpdateUser.model_validate(request.data)

        user = user_service.update_user(
            user_id,
            data,
        )

        return Response(
            serialize_user(user),
            status=status.HTTP_200_OK,
        )

    @inject
    def delete(
        self,
        request,
        user_id: int,
        user_service: UserService = Provide[Container.user_service],
    ):
        user_service.delete_user(user_id)

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )