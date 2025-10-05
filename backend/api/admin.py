# api/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Doctor, Patient, Bed, Appointment

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