# accounts/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions, serializers
from .serializers import MyTokenObtainPairSerializer, DoctorSerializer, PatientSerializer, BedSerializer, AppointmentSerializer, MedicineSerializer, DiagnosisSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Doctor, Patient, Bed, Appointment, Medicine, Diagnosis
from .permissions import IsAdminOrReceptionist, IsDoctor # Import new permissions

# Custom Login View - Standard JWT approach, only returns tokens
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Standard JWT token generation - only returns access and refresh tokens
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Set tokens in HTTPOnly cookies for security (optional)
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            response.set_cookie(
                'access_token',
                access_token,
                httponly=True,
                samesite='Lax'
            )
            response.set_cookie(
                'refresh_token',
                refresh_token,
                httponly=True,
                samesite='Lax'
            )
        
        return response

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    # Only receptionists and admins can manage doctors
    permission_classes = [IsAdminOrReceptionist]

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            # Use the direct relationship! This is robust.
            return Patient.objects.filter(assigned_doctor=user.doctor_profile)
        elif user.role in ['admin', 'receptionist']:
            return Patient.objects.all()
        return Patient.objects.none()


class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.all()
    serializer_class = BedSerializer
    # Only receptionists and admins can manage beds
    permission_classes = [IsAdminOrReceptionist]

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            # Use the direct relationship here as well!
            return Appointment.objects.filter(doctor=user.doctor_profile)
        elif user.role in ['admin', 'receptionist']:
            return Appointment.objects.all()
        return Appointment.objects.none()

class MedicineViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'receptionist', 'doctor']:
            # All authenticated users can see all medicines
            return Medicine.objects.all()
        return Medicine.objects.none()

class DiagnosisViewSet(viewsets.ModelViewSet):
    serializer_class = DiagnosisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'receptionist', 'doctor']:
            # All authenticated users can see all diagnoses
            return Diagnosis.objects.all()
        return Diagnosis.objects.none()


# Login Page View
def login_view(request):
    return render(request, 'api/login.html')

# Logout View
def logout_view(request):
    logout(request)
    response = redirect('login')
    # Clear cookies on logout
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response

# API endpoint to verify user authentication and get user info
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'role': user.role,
            'user_id': user.id,
            'is_authenticated': True
        })

# Redirection logic based on role (kept for backward compatibility)
class RoleRedirectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.user.role
        if role == 'admin':
            return redirect('admin_dashboard')
        elif role == 'receptionist':
            return redirect('receptionist_dashboard')
        elif role == 'doctor':
            return redirect('doctor_dashboard')
        else:
            return Response({"error": "Invalid role"}, status=400)

# Simple Dashboard Views (protected by authentication)
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Forbidden"}, status=403)
        return render(request, 'api/admin_dashboard.html')

class ReceptionistDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.role != 'receptionist':
            return Response({"error": "Forbidden"}, status=403)
        return render(request, 'api/receptionist_dashboard.html')

class DoctorDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.role != 'doctor':
            return Response({"error": "Forbidden"}, status=403)
        return render(request, 'api/doctor_dashboard.html')