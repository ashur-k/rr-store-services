from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from keycloak import KeycloakAdmin

from config.keycloak import KEYCLOAK

CLIENT_ID = settings.STORE_SERVICE_M2M_CLIENT_ID
ROLE_NAME = "check-store-ownership"


class Command(BaseCommand):
    help = "Provision the store-service M2M client and its restricted role in Keycloak."

    def handle(self, *args, **options):
        if not settings.STORE_SERVICE_M2M_CLIENT_SECRET:
            raise CommandError("STORE_SERVICE_M2M_CLIENT_SECRET must be configured.")

        try:
            admin = KeycloakAdmin(
                server_url=KEYCLOAK.server_url,
                realm_name=KEYCLOAK.realm,
                client_id=KEYCLOAK.admin_client_id,
                client_secret_key=KEYCLOAK.admin_client_secret,
            )

            client = self._get_or_create_client(admin)
            client_uuid = client["id"]

            self._ensure_audience_mapper(admin, client_uuid)  # Add this
            self._ensure_role(admin)

            service_account = admin.get_client_service_account_user(client_uuid)
            service_account_id = service_account["id"]

            role = admin.get_realm_role(ROLE_NAME)
            assigned_roles = admin.get_realm_roles_of_user(service_account_id)

            if not any(item["name"] == ROLE_NAME for item in assigned_roles):
                admin.assign_realm_roles(
                    service_account_id,
                    [role],
                )

        except Exception as exc:
            raise CommandError(
                "Failed to provision the store-service M2M client. Check Keycloak connectivity and admin permissions."
            ) from exc

        self.stdout.write(
            self.style.SUCCESS(f"Keycloak M2M client '{CLIENT_ID}' is configured with role '{ROLE_NAME}'.")
        )

    def _get_or_create_client(self, admin):
        clients = admin.get_clients()
        client = next(
            (item for item in clients if item.get("clientId") == CLIENT_ID),
            None,
        )

        client_secret = settings.STORE_SERVICE_M2M_CLIENT_SECRET

        if client is None:
            client_uuid = admin.create_client(
                {
                    "clientId": CLIENT_ID,
                    "name": "User service store ownership check",
                    "enabled": True,
                    "protocol": "openid-connect",
                    "publicClient": False,
                    "clientAuthenticatorType": "client-secret",
                    "secret": client_secret,
                    "serviceAccountsEnabled": True,
                    "standardFlowEnabled": False,
                    "implicitFlowEnabled": False,
                    "directAccessGrantsEnabled": False,
                    "authorizationServicesEnabled": False,
                    "fullScopeAllowed": False,
                }
            )
            client = admin.get_client(client_uuid)
        else:
            admin.update_client(
                client["id"],
                {
                    "enabled": True,
                    "publicClient": False,
                    "clientAuthenticatorType": "client-secret",
                    "secret": client_secret,
                    "serviceAccountsEnabled": True,
                    "standardFlowEnabled": False,
                    "implicitFlowEnabled": False,
                    "directAccessGrantsEnabled": False,
                    "authorizationServicesEnabled": False,
                    "fullScopeAllowed": False,
                },
            )
            client = admin.get_client(client["id"])

        return client

    def _ensure_audience_mapper(self, admin, client_uuid):
        """Ensure M2M access tokens include the store-service audience."""
        mapper_name = "store-service-audience"

        mapper_payload = {
            "name": mapper_name,
            "protocol": "openid-connect",
            "protocolMapper": "oidc-audience-mapper",
            "config": {
                "included.custom.audience": "store-service",
                "access.token.claim": "true",
                "id.token.claim": "false",
                "introspection.token.claim": "true",
            },
        }

        mappers = admin.get_mappers_from_client(client_uuid)

        existing_mapper = next(
            (mapper for mapper in mappers if mapper.get("name") == mapper_name),
            None,
        )

        if existing_mapper is None:
            admin.add_mapper_to_client(client_uuid, mapper_payload)
        else:
            admin.update_client_mapper(
                client_uuid,
                existing_mapper["id"],
                mapper_payload,
            )

    def _ensure_role(self, admin):
        try:
            admin.get_realm_role(ROLE_NAME)
        except Exception:
            admin.create_realm_role(
                {
                    "name": ROLE_NAME,
                    "description": (
                        "Allows the user service to check whether an owner "
                        "has stores. Does not grant general store access."
                    ),
                }
            )
