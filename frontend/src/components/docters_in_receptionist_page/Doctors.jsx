import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./Doctors.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { doctorsAPI } from "../../services/api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({
    id: "",
    name: "",
    specialization: "",
    contact: "",
    availability: [],
  });

  const doctorsPerPage = 5;

  // Fetch doctors from database on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await doctorsAPI.getAll();
      console.log('Fetched doctors:', data);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setIsEditing(true);
      // Convert availability from comma-separated string to array if needed
      const availability = typeof doctor.availability === 'string' 
        ? doctor.availability.split(',').filter(day => day.trim() !== '')
        : doctor.availability || [];
      
      setCurrentDoctor({
        ...doctor,
        availability: availability
      });
    } else {
      setIsEditing(false);
      setCurrentDoctor({
        id: "",
        name: "",
        specialization: "",
        contact: "",
        availability: [],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleCheckboxChange = (day) => {
    setCurrentDoctor((prev) => {
      const exists = prev.availability.includes(day);
      return {
        ...prev,
        availability: exists
          ? prev.availability.filter((d) => d !== day)
          : [...prev.availability, day],
      };
    });
  };

  const handleSave = async () => {
    if (!currentDoctor.name || !currentDoctor.specialization || !currentDoctor.contact) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare doctor data for API
      const doctorData = {
        name: currentDoctor.name,
        specialization: currentDoctor.specialization,
        contact: currentDoctor.contact,
        availability: currentDoctor.availability.join(',') // Convert array to comma-separated string
      };
      
      if (isEditing) {
        await doctorsAPI.update(currentDoctor.id, doctorData);
        alert("Doctor updated successfully!");
      } else {
        await doctorsAPI.create(doctorData);
        alert("Doctor added successfully!");
      }
      
      // Refresh the doctors list
      await fetchDoctors();
      setShowModal(false);
    } catch (err) {
      console.error('Error saving doctor:', err);
      alert(`Failed to ${isEditing ? 'update' : 'add'} doctor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        setLoading(true);
        await doctorsAPI.delete(id);
        alert("Doctor deleted successfully!");
        
        // Refresh the doctors list
        await fetchDoctors();
      } catch (err) {
        console.error('Error deleting doctor:', err);
        alert(`Failed to delete doctor: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Enhanced search with comprehensive error handling
  const filteredDoctors = useMemo(() => {
    try {
      console.log('🔍 Doctor Search Debug:', {
        searchTerm: search,
        doctorsCount: doctors?.length || 0,
        doctorsArray: doctors
      });
      
      setSearchError(""); // Clear any previous search errors
      
      // Validate doctors array
      if (!Array.isArray(doctors)) {
        console.warn('⚠️ Doctors is not an array:', doctors);
        return [];
      }
      
      // If no search term, return all doctors
      if (!search || search.trim() === '') {
        return doctors;
      }
      
      const searchTerm = search.toLowerCase().trim();
      
      const filtered = doctors.filter((doc) => {
        try {
          // Defensive null checks for all searchable fields
          const name = (doc?.name || '').toString().toLowerCase();
          const id = (doc?.id || '').toString().toLowerCase();
          const specialization = (doc?.specialization || '').toString().toLowerCase();
          
          return name.includes(searchTerm) || 
                 id.includes(searchTerm) || 
                 specialization.includes(searchTerm);
        } catch (fieldError) {
          console.warn('⚠️ Error processing doctor for search:', doc, fieldError);
          return false; // Skip this doctor if there's an error
        }
      });
      
      return filtered;
      
    } catch (error) {
      console.error('❌ Search Error:', error);
      setSearchError(`Search error: ${error.message}`);
      return doctors || []; // Return original doctors array on error
    }
  }, [search, doctors]);

  // Pagination logic
  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };
  
  // Safe search input handler with error boundary
  const handleSearchChange = useCallback((e) => {
    try {
      const value = e?.target?.value || '';
      console.log('🔄 Search input changed:', value);
      setSearch(value);
      setCurrentPage(1); // Reset to first page when searching
    } catch (error) {
      console.error('❌ Search input error:', error);
      setSearchError(`Input error: ${error.message}`);
    }
  }, []);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="doctors-page">
      <h2 className="title">Manage Doctors</h2>
      <div className="doctors-box">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search by name,  or specialization..."
            value={search}
            onChange={handleSearchChange}
          />
          
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

        {loading && !showModal ? (
          <div className="loading-message">
            <p>Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchDoctors}>Retry</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                try {
                  if (!Array.isArray(currentDoctors) || currentDoctors.length === 0) {
                    return (
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                          {search.trim() && filteredDoctors.length === 0 ? (
                            <div>
                              <div>No doctors found matching "{search}"</div>
                              <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
                                Try searching by name, ID, or specialization
                              </small>
                            </div>
                          ) : filteredDoctors.length === 0 ? (
                            "No doctors found."
                          ) : (
                            "No doctors on this page."
                          )}
                        </td>
                      </tr>
                    );
                  }
                  
                  return currentDoctors.map((doctor) => {
                    try {
                      // Safe availability handling with extensive null checks
                      let availability = [];
                      if (doctor?.availability) {
                        if (typeof doctor.availability === 'string') {
                          availability = doctor.availability.split(',').filter(day => day && day.trim() !== '');
                        } else if (Array.isArray(doctor.availability)) {
                          availability = doctor.availability.filter(day => day && day.trim() !== '');
                        }
                      }
                      
                      return (
                        <tr key={doctor?.id || Math.random()}>
                          <td>{doctor?.id || 'N/A'}</td>
                        
                          <td>{doctor?.full_name || 'N/A'}</td>

                          <td>{doctor?.specialization || 'N/A'}</td>
                          
                          <td>{doctor?.contact || 'N/A'}</td>
                          <td>
                            {availability.map((day, index) => (
                              <span className="day-chip" key={`${day}-${index}`}>
                                {day.trim()}
                              </span>
                            ))}
                            {availability.length === 0 && <span style={{color: '#999'}}>Not specified</span>}
                          </td>
                          <td>
                            <button
                              className="icon-btn"
                              onClick={() => handleOpenModal(doctor)}
                              disabled={loading}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => handleDelete(doctor?.id)}
                              disabled={loading}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    } catch (rowError) {
                      console.error('❌ Error rendering doctor row:', doctor, rowError);
                      return (
                        <tr key={Math.random()}>
                          <td colSpan="6" style={{textAlign: 'center', color: '#ff6b6b', padding: '10px'}}>
                            Error displaying doctor data
                          </td>
                        </tr>
                      );
                    }
                  });
                } catch (renderError) {
                  console.error('❌ Critical render error:', renderError);
                  return (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', color: '#ff6b6b', padding: '20px'}}>
                        Unable to display doctors. Please refresh the page.
                      </td>
                    </tr>
                  );
                }
              })()}
            </tbody>
          </table>
        )}
        
        {filteredDoctors.length > 0 && (
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
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? "Edit Doctor" : "Add New Doctor"}</h3>
            <label>
              Name *
              <input
                type="text"
                value={currentDoctor.name}
                onChange={(e) =>
                  setCurrentDoctor({ ...currentDoctor, name: e.target.value })
                }
                placeholder="Enter doctor name"
              />
            </label>
            <label>
              Specialization *
              <input
                type="text"
                value={currentDoctor.specialization}
                onChange={(e) =>
                  setCurrentDoctor({
                    ...currentDoctor,
                    specialization: e.target.value,
                  })
                }
                placeholder="e.g., Cardiology"
              />
            </label>
            <label>
              Contact *
              <input
                type="text"
                value={currentDoctor.contact}
                onChange={(e) =>
                  setCurrentDoctor({ ...currentDoctor, contact: e.target.value })
                }
                placeholder="Enter contact number"
              />
            </label>

            <p className="days-title">Available Days</p>
            <div className="days-list">
              {days.map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={currentDoctor.availability.includes(day)}
                    onChange={() => handleCheckboxChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                {isEditing ? "Update Doctor" : "Add Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
