# accounts/authentication.py

from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class to extract JWT from an HttpOnly cookie.
    """
    def authenticate(self, request):
        # Get the token from the 'access_token' cookie
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'))

        if raw_token is None:
            return None

        # Validate the token
        validated_token = self.get_validated_token(raw_token)

        # Return the user and validated token
        return self.get_user(validated_token), validated_token