// src/components/doctor_page/doctor.jsx
import React, { useEffect, useState } from "react";
import PatientModal from "../PatientModal";
import StatsCard from "../StatsCard";
import "../dashboard.css";
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

  // sample fallback data (used if fetch fails)
  const samplePatients = [
    { id: "P001", name: "John Smith", bed: "A-101", condition: "Stable", contact: "+1234567890", emergency: "+1234567891", age: 45, gender: "Male", address: "123 Main St" },
    { id: "P002", name: "Michael Brown", bed: "Not assigned", condition: "Routine Checkup", contact: "+9876543210", emergency: "+9876543211", age: 50, gender: "Male", address: "45 Elm Ave" }
  ];
  const sampleAppointments = [
    { id: "A001", patientId: "P001", patient: "John Smith", time: "10:00", status: "scheduled" }
  ];

  const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
  };

  useEffect(() => {
    // if user supplied both props, skip fetching
    if (patientsProp && appointmentsProp) {
      return;
    }

    // otherwise fetch from API (if base provided), else use sample data
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
      <div
        className="hd-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1 className="hd-title">Doctor Dashboard</h1>
          <div className="hd-subtitle">Welcome, Dr. Emily Wilson</div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "#d00a1aff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {loading && <div className="hd-info">Loading...</div>}
      {error && <div className="hd-error">{error}</div>}

      <div className="hd-grid">
        <div className="hd-card hd-card-large">
          <div className="hd-card-header">
            <strong>My Patients</strong>
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
                    <button className="hd-btn" onClick={() => setSelectedPatient(p)}>View</button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr><td colSpan="4">No patients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="hd-card hd-card-large">
          <div className="hd-card-header">
            <strong>Today's Appointments</strong>
            <span className="hd-badge">{appointments.length}</span>
          </div>
          <div className="hd-appointments">
            {appointments.map((a) => (
              <div key={a.id} className="hd-appointment">
                <div>
                  <div className="hd-apt-name">{a.patient}</div>
                  <div className="hd-apt-id">Patient ID: {a.patientId || a.patientId}</div>
                </div>
                <div className="hd-apt-meta">
                  <div className="hd-time">{a.time}</div>
                  <div className="hd-status">{a.status}</div>
                </div>
              </div>
            ))}
            {appointments.length === 0 && <div>No appointments today.</div>}
          </div>
        </div>
      </div>

      <div className="hd-stats-row">
        <StatsCard title="Total Patients" value={patients.length} />
        <StatsCard title="Today's Appointments" value={appointments.length} />
        <StatsCard title="Specialization" value="Cardiology" />
        <StatsCard title="Available Days" value="3" />
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
