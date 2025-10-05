from rest_framework import serializers
from .models import Doctor, Patient, Bed, Appointment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['name'] = user.get_full_name() or user.username
        return token

class DoctorSerializer(serializers.ModelSerializer):
    # Add fields from the related User model to make them available in the API
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Doctor
        # Include all fields from Doctor model and the new user fields
        fields = ['id', 'user', 'first_name', 'last_name', 'email', 'specialization', 'contact', 'availability']
        read_only_fields = ['user'] # User should not be changed directly via API

class BedSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True, default=None)
    
    class Meta:
        model = Bed
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'