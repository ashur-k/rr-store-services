# Keycloak Configuration

This document describes the Keycloak configuration for the RR Store project.

Keycloak provides:

- Authentication
- Single Sign-On (SSO)
- User management
- Realm roles
- OIDC authentication
- OAuth 2.0 authorization
- Logout
- Backchannel logout

The same Keycloak realm is used by:

- React frontend
- Django user-service
- Django admin
- Future microservices

# 1. Architecture

The project uses one Keycloak realm:

```text
Keycloak
└── rr-store
    │
    ├── user-service
    │     └── Django backend / Django admin
    │
    └── rr-store-frontend
          └── React frontend

# 2. Keycloak URLs

There are two different Keycloak URLs depending on where the request originates.

## Browser URL

Used by React and the user's browser:

```text
http://localhost:8081

