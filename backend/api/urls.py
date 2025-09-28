# accounts/urls.py

from django.urls import path
from .views import (
    login_view,
    logout_view,
    RoleRedirectView,
    AdminDashboardView,
    ReceptionistDashboardView,
    DoctorDashboardView,
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),

    # API endpoints for tokens
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Redirection and dashboards
    path('redirect/', RoleRedirectView.as_view(), name='role_redirect'),
    path('admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('reception/', ReceptionistDashboardView.as_view(), name='receptionist_dashboard'),
    path('doctor/', DoctorDashboardView.as_view(), name='doctor_dashboard'),
]