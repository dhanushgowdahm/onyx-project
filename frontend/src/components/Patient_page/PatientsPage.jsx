import React, { useState, useEffect } from "react";
import AddPatientModal from "./AddPatientModal";
import EditPatientModal from "./EditPatientModal"; 
import PatientModal from "../doctor_page/PatientModal";
import "./PatientsPage.css";
import "../doctor_page/dashboard.css";
import { patientsAPI, doctorsAPI, bedsAPI } from "../../services/api";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [beds, setBeds] = useState([]);
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const patientsPerPage = 5;


  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const [patientsData, doctorsData, bedsData] = await Promise.all([
        patientsAPI.getAll(),
        doctorsAPI.getAll(),
        bedsAPI.getAll()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
      setBeds(bedsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = React.useMemo(() => {
    try {
      console.log('🔍 Patient Search Debug:', {
        searchTerm: search,
        patientsCount: patients?.length || 0,
        patientsArray: patients
      });
      
      setSearchError(""); // Clear any previous search errors
      
      if (!Array.isArray(patients)) {
        console.warn('⚠️ Patients is not an array:', patients);
        return [];
      }
      
      if (!search || search.trim() === '') {
        return patients;
      }
      
      const searchLower = search.toLowerCase();
      
      // Helper function to safely check string values
      const safeIncludes = (value) => {
        try {
          if (!value) return false;
          return value.toString().toLowerCase().includes(searchLower);
        } catch (error) {
          console.warn('Error in safeIncludes:', error, 'value:', value);
          return false;
        }
      };
      
      // Helper function to safely get doctor name
      const safeDoctorName = (doctorId) => {
        try {
          if (!doctorId) return 'Not assigned';
          const doctor = doctors.find(d => d && d.id && d.id.toString() === doctorId.toString());
          return doctor ? `Dr. ${doctor.name}` : 'Unknown Doctor';
        } catch (error) {
          console.warn('Error in safeDoctorName:', error, 'doctorId:', doctorId);
          return 'Not assigned';
        }
      };
      
      const filtered = patients.filter((p) => {
        try {
          if (!p) return false;
          
          // Helper function to get full bed display for search
          const getBedDisplayForSearch = (assignedBedId) => {
            try {
              if (!assignedBedId) return '';
              
              // If already in "Ward X - BedNumber" format (legacy), return as is
              if (assignedBedId.toString().includes(' - ')) {
                return assignedBedId.toString();
              }
              
              // Look up bed by ID (since API returns bed ID)
              const bed = beds.find(b => b && b.id && b.id.toString() === assignedBedId.toString());
              return bed ? `${bed.ward} ${bed.bed_number}` : assignedBedId.toString();
            } catch (error) {
              return assignedBedId ? assignedBedId.toString() : '';
            }
          };

          const matches = (
            safeIncludes(p.name) ||
            safeIncludes(p.id) ||
            safeIncludes(p.assigned_bed) ||
            getBedDisplayForSearch(p.assigned_bed).toLowerCase().includes(searchLower) ||
            safeIncludes(p.contact) ||
            safeIncludes(p.gender) ||
            safeIncludes(p.age) ||
            safeDoctorName(p.assigned_doctor).toLowerCase().includes(searchLower)
          );
          
          return matches;
        } catch (error) {
          console.warn('Error filtering patient:', error, 'patient:', p);
          return false;
        }
      });
      
      return filtered;
      
    } catch (error) {
      console.error('❌ Search Error:', error);
      setSearchError(`Search error: ${error.message}`);
      return patients || []; // Return original patients array on error
    }
  }, [patients, doctors, beds, search]);

  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // Helper function to get doctor name by ID
  const getDoctorName = React.useCallback((doctorId) => {
    try {
      if (!doctorId || !doctors || doctors.length === 0) return 'Not assigned';
      const doctor = doctors.find(d => d && d.id && d.id.toString() === doctorId.toString());
      return doctor && doctor.name ? `Dr. ${doctor.name}` : 'Unknown Doctor';
    } catch (error) {
      console.warn('Error in getDoctorName:', error);
      return 'Not assigned';
    }
  }, [doctors]);

  // Helper function to get bed display with ward info
  const getBedDisplay = React.useCallback((assignedBedId) => {
    try {
      if (!assignedBedId || !beds || beds.length === 0) return 'Not assigned';
      
      // Handle case where bed is already in "Ward X - BedNumber" format (legacy data)
      if (assignedBedId.toString().includes(' - ')) {
        return assignedBedId.toString(); // Already in correct format
      }
      
      // Look up the bed by ID (since API returns bed ID)
      const bed = beds.find(b => b && b.id && b.id.toString() === assignedBedId.toString());
      return bed ? `${bed.ward} ${bed.bed_number}` : `Bed ID: ${assignedBedId}`; // Show bed number with ward
    } catch (error) {
      console.warn('Error in getBedDisplay:', error, 'assignedBedId:', assignedBedId);
      return assignedBedId ? `Bed ID: ${assignedBedId}` : 'Not assigned';
    }
  }, [beds]);

  const handleAddPatient = async (newPatient) => {
    try {
      // Validate and prepare data before sending
      const patientData = {
        ...newPatient,
        age: parseInt(newPatient.age) || 0, // Ensure age is a number
        assigned_bed: null, // Set to null for now, will be handled separately
        assigned_doctor: newPatient.assigned_doctor || null
      };
      
      console.log('Sending patient data:', patientData);
      await patientsAPI.create(patientData);
      await fetchPatients(); 
      setIsAddModalOpen(false); // Only close on success
      alert('Patient added successfully!');
    } catch (error) {
      console.error('Full error:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Error adding patient: ${errorMessage}`);
      // Don't close modal on error so user can fix the issue
    }
  };

  const handleDeletePatient = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this patient?");
    if (!confirmed) return;

    try {
      await patientsAPI.delete(id);
      await fetchPatients(); 
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Error deleting patient: ${errorMessage}`);
    }
  };

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
  };

  const handleViewPatient = (patient) => {
    console.log('Opening patient view for:', patient.name);
    setViewingPatient(patient);
  };

  const handleUpdatePatient = async (updatedPatient) => {
    try {
      const patientData = {
        ...updatedPatient,
        age: parseInt(updatedPatient.age) || 0,
        assigned_bed: null, // Will be handled separately
        assigned_doctor: updatedPatient.assigned_doctor || null
      };
      
      await patientsAPI.update(updatedPatient.id, patientData);
      setEditingPatient(null);
      await fetchPatients();
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      alert(`Error updating patient: ${errorMessage}`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="patients-page">
        <h2 className="title">Manage Patients</h2>
        <div className="patients-box">
          <div className="loading-message">
            <p>Loading patients...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="patients-page">
        <h2 className="title">Manage Patients</h2>
        <div className="patients-box">
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={fetchPatients}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-page">
      <h2 className="title">Manage Patients</h2>
      <div className="patients-box">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search by name, bed, or doctor..."
            value={search}
            onChange={(e) => {
              try {
                const value = e?.target?.value || '';
                console.log('🔄 Search input changed:', value);
                setSearch(value);
                setCurrentPage(1);
                setSearchError(''); // Clear search error on input
                console.log('Search state updated successfully');
              } catch (error) {
                console.error('❌ Search input error:', error);
                setSearchError(`Input error: ${error.message}`);
              }
            }}
          />
          <button className="add-patient-btn" onClick={() => setIsAddModalOpen(true)}>
            + Add Patient
          </button>
        </div>
        
        {/* Search Error Display */}
        {searchError && (
          <div style={{ 
            padding: '8px', 
            background: '#ffe6e6', 
            border: '1px solid #ff9999', 
            borderRadius: '4px',
            fontSize: '12px',
            color: '#cc0000',
            margin: '10px 0'
          }}>
            ⚠️ {searchError}
          </div>
        )}
        
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Assigned Bed</th>
              <th>Assigned Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients && currentPatients.length > 0 ? (
              currentPatients.map((p) => {
                if (!p) return null;
                return (
                  <tr key={p.id || `patient-${Math.random()}`}>
                    <td className="bold-cell">{p.id || 'N/A'}</td>
                    <td>{p.name || 'N/A'}</td>
                    <td>{p.age || 'N/A'}</td>
                    <td>{p.gender || 'N/A'}</td>
                    <td>{p.contact || 'N/A'}</td>
                    <td>{getBedDisplay(p.assigned_bed)}</td>
                    <td>{getDoctorName(p.assigned_doctor)}</td>
                    <td>
                      <button
                        className="icon-btn view-patient-btn"
                        onClick={() => handleViewPatient(p)}
                        disabled={loading}
                        title="View Patient Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleEditClick(p)}
                        disabled={loading}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleDeletePatient(p.id)}
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              }).filter(Boolean)
            ) : null}
            {currentPatients.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  {search.trim() ? (
                    <div>
                      <div>No patients found matching "{search}"</div>
                      <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
                        Try searching by name, bed number, or doctor name
                      </small>
                    </div>
                  ) : (
                    "No patients found."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      {isAddModalOpen && (
        <AddPatientModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddPatient}
        />
      )}

      {editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSave={handleUpdatePatient}
        />
      )}

      {viewingPatient && (
        <PatientModal
          patient={viewingPatient}
          onClose={() => setViewingPatient(null)}
          onAddMedication={() => console.log('Add medication functionality not available in patients page')}
          onAddDiagnosis={() => console.log('Add diagnosis functionality not available in patients page')}
        />
      )}
    </div>
  );
}

export default PatientsPage;
