from django.db.models import Count
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated  # por si lo usas en más vistas

from .models import Curso, Matricula, Tarea, Entrega, Calificacion
from .serializers import (
    CursoSerializer, MatriculaSerializer, TareaSerializer,
    EntregaSerializer, CalificacionSerializer, AlumnoResumenSerializer
)
from .permisos import IsTeacherOrAdmin, IsOwnerTeacherOrAdmin
from authentication import CookieJWTAuthentication  # middleware personalizado

User = get_user_model()


class CursoViewSet(viewsets.ModelViewSet):
    """
    ViewSet unificado: cursos del profesor + acciones extra.
    """
    authentication_classes = [CookieJWTAuthentication]
    serializer_class = CursoSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = Curso.objects.all().annotate(alumnos_count=Count('matriculas'))
        # ADMIN o superuser ve todos; profesor solo los suyos
        if getattr(user, "role", None) == 'A' or getattr(user, "is_superuser", False):
            return qs
        return qs.filter(profesor=user)

    def perform_create(self, serializer):
        serializer.save(profesor=self.request.user)

    def get_permissions(self):
        # Para operaciones sobre un curso concreto, exige además ser owner
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsTeacherOrAdmin(), IsOwnerTeacherOrAdmin()]
        return [IsTeacherOrAdmin()]

    @action(methods=['post'], detail=True,
            permission_classes=[IsTeacherOrAdmin, IsOwnerTeacherOrAdmin])
    def matricular(self, request, pk=None):
        """
        POST /api/profesor/cursos/<id>/matricular/
        Acepta:
          - {"username": "daniel"}
          - {"alumno": 10}           fallback por id
        """
        curso = self.get_object()
        username = request.data.get('username')
        alumno_id = request.data.get('alumno') or request.data.get('alumno_id') or request.data.get('user_id')

        if not username and not alumno_id:
            return Response({'detail': "Falta 'username' o 'alumno' (id)."}, status=status.HTTP_400_BAD_REQUEST)

        if username:
            alumno = get_object_or_404(User, username=username)
        else:
            alumno = get_object_or_404(User, pk=alumno_id)

        m, created = Matricula.objects.get_or_create(curso=curso, alumno=alumno)
        return Response(MatriculaSerializer(m).data,
                        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='resumen-alumnos',
            permission_classes=[IsTeacherOrAdmin])
    def resumen_alumnos(self, request):
        User = get_user_model()

        # 1) TODOS los alumnos (role='S'), aunque no tengan matrícula
        alumnos_qs = User.objects.filter(role='S').values(
            'id', 'username', 'first_name', 'last_name',
        )
        agrupado = {
            a['id']: {
                "id": a['id'],
                "username": a['username'],
                "first_name": a['first_name'] or "",
                "last_name": a['last_name'] or "",
                "cursos": [],
            }
            for a in alumnos_qs
        }

        # 2) Añadir cursos si existen matrículas (FKs: alumno, curso)
        qs = Matricula.objects.select_related('alumno', 'curso')
        for m in qs:
            a = m.alumno
            if getattr(a, 'role', None) != 'S':
                continue
            if a.id not in agrupado:
                agrupado[a.id] = {
                    "id": a.id,
                    "username": a.username,
                    "first_name": a.first_name or "",
                    "last_name": a.last_name or "",
                    "cursos": [],
                }
            agrupado[a.id]["cursos"].append({
                "id": m.curso.id,
                "nombre": getattr(m.curso, "nombre", str(m.curso)),
            })

        data = list(agrupado.values())
        return Response(AlumnoResumenSerializer(data, many=True).data, status=200)

class TareaViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieJWTAuthentication]
    serializer_class = TareaSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = Tarea.objects.select_related('curso')
        if getattr(user, "role", None) == 'A':
            return qs
        return qs.filter(curso__profesor=user)

    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy', 'create']:
            return [IsTeacherOrAdmin(), IsOwnerTeacherOrAdmin()]
        return super().get_permissions()


class EntregaViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [CookieJWTAuthentication]
    serializer_class = EntregaSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = Entrega.objects.select_related('tarea', 'alumno', 'tarea__curso')
        if getattr(user, "role", None) == 'A':
            return qs
        return qs.filter(tarea__curso__profesor=user)


class CalificacionViewSet(viewsets.ModelViewSet):
    authentication_classes = [CookieJWTAuthentication]
    serializer_class = CalificacionSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = Calificacion.objects.select_related('entrega', 'entrega__tarea', 'entrega__tarea__curso')
        if getattr(user, "role", None) == 'A':
            return qs
        return qs.filter(entrega__tarea__curso__profesor=user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'retrieve', 'list']:
            return [IsTeacherOrAdmin(), IsOwnerTeacherOrAdmin()]
        return super().get_permissions()
