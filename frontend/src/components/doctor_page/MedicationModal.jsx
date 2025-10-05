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

  // Debugging function to check state
  const debugState = () => {
    console.log('Current form state:', {
      medicineName,
      dosage,
      frequency,
      relationToFood,
      noOfDays,
      patient: patient?.id
    });
  };

  if (!patient) return null;

  return (
    <div className="hd-modal-overlay" role="dialog" aria-modal="true">
      <div className="hd-medication-modal-enhanced">
        <button className="hd-modal-close" onClick={onClose} aria-label="Close">×</button>
        
        <div className="hd-modal-header">
          <h2 className="hd-modal-title">New Medicine Prescription</h2>
          <p className="hd-modal-subtitle">Patient: <strong>{patient.name}</strong> (ID: {patient.id})</p>
        </div>

        <div className="hd-prescription-form">
          <div className="hd-form-grid">
            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="medicine-name">
                Medicine Name *
              </label>
              <input
                id="medicine-name"
                type="text"
                className="hd-form-input"
                placeholder="e.g., Amoxicillin"
                value={medicineName}
                onChange={(e) => {
                  setMedicineName(e.target.value);
                  debugState();
                }}
                required
              />
            </div>

            <div className="hd-form-group">
              <label className="hd-form-label" htmlFor="dosage">
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
              <label className="hd-form-label" htmlFor="relation-to-food">
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
              <label className="hd-form-label" htmlFor="no-of-days">
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

            <div className="hd-form-group hd-full-width">
              <label className="hd-form-label">
                When to take 
              </label>
              <div className="hd-frequency-hint">
                Select meal times for taking the medicine
              </div>
              <div className="hd-checkbox-group">
                {['Breakfast', 'Lunch', 'Dinner'].map((freq) => (
                  <label 
                    key={freq} 
                    className={`hd-checkbox-label ${frequency.includes(freq) ? 'checked' : ''}`}
                    onClick={() => handleFrequencyChange(freq)}
                  >
                    <input
                      type="checkbox"
                      className="hd-checkbox"
                      checked={frequency.includes(freq)}
                      onChange={() => {}} // Handled by label click
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="hd-checkbox-text">{freq}</span>
                  </label>
                ))}
              </div>
              {frequency.length > 0 && (
                <div style={{marginTop: '8px', fontSize: '12px', color: '#059669', fontWeight: '600'}}>
                  Selected: {frequency.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hd-prescription-summary">
          <h4 className="hd-summary-title">Prescription Summary</h4>
          <div className="hd-summary-content">
            <div className="hd-summary-text">
              <strong>{medicineName || "Medicine Name"}</strong>
              {dosage && ` - ${dosage}`}
              {frequency.length > 0 && (
                <div>Take with: {frequency.join(', ')}</div>
              )}
              {relationToFood && (
                <div>Relation to food: {relationToFood} meals</div>
              )}
              {noOfDays && (
                <div>Duration: {noOfDays} days</div>
              )}
            </div>
          </div>
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
            disabled={isSubmitting || !medicineName.trim() || !dosage.trim() || frequency.length === 0 || !relationToFood || !noOfDays}
          >
            {isSubmitting ? 'Prescribing...' : 'Prescribe Medicine'}
          </button>
        </div>
      </div>
    </div>
  );
}