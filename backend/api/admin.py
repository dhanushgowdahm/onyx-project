# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Doctor, Patient, Bed, Appointment, Medicine, Diagnosis

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

@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ('medicine_name', 'patient', 'dosage', 'frequency_display', 'relation_to_food', 'no_of_days', 'created_at')
    list_filter = ('relation_to_food', 'created_at')
    search_fields = ('medicine_name', 'patient__name')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    def frequency_display(self, obj):
        """Display frequency as a formatted list"""
        frequencies = obj.get_frequency_list()
        if frequencies:
            return ' + '.join(frequencies)
        return 'Not set'
    frequency_display.short_description = 'Frequency'

@admin.register(Diagnosis)
class DiagnosisAdmin(admin.ModelAdmin):
    list_display = ('patient', 'diagnosis_preview', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('diagnosis', 'patient__name')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    def diagnosis_preview(self, obj):
        return obj.diagnosis[:50] + '...' if len(obj.diagnosis) > 50 else obj.diagnosis
    diagnosis_preview.short_description = 'Diagnosis Preview'