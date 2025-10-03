import os
import django
import sys

# Add the project path to sys.path
sys.path.append('C:/Users/DELL/Desktop/onyx_prj/onyx-project/backend')

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_project.settings')

# Setup Django
django.setup()

from api.models import Doctor, Patient, Bed, Appointment

def test_doctor_database():
    print("=== DOCTOR DATABASE TEST ===\n")
    
    # Check existing doctors
    print("1. Checking existing doctors in database...")
    doctors = Doctor.objects.all()
    print(f"Total doctors found: {doctors.count()}")
    
    if doctors.count() > 0:
        print("Existing doctors:")
        for i, doctor in enumerate(doctors, 1):
            print(f"  {i}. ID: {doctor.id}, Name: {doctor.name}, Specialization: {doctor.specialization}")
            print(f"     Contact: {doctor.contact}, Availability: {doctor.availability}")
    else:
        print("No doctors found in database")
        
        # Create a test doctor
        print("\n2. Creating a test doctor...")
        try:
            test_doctor = Doctor.objects.create(
                name="Dr. John Smith",
                specialization="Cardiology", 
                contact="+1234567890",
                availability="Mon,Wed,Fri"
            )
            print(f"✅ Successfully created test doctor: {test_doctor.name} (ID: {test_doctor.id})")
        except Exception as e:
            print(f"❌ Error creating test doctor: {e}")
    
    # Test relationships
    print("\n3. Checking doctor-patient relationships...")
    patients = Patient.objects.all()
    print(f"Total patients: {patients.count()}")
    
    patients_with_doctors = Patient.objects.filter(assigned_doctor__isnull=False)
    print(f"Patients with assigned doctors: {patients_with_doctors.count()}")
    
    # Test appointments
    print("\n4. Checking doctor appointments...")
    appointments = Appointment.objects.all()
    print(f"Total appointments: {appointments.count()}")
    
    if appointments.count() > 0:
        print("Appointments with doctors:")
        for appointment in appointments[:5]:  # Show first 5
            print(f"  - Patient: {appointment.patient.name} with Dr. {appointment.doctor.name}")
    
    print("\n=== TEST COMPLETE ===")

if __name__ == "__main__":
    test_doctor_database()