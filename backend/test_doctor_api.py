import requests
import json

# Test API endpoints directly
API_BASE_URL = "http://127.0.0.1:8000/api"

def test_doctor_api_endpoints():
    print("=== TESTING DOCTOR API ENDPOINTS ===\n")
    
    # Test 1: Check if server is running
    print("1. Testing if Django server is running...")
    try:
        response = requests.get(f"{API_BASE_URL}/doctors/", timeout=5)
        print(f"✅ Server is running! Status: {response.status_code}")
        
        if response.status_code == 200:
            doctors = response.json()
            print(f"✅ GET /api/doctors/ successful")
            print(f"Number of doctors returned: {len(doctors)}")
            
            if len(doctors) > 0:
                print("Doctor data structure:")
                print(json.dumps(doctors[0], indent=2))
            else:
                print("⚠️  No doctors found in database")
                
        elif response.status_code == 401:
            print("❌ Authentication required - need to login first")
            return test_with_auth()
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Django server")
        print("Please make sure Django server is running on http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

def test_with_auth():
    print("\n2. Testing with authentication...")
    
    # Try to get a token first
    try:
        login_data = {"username": "admin", "password": "admin"}
        auth_response = requests.post(f"{API_BASE_URL}/token/", json=login_data)
        
        if auth_response.status_code == 200:
            token_data = auth_response.json()
            access_token = token_data.get('access')
            print("✅ Authentication successful")
            
            # Now try the doctors endpoint with auth
            headers = {"Authorization": f"Bearer {access_token}"}
            response = requests.get(f"{API_BASE_URL}/doctors/", headers=headers)
            
            if response.status_code == 200:
                doctors = response.json()
                print(f"✅ Authenticated GET /api/doctors/ successful")
                print(f"Number of doctors: {len(doctors)}")
                
                if len(doctors) > 0:
                    print("Sample doctor data:")
                    print(json.dumps(doctors[0], indent=2))
                else:
                    print("⚠️  Database is empty - no doctors found")
                    
                return True
            else:
                print(f"❌ Still failed with auth: {response.status_code}")
                print(f"Response: {response.text}")
        else:
            print(f"❌ Authentication failed: {auth_response.status_code}")
            print(f"Response: {auth_response.text}")
            
    except Exception as e:
        print(f"❌ Auth test error: {e}")
    
    return False

def test_create_doctor():
    print("\n3. Testing doctor creation...")
    
    # Get auth token
    try:
        login_data = {"username": "admin", "password": "admin"}
        auth_response = requests.post(f"{API_BASE_URL}/token/", json=login_data)
        
        if auth_response.status_code != 200:
            print("❌ Cannot authenticate for create test")
            return
            
        token_data = auth_response.json()
        access_token = token_data.get('access')
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        # Try to create a test doctor
        test_doctor = {
            "name": "Dr. API Test",
            "specialization": "Test Medicine",
            "contact": "+1234567890", 
            "availability": "Mon,Wed,Fri"
        }
        
        response = requests.post(f"{API_BASE_URL}/doctors/", headers=headers, json=test_doctor)
        
        if response.status_code == 201:
            created_doctor = response.json()
            print(f"✅ Doctor created successfully!")
            print(f"Created doctor ID: {created_doctor.get('id')}")
            print(f"Name: {created_doctor.get('name')}")
            return created_doctor.get('id')
        else:
            print(f"❌ Failed to create doctor: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Create test error: {e}")
    
    return None

if __name__ == "__main__":
    if test_doctor_api_endpoints():
        doctor_id = test_create_doctor()
        if doctor_id:
            print(f"\n✅ All tests passed! Doctor API is working.")
        else:
            print(f"\n⚠️  GET works but CREATE might have issues.")
    else:
        print(f"\n❌ Basic connectivity failed.")