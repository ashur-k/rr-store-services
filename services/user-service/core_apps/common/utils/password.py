import secrets
import string


def generate_temporary_password(length: int = 16) -> str:
    """Generate a cryptographically secure temporary password."""

    characters = string.ascii_letters + string.digits + "!@#$%^&*_-+="

    return "".join(secrets.choice(characters) for _ in range(length))
