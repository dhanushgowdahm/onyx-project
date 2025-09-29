# accounts/authentication.py

from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

class CustomJWTAuthentication(JWTAuthentication):
    """
    Custom authentication class to extract JWT from either Authorization header or HttpOnly cookie.
    """
    def authenticate(self, request):
        # First, try to get token from Authorization header (standard JWT authentication)
        header_token = self.get_header(request)
        if header_token is not None:
            raw_token = self.get_raw_token(header_token)
            if raw_token is not None:
                validated_token = self.get_validated_token(raw_token)
                return self.get_user(validated_token), validated_token

        # If no header token, try to get from cookie
        raw_token = request.COOKIES.get(settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token'))
        
        if raw_token is None:
            return None

        # Validate the token from cookie
        validated_token = self.get_validated_token(raw_token)

        # Return the user and validated token
        return self.get_user(validated_token), validated_token