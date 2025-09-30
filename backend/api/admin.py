# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Doctor, Patient, Bed, Appointment

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role')
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('role',)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {'fields': ('role',)}),)

# Register your models here
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Bed)
admin.site.register(Appointment)