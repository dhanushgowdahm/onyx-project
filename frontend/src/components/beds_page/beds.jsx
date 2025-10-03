import React, { useState, useEffect } from 'react';
import './beds.css';

const initialBedsData = [
  {
    name: 'Ward A',
    beds: [
      { id: 101, occupied: true },
      { id: 102, occupied: false },
      { id: 103, occupied: false },
      { id: 104, occupied: false },
    ],
  },
  {
    name: 'Ward B',
    beds: [
      { id: 201, occupied: true },
      { id: 202, occupied: false },
      { id: 203, occupied: false },
      { id: 204, occupied: false },
    ],
  },
  {
    name: 'Ward C',
    beds: [
      { id: 301, occupied: false },
      { id: 302, occupied: false },
      { id: 303, occupied: false },
      { id: 304, occupied: false },
    ],
  },
];

// Bed Details Modal Component (for occupied beds)
function BedDetailsModal({ selectedBed, wardName, onClose, onDischarge }) {
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails();
  }, []);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch patient details based on bed assignment
      // TODO: Implement API call to fetch patient details
      setPatientDetails(null);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setPatientDetails(null);
    }
    setLoading(false);
  };

  const handleDischarge = () => {
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
                <span className="info-value">{patientDetails.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Age:</span>
                <span className="info-value">{patientDetails.age}</span>
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
                <span className="info-label">Condition:</span>
                <span className="info-value">{patientDetails.condition}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="loading-section">
            <div className="loading-text">No patient details available</div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="discharge-btn" 
            onClick={handleDischarge}
            disabled={loading}
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
  const [selectedPatient, setSelectedPatient] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/patients");
      if (response.ok) {
        const data = await response.json();
        // Filter patients who don't have beds assigned
        const availablePatients = data.filter(patient => 
          !patient.assigned_bed || patient.assigned_bed === "Not assigned"
        );
        setPatients(availablePatients);
      } else {
        console.error("Failed to fetch patients");
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    }
    setLoading(false);
  };

  const handleAllocate = () => {
    if (!selectedPatient) {
      alert("Please select a patient to allocate");
      return;
    }
    onAllocate(selectedPatient);
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
            <div className="loading-text">Loading patients...</div>
          ) : (
            <select
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="patient-dropdown"
            >
              <option value="">Choose a patient to allocate</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} (ID: {patient.id})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="allocate-btn" 
            onClick={handleAllocate}
            disabled={!selectedPatient || loading}
          >
            Allocate Bed
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
  const [wards, setWards] = useState(initialBedsData);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBedInfo, setSelectedBedInfo] = useState(null);

  // Calculate stats
  const allBeds = wards.flatMap(ward => ward.beds);
  const totalBeds = allBeds.length;
  const occupiedBeds = allBeds.filter(b => b.occupied).length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

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

  // Handle bed allocation
  function handleAllocateBed(patientId) {
    if (!selectedBedInfo) return;
    
    const { bed, wardName } = selectedBedInfo;
    
    // Update bed status to occupied
    setWards(prev =>
      prev.map(ward =>
        ward.name === wardName
          ? {
              ...ward,
              beds: ward.beds.map(b =>
                b.id === bed.id ? { ...b, occupied: true, patientId } : b
              ),
            }
          : ward
      )
    );

    // Close modal
    setShowAllocateModal(false);
    setSelectedBedInfo(null);
    
    // Show success message
    alert(`Bed ${bed.id} in ${wardName} has been allocated successfully!`);
  }

  // Handle patient discharge
  function handleDischargePatient() {
    if (!selectedBedInfo) return;
    
    const { bed, wardName } = selectedBedInfo;
    
    // Update bed status to available
    setWards(prev =>
      prev.map(ward =>
        ward.name === wardName
          ? {
              ...ward,
              beds: ward.beds.map(b =>
                b.id === bed.id ? { ...b, occupied: false, patientId: null } : b
              ),
            }
          : ward
      )
    );

    // Close modal
    setShowDetailsModal(false);
    setSelectedBedInfo(null);
    
    // Show success message
    alert(`Patient discharged from Bed ${bed.id} in ${wardName} successfully!`);
  }

  // Close modals
  function handleCloseModal() {
    setShowAllocateModal(false);
    setShowDetailsModal(false);
    setSelectedBedInfo(null);
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
        {wards.map(ward => (
          <WardSection key={ward.name} ward={ward} onBedClick={handleBedClick} />
        ))}
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
