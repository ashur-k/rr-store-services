from pydantic import BaseModel, EmailStr


class CreateStoreUser(BaseModel):
    """Data required to create a store user."""

    email: EmailStr
    first_name: str
    last_name: str


class KeycloakStoreUserCreate(BaseModel):
    """Data required by Keycloak to create a store user."""

    email: EmailStr
    first_name: str
    last_name: str
    password: str
