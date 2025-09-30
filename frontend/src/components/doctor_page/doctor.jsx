// src/components/doctor_page/doctor.jsx
import React, { useEffect, useState } from "react";
import PatientModal from "./PatientModal";
import StatsCard from "./StatsCard";
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
  const [loading, setLoading] = useState(!patientsProp || !appointmentsProp);
  const [error, setError] = useState(null);

  const base = apiBaseUrl || import.meta.env.VITE_API_BASE_URL || "";
  const navigate = useNavigate();

  // sample fallback data
  const samplePatients = [
    { id: "P001", name: "John Smith", bed: "A-101", condition: "Hypertension" },
    { id: "P002", name: "Michael Brown", bed: "Not assigned", condition: "Routine Checkup" }
  ];
  const sampleAppointments = [
    { id: "A001", patientId: "P001", patient: "John Smith", time: "10:00", status: "scheduled" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  useEffect(() => {
    if (patientsProp && appointmentsProp) return;

    if (!base) {
      setPatients(samplePatients);
      setAppointments(sampleAppointments);
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
        setPatients(Array.isArray(pJson) ? pJson : samplePatients);
        setAppointments(Array.isArray(aJson) ? aJson : sampleAppointments);
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (!cancelled) {
          setError("Failed to load data from API — showing sample data.");
          setPatients(samplePatients);
          setAppointments(sampleAppointments);
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
        <h2 className="hd-app-title">Hospital Management</h2>
        <div className="hd-user-info">
          Welcome, Dr. Emily Wilson
          <button className="hd-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="hd-title">Doctor Dashboard</h1>
      <p className="hd-subtitle">Welcome, Dr. Emily Wilson</p>

      {loading && <div className="hd-info">Loading...</div>}
      {error && <div className="hd-error">{error}</div>}

      <div className="hd-grid">
        {/* Patients */}
        <div className="hd-card hd-card-large">
          <div className="hd-card-header">
            👥 <strong> My Patients</strong>
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
                    <button className="hd-btn-icon" onClick={() => setSelectedPatient(p)}>
                      👁️
                    </button>
                    <button className="hd-btn-icon">
                      🔗
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
            📅 <strong> Today's Appointments</strong>
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
            {appointments.length === 0 && <div>No appointments today.</div>}
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
    </div>
  );
}
