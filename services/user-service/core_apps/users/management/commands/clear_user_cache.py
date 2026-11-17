from django.core.management.base import BaseCommand

from config.startup import container


class Command(BaseCommand):
    help = "Clear cached data in the users: Redis namespace."

    def handle(self, *args, **options):
        cache_service = container.cache_service()

        import asyncio

        deleted = asyncio.run(cache_service.clear_namespace("users:"))

        self.stdout.write(self.style.SUCCESS(f"User cache cleared. Deleted {deleted} Redis key(s)."))
