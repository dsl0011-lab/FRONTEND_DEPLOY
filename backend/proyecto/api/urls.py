
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (TokenRefreshView, TokenVerifyView)

from api.views import (
    # CookieTokenVerifyView,
    UsuarioPersonalizadoViewSet,
    MyTokenObtainPairView,
    register_user,
    logout,
    CookieTokenRefreshView,
    CookieTokenVerifyView
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioPersonalizadoViewSet, basename='usuarios')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # usa el campo token dentro de heathers, innacesible para cookie httponly
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'), #sucede el mismo problema que el de arriba
    path('auth/token/refresh_cookie/', CookieTokenRefreshView.as_view(), name='token_refresh_cookie'), #endpoint para refresh usando cookie httponly
    path("auth/token/verify_cookie/", CookieTokenVerifyView.as_view(), name="token_verify_cookie"), #endpoint para verify usando cookie httponly
    path('auth/register/', register_user, name='register'),
    path('auth/logout', logout, name='logout'), #endpoint para logout eliminando la cookie httponly
]
