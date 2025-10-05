import React, { useState, useEffect } from "react";
import "./AddPatientModal.css";
import { doctorsAPI } from "../../services/api";

function AddPatientModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    assigned_bed: "",
    assigned_doctor: "",
    address: "",
    emergency_contact: "",
  });
  
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Fetch doctors for dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const doctorsData = await doctorsAPI.getAll();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    
    if (!formData.age || parseInt(formData.age) <= 0) {
      alert("Please enter a valid age");
      return;
    }
    
    if (!formData.gender) {
      alert("Please select a gender");
      return;
    }
    
    // Don't close modal here - let the parent handle success/error
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Patient</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Name:
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Age:
            <input type="number" name="age" value={formData.age} onChange={handleChange} />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Contact:
            <input name="contact" value={formData.contact} onChange={handleChange} />
          </label>
          <label>
            Assigned Bed:
            <input name="assigned_bed" value={formData.assigned_bed} onChange={handleChange} />
          </label>
          <label>
            Assign Doctor (Optional):
            {loadingDoctors ? (
              <select disabled>
                <option>Loading doctors...</option>
              </select>
            ) : (
              <select name="assigned_doctor" value={formData.assigned_doctor} onChange={handleChange}>
                <option value="">No doctor assigned</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label>
            Address:
            <input name="address" value={formData.address} onChange={handleChange} />
          </label>
          <label>
            Emergency Contact:
            <input name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
          </label>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatientModal;
