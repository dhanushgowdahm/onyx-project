import React, { useState, useEffect } from "react";
import "./AddPatientModal.css";
import { doctorsAPI, bedsAPI } from "../../services/api";

function EditPatientModal({ patient, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    assigned_bed: "",
    assigned_doctor: "",
    address: "",
    emergency_contact: "",
  });
  
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [beds, setBeds] = useState([]);
  const [loadingBeds, setLoadingBeds] = useState(true);
  const [availableBeds, setAvailableBeds] = useState([]);

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        assigned_doctor: patient.assigned_doctor || ""
      });
    }
  }, [patient]);
  
  // Fetch doctors for dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const doctorsData = await doctorsAPI.getAll();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  // Fetch beds for dropdown
  useEffect(() => {
    const fetchBeds = async () => {
      try {
        setLoadingBeds(true);
        const bedsData = await bedsAPI.getAll();
        setBeds(bedsData);
        
        // Filter beds that are either:
        // 1. Unoccupied (is_occupied === false)
        // 2. Currently assigned to this patient (so they can keep their bed)
        const unoccupiedBeds = bedsData.filter(bed => 
          !bed.is_occupied || 
          (patient && bed.bed_number === patient.assigned_bed)
        );
        setAvailableBeds(unoccupiedBeds);
        
        console.log('All beds:', bedsData);
        console.log('Available beds for selection:', unoccupiedBeds);
      } catch (error) {
        console.error('Error fetching beds:', error);
      } finally {
        setLoadingBeds(false);
      }
    };
    
    fetchBeds();
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Patient</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Name:
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Age:
            <input type="number" name="age" value={formData.age} onChange={handleChange} />
          </label>
          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Contact:
            <input name="contact" value={formData.contact} onChange={handleChange} />
          </label>
          <label>
            Assigned Bed:
            {loadingBeds ? (
              <select disabled>
                <option>Loading beds...</option>
              </select>
            ) : (
              <select name="assigned_bed" value={formData.assigned_bed} onChange={handleChange}>
                <option value="">No bed assigned</option>
                {availableBeds.map(bed => {
                  const isCurrentBed = patient && bed.bed_number === patient.assigned_bed;
                  return (
                    <option key={bed.id} value={bed.bed_number}>
                      Bed {bed.bed_number} - {bed.ward}
                      {isCurrentBed ? ' (Currently Assigned)' : ''}
                      {bed.is_occupied && !isCurrentBed ? ' (Occupied)' : ''}
                    </option>
                  );
                })}
              </select>
            )}
          </label>
          {formData.assigned_bed && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              ℹ️ Selected: Bed {formData.assigned_bed}
              {(() => {
                const selectedBed = beds.find(b => b.bed_number === formData.assigned_bed);
                return selectedBed ? ` in ${selectedBed.ward}` : '';
              })()} 
            </div>
          )}
          {!formData.assigned_doctor && (
            <label>
              Assign Doctor:
              {loadingDoctors ? (
                <select disabled>
                  <option>Loading doctors...</option>
                </select>
              ) : (
                <select name="assigned_doctor" value={formData.assigned_doctor} onChange={handleChange}>
                  <option value="">No doctor assigned</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              )}
            </label>
          )}
          {formData.assigned_doctor && (
            <div className="assigned-doctor-info">
              <label>Currently Assigned Doctor:</label>
              <div className="doctor-display">
                {(() => {
                  const doctor = doctors.find(d => d.id.toString() === formData.assigned_doctor.toString());
                  return doctor ? `Dr. ${doctor.name} - ${doctor.specialization}` : 'Doctor information loading...';
                })()}
              </div>
              <button 
                type="button" 
                className="unassign-doctor-btn"
                onClick={() => setFormData(prev => ({ ...prev, assigned_doctor: "" }))}
              >
                Unassign Doctor
              </button>
            </div>
          )}
          
          {/* Bed availability info */}
          <div style={{ 
            padding: '10px', 
            background: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666',
            margin: '10px 0'
          }}>
            
          </div>
          
          <label>
            Address:
            <input name="address" value={formData.address} onChange={handleChange} />
          </label>
          <label>
            Emergency Contact:
            <input name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
          </label>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientModal;
