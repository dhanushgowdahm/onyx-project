// API service for hospital management system
// const API_BASE_URL = 'https://api.themahadeva.live/api';
const API_BASE_URL =  'http://127.0.0.1:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  console.log('Auth token exists:', !!token);
  if (token) {
    console.log('Token starts with:', token.substring(0, 20) + '...');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.text();
      if (errorData) {
        // Try to parse as JSON for detailed error messages
        try {
          const parsedError = JSON.parse(errorData);
          if (parsedError.detail) {
            errorMessage = parsedError.detail;
          } else if (typeof parsedError === 'object') {
            // Handle field-specific errors
            const errors = Object.entries(parsedError).map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${messages}`;
            });
            errorMessage = errors.join('; ');
          }
        } catch {
          // If not JSON, use the text as is
          errorMessage = errorData;
        }
      }
    } catch (textError) {
      console.error('Error reading response text:', textError);
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  getUserInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/user-info/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Patients API
export const patientsAPI = {
  getAll: async () => {
    console.log('Fetching all patients...');
    const response = await fetch(`${API_BASE_URL}/patients/`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    console.log('Patients API response:', result);
    return result;
  },

  create: async (patientData) => {
    console.log('Creating patient with data:', patientData);
    console.log('API URL:', `${API_BASE_URL}/patients/`);
    
    const headers = getAuthHeaders();
    console.log('Request headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/patients/`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(patientData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    return handleResponse(response);
  },

  update: async (id, patientData) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(patientData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/patients/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Doctors API
export const doctorsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/doctors/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (doctorData) => {
    const response = await fetch(`${API_BASE_URL}/doctors/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctorData),
    });
    return handleResponse(response);
  },

  update: async (id, doctorData) => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(doctorData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  checkAvailability: async (doctorId, date) => {
    const response = await fetch(`${API_BASE_URL}/doctor-availability/?doctor_id=${doctorId}&date=${date}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAvailability: async (doctorId) => {
    const response = await fetch(`${API_BASE_URL}/doctor-availability/?doctor_id=${doctorId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Beds API
export const bedsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/beds/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (bedData) => {
    const response = await fetch(`${API_BASE_URL}/beds/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bedData),
    });
    return handleResponse(response);
  },

  update: async (id, bedData) => {
    const response = await fetch(`${API_BASE_URL}/beds/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(bedData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/beds/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/beds/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Appointments API
export const appointmentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  },

  update: async (id, appointmentData) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};

// Medicines API
export const medicinesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/medicines/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (medicineData) => {
    console.log('Creating medicine with data:', medicineData);
    const response = await fetch(`${API_BASE_URL}/medicines/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(medicineData),
    });
    return handleResponse(response);
  },

  update: async (id, medicineData) => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(medicineData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getByPatient: async (patientId) => {
    console.log(`Fetching medicines for patient ID: ${patientId}`);
    console.log(`API URL: ${API_BASE_URL}/medicines/?patient=${patientId}`);
    const response = await fetch(`${API_BASE_URL}/medicines/?patient=${patientId}`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    console.log(`Medicines API response for patient ${patientId}:`, result);
    return result;
  }
};

// Diagnoses API
export const diagnosesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/diagnoses/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (diagnosisData) => {
    console.log('Creating diagnosis with data:', diagnosisData);
    const response = await fetch(`${API_BASE_URL}/diagnoses/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(diagnosisData),
    });
    return handleResponse(response);
  },

  update: async (id, diagnosisData) => {
    const response = await fetch(`${API_BASE_URL}/diagnoses/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(diagnosisData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/diagnoses/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/diagnoses/${id}/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getByPatient: async (patientId) => {
    console.log(`Fetching diagnoses for patient ID: ${patientId}`);
    console.log(`API URL: ${API_BASE_URL}/diagnoses/?patient=${patientId}`);
    const response = await fetch(`${API_BASE_URL}/diagnoses/?patient=${patientId}`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse(response);
    console.log(`Diagnoses API response for patient ${patientId}:`, result);
    return result;
  }
};

// PDF Reports API
export const reportsAPI = {
  generatePatientPDF: async (patientId) => {
    const response = await fetch(`${API_BASE_URL}/patient-report-pdf/${patientId}/`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Return the blob for download
    return response.blob();
  },

  viewPatientReport: async (patientId, patientName) => {
    try {
      // Method 1: Try to get the blob first and create object URL
      const response = await fetch(`${API_BASE_URL}/patient-report-pdf/${patientId}/`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the PDF blob
      const blob = await response.blob();
      
      // Create object URL and open in new tab
      const url = window.URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        window.URL.revokeObjectURL(url);
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      // Clean up the object URL after a delay (when user likely finished with it)
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000); // Clean up after 1 minute
      
      return true;
    } catch (error) {
      console.error('Error viewing PDF:', error);
      throw error;
    }
  },

  downloadPatientReport: async (patientId, patientName) => {
    try {
      const blob = await reportsAPI.generatePatientPDF(patientId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `patient_report_${patientName}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
};

export default {
  authAPI,
  patientsAPI,
  doctorsAPI,
  bedsAPI,
  appointmentsAPI,
  medicinesAPI,
  diagnosesAPI,
  reportsAPI
};