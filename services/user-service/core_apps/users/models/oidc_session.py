from django.conf import settings
from django.db import models


class OIDCSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="oidc_sessions",
    )
    keycloak_sid = models.CharField(
        max_length=255,
        unique=True,
    )
    django_session_key = models.CharField(
        max_length=255,
        unique=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.keycloak_sid}"