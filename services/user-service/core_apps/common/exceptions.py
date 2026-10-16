class ApplicationError(Exception):
    """Base exception for application-level errors."""


class UserAlreadyExistsError(ApplicationError):
    """Raised when a user already exists."""


class UserNotFoundError(ApplicationError):
    """Raised when a user does not exist."""


class KeycloakError(ApplicationError):
    """Raised when a Keycloak operation fails."""


class KeycloakUserNotFoundError(KeycloakError):
    pass


class UserOwnsStoresError(ApplicationError):
    """Raised when a user owns stores and cannot be deleted."""


class StoreServiceUnavailableError(ApplicationError):
    """Raised when store ownership cannot be verified."""
