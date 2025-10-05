// src/components/Patient_page/PatientReportModal.jsx
import React, { useState, useEffect } from "react";
import { medicinesAPI, diagnosesAPI, reportsAPI } from "../../services/api";
import "./PatientReportModal.css";

export default function PatientReportModal({ patient, onClose }) {
  const [medicines, setMedicines] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingPDF, setViewingPDF] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patient) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching report data for patient:", patient.name, "ID:", patient.id);
        
        // Fetch medicines and diagnoses for this patient
        const [medicinesData, diagnosesData] = await Promise.all([
          medicinesAPI.getByPatient(patient.id),
          diagnosesAPI.getByPatient(patient.id)
        ]);
        
        console.log("Medicines data:", medicinesData);
        console.log("Diagnoses data:", diagnosesData);
        
        setMedicines(medicinesData || []);
        setDiagnoses(diagnosesData || []);
      } catch (err) {
        console.error("Error fetching patient report data:", err);
        setError(`Failed to load patient data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patient]);

  if (!patient) return null;

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

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPDF(true);
      await reportsAPI.downloadPatientReport(patient.id, patient.name);
      console.log("PDF downloaded successfully for patient:", patient.name);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert(`Failed to download PDF report: ${error.message}`);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-modal-overlay" role="dialog" aria-modal="true">
      <div className="report-modal">
        <div className="report-modal-header">
          <h2 className="report-modal-title">Patient Medical Report</h2>
          <p className="report-modal-subtitle">Patient: <strong>{patient.name}</strong> (ID: {patient.id})</p>
          <button className="report-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="report-content">
          {loading && (
            <div className="report-loading">
              <div className="loading-spinner"></div>
              <p>Loading patient report data...</p>
            </div>
          )}
          
          {error && (
            <div className="report-error">
              <p>❌ {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Patient Basic Information */}
              <div className="report-section">
                <h3 className="report-section-title">📋 Patient Information</h3>
                <div className="report-info-grid">
                  <div className="report-info-item">
                    <span className="report-label">Full Name:</span>
                    <span className="report-value">{patient.name}</span>
                  </div>
                  <div className="report-info-item">
                    <span className="report-label">Patient ID:</span>
                    <span className="report-value">{patient.id}</span>
                  </div>
                  <div className="report-info-item">
                    <span className="report-label">Age:</span>
                    <span className="report-value">{patient.age ? `${patient.age} years` : "Not specified"}</span>
                  </div>
                  <div className="report-info-item">
                    <span className="report-label">Gender:</span>
                    <span className="report-value">{patient.gender || "Not specified"}</span>
                  </div>
                  <div className="report-info-item">
                    <span className="report-label">Contact:</span>
                    <span className="report-value">{patient.contact || "Not provided"}</span>
                  </div>
                  <div className="report-info-item">
                    <span className="report-label">Emergency Contact:</span>
                    <span className="report-value">{patient.emergency_contact || "Not provided"}</span>
                  </div>
                  <div className="report-info-item report-full-width">
                    <span className="report-label">Address:</span>
                    <span className="report-value">{patient.address || "Not provided"}</span>
                  </div>
                  <div className="report-info-item report-full-width">
                    <span className="report-label">Current Condition:</span>
                    <span className="report-value">{patient.condition || "Not specified"}</span>
                  </div>
                </div>
              </div>

              {/* Prescribed Medicines Section */}
              <div className="report-section">
                <h3 className="report-section-title">
                  💊 Prescribed Medicines
                  <span className="report-count-badge">{medicines.length}</span>
                </h3>
                {medicines.length > 0 ? (
                  <div className="report-medicines-list">
                    {medicines.map((medicine, index) => (
                      <div key={medicine.id} className="report-medicine-card">
                        <div className="medicine-header">
                          <span className="medicine-number">#{index + 1}</span>
                          <h4 className="medicine-name">{medicine.medicine_name}</h4>
                          <span className="medicine-dosage">{medicine.dosage}</span>
                        </div>
                        <div className="medicine-details">
                          <div className="medicine-detail">
                            <strong>Frequency:</strong> {medicine.frequency || "As needed"}
                          </div>
                          <div className="medicine-detail">
                            <strong>Relation to food:</strong> {medicine.relation_to_food}
                          </div>
                          <div className="medicine-detail">
                            <strong>Duration:</strong> {medicine.no_of_days} days
                          </div>
                          <div className="medicine-detail">
                            <strong>Prescribed on:</strong> {new Date(medicine.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="report-no-data">
                    <p>📝 No medicines have been prescribed to this patient yet.</p>
                  </div>
                )}
              </div>

              {/* Diagnosis History Section */}
              <div className="report-section">
                <h3 className="report-section-title">
                  🔍 Diagnosis History
                  <span className="report-count-badge">{diagnoses.length}</span>
                </h3>
                {diagnoses.length > 0 ? (
                  <div className="report-diagnoses-list">
                    {diagnoses.map((diagnosis, index) => (
                      <div key={diagnosis.id} className="report-diagnosis-card">
                        <div className="diagnosis-header">
                          <span className="diagnosis-number">#{index + 1}</span>
                          <span className="diagnosis-date">
                            {new Date(diagnosis.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="diagnosis-text">{diagnosis.diagnosis}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="report-no-data">
                    <p>🏥 No diagnoses have been recorded for this patient yet.</p>
                  </div>
                )}
              </div>

              {/* Summary Section */}
              <div className="report-section report-summary">
                <h3 className="report-section-title">📊 Summary</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="stat-number">{medicines.length}</span>
                    <span className="stat-label">Total Medicines</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">{diagnoses.length}</span>
                    <span className="stat-label">Total Diagnoses</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">{new Date().toLocaleDateString()}</span>
                    <span className="stat-label">Report Generated</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="report-modal-actions">
          <button 
            className="report-btn report-btn-view" 
            onClick={handleViewPDF} 
            disabled={viewingPDF || loading}
            title="Open PDF report in new tab for viewing"
          >
            {viewingPDF ? "📄 Opening..." : "📄 View PDF"}
          </button>
          
          <button 
            className="report-btn report-btn-download" 
            onClick={handleDownloadPDF} 
            disabled={downloadingPDF || loading}
            title="Download PDF report to your computer"
          >
            {downloadingPDF ? "⬇️ Downloading..." : "⬇️ Download PDF"}
          </button>
          
          <button 
            className="report-btn report-btn-print" 
            onClick={handlePrint}
            disabled={loading}
            title="Print this report"
          >
            🖨️ Print Report
          </button>
          
          <div style={{flex: 1}} />
          
          <button 
            className="report-btn report-btn-close" 
            onClick={onClose}
          >
            ✖️ Close
          </button>
        </div>
      </div>
    </div>
  );
}