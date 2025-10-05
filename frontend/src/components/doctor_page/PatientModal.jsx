// src/components/PatientModal.jsx
import React, { useState, useEffect } from "react";
import { medicinesAPI, diagnosesAPI, reportsAPI } from "../../services/api";

export default function PatientModal({ patient, onClose, onAddMedication, onAddDiagnosis }) {
  const [medicines, setMedicines] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingPDF, setViewingPDF] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patient) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Patient data received in modal:", patient);
        console.log("Fetching medicines and diagnoses for patient ID:", patient.id);
        
        // Fetch medicines and diagnoses for this patient
        const [medicinesData, diagnosesData] = await Promise.all([
          medicinesAPI.getByPatient(patient.id),
          diagnosesAPI.getByPatient(patient.id)
        ]);
        
        console.log("Medicines data received:", medicinesData);
        console.log("Diagnoses data received:", diagnosesData);
        
        setMedicines(medicinesData || []);
        setDiagnoses(diagnosesData || []);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError(`Failed to load patient data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patient]);

  if (!patient) return null;

  const handleMedication = () => {
    if (onAddMedication) onAddMedication(patient.id);
    else console.log("Add medication:", patient.id);
  };
  
  const handleDiagnosis = () => {
    if (onAddDiagnosis) onAddDiagnosis(patient.id);
    else console.log("Add diagnosis:", patient.id);
  };

  const handleViewPDF = async () => {
    try {
      setViewingPDF(true);
      await reportsAPI.viewPatientReport(patient.id, patient.name);
      console.log("PDF opened successfully for patient:", patient.name);
    } catch (error) {
      console.error("Error viewing PDF:", error);
      alert(`Failed to open PDF report: ${error.message}`);
    } finally {
      setViewingPDF(false);
    }
  };

  return (
    <div className="hd-modal-overlay" role="dialog" aria-modal="true">
      <div className="hd-modal hd-patient-modal-unified">
        <button className="hd-modal-close" onClick={onClose} aria-label="Close">×</button>
        
        <div className="hd-modal-header">
          <h2 className="hd-modal-title">Patient Complete View</h2>
          <p className="hd-modal-subtitle">Patient: <strong>{patient.name}</strong> (ID: {patient.id})</p>
        </div>

        <div className="hd-unified-content">
          {loading && <div className="hd-info">Loading patient data...</div>}
          {error && <div className="hd-error">{error}</div>}

          {!loading && (
            <>
              {/* Patient Basic Information */}
              <div className="hd-unified-section">
                <h3 className="hd-section-title">Patient Information</h3>
                <div className="hd-patient-info-grid">
                  <div className="hd-info-item">
                    <span className="hd-info-label">Name:</span>
                    <span className="hd-info-value">{patient.name}</span>
                  </div>
                  <div className="hd-info-item">
                    <span className="hd-info-label">Contact:</span>
                    <span className="hd-info-value">{patient.contact || "-"}</span>
                  </div>
                  <div className="hd-info-item">
                    <span className="hd-info-label">Patient ID:</span>
                    <span className="hd-info-value">{patient.id}</span>
                  </div>
                  <div className="hd-info-item">
                    <span className="hd-info-label">Emergency Contact:</span>
                    <span className="hd-info-value">{patient.emergency_contact || "-"}</span>
                  </div>
                  <div className="hd-info-item">
                    <span className="hd-info-label">Age:</span>
                    <span className="hd-info-value">{patient.age ? `${patient.age} years` : "-"}</span>
                  </div>
                  <div className="hd-info-item">
                    <span className="hd-info-label">Assigned Bed:</span>
                    <span className="hd-info-value">
                      {patient.assigned_bed_number 
                        ? `${patient.assigned_bed_ward} - Bed ${patient.assigned_bed_number}` 
                        : "-"}
                    </span>
                  </div>
                  <div className="hd-info-item">
                    <span className="hd-info-label">Gender:</span>
                    <span className="hd-info-value">{patient.gender || "-"}</span>
                  </div>
                  <div className="hd-info-item">
                    <span className="hd-info-label">Address:</span>
                    <span className="hd-info-value">{patient.address || "-"}</span>
                  </div>
                  <div className="hd-info-item hd-info-full">
                    <span className="hd-info-label">Current Condition:</span>
                    <span className="hd-info-value">{patient.condition || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Medicines Section */}
              <div className="hd-unified-section">
                <h3 className="hd-section-title">
                  Prescribed Medicines
                  <span className="hd-badge">{medicines.length}</span>
                </h3>
                {medicines.length > 0 ? (
                  <div className="hd-medicines-unified">
                    {medicines.map((medicine) => (
                      <div key={medicine.id} className="hd-medicine-item">
                        <div className="hd-medicine-header">
                          <strong>{medicine.medicine_name}</strong>
                          <span className="hd-medicine-dosage">{medicine.dosage}</span>
                        </div>
                        <div className="hd-medicine-details">
                          <div>Frequency: {medicine.frequency}</div>
                          <div>Relation to food: {medicine.relation_to_food}</div>
                          <div>Days: {medicine.no_of_days}</div>
                          <div className="hd-medicine-date">
                            Prescribed: {new Date(medicine.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="hd-no-data">No medicines prescribed yet</div>
                )}
              </div>

              {/* Diagnoses Section */}
              <div className="hd-unified-section">
                <h3 className="hd-section-title">
                  Diagnosis History
                  <span className="hd-badge">{diagnoses.length}</span>
                </h3>
                {diagnoses.length > 0 ? (
                  <div className="hd-diagnoses-unified">
                    {diagnoses.map((diagnosis) => (
                      <div key={diagnosis.id} className="hd-diagnosis-item">
                        <div className="hd-diagnosis-text">{diagnosis.diagnosis}</div>
                        <div className="hd-diagnosis-date">
                          Diagnosed: {new Date(diagnosis.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="hd-no-data">No diagnoses recorded yet</div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="hd-modal-actions">
          <button className="hd-btn hd-btn-primary" onClick={handleMedication}>Add Medication</button>
          <button className="hd-btn hd-btn-primary" onClick={handleDiagnosis}>Add Diagnosis</button>
          <button 
            className="hd-btn hd-btn-view" 
            onClick={handleViewPDF} 
            disabled={viewingPDF}
            title="View Patient Report PDF - Opens in new tab with print/download options"
          >
            {viewingPDF ? "📄 Opening..." : "📄 View PDF"}
          </button>
          <div style={{flex:1}} />
          <button className="hd-btn hd-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}