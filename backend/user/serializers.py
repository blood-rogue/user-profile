from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "date_joined",
            "bio",
            "avatar",
        ]
        read_only_fields = ["username", "avatar"]
