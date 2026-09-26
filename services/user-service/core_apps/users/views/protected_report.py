from datetime import datetime, timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..permissions import keycloak_role_required


# Function-based view with dynamic role check
@api_view(["GET"])
@permission_classes([IsAuthenticated, keycloak_role_required("staff")])
def protected_report(request):
    """Generate a report. Requires 'staff' role."""
    return Response({
        "report": "Monthly authentication summary",
        "generated_by": request.user.username,
        "generated_at": datetime.now(timezone.utc),
    })