# api/serializers.py
from rest_framework import serializers
from .models import Doctor, Patient, Bed, Appointment, Medicine, Diagnosis
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        # Add the user's full name to the token
        token['name'] = user.get_full_name() or user.username
        return token

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

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
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    frequency_list = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Medicine
        fields = '__all__'
    
    def get_frequency_list(self, obj):
        """Convert comma-separated frequency string to list for frontend display"""
        if obj.frequency:
            return obj.frequency.split(',')
        return []
    
    def validate_frequency(self, value):
        """Validate that frequency contains valid choices"""
        if value:
            frequency_choices = ['Breakfast', 'Lunch', 'Dinner']
            frequencies = [f.strip() for f in value.split(',')]
            
            for freq in frequencies:
                if freq not in frequency_choices:
                    raise serializers.ValidationError(f"'{freq}' is not a valid frequency choice. Valid choices are: {', '.join(frequency_choices)}")
            
            # Remove duplicates and rejoin
            unique_frequencies = list(dict.fromkeys(frequencies))  # Preserve order while removing duplicates
            return ','.join(unique_frequencies)
        
        return value

class DiagnosisSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    
    class Meta:
        model = Diagnosis
        fields = '__all__'