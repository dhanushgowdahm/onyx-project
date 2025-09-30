// src/components/PatientModal.jsx
import React from "react";

export default function PatientModal({ patient, onClose, onAddMedication, onAddDiagnosis }) {
  const handleMedication = () => {
    if (onAddMedication) onAddMedication(patient.id);
    else console.log("Add medication:", patient.id);
  };
  const handleDiagnosis = () => {
    if (onAddDiagnosis) onAddDiagnosis(patient.id);
    else console.log("Add diagnosis:", patient.id);
  };

  return (
    <div className="hd-modal-overlay" role="dialog" aria-modal="true">
      <div className="hd-modal">
        <button className="hd-modal-close" onClick={onClose} aria-label="Close">×</button>
        <h2 className="hd-modal-title">Patient Details</h2>

        <div className="hd-modal-grid">
          <div><div className="hd-meta-label">Name</div><div className="hd-meta-value">{patient.name}</div></div>
          <div><div className="hd-meta-label">Contact</div><div className="hd-meta-value">{patient.contact || "-"}</div></div>

          <div><div className="hd-meta-label">Patient ID</div><div className="hd-meta-value">{patient.id}</div></div>
          <div><div className="hd-meta-label">Emergency Contact</div><div className="hd-meta-value">{patient.emergency || "-"}</div></div>

          <div><div className="hd-meta-label">Age</div><div className="hd-meta-value">{patient.age ? `${patient.age} years` : "-"}</div></div>
          <div><div className="hd-meta-label">Assigned Bed</div><div className="hd-meta-value">{patient.bed || "-"}</div></div>

          <div><div className="hd-meta-label">Gender</div><div className="hd-meta-value">{patient.gender || "-"}</div></div>
          <div><div className="hd-meta-label">Address</div><div className="hd-meta-value">{patient.address || "-"}</div></div>
        </div>

        <div className="hd-modal-section">
          <div className="hd-meta-label">Current Condition / Diagnosis</div>
          <div className="hd-condition">{patient.condition || "-"}</div>
        </div>

        <div className="hd-modal-actions">
          <button className="hd-btn hd-btn-icon" onClick={handleMedication}>➕ Add Medication</button>
          <button className="hd-btn hd-btn-icon" onClick={handleDiagnosis}>➕ Add Diagnosis</button>
          <div style={{flex:1}} />
          <button className="hd-btn hd-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
