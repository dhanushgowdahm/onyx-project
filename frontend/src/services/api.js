// API service for hospital management system
const API_BASE_URL = 'https://api.themahadeva.live/api';
// const API_BASE_URL =  'http://127.0.0.1:8000/api';

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
    const response = await fetch(`${API_BASE_URL}/patients/`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
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

export default {
  authAPI,
  patientsAPI,
  doctorsAPI,
  bedsAPI,
  appointmentsAPI
};