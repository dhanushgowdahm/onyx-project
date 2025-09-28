# accounts/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Custom Login View to set token in cookie
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Set tokens in HTTPOnly cookies for security
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

# Redirection logic based on role
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