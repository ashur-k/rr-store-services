# 3. Docker Architecture

Local development uses Docker Compose.

Nginx acts as the entry point for the Django `user-service` API.

```text
                         Browser
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
           React          Nginx         Keycloak
      localhost:5173   localhost:8080  localhost:8081
                            │
                            ▼
                       user-service
                          :8000
                            │
                            │
                     Docker network
                            │
                         Postgres
                          :5432
                       ┌────┴────┐
                       │         │
                       ▼         ▼
                  Keycloak DB   User DB

## Docker Network URLs

```text
Keycloak    → http://keycloak:8080
User API    → http://user-service:8000
Postgres    → postgres:5432

React       → http://localhost:5173
API         → http://localhost:8080
Keycloak    → http://localhost:8081

