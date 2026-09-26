import logging

from dependency_injector.wiring import Provide, inject
from django.contrib.auth import logout
from django.http import HttpResponse, HttpResponseRedirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from config.container import Container
from core_apps.users.services.logout import KeycloakLogoutService

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name="dispatch")
class OIDCBackchannelLogoutView(View):
    http_method_names = ["post"]

    @inject
    def post(
        self,
            request,
            logout_service: KeycloakLogoutService = Provide[Container.keycloak_logout_service]
        ):
        logout_token = request.POST.get("logout_token")

        if not logout_token:
            logger.warning("Backchannel logout received without logout_token.")
            return HttpResponse( "Missing logout_token", status=400)

        payload = logout_service.validate_logout_token(logout_token)

        sid = payload.get("sid")
        deleted = logout_service.logout_session(sid)
        logger.info("Keycloak backchannel logout processed. sid=%s django_session_deleted=%s", sid, deleted)

        return HttpResponse(status=200)


class DjangoAdminLogoutView(View):
    http_method_names = ["get", "post"]

    def get(self, request):
        return self._logout(request)

    def post(self, request):
        return self._logout(request)

    @staticmethod
    def _logout(
        request,
        logout_service: KeycloakLogoutService = Provide[Container.keycloak_logout_service]
    ):
        logout_url = logout_service.build_provider_logout_url(request)

        logout(request)
        logger.info("Django admin logout initiated for user=%s.", request.user)

        return HttpResponseRedirect(logout_url)

