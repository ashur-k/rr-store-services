from .base import *  #noqa
from .base import env

# python -c "import secrets; print(secrets.token_urlsafe(38))" for generating new secret key
SECRET_KEY = env("DJANGO_SECRET_KEY", default = "otc83HoD6v7eCAbkjHgo7z7AaXxT_1mJ1vnmK7_cIdUebcHt44Y")

DEBUG = True

CSRF_TRUSTED_ORIGINS = ["http://localhost:8080"]
