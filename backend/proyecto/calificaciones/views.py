from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from .models import NotaAcademica, Asistencia
from .serializers import (
    NotaAcademicaSerializer, AsistenciaSerializer
)
from cursos.models import Curso

class CalificacionViewSet(viewsets.ModelViewSet):
    serializer_class = NotaAcademicaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        queryset = NotaAcademica.objects.select_related('estudiante', 'curso', 'profesor')
        print(queryset)
        
        if hasattr(user, 'estudiante'):
            queryset = queryset.filter(estudiante=user, visible_estudiante=True)
        
        curso_id = self.request.query_params.get('curso', None)
        if curso_id:
            queryset = queryset.filter(curso_id=curso_id)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(profesor=self.request.user)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        user = request.user
        
        notas = NotaAcademica.objects.filter(estudiante=user, visible_estudiante=True)
        cursos_stats = []
        
        for curso_id in notas.values_list('curso', flat=True).distinct():
            notas_curso = notas.filter(curso=curso_id)
            media = notas_curso.aggregate(Avg('nota'))['nota__avg'] or 0
            asists = Asistencia.objects.filter(estudiante=user, curso=curso_id)
            total_asist = asists.count()
            presentes = asists.filter(presente=True).count()
            porcentaje_asist = (presentes / total_asist * 100) if total_asist > 0 else 100
            
            cursos_stats.append({
                'curso_id': curso_id,
                'curso_nombre': notas_curso.first().curso.nombre,
                'media_calificaciones': round(media, 2),
                'total_calificaciones': notas_curso.count(),
                'porcentaje_asistencia': round(porcentaje_asist, 2)
            })
        
        return Response(cursos_stats)

class AsistenciaViewSet(viewsets.ModelViewSet):
    serializer_class = AsistenciaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Asistencia.objects.select_related('estudiante', 'curso', 'profesor')
        
        if hasattr(user, 'estudiante'):
            queryset = queryset.filter(estudiante=user)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(profesor=self.request.user)