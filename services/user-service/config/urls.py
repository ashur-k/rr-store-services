from django.conf import settings
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from core_apps.users.views.logout import DjangoAdminLogoutView


def service_status(request):
    return JsonResponse({
        "success": True,
        "message": "Thank you for using RR Store User Service",
        "service": "user-service",
    })


schema_view = get_schema_view(
    openapi.Info(
        title="RR Store User Service API",
        default_version="v1",
        description="User Service API",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url="http://localhost:8080",
)


urlpatterns = [
    path("", service_status, name="service-status"),
    path("oidc/", include("mozilla_django_oidc.urls")),
    path("admin/logout/", DjangoAdminLogoutView.as_view()),
    path('admin/', admin.site.urls),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("users/", include("core_apps.users.urls")),
]
