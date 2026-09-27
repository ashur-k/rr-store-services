# RR Store

RR Store is a modern e-commerce platform built with a microservice-oriented architecture.

The project is developed as a demonstration of modern software engineering practices, with a focus on clean architecture, maintainability, scalability, and real-world development patterns.

## Architecture

The project is being developed using independent services, with responsibilities separated by domain.

Current structure includes:

* **User Service** — user management, profiles, authentication integration, and Django administration.
* **Keycloak** — identity and authentication provider.
* **PostgreSQL** — relational database for application data.
* **React Frontend** — web application.
* **Nginx** — local reverse proxy.

Future services may include:

* Product Service
* Store Service
* Order Service
* Additional domain-specific services

## User Service Architecture

The User Service follows a layered architecture:

```text
HTTP Request
     ↓
Views
     ↓
Pydantic Validation
     ↓
Services
     ↓
Selectors / Repositories
     ↓
Django ORM / PostgreSQL
```

External identity operations are handled through:

```text
User Service
     ↓
Keycloak Client
     ↓
Keycloak
```

### Layer Responsibilities

* **Views** — HTTP requests and responses.
* **Pydantic Schemas** — request validation and API data contracts.
* **Services** — application workflows and business logic.
* **Selectors** — database read/query operations.
* **Repositories** — database persistence operations.
* **Clients** — communication with external services such as Keycloak.

## Authentication

Keycloak is the primary identity provider.

It is responsible for:

* User authentication
* Password management
* Identity
* Roles
* Authentication sessions
* Access tokens

Django maintains the application-side user record and profile data required by the service.

## Technology Stack

### Backend

* Python
* Django
* Django REST Framework
* Pydantic
* PostgreSQL
* Keycloak
* `python-keycloak`
* Dependency Injector
* uv

### Frontend

* React
* TypeScript
* Vite
* Axios
* TanStack Query
* Redux Toolkit

### Infrastructure

* Docker
* Docker Compose
* Nginx

## Development

The project uses Docker Compose for local development.

```powershell
docker compose -f local.yml up
```

The services can then be accessed through their configured local endpoints.

## Project Status

This project is actively under development. Architecture and infrastructure may evolve as additional services and requirements are introduced.

## Copyright

Copyright © 2026 Ashur Kanwal. All rights reserved.

This source code is provided for viewing and development purposes. No permission is granted to reproduce, distribute, modify, or use this software for commercial purposes without prior written permission from the copyright holder.
