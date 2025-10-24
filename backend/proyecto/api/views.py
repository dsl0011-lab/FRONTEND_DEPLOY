# backend/proyecto/api/views.py

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import UsuarioPersonalizado
from .serializers import (
    UsuarioPersonalizadoSerializer,
    RegistroSerializer,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
class IsAdminOrSelf(BasePermission):
    """
    Permite acceso total a ADMIN/superuser y acceso de objeto al propio usuario.
    Se usa junto con IsAuthenticated.
    """
    def has_permission(self, request, view):
        # Permiso general: debe estar autenticado para el ViewSet
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # ADMIN o superuser -> acceso total
        if request.user.is_superuser or getattr(request.user, "role", None) == "ADMIN":
            return True
        # De lo contrario, solo al propio registro
        return obj.id == request.user.id


class UsuarioPersonalizadoViewSet(viewsets.ModelViewSet):
    """
    CRUD de usuarios con seguridad:
    - ADMIN/superuser puede listar/crear/editar/eliminar a cualquiera.
    - No-ADMIN solo ve y edita su propio perfil.
    - Endpoints extra:
        * GET /api/usuarios/me/         → perfil propio
        * POST /api/usuarios/set-password/ → cambiar contraseña propia
    """
    serializer_class = UsuarioPersonalizadoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrSelf]

    # Búsqueda y ordenación útiles
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["username", "email", "first_name", "last_name", "role"]
    ordering = ["id"]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or getattr(user, "role", None) == "ADMIN":
            return UsuarioPersonalizado.objects.all()
        # No-ADMIN solo su propio registro
        return UsuarioPersonalizado.objects.filter(id=user.id)

    def perform_create(self, serializer):
        """
        Crea usuario respetando set_password si viene 'password' en el body.
        Ojo: los checks de role/is_active los gestiona el serializer (solo ADMIN).
        """
        user = serializer.save()
        password = self.request.data.get("password")
        if password:
            user.set_password(password)
            user.save()

    def destroy(self, request, *args, **kwargs):
        """
        Restringe la eliminación a ADMIN/superuser.
        """
        if not (request.user.is_superuser or getattr(request.user, "role", None) == "ADMIN"):
            return Response({"detail": "Solo ADMIN puede eliminar usuarios."},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        """
        Devuelve el perfil del usuario autenticado.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="set-password")
    def set_password(self, request):
        """
        Cambia la contraseña del usuario autenticado.
        Body: { "new_password": "..." } (mín. 8)
        """
        new_password = request.data.get("new_password")
        if not new_password or len(new_password) < 8:
            return Response({"detail": "Nueva contraseña inválida (mínimo 8 caracteres)."},
                            status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        user.set_password(new_password)
        user.save()
        return Response({"ok": True})

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegistroSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        response_data =({
            "username": user.username,
            "full_name": user.full_name,
            "id": user.id,
            "gender": user.gender,
            "role": user.role
            })
        response = Response(response_data, status=status.HTTP_201_CREATED)
        response.set_cookie(
            key="jwt",
            value=access_token,
            httponly=True,
            secure=False,  # True en HTTPS
            samesite="Lax",
            domain="localhost"
        )
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Campo extra en el payload
        token["role"] = getattr(user, "role", None)
        token["username"] = user.username
        token["id"] = user.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            "role": getattr(self.user, "role", None),
            "username": self.user.username,
            "gender": self.user.gender,
            "full_name": self.user.full_name,
            "email": self.user.email
        })
        #opcional si HttpOnly esta activo
        data.pop("access", None)
        data.pop("refresh", None)
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    # Your custom logic here, e.g., custom serializer
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": "Credenciales inválidas"}, status=401)
        access_token = serializer.validated_data.get("access") or super().get_serializer().get_token(serializer.user).access_token
        refresh_token = super().get_serializer().get_token(serializer.user)
        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        #  Guardamos las cookies HttpOnly
        response.set_cookie(
            key="jwt",
            value=str(access_token),
            httponly=True,
            samesite="Lax",
            secure=False,  # True si usas HTTPS
        )
        return response
