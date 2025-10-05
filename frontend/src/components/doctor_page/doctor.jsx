// src/components/doctor_page/doctor.jsx
import React, { useState, useEffect } from "react";
import PatientModal from "./PatientModal";
import StatsCard from "./StatsCard";
import MedicationModal from "./MedicationModal";
import DiagnosisModal from "./DiagnosisModal";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { patientsAPI, appointmentsAPI } from "../../services/api";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescribePatient, setPrescribePatient] = useState(null);
  const [diagnosisPatient, setDiagnosisPatient] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch data specific to the logged-in doctor
        const [patientsData, appointmentsData] = await Promise.all([
          patientsAPI.getAll(), // This now gets doctor-specific patients from the backend
          appointmentsAPI.getAll(), // This now gets doctor-specific appointments
        ]);
        setPatients(patientsData || []);
        
        // Filter for today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = (appointmentsData || []).filter(app => app.appointment_date === today);
        setAppointments(todaysAppointments);

      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const handlePrescribe = (patientId, medicationDetails) => {
    console.log(`Prescribed for patient ${patientId}:`, medicationDetails);
    alert(`Medication prescribed successfully for ${prescribePatient.name}`);
  };

  const handleSaveDiagnosis = (patientId, diagnosisData) => {
    console.log(`Diagnosis saved for patient ${patientId}:`, diagnosisData);
    alert(`Diagnosis saved successfully for ${diagnosisPatient.name}`);
  };

  const handleAddMedication = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(null);
      setPrescribePatient(patient);
    }
  };

  const handleAddDiagnosis = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(null);
      setDiagnosisPatient(patient);
    }
  };

  return (
    <div className="hd-dashboard">
      <div className="hd-topbar">
        <h2 className="hd-app-title">Hospital Management System</h2>
        <div className="hd-user-info">
          Welcome, Doctor
          <button className="hd-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <h1 className="hd-title">Doctor Dashboard</h1>
      <p className="hd-subtitle">Welcome back, Doctor. Here's your daily overview.</p>

      {loading && <div className="hd-info">Loading dashboard data...</div>}
      {error && <div className="hd-error">{error}</div>}

      <div className="hd-grid">
        <div className="hd-card hd-card-large">
          <div className="hd-card-header">
            🏥 <strong>My Patients</strong>
            <span className="hd-badge">{patients.length}</span>
          </div>
          <table className="hd-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Bed No</th>
                <th>Condition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.assigned_bed ? `Bed ${p.assigned_bed}` : "N/A"}</td>
                  <td>{p.condition}</td>
                  <td>
                    <button className="hd-btn-icon" onClick={() => setSelectedPatient(p)} title="View Patient Details">
                      👁️
                    </button>
                    <button className="hd-btn-icon" onClick={() => setPrescribePatient(p)} title="Prescribe Medication">
                      💊
                    </button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && !loading && (
                <tr><td colSpan="4">No patients assigned to you.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="hd-card hd-card-large">
          <div className="hd-card-header">
            📅 <strong>Today's Appointments</strong>
            <span className="hd-badge">{appointments.length}</span>
          </div>
          <div className="hd-appointments">
            {appointments.map((a) => (
              <div key={a.id} className="hd-appointment">
                <div>
                  <div className="hd-apt-name">{a.patient_name}</div>
                  <div className="hd-apt-id">Patient ID: {a.patient}</div>
                </div>
                <div className="hd-apt-meta">
                  <div className="hd-time">🕐 {a.appointment_time}</div>
                  <div className="hd-status">{a.status}</div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && !loading && <div>No appointments scheduled for today.</div>}
          </div>
        </div>
      </div>

      <div className="hd-stats-row">
        <StatsCard title="Total Patients" value={patients.length} icon="👥" />
        <StatsCard title="Today's Appointments" value={appointments.length} icon="📅" />
        <StatsCard title="Specialization" value="Cardiology" icon="💊" />
        <StatsCard title="Available Days" value="3" icon="🕐" />
      </div>

      {selectedPatient && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onAddMedication={handleAddMedication}
          onAddDiagnosis={handleAddDiagnosis}
        />
      )}

      {prescribePatient && (
        <MedicationModal
          patient={prescribePatient}
          onClose={() => setPrescribePatient(null)}
          onPrescribe={handlePrescribe}
        />
      )}

      {diagnosisPatient && (
        <DiagnosisModal
          patient={diagnosisPatient}
          onClose={() => setDiagnosisPatient(null)}
          onSaveDiagnosis={handleSaveDiagnosis}
        />
      )}
    </div>
  );
}