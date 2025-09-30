// src/components/MedicationModal.jsx
import React, { useState } from "react";

export default function MedicationModal({ patient, onClose, onPrescribe }) {
  const [medicationDetails, setMedicationDetails] = useState("");

  const handlePrescribe = () => {
    if (medicationDetails.trim()) {
      if (onPrescribe) {
        onPrescribe(patient.id, medicationDetails);
      }
      console.log(`Prescribed for ${patient.name}:`, medicationDetails);
      onClose();
    }
  };

  if (!patient) return null;

  return (
    <div className="hd-modal-overlay" role="dialog" aria-modal="true">
      <div className="hd-medication-modal">
        <button className="hd-modal-close" onClick={onClose} aria-label="Close">×</button>
        
        <h2 className="hd-modal-title">Prescribe Medication</h2>
        
        <div className="hd-patient-info">
          <span className="hd-patient-label">Patient:</span>
          <span className="hd-patient-name">{patient.name}</span>
        </div>

        <div className="hd-medication-form">
          <label className="hd-form-label" htmlFor="medication-details">
            Medication Details
          </label>
          <textarea
            id="medication-details"
            className="hd-medication-textarea"
            placeholder="Enter medication name, dosage, frequency, and instructions..."
            value={medicationDetails}
            onChange={(e) => setMedicationDetails(e.target.value)}
            rows={4}
          />
        </div>

        <div className="hd-modal-actions">
          <button 
            className="hd-btn hd-btn-secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="hd-btn hd-btn-primary" 
            onClick={handlePrescribe}
            disabled={!medicationDetails.trim()}
          >
            Prescribe
          </button>
        </div>
      </div>
    </div>
  );
}