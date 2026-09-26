from datetime import datetime, timezone

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..permissions import IsKeycloakStaff
from ..serializers import ItemSerializer


class ItemListView(APIView):
    """ List items. Requires 'staff' role. """
    permission_classes = [IsAuthenticated, IsKeycloakStaff]

    def get(self, request):
        items = [
            {
                "id": 1,
                "name": "Widget",
                "owner": request.user.username,
                "created_at": datetime.now(timezone.utc),
            },
            {
                "id": 2,
                "name": "Gadget",
                "owner": request.user.username,
                "created_at": datetime.now(timezone.utc),
            },
        ]
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)
