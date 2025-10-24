from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Leer token desde la cookie HttpOnly "jwt"
        access_token = request.COOKIES.get('jwt')

        if access_token is None:
            return None  # Deja que siga el flujo normal (podría ser Token en headers)

        # Validar token como si viniera en los headers
        validated_token = self.get_validated_token(access_token)
        return self.get_user(validated_token), validated_token
