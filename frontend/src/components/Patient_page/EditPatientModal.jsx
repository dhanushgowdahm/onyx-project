import React, { useState, useEffect } from "react";
import "./AddPatientModal.css"; 

function EditPatientModal({ patient, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    assigned_bed: "",
    address: "",
    emergency_contact: "",
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Patient</h2>
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
            Address:
            <input name="address" value={formData.address} onChange={handleChange} />
          </label>
          <label>
            Emergency Contact:
            <input name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
          </label>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientModal;
