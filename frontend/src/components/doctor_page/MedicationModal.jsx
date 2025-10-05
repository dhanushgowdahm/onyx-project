// src/components/MedicationModal.jsx
import React, { useState } from "react";

export default function MedicationModal({ patient, onClose, onPrescribe }) {
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [instructions, setInstructions] = useState("");
  const [medicationType, setMedicationType] = useState("tablet");

  const handlePrescribe = () => {
    if (medicationName.trim() && dosage.trim() && frequency.trim()) {
      const prescriptionData = {
        medicationName,
        dosage,
        frequency,
        duration,
        instructions,
        medicationType,
        prescribedDate: new Date().toLocaleDateString(),
        patientId: patient.id,
        patientName: patient.name
      };
      
      if (onPrescribe) {
        onPrescribe(patient.id, prescriptionData);
      }
      console.log(`Prescribed for ${patient.name}:`, prescriptionData);
      onClose();
    }
  };

  if (!patient) return null;

  return (
    <div className="hd-modal-overlay" role="dialog" aria-modal="true">
      <div className="hd-medication-modal-enhanced">
        <button className="hd-modal-close" onClick={onClose} aria-label="Close">×</button>
        
        <div className="hd-modal-header">
          <div className="hd-prescription-icon">💊</div>
          <h2 className="hd-modal-title">New Prescription</h2>
          <p className="hd-modal-subtitle">Complete the medication details below</p>
        </div>
        
        <div className="hd-patient-info-enhanced">
          <div className="hd-patient-avatar">👤</div>
          <div className="hd-patient-details">
            <span className="hd-patient-name">{patient.name}</span>
            <span className="hd-patient-id">ID: {patient.id}</span>
            <span className="hd-patient-condition">Condition: {patient.condition}</span>
          </div>
        </div>

        <div className="hd-prescription-form">
          <div className="hd-form-grid">
            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="medication-name">
                <span className="hd-label-icon">🏷️</span>
                Medication Name *
              </label>
              <input
                id="medication-name"
                type="text"
                className="hd-form-input"
                placeholder="e.g., Amoxicillin"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                required
              />
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="medication-type">
                <span className="hd-label-icon">💊</span>
                Type
              </label>
              <select
                id="medication-type"
                className="hd-form-select"
                value={medicationType}
                onChange={(e) => setMedicationType(e.target.value)}
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="cream">Cream/Ointment</option>
                <option value="drops">Drops</option>
              </select>
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="dosage">
                <span className="hd-label-icon">⚖️</span>
                Dosage *
              </label>
              <input
                id="dosage"
                type="text"
                className="hd-form-input"
                placeholder="e.g., 500mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="frequency">
                <span className="hd-label-icon">⏰</span>
                Frequency *
              </label>
              <select
                id="frequency"
                className="hd-form-select"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              >
                <option value="">Select frequency</option>
                <option value="once-daily">Once daily</option>
                <option value="twice-daily">Twice daily</option>
                <option value="three-times-daily">Three times daily</option>
                <option value="four-times-daily">Four times daily</option>
                <option value="as-needed">As needed</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="duration">
                <span className="hd-label-icon">📅</span>
                Duration
              </label>
              <input
                id="duration"
                type="text"
                className="hd-form-input"
                placeholder="e.g., 7 days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="hd-form-group hd-full-width">
            <label className="hd-form-label" htmlFor="instructions">
              <span className="hd-label-icon">📝</span>
              Additional Instructions
            </label>
            <textarea
              id="instructions"
              className="hd-form-textarea"
              placeholder="Enter any special instructions, warnings, or notes for the patient..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="hd-prescription-summary">
          <h4 className="hd-summary-title">Prescription Summary</h4>
          <div className="hd-summary-content">
            <span className="hd-summary-text">
              {medicationName || "Medication"} {dosage && `(${dosage})`} - {frequency || "Frequency not set"}
              {duration && ` for ${duration}`}
            </span>
          </div>
        </div>

        <div className="hd-modal-actions">
          <button 
            className="hd-btn hd-btn-secondary" 
            onClick={onClose}
          >
            <span>❌</span> Cancel
          </button>
          <button 
            className="hd-btn hd-btn-primary" 
            onClick={handlePrescribe}
            disabled={!medicationName.trim() || !dosage.trim() || !frequency}
          >
            <span>✅</span> Prescribe Medication
          </button>
        </div>
      </div>
    </div>
  );
}