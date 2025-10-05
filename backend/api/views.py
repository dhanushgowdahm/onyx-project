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
        queryset = Medicine.objects.none()
        
        if user.role in ['admin', 'receptionist', 'doctor']:
            queryset = Medicine.objects.all()
            
            # Filter by patient if provided in query params
            patient_id = self.request.query_params.get('patient', None)
            if patient_id is not None:
                queryset = queryset.filter(patient_id=patient_id)
                
        return queryset.order_by('-created_at')

class DiagnosisViewSet(viewsets.ModelViewSet):
    serializer_class = DiagnosisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Diagnosis.objects.none()
        
        if user.role in ['admin', 'receptionist', 'doctor']:
            queryset = Diagnosis.objects.all()
            
            # Filter by patient if provided in query params
            patient_id = self.request.query_params.get('patient', None)
            if patient_id is not None:
                queryset = queryset.filter(patient_id=patient_id)
                
        return queryset.order_by('-created_at')


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
        response_data = {
            
            'username': user.username,
            'role': user.role,
            'user_id': user.id,
            'is_authenticated': True
        }
        
        # If user is a doctor, include doctor profile information
        if user.role == 'doctor':
            try:
                doctor_profile = user.doctor_profile
                response_data.update({
                    'doctor_info': {
                        'id': doctor_profile.id,
                        'specialization': doctor_profile.specialization,
                        'contact': doctor_profile.contact,
                        'availability': doctor_profile.availability,
                        'available_days': doctor_profile.get_available_days(),
                        'available_days_count': len(doctor_profile.get_available_days())
                    }
                })
            except:
                # Doctor profile doesn't exist
                response_data.update({
                    'doctor_info': {
                        'specialization': 'Not Set',
                        'availability': '',
                        'available_days': [],
                        'available_days_count': 0
                    }
                })
        
        return Response(response_data)

# Debug view to check data
class DebugDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from .models import Patient, Medicine, Diagnosis, Bed
        
        patients_count = Patient.objects.count()
        medicines_count = Medicine.objects.count()
        diagnoses_count = Diagnosis.objects.count()
        beds_count = Bed.objects.count()
        
        # Get sample patient data
        sample_patient = Patient.objects.first()
        sample_patient_data = None
        if sample_patient:
            from .serializers import PatientSerializer
            sample_patient_data = PatientSerializer(sample_patient).data
        
        return Response({
            'counts': {
                'patients': patients_count,
                'medicines': medicines_count,
                'diagnoses': diagnoses_count,
                'beds': beds_count
            },
            'sample_patient': sample_patient_data,
            'user_role': request.user.role
        })

# Doctor Availability Check View
class DoctorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Check doctor availability for a specific date or get all available dates"""
        doctor_id = request.query_params.get('doctor_id')
        date_str = request.query_params.get('date')  # Format: YYYY-MM-DD
        
        if not doctor_id:
            return Response({'error': 'doctor_id parameter is required'}, status=400)
        
        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=404)
        
        response_data = {
            'doctor_id': doctor.id,
            'doctor_name': doctor.user.get_full_name(),
            'specialization': doctor.specialization,
            'available_days': doctor.get_available_days()
        }
        
        if date_str:
            try:
                from datetime import datetime
                appointment_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                
                is_available = doctor.is_available_on_date(appointment_date)
                import calendar
                day_name = calendar.day_name[appointment_date.weekday()]
                
                response_data.update({
                    'date': date_str,
                    'day': day_name,
                    'is_available': is_available,
                    'message': f"Dr. {doctor.user.get_full_name()} is {'available' if is_available else 'not available'} on {day_name}, {date_str}"
                })
                
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
        
        return Response(response_data)

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