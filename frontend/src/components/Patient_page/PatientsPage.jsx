import React, { useState, useEffect } from "react";
import AddPatientModal from "./AddPatientModal";
import EditPatientModal from "./EditPatientModal"; 
import "./PatientsPage.css";
import { patientsAPI, doctorsAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const patientsPerPage = 5;


  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const [patientsData, doctorsData] = await Promise.all([
        patientsAPI.getAll(),
        doctorsAPI.getAll()
      ]);
      setPatients(patientsData);
      setDoctors(doctorsData);
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

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.assigned_bed.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // Helper function to get doctor name by ID
  const getDoctorName = (doctorId) => {
    if (!doctorId) return 'Not assigned';
    const doctor = doctors.find(d => d.id.toString() === doctorId.toString());
    return doctor ? `Dr. ${doctor.name}` : 'Unknown Doctor';
  };

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

  return (
    <div className="main-bg">
      <div className="container">
        <div className="header-bar">
          <span className="title">Manage Patients</span>
          <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
            <span className="add-icon">+</span> Add Patient
          </button>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search by name, ID, or bed number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
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
            {currentPatients.map((p) => (
              <tr key={p.id}>
                <td className="bold-cell">{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.contact}</td>
                <td>{p.assigned_bed || 'Not assigned'}</td>
                <td>{getDoctorName(p.assigned_doctor)}</td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn" title="Edit" onClick={() => handleEditClick(p)}>
                      ✏️
                    </button>
                    <button
                      className="action-btn"
                      title="Delete"
                      onClick={() => handleDeletePatient(p.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentPatients.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No patients found.
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
    </div>
  );
}

export default PatientsPage;
