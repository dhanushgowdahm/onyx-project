# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Doctor, Patient, Bed, Appointment, Medicine, Diagnosis

# Define an inline admin descriptor for Doctor model
# which acts a bit like a singleton
class DoctorProfileInline(admin.StackedInline):
    model = Doctor
    can_delete = False
    verbose_name_plural = 'Doctor Profile'
    fk_name = 'user'

class CustomUserAdmin(UserAdmin):
    inlines = (DoctorProfileInline, )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'role')
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('role',)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {'fields': ('role',)}),)

    def get_inline_instances(self, request, obj=None):
        if not obj or obj.role != 'doctor':
            return []
        return super().get_inline_instances(request, obj)

# Unregister the original User admin
# admin.site.unregister(CustomUser)
# Register the new CustomUser admin
admin.site.register(CustomUser, CustomUserAdmin)

# We no longer need a separate admin for Doctor
# admin.site.register(Doctor) 

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