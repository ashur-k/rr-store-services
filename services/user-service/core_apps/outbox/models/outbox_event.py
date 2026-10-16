import uuid

from django.db import models


class OutboxEvent(models.Model):
    """An event waiting to be published to the message broker."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    event_type = models.CharField(max_length=255)

    payload = models.JSONField()

    created_at = models.DateTimeField(auto_now_add=True)

    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.event_type} - {self.id}"
