from pydantic import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

from core_apps.common.exceptions import (
    KeycloakError,
    UserAlreadyExistsError,
    UserNotFoundError,
)


def handle_application_exception(
    exception: Exception,
    context: dict,
) -> Response | None:
    """Convert application exceptions into API responses."""

    if isinstance(exception, UserAlreadyExistsError):
        return Response(
            {
                "detail": str(exception),
            },
            status=status.HTTP_409_CONFLICT,
        )

    if isinstance(exception, ValidationError):
        return Response(
            {
                "detail": exception.errors(),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exception, UserNotFoundError):
        return Response(
            {
                "detail": str(exception),
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if isinstance(exception, KeycloakError):
        return Response(
            {"detail": str(exception)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return exception_handler(exception, context)