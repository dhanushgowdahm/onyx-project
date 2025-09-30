import React, { useState } from "react";
import "./Doctor.css";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const Doctor = () => {
  const [doctors, setDoctors] = useState([
    {
      id: "D001",
      name: "Dr. Emily Wilson",
      specialization: "Cardiology",
      contact: "+1234567896",
      availability: ["Mon", "Wed", "Fri"],
    },
    {
      id: "D002",
      name: "Dr. Robert Davis",
      specialization: "Endocrinology",
      contact: "+1234567897",
      availability: ["Tue", "Thu", "Sat"],
    },
    {
      id: "D003",
      name: "Dr. Lisa Garcia",
      specialization: "General Medicine",
      contact: "+1234567898",
      availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    contact: "",
    availability: [],
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleCheckbox = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
  };

  const handleAddDoctor = () => {
    if (!formData.name || !formData.specialization || !formData.contact)
      return alert("Please fill all required fields!");

    const newDoctor = {
      id: `D${String(doctors.length + 1).padStart(3, "0")}`,
      ...formData,
    };

    setDoctors([...doctors, newDoctor]);
    setFormData({ name: "", specialization: "", contact: "", availability: [] });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDoctors(doctors.filter((doc) => doc.id !== id));
  };

  return (
    <div className="doctor-container">
      <h2 className="page-title">Manage Doctors</h2>

      <div className="top-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, ID, or specialization..."
          />
        </div>
        <button className="add-doctor-btn" onClick={() => setShowModal(true)}>
          <FaPlus className="plus-icon" /> Add Doctor
        </button>
      </div>

      <div className="table-container">
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
            {doctors.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.name}</td>
                <td>{doc.specialization}</td>
                <td>{doc.contact}</td>
                <td>
                  {doc.availability.map((day, i) => (
                    <span key={i} className="availability-chip">
                      {day}
                    </span>
                  ))}
                </td>
                <td>
                  <button className="icon-btn">
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3>Add New Doctor</h3>

            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                placeholder="Enter doctor name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Specialization *</label>
              <input
                type="text"
                placeholder="e.g., Cardiology, General Medicine"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Contact *</label>
              <input
                type="text"
                placeholder="Enter contact number"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Available Days</label>
              <div className="checkbox-grid">
                {days.map((day) => (
                  <label key={day}>
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(day)}
                      onChange={() => handleCheckbox(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleAddDoctor}>
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
