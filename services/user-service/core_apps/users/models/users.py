from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    kc_id = models.UUIDField(unique=True, editable=False)