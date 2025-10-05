import React, { useState, useEffect } from 'react';
import './beds.css';
import { bedsAPI, patientsAPI, doctorsAPI } from '../../services/api';

const initialBedsData = [];

// Bed Details Modal Component (for occupied beds)
function BedDetailsModal({ selectedBed, wardName, onClose, onDischarge }) {
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patient details when modal opens
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (selectedBed && selectedBed.bedData) {
        try {
          setLoading(true);
          setError(null);
          
          // Get all patients and find the one assigned to this bed
          const patients = await patientsAPI.getAll();
          const assignedPatient = patients.find(patient => 
            patient.assigned_bed && 
            patient.assigned_bed.toString() === selectedBed.bedData.id.toString()
          );
          
          if (assignedPatient) {
            setPatientDetails(assignedPatient);
          } else {
            setError("No patient found for this bed");
          }
        } catch (err) {
          console.error('Error fetching patient details:', err);
          setError("Failed to load patient details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPatientDetails();
  }, [selectedBed]);

  const handleDischarge = async () => {
    if (window.confirm("Are you sure you want to discharge this patient?")) {
      onDischarge();
    }
  };

  if (!selectedBed) return null;

  return (
    <div className="modal-overlay">
      <div className="bed-details-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h3 className="modal-title">Bed Details</h3>
        
        <div className="bed-info-section">
          <h4>{wardName} - Bed {selectedBed.id}</h4>
          <p className="bed-status-text">Status: Occupied</p>
        </div>

        {loading ? (
          <div className="loading-section">
            <div className="loading-text">Loading patient details...</div>
          </div>
        ) : error ? (
          <div className="error-section">
            <div className="error-text">{error}</div>
          </div>
        ) : patientDetails ? (
          <div className="patient-details-section">
            <h4 className="section-title">Current Patient</h4>
            <div className="patient-info-grid">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{patientDetails.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">#{patientDetails.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Age:</span>
                <span className="info-value">{patientDetails.age} years</span>
              </div>
              <div className="info-row">
                <span className="info-label">Gender:</span>
                <span className="info-value">{patientDetails.gender}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Contact:</span>
                <span className="info-value">{patientDetails.contact}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">{patientDetails.address || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Emergency Contact:</span>
                <span className="info-value">{patientDetails.emergency_contact || 'Not provided'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Condition:</span>
                <span className="info-value">{patientDetails.condition || 'Not specified'}</span>
              </div>
              {patientDetails.assigned_doctor && (
                <div className="info-row">
                  <span className="info-label">Assigned Doctor:</span>
                  <span className="info-value">Dr. {patientDetails.assigned_doctor}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="error-section">
            <div className="error-text">No patient assigned to this bed</div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="discharge-btn" 
            onClick={handleDischarge}
          >
            Discharge Patient
          </button>
        </div>
      </div>
    </div>
  );
}

// Allocate Bed Modal Component (for available beds)
function AllocateBedModal({ selectedBed, wardName, onClose, onAllocate }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Fetch patients without assigned beds and all doctors when modal opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allPatients, allDoctors] = await Promise.all([
          patientsAPI.getAll(),
          doctorsAPI.getAll()
        ]);
        
        // Filter patients who don't have an assigned bed
        const availablePatients = allPatients.filter(patient => !patient.assigned_bed);
        setPatients(availablePatients);
        setDoctors(allDoctors);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAllocate = () => {
    if (!selectedPatient) {
      alert("Please select a patient to allocate");
      return;
    }
    onAllocate(selectedPatient, selectedDoctor);
  };

  if (!selectedBed) return null;

  return (
    <div className="modal-overlay">
      <div className="allocate-bed-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h3 className="modal-title">Allocate Bed</h3>
        
        <div className="bed-info-section">
          <h4>{wardName} - Bed {selectedBed.id}</h4>
          <p className="bed-status-text">Status: Available</p>
        </div>

        <div className="patient-selection">
          <label htmlFor="patient-select">Select Patient</label>
          {loading ? (
            <div className="loading-text">Loading available patients...</div>
          ) : (
            <select
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => {
                setSelectedPatient(e.target.value);
                setSelectedDoctor(""); // Reset doctor selection when patient changes
              }}
              className="patient-dropdown"
            >
              <option value="">
                {patients.length > 0 ? "Choose a patient to allocate" : "No patients available for allocation"}
              </option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} (ID: #{patient.id}) - {patient.age} years, {patient.gender}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Conditional Doctor Assignment - only show if selected patient has no doctor */}
        {selectedPatient && !loading && (() => {
          const patient = patients.find(p => p.id.toString() === selectedPatient.toString());
          return patient && !patient.assigned_doctor ? (
            <div className="doctor-selection">
              <label htmlFor="doctor-select">Assign Doctor (Optional)</label>
              <select
                id="doctor-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="doctor-dropdown"
              >
                <option value="">No doctor assigned</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              <div className="doctor-note">
                💡 This patient doesn't have a doctor assigned yet
              </div>
            </div>
          ) : patient && patient.assigned_doctor ? (
            <div className="doctor-info">
              <label>Patient's Current Doctor:</label>
              <div className="current-doctor">
                ✅ Already assigned to a doctor
              </div>
            </div>
          ) : null;
        })()}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="allocate-btn" 
            onClick={handleAllocate}
            disabled={!selectedPatient}
          >
            Allocate Bed{selectedDoctor && " & Assign Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function BedStatus({ bed, wardName, onBedClick }) {
  return (
    <div
      className={`bed-card ${bed.occupied ? 'occupied' : 'unoccupied'}`}
      onClick={() => onBedClick(bed, wardName)}
      title={bed.occupied ? 'Click to de-allocate' : 'Click to allocate'}
    >
      <div className="bed-icon">🛏️</div>
      <div className="bed-info">
        <span className="bed-number">{bed.id}</span>
        <span className="bed-status">{bed.occupied ? 'Occupied' : 'Available'}</span>
      </div>
    </div>
  );
}

function WardSection({ ward, onBedClick }) {
  const occupiedCount = ward.beds.filter(b => b.occupied).length;
  return (
    <div className="ward-section">
      <div className="ward-header">
        <span className="ward-title">{ward.name}</span>
        <span className="ward-occupancy">{occupiedCount}/{ward.beds.length} occupied</span>
      </div>
      <div className="ward-beds">
        {ward.beds.map((bed, idx) => (
          <BedStatus
            key={bed.id}
            bed={bed}
            wardName={ward.name}
            onBedClick={onBedClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function BedsDashboard() {
  const [wards, setWards] = useState([]);
  const [allBeds, setAllBeds] = useState([]);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBedInfo, setSelectedBedInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const bedsData = await bedsAPI.getAll();
      
      // Group beds by ward
      const wardGroups = bedsData.reduce((acc, bed) => {
        const ward = bed.ward || 'Ward A'; // Default ward if not specified
        if (!acc[ward]) {
          acc[ward] = {
            name: ward,
            beds: []
          };
        }
        acc[ward].beds.push({
          id: bed.bed_number,
          occupied: bed.is_occupied,
          patient_name: bed.patient_name || null,
          bedData: bed // Store original bed data
        });
        return acc;
      }, {});

      setWards(Object.values(wardGroups));
      setAllBeds(bedsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching beds:", err);
      setError("Failed to load bed data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalBeds = allBeds.length;
  const occupiedBeds = allBeds.filter(b => b.is_occupied).length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Handle bed click to show appropriate modal
  function handleBedClick(bed, wardName) {
    setSelectedBedInfo({ bed, wardName });
    
    if (bed.occupied) {
      // Show bed details modal for occupied beds
      setShowDetailsModal(true);
    } else {
      // Show allocation modal for available beds
      setShowAllocateModal(true);
    }
  }

  // Handle bed allocation with optional doctor assignment
  async function handleAllocateBed(patientId, doctorId = null) {
    if (!selectedBedInfo) return;
    
    const { bed, wardName } = selectedBedInfo;
    
    try {
      // Get patient details
      const patient = await patientsAPI.getById(patientId);
      
      // Update patient to assign the bed and optionally assign doctor
      const updatedData = {
        ...patient,
        assigned_bed: bed.bedData.id
      };
      
      // Only update doctor if one is selected and patient doesn't already have one
      if (doctorId && !patient.assigned_doctor) {
        updatedData.assigned_doctor = doctorId;
      }
      
      await patientsAPI.update(patientId, updatedData);
      
      // Update bed status to occupied in the database
      await bedsAPI.update(bed.bedData.id, {
        ...bed.bedData,
        is_occupied: true
      });
      
      // Refresh bed data from the database
      await fetchBeds();
      
      // Close modal
      setShowAllocateModal(false);
      setSelectedBedInfo(null);
      
      // Create success message
      let message = `Bed ${bed.id} in ${wardName} has been allocated to ${patient.name}`;
      if (doctorId && !patient.assigned_doctor) {
        message += ' and doctor has been assigned';
      }
      message += ' successfully!';
      
      alert(message);
      
    } catch (error) {
      console.error('Error allocating bed:', error);
      alert(`Failed to allocate bed: ${error.message}`);
    }
  }

  // Handle patient discharge
  async function handleDischargePatient() {
    if (!selectedBedInfo) return;
    
    const { bed, wardName } = selectedBedInfo;
    
    try {
      // First, get all patients to find the one assigned to this bed
      const patients = await patientsAPI.getAll();
      const assignedPatient = patients.find(patient => 
        patient.assigned_bed && 
        patient.assigned_bed.toString() === bed.bedData.id.toString()
      );
      
      if (assignedPatient) {
        // Update patient to remove bed assignment
        await patientsAPI.update(assignedPatient.id, {
          ...assignedPatient,
          assigned_bed: null
        });
      }
      
      // Update bed status to available in the database
      await bedsAPI.update(bed.bedData.id, {
        ...bed.bedData,
        is_occupied: false
      });
      
      // Refresh bed data from the database
      await fetchBeds();
      
      // Close modal
      setShowDetailsModal(false);
      setSelectedBedInfo(null);
      
      // Show success message
      alert(`Patient discharged from Bed ${bed.id} in ${wardName} successfully!`);
      
    } catch (error) {
      console.error('Error discharging patient:', error);
      alert(`Failed to discharge patient: ${error.message}`);
    }
  }

  // Close modals
  function handleCloseModal() {
    setShowAllocateModal(false);
    setShowDetailsModal(false);
    setSelectedBedInfo(null);
  }

  if (loading) {
    return (
      <div className="dashboard-wrap">
        <h2 className="dashboard-title">Bed Allocation</h2>
        <div className="loading">Loading bed information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrap">
        <h2 className="dashboard-title">Bed Allocation</h2>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrap">
      <h2 className="dashboard-title">Bed Allocation</h2>
      <div className="dashboard-stats">
        <div className="stat-card total">
          <div className="stat-label">Total Beds</div>
          <div className="stat-value">{totalBeds}</div>
        </div>
        <div className="stat-card occupied">
          <div className="stat-label">Occupied</div>
          <div className="stat-value">{occupiedBeds}</div>
        </div>
        <div className="stat-card rate">
          <div className="stat-label">Occupancy Rate</div>
          <div className="stat-value">
            <span className="dot-green"></span>
            {occupancyRate}%
          </div>
        </div>
      </div>

      <div className="wards-wrap">
        {wards.length > 0 ? (
          wards.map(ward => (
            <WardSection key={ward.name} ward={ward} onBedClick={handleBedClick} />
          ))
        ) : (
          <div className="no-data">No bed data available</div>
        )}
      </div>

      <div className="legend-wrap">
        <div className="legend-item">
          <span className="legend-dot-green"></span> Green: Unoccupied
        </div>
        <div className="legend-item">
          <span className="legend-dot-red"></span> Red: Occupied
        </div>
        <div className="legend-item">
          <span className="legend-icon">🛏️</span> Click icon: Allocate / De-allocate
        </div>
      </div>

      {/* Bed Details Modal (for occupied beds) */}
      {showDetailsModal && selectedBedInfo && (
        <BedDetailsModal
          selectedBed={selectedBedInfo.bed}
          wardName={selectedBedInfo.wardName}
          onClose={handleCloseModal}
          onDischarge={handleDischargePatient}
        />
      )}

      {/* Allocate Bed Modal (for available beds) */}
      {showAllocateModal && selectedBedInfo && (
        <AllocateBedModal
          selectedBed={selectedBedInfo.bed}
          wardName={selectedBedInfo.wardName}
          onClose={handleCloseModal}
          onAllocate={handleAllocateBed}
        />
      )}
    </div>
  );
}
