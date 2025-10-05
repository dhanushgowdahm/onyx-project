// src/components/doctor_page/doctor.jsx
import React, { useEffect, useState } from "react";
import PatientModal from "./PatientModal";
import StatsCard from "./StatsCard";
import MedicationModal from "./MedicationModal";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

/*
Props:
  - patients (optional array) 
  - appointments (optional array)
  - apiBaseUrl (optional string) - overrides VITE_API_BASE_URL
*/
export default function Dashboard({ patients: patientsProp, appointments: appointmentsProp, apiBaseUrl }) {
  const [patients, setPatients] = useState(patientsProp || []);
  const [appointments, setAppointments] = useState(appointmentsProp || []);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescribePatient, setPrescribePatient] = useState(null);
  const [loading, setLoading] = useState(!patientsProp || !appointmentsProp);
  const [error, setError] = useState(null);

  const base = apiBaseUrl || import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const handlePrescribe = (patientId, medicationDetails) => {
    console.log(`Prescribed for patient ${patientId}:`, medicationDetails);
    // Here you can add API call to save the prescription
    alert(`Medication prescribed successfully for ${prescribePatient.name}`);
  };

  useEffect(() => {
    if (patientsProp && appointmentsProp) return;

    if (!base) {
      setPatients([]);
      setAppointments([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [pRes, aRes] = await Promise.all([
          fetch(`${base.replace(/\/$/, "")}/patients`),
          fetch(`${base.replace(/\/$/, "")}/appointments`)
        ]);
        if (!pRes.ok || !aRes.ok) throw new Error("Network response was not ok");
        const [pJson, aJson] = await Promise.all([pRes.json(), aRes.json()]);
        if (cancelled) return;
        setPatients(Array.isArray(pJson) ? pJson : []);
        setAppointments(Array.isArray(aJson) ? aJson : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (!cancelled) {
          setError("Failed to load data from API.");
          setPatients([]);
          setAppointments([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [patientsProp, appointmentsProp, base]);

  return (
    <div className="hd-dashboard">
      {/* Header */}
      <div className="hd-topbar">
        <h2 className="hd-app-title">Hospital Management System</h2>
        <div className="hd-user-info">
          Welcome, Doctor
          <button className="hd-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="hd-title">Doctor Dashboard</h1>
      <p className="hd-subtitle">Welcome back, Doctor. Here's your daily overview.</p>

      {loading && <div className="hd-info">Loading dashboard data...</div>}
      {error && <div className="hd-error">{error}</div>}

      <div className="hd-grid">
        {/* Patients */}
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
                  <td>{p.bed}</td>
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
              {patients.length === 0 && (
                <tr><td colSpan="4">No patients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Appointments */}
        <div className="hd-card hd-card-large">
          <div className="hd-card-header">
            📅 <strong>Today's Appointments</strong>
            <span className="hd-badge">{appointments.length}</span>
          </div>
          <div className="hd-appointments">
            {appointments.map((a) => (
              <div key={a.id} className="hd-appointment">
                <div>
                  <div className="hd-apt-name">{a.patient}</div>
                  <div className="hd-apt-id">Patient ID: {a.patientId}</div>
                </div>
                <div className="hd-apt-meta">
                  <div className="hd-time">🕐 {a.time}</div>
                  <div className="hd-status">{a.status}</div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && <div>No appointments scheduled for today.</div>}
          </div>
        </div>
      </div>

      {/* Stats */}
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
          onAddMedication={(id) => { console.log("Add medication for", id); }}
          onAddDiagnosis={(id) => { console.log("Add diagnosis for", id); }}
        />
      )}

      {prescribePatient && (
        <MedicationModal
          patient={prescribePatient}
          onClose={() => setPrescribePatient(null)}
          onPrescribe={handlePrescribe}
        />
      )}
    </div>
  );
}