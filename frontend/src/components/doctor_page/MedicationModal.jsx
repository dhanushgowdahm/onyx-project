// src/components/MedicationModal.jsx
import React, { useState } from "react";
import { medicinesAPI } from "../../services/api";

export default function MedicationModal({ patient, onClose, onPrescribe }) {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState([]);
  const [relationToFood, setRelationToFood] = useState("");
  const [noOfDays, setNoOfDays] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFrequencyChange = (selectedFreq) => {
    setFrequency(prev => {
      if (prev.includes(selectedFreq)) {
        // Remove if already selected
        return prev.filter(f => f !== selectedFreq);
      } else {
        // Add if not selected
        return [...prev, selectedFreq];
      }
    });
  };

  const handlePrescribe = async () => {
    if (medicineName.trim() && dosage.trim() && frequency.length > 0 && relationToFood && noOfDays) {
      setIsSubmitting(true);
      try {
        const medicineData = {
          patient: patient.id,
          medicine_name: medicineName.trim(),
          dosage: dosage.trim(),
          frequency: frequency.join(','), // Convert array to comma-separated string
          relation_to_food: relationToFood,
          no_of_days: parseInt(noOfDays)
          // Note: doctor field is automatically assigned by backend from authenticated user
        };
        
        console.log('Sending medicine data:', medicineData);
        console.log('Auth token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
        
        const result = await medicinesAPI.create(medicineData);
        console.log('Medicine creation result:', result);
        
        if (onPrescribe) {
          onPrescribe(patient.id, medicineData);
        }
        
        console.log(`Medicine prescribed for ${patient.name}:`, medicineData);
        alert(`Medicine prescribed successfully for ${patient.name}`);
        onClose();
      } catch (error) {
        console.error('Error prescribing medicine:', error);
        alert(`Failed to prescribe medicine: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please fill in all required fields');
    }
  };

  // Add CSS styles for checkbox group (you can move this to a separate CSS file)
  const checkboxGroupStyles = `
    .hd-checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    .hd-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .hd-checkbox-label:hover {
      background-color: #e9e9e9;
    }
    .hd-checkbox {
      margin: 0;
      cursor: pointer;
    }
    .hd-checkbox-text {
      font-size: 14px;
      color: #333;
    }
  `;

  if (!patient) return null;

  return (
    <div className="hd-modal-overlay" role="dialog" aria-modal="true">
      <style>{checkboxGroupStyles}</style>
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
              <label className="hd-form-label" htmlFor="medicine-name">
                <span className="hd-label-icon">🏷️</span>
                Medicine Name *
              </label>
              <input
                id="medicine-name"
                type="text"
                className="hd-form-input"
                placeholder="e.g., Amoxicillin"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                required
              />
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="relation-to-food">
                <span className="hd-label-icon">🍽️</span>
                Relation to Food *
              </label>
              <select
                id="relation-to-food"
                className="hd-form-select"
                value={relationToFood}
                onChange={(e) => setRelationToFood(e.target.value)}
                required
              >
                <option value="">Select relation to food</option>
                <option value="Before">Before meals</option>
                <option value="After">After meals</option>
                <option value="With">With meals</option>
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
              <label className="hd-form-label">
                <span className="hd-label-icon">⏰</span>
                Frequency * (Select one or more)
              </label>
              <div className="hd-checkbox-group">
                {['Breakfast', 'Lunch', 'Dinner'].map((freq) => (
                  <label key={freq} className="hd-checkbox-label">
                    <input
                      type="checkbox"
                      className="hd-checkbox"
                      checked={frequency.includes(freq)}
                      onChange={() => handleFrequencyChange(freq)}
                    />
                    <span className="hd-checkbox-text">{freq}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="no-of-days">
                <span className="hd-label-icon">📅</span>
                Number of Days *
              </label>
              <input
                id="no-of-days"
                type="number"
                className="hd-form-input"
                placeholder="e.g., 7"
                min="1"
                value={noOfDays}
                onChange={(e) => setNoOfDays(e.target.value)}
                required
              />
            </div>
          </div>

        </div>

        <div className="hd-prescription-summary">
          <h4 className="hd-summary-title">Medicine Prescription Summary</h4>
          <div className="hd-summary-content">
            <span className="hd-summary-text">
              {medicineName || "Medicine"} {dosage && `(${dosage})`} - {frequency.length > 0 ? frequency.join(', ') : "Frequency not set"}
              {relationToFood && ` ${relationToFood} meals`}
              {noOfDays && ` for ${noOfDays} days`}
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
            disabled={isSubmitting || !medicineName.trim() || !dosage.trim() || frequency.length === 0 || !relationToFood || !noOfDays}
          >
            <span>✅</span> {isSubmitting ? 'Prescribing...' : 'Prescribe Medicine'}
          </button>
        </div>
      </div>
    </div>
  );
}