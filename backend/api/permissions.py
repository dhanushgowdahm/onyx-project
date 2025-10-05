from rest_framework import permissions

class IsAdminOrReceptionist(permissions.BasePermission):
    """
    Allows access only to admin or receptionist users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['admin', 'receptionist']

class IsDoctor(permissions.BasePermission):
    """
    Allows access only to doctor users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'doctor'

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `assigned_doctor` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the doctor assigned to the patient.
        return obj.assigned_doctor == request.user.doctor