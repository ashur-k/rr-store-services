from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

from core_apps.users.models import OIDCSession


@receiver(user_logged_in)
def create_oidc_session(sender, request, user, **kwargs):
    
    keycloak_sid = request.session.get("keycloak_sid")

    if not keycloak_sid:
        return

    OIDCSession.objects.update_or_create(
        keycloak_sid=keycloak_sid,
        defaults={
            "user": user,
            "django_session_key": request.session.session_key,
        },
    )