from django.contrib import admin
from .models import UsuarioPersonalizado

@admin.register(UsuarioPersonalizado)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("username", "email")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Info", {"fields": ("full_name", "email", "role")}),
        ("Permisos", {"fields": ("is_active","is_staff","is_superuser","groups","user_permissions")}),
    )
