
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView, TokenVerifyView, TokenBlacklistView
)

from api.views import (
    UsuarioPersonalizadoViewSet,
    register_user,
    MyTokenObtainPairView,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioPersonalizadoViewSet, basename='usuarios')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('auth/register/', register_user, name='register'),
]

