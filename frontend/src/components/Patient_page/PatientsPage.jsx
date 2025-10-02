import React, { useState, useEffect } from "react";
import AddPatientModal from "./AddPatientModal";
import EditPatientModal from "./EditPatientModal"; 
import "./PatientsPage.css";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const patientsPerPage = 5;


  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients");
      if (response.ok) {
        const data = await response.json();
        setPatients(data);
      } else {
        console.error("Failed to fetch patients");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
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

  const handleAddPatient = async (newPatient) => {
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });
      if (response.ok) {
        await fetchPatients(); 
        setIsAddModalOpen(false);
      } else {
        alert("Failed to add patient");
      }
    } catch (error) {
      alert("Error adding patient");
      console.error(error);
    }
  };

  const handleDeletePatient = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this patient?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchPatients(); 
      } else {
        alert("Failed to delete patient");
      }
    } catch (error) {
      alert("Error deleting patient");
      console.error(error);
    }
  };

  const handleEditClick = (patient) => {
    setEditingPatient(patient);
  };

  const handleUpdatePatient = async (updatedPatient) => {
    try {
      const response = await fetch(`/api/patients/${updatedPatient.id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPatient),
      });
      if (response.ok) {
        setEditingPatient(null);
        await fetchPatients(); 
      } else {
        alert("Failed to update patient");
      }
    } catch (error) {
      alert("Error updating patient");
      console.error(error);
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
                <td>{p.assigned_bed}</td>
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
                <td colSpan="7" style={{ textAlign: "center" }}>
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
