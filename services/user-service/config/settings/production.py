from .base import *  # noqa
from .base import env
import re

DEBUG = False

SECRET_KEY = env("DJANGO_SECRET_KEY")

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS")

CSRF_TRUSTED_ORIGINS = env.list("DJANGO_CSRF_TRUSTED_ORIGINS")

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

OIDC_REDIRECT_URI = "https://rr-store.co.uk/oidc/callback/"
CORS_ALLOWED_ORIGINS = ["https://rr-store.co.uk"]
OIDC_EXEMPT_URLS = [re.compile(r"^/api/")]
