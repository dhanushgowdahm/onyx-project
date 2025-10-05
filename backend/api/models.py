# api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('receptionist', 'Receptionist'),
        ('doctor', 'Doctor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='receptionist')

    def __str__(self):
        return self.username

class Doctor(models.Model):
    # One-to-one link to the user model
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='doctor_profile')
    
    # Name is no longer needed here; we'll get it from the user model
    # name = models.CharField(max_length=100)
    
    specialization = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    availability = models.CharField(max_length=255, blank=True, help_text="Comma-separated days, e.g., Monday,Tuesday")

    def __str__(self):
        # Get the full name from the linked user
        return f"Dr. {self.user.get_full_name()} ({self.specialization})"

class Bed(models.Model):
    WARD_CHOICES = (
        ('Ward A', 'Ward A'),
        ('Ward B', 'Ward B'),
        ('Ward C', 'Ward C'),
    )
    bed_number = models.CharField(max_length=10, unique=True)
    ward = models.CharField(max_length=50, choices=WARD_CHOICES)
    is_occupied = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.ward} - {self.bed_number}"

class Patient(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    contact = models.CharField(max_length=15)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=15, blank=True)
    condition = models.TextField(blank=True, help_text="Current diagnosis or medical condition")
    
    assigned_bed = models.OneToOneField(Bed, on_delete=models.SET_NULL, null=True, blank=True, related_name='patient')
    assigned_doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')

    def __str__(self):
        return self.name

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.CharField(max_length=5) # e.g., '09:30'
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')

    def __str__(self):
        return f"Appointment for {self.patient.name} with Dr. {self.doctor.name}"