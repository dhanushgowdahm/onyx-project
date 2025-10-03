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

def test_doctor_apis():
    print("=== TESTING DOCTOR APIs ===\n")
    
    # First, let's try to get a token (we'll need authentication)
    print("1. Testing Authentication...")
    login_data = {
        "username": "admin",  # Try with admin first
        "password": "admin"
    }
    
    try:
        auth_response = requests.post(f"{BASE_URL}/token/", json=login_data)
        print(f"Auth Status Code: {auth_response.status_code}")
        
        if auth_response.status_code == 200:
            token_data = auth_response.json()
            access_token = token_data.get('access')
            print("✅ Authentication successful!")
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
        else:
            print("❌ Authentication failed. Trying without auth...")
            headers = {'Content-Type': 'application/json'}
            
    except Exception as e:
        print(f"❌ Auth error: {e}")
        headers = {'Content-Type': 'application/json'}
    
    # Test GET /api/doctors/
    print("\n2. Testing GET /api/doctors/...")
    try:
        response = requests.get(f"{BASE_URL}/doctors/", headers=headers)
        print(f"GET Status Code: {response.status_code}")
        if response.status_code == 200:
            doctors = response.json()
            print(f"✅ Found {len(doctors)} doctors in database")
            for i, doctor in enumerate(doctors[:3]):  # Show first 3
                print(f"  Doctor {i+1}: {doctor.get('name', 'N/A')} - {doctor.get('specialization', 'N/A')}")
        else:
            print(f"❌ GET failed: {response.text}")
    except Exception as e:
        print(f"❌ GET error: {e}")
    
    # Test POST /api/doctors/ (Create new doctor)
    print("\n3. Testing POST /api/doctors/ (Create Doctor)...")
    test_doctor = {
        "name": "Dr. Test API",
        "specialization": "Test Specialization", 
        "contact": "+1234567890",
        "availability": "Mon,Tue,Wed"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/doctors/", json=test_doctor, headers=headers)
        print(f"POST Status Code: {response.status_code}")
        if response.status_code == 201:
            created_doctor = response.json()
            doctor_id = created_doctor.get('id')
            print(f"✅ Successfully created doctor with ID: {doctor_id}")
            
            # Test PUT /api/doctors/{id}/ (Update doctor)
            print(f"\n4. Testing PUT /api/doctors/{doctor_id}/ (Update Doctor)...")
            updated_doctor = {
                **test_doctor,
                "specialization": "Updated Specialization"
            }
            
            try:
                response = requests.put(f"{BASE_URL}/doctors/{doctor_id}/", json=updated_doctor, headers=headers)
                print(f"PUT Status Code: {response.status_code}")
                if response.status_code == 200:
                    print("✅ Successfully updated doctor")
                else:
                    print(f"❌ PUT failed: {response.text}")
            except Exception as e:
                print(f"❌ PUT error: {e}")
            
            # Test DELETE /api/doctors/{id}/
            print(f"\n5. Testing DELETE /api/doctors/{doctor_id}/ (Delete Doctor)...")
            try:
                response = requests.delete(f"{BASE_URL}/doctors/{doctor_id}/", headers=headers)
                print(f"DELETE Status Code: {response.status_code}")
                if response.status_code == 204:
                    print("✅ Successfully deleted doctor")
                else:
                    print(f"❌ DELETE failed: {response.text}")
            except Exception as e:
                print(f"❌ DELETE error: {e}")
                
        else:
            print(f"❌ POST failed: {response.text}")
    except Exception as e:
        print(f"❌ POST error: {e}")
    
    print("\n=== API TEST COMPLETE ===")

if __name__ == "__main__":
    test_doctor_apis()