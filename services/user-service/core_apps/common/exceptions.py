

class ApplicationError(Exception):
    """Base exception for application-level errors."""


class UserAlreadyExistsError(ApplicationError):
    """Raised when a user already exists."""


class UserNotFoundError(ApplicationError):
    """Raised when a user does not exist."""


class KeycloakError(ApplicationError):
    """Raised when a Keycloak operation fails."""