import React, { useState, useEffect } from "react";
import "./Patient.css";
import axios from "axios";

function Patient() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    gender: "",
    birthDate: "",
  });

  // Fetch all patients
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/patients/");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add new patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/patients/", formData);
      alert("Patient added successfully!");
      setFormData({
        givenName: "",
        familyName: "",
        gender: "",
        birthDate: "",
      });
      fetchPatients(); // refresh list
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient!");
    }
  };

  // Filter patients based on search
  const filteredPatients = patients.filter(
    (p) =>
      p.givenName.toLowerCase().includes(search.toLowerCase()) ||
      p.familyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="patient-container">
      <h2>Patient Management</h2>

      {/* 🔹 Add Patient Form */}
      <form className="patient-form" onSubmit={handleSubmit}>
        <h3>Add New Patient</h3>
        <div className="form-row">
          <input
            type="text"
            name="givenName"
            placeholder="Given Name"
            value={formData.givenName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="familyName"
            placeholder="Family Name"
            value={formData.familyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-add">Add Patient</button>
      </form>

      {/* 🔹 Search Bar */}
      <input
        type="text"
        placeholder="Search patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="patient-search"
      />

      {/* 🔹 Patient Table */}
      <table className="patient-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Given Name</th>
            <th>Family Name</th>
            <th>Gender</th>
            <th>Birth Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>{patient.givenName}</td>
              <td>{patient.familyName}</td>
              <td>{patient.gender}</td>
              <td>{patient.birthDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Patient;
