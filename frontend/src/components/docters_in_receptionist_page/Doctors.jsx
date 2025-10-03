import React, { useState, useEffect } from "react";
import "./Doctors.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { doctorsAPI } from "../../services/api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState({
    id: "",
    name: "",
    specialization: "",
    contact: "",
    availability: [],
  });

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

  const filteredDoctors = search
  ? doctors.filter(
      (doc) => doc.name.toLowerCase().includes(search.toLowerCase().trim()) ||
               doc.id.toLowerCase().includes(search.toLowerCase().trim()) ||
               doc.specialization.toLowerCase().includes(search.toLowerCase().trim())
    )
  : doctors;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="doctors-page">
      <h2 className="title">Manage Doctors</h2>
      <div className="doctors-box">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search by name, ID, or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-doctor-btn" onClick={() => handleOpenModal()}>
            + Add Doctor
          </button>
        </div>

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
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => {
                  // Handle availability display - convert string to array if needed
                  const availability = typeof doctor.availability === 'string' 
                    ? doctor.availability.split(',').filter(day => day.trim() !== '')
                    : doctor.availability || [];
                  
                  return (
                    <tr key={doctor.id}>
                      <td>{doctor.id}</td>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.contact}</td>
                      <td>
                        {availability.map((day) => (
                          <span className="day-chip" key={day}>
                            {day.trim()}
                          </span>
                        ))}
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
                          onClick={() => handleDelete(doctor.id)}
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                    No doctors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
