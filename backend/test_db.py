#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append('/c/Users/DELL/Desktop/onyx_prj/onyx-project/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')

django.setup()

from api.models import Doctor, Patient, Bed, Appointment

# Test Doctor model
print("=== DOCTOR MODEL TESTING ===")
print(f"Doctor table exists: {Doctor._meta.db_table}")

# Check existing doctors
doctors = Doctor.objects.all()
print(f"Number of existing doctors: {doctors.count()}")

for doctor in doctors:
    print(f"Doctor: {doctor}")

# Test creating a new doctor
try:
    test_doctor = Doctor.objects.create(
        name="Dr. Test Smith",
        specialization="Cardiology", 
        contact="+1234567890",
        availability="Mon,Wed,Fri"
    )
    print(f"✅ Successfully created doctor: {test_doctor}")
    
    # Test updating the doctor
    test_doctor.specialization = "Internal Medicine"
    test_doctor.save()
    print(f"✅ Successfully updated doctor specialization")
    
    # Test deleting the doctor
    test_doctor.delete()
    print(f"✅ Successfully deleted test doctor")
    
except Exception as e:
    print(f"❌ Error with doctor operations: {e}")

print("\n=== PATIENT MODEL TESTING ===")
print(f"Patient table exists: {Patient._meta.db_table}")

patients = Patient.objects.all()
print(f"Number of existing patients: {patients.count()}")

print("\n=== BED MODEL TESTING ===")
print(f"Bed table exists: {Bed._meta.db_table}")

beds = Bed.objects.all()
print(f"Number of existing beds: {beds.count()}")

print("\n=== APPOINTMENT MODEL TESTING ===")
print(f"Appointment table exists: {Appointment._meta.db_table}")

appointments = Appointment.objects.all()
print(f"Number of existing appointments: {appointments.count()}")

print("\n=== DATABASE SCHEMA CHECK ===")
from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Database tables:")
for table in tables:
    print(f"  - {table[0]}")