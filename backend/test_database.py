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

def test_database_and_models():
    print("=== DATABASE AND MODELS TEST ===\n")
    
    # Test Doctor model
    print("1. Testing Doctor Model...")
    doctors = Doctor.objects.all()
    print(f"Total doctors in database: {doctors.count()}")
    
    if doctors.count() > 0:
        print("Existing doctors:")
        for i, doctor in enumerate(doctors[:5], 1):  # Show first 5
            print(f"  {i}. {doctor.name} - {doctor.specialization}")
    
    # Create a test doctor
    print("\n2. Creating a test doctor...")
    try:
        test_doctor = Doctor.objects.create(
            name="Dr. Test API",
            specialization="Test Specialization",
            contact="+1234567890",
            availability="Mon,Tue,Wed"
        )
        print(f"✅ Successfully created doctor: {test_doctor.name} (ID: {test_doctor.id})")
        
        # Update the doctor
        test_doctor.specialization = "Updated Specialization"
        test_doctor.save()
        print("✅ Successfully updated doctor")
        
        # Delete the test doctor
        test_doctor.delete()
        print("✅ Successfully deleted test doctor")
        
    except Exception as e:
        print(f"❌ Error with doctor operations: {e}")
    
    # Test Patient model
    print("\n3. Testing Patient Model...")
    patients = Patient.objects.all()
    print(f"Total patients in database: {patients.count()}")
    
    if patients.count() > 0:
        print("Existing patients:")
        for i, patient in enumerate(patients[:5], 1):  # Show first 5
            print(f"  {i}. {patient.name} - Age: {patient.age}")
    
    # Test Bed model
    print("\n4. Testing Bed Model...")
    beds = Bed.objects.all()
    print(f"Total beds in database: {beds.count()}")
    
    if beds.count() > 0:
        print("Existing beds:")
        for i, bed in enumerate(beds[:5], 1):  # Show first 5
            print(f"  {i}. Bed {bed.bed_number} - Type: {bed.bed_type} - Status: {bed.status}")
    
    # Test Appointment model
    print("\n5. Testing Appointment Model...")
    appointments = Appointment.objects.all()
    print(f"Total appointments in database: {appointments.count()}")
    
    if appointments.count() > 0:
        print("Existing appointments:")
        for i, appointment in enumerate(appointments[:5], 1):  # Show first 5
            print(f"  {i}. {appointment.patient.name} with Dr. {appointment.doctor.name} - {appointment.appointment_date}")
    
    print("\n=== TEST COMPLETE ===")

if __name__ == "__main__":
    test_database_and_models()