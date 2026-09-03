from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "password", "password2", "first_name", "last_name")

    def validate_email(self, value):
        email = value.lower().strip()
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return email

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password": "Password do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        email = validated_data["email"].lower().strip()

        user = User.objects.create_user(
            username = email,
            email = email,
            password = validated_data["password"],
            first_name = validated_data.get("first_name", ""),
            last_name = validated_data.get("last_name", ""),
        )
        return user