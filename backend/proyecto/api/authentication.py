from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Leer token desde la cookie HttpOnly "jwt"
        access_token = request.COOKIES.get('jwt')

        if not access_token:
            return None  # sin cookie => no autenticar y pasa al siguiente middleware

        try:
            # Validar token como si viniera en los headers
            validated_token = self.get_validated_token(access_token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, TokenError):
            #si el token esta mal formado o expirdao,  no devuelve 401
            return None
