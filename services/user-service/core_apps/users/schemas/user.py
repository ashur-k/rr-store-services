from pydantic import BaseModel, EmailStr


class CreateUser(BaseModel):
    """Application-level data required to create a user."""

    email: EmailStr
    first_name: str
    last_name: str
    password: str


class KeycloakUserCreate(BaseModel):
    """Data required by Keycloak to create a user."""

    email: EmailStr
    first_name: str
    last_name: str
    password: str


class UpdateUser(BaseModel):
    """Application-level data for updating a user."""

    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None


class KeycloakUserUpdate(BaseModel):
    """Data required by Keycloak to update a user."""

    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None


class UserResponse(BaseModel):
    """API response representation of a user."""

    id: int
    kc_id: str
    email: EmailStr