from rest_framework import serializers


class UserProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    sub = serializers.CharField()
    email = serializers.EmailField(allow_blank=True)
    username = serializers.CharField()
    first_name = serializers.CharField(allow_blank=True)
    last_name = serializers.CharField(allow_blank=True)
    realm_roles = serializers.ListField(child=serializers.CharField())
    client_roles = serializers.ListField(child=serializers.CharField())
    is_staff = serializers.BooleanField()
    is_superuser = serializers.BooleanField()


class ItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    owner = serializers.CharField()
    created_at = serializers.DateTimeField()