// src/components/doctor_page/DiagnosisModal.jsx
import React, { useState } from "react";
import { diagnosesAPI } from "../../services/api";
import "./dashboard.css";

export default function DiagnosisModal({ patient, onClose, onSaveDiagnosis }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (diagnosis.trim()) {
      setIsSubmitting(true);
      try {
        const diagnosisData = {
          patient: patient.id,
          diagnosis: diagnosis.trim()
          // Note: doctor field is automatically assigned by backend from authenticated user
        };
        
        await diagnosesAPI.create(diagnosisData);
        
        if (onSaveDiagnosis) {
          onSaveDiagnosis(patient.id, diagnosisData);
        }
        
        console.log(`Diagnosis saved for ${patient.name}:`, diagnosisData);
        alert(`Diagnosis saved successfully for ${patient.name}`);
        onClose();
      } catch (error) {
        console.error('Error saving diagnosis:', error);
        alert(`Failed to save diagnosis: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please enter a diagnosis');
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
          <div className="hd-form-group">
            <label className="hd-form-label">
              <span className="hd-label-icon">🔍</span>
              Diagnosis Details *
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="hd-diagnosis-textarea"
              placeholder="Enter detailed diagnosis, clinical observations, symptoms, test results, and treatment recommendations..."
              rows={6}
              required
            />
          </div>

          <div className="hd-diagnosis-info">
            <div className="hd-info-item">
              <span className="hd-info-icon">👨‍⚕️</span>
              <span>Diagnosed by: Doctor</span>
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
            <button type="submit" className="hd-btn hd-btn-primary" disabled={isSubmitting || !diagnosis.trim()}>
              <span className="hd-btn-icon">💾</span>
              {isSubmitting ? 'Saving...' : 'Save Diagnosis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}