// src/components/doctor_page/DiagnosisModal.jsx
import React, { useState } from "react";
import "./dashboard.css";

export default function DiagnosisModal({ patient, onClose, onSaveDiagnosis }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (diagnosis.trim()) {
      const diagnosisData = {
        diagnosis: diagnosis.trim(),
        severity,
        notes: notes.trim(),
        date: new Date().toISOString().split('T')[0],
        doctor: "Dr. Emily Wilson"
      };
      onSaveDiagnosis(patient.id, diagnosisData);
      onClose();
    }
  };

  return (
    <div className="hd-modal-overlay">
      <div className="hd-diagnosis-modal">
        <button className="hd-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="hd-modal-header">
          <h3 className="hd-modal-title">🩺 Add Diagnosis</h3>
          <div className="hd-patient-info">
            <span className="hd-patient-label">Patient:</span>
            <span className="hd-patient-name">{patient.name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="hd-diagnosis-form">
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label className="hd-form-label">
                <span className="hd-label-icon">🔍</span>
                Diagnosis/Condition *
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="hd-diagnosis-input"
                placeholder="Enter primary diagnosis..."
                required
              />
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label">
                <span className="hd-label-icon">⚠️</span>
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="hd-diagnosis-select"
              >
                <option value="mild">🟢 Mild</option>
                <option value="moderate">🟡 Moderate</option>
                <option value="severe">🟠 Severe</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>
          </div>

          <div className="hd-form-group">
            <label className="hd-form-label">
              <span className="hd-label-icon">📝</span>
              Clinical Notes & Observations
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="hd-diagnosis-textarea"
              placeholder="Enter detailed clinical observations, symptoms, test results, and treatment recommendations..."
              rows={4}
            />
          </div>

          <div className="hd-diagnosis-info">
            <div className="hd-info-item">
              <span className="hd-info-icon">👨‍⚕️</span>
              <span>Diagnosed by: Dr. Emily Wilson</span>
            </div>
            <div className="hd-info-item">
              <span className="hd-info-icon">📅</span>
              <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="hd-modal-actions">
            <button type="button" className="hd-btn hd-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="hd-btn hd-btn-primary" disabled={!diagnosis.trim()}>
              <span className="hd-btn-icon">💾</span>
              Save Diagnosis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}