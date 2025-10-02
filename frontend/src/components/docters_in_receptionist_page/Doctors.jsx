import React, { useState } from "react";
import "./Doctors.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const Doctors = () => {
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

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setIsEditing(true);
      setCurrentDoctor(doctor);
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

  const handleSave = () => {
    if (!currentDoctor.name || !currentDoctor.specialization || !currentDoctor.contact) {
      alert("Please fill all required fields");
      return;
    }

    if (isEditing) {
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === currentDoctor.id ? currentDoctor : doc))
      );
    } else {
      const newDoctor = {
        ...currentDoctor,
        id: `D${String(doctors.length + 1).padStart(3, "0")}`,
      };
      setDoctors((prev) => [...prev, newDoctor]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setDoctors((prev) => prev.filter((d) => d.id !== id));
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
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.contact}</td>
                <td>
                  {doctor.availability.map((day) => (
                    <span className="day-chip" key={day}>
                      {day}
                    </span>
                  ))}
                </td>
                <td>
                  <button
                    className="icon-btn"
                    onClick={() => handleOpenModal(doctor)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleDelete(doctor.id)}
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
