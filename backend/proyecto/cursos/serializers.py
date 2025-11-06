from rest_framework import serializers
from .models import Curso, Matricula, Tarea, Entrega, Calificacion

class CursoSerializer(serializers.ModelSerializer):
    alumnos_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Curso
        fields = ['id','nombre','descripcion','profesor','creado_en','alumnos_count']
        read_only_fields = ['profesor','creado_en','alumnos_count']

class MatriculaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matricula
        fields = ['id','curso','alumno','fecha']

class TareaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarea
        fields = ['id','curso','titulo','descripcion','fecha_entrega','publicado','creado_en']
        read_only_fields = ['creado_en']

class EntregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrega
        fields = ['id','tarea','alumno','texto','archivo','enviada_en']
        read_only_fields = ['enviada_en']

class CalificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calificacion
        fields = ['id','entrega','nota','feedback','calificada_en']
        read_only_fields = ['calificada_en']

class AlumnoResumenSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    first_name = serializers.CharField(allow_blank=True)
    last_name = serializers.CharField(allow_blank=True)
    cursos = serializers.ListField(child=serializers.DictField(), default=list)