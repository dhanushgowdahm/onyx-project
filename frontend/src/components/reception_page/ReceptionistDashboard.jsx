import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReceptionistDashboard.css";
import { patientsAPI, doctorsAPI, bedsAPI, appointmentsAPI } from "../../services/api";
import { getTodayString } from "../../utils/dateUtils";

function ReceptionistDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    availableDoctors: 0,
    occupiedBeds: 0,
    totalBeds: 0,
    todayAppointments: 0,
    allAppointments: 0
  });
  const [beds, setBeds] = useState([]);
  const [appointments, setAppointments] = useState({
    today: [],
    all: [] // Changed from tomorrow to all
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching receptionist dashboard data...');
      
      const [patientsData, doctorsData, bedsData, appointmentsData] = await Promise.all([
        patientsAPI.getAll(),
        doctorsAPI.getAll(), 
        bedsAPI.getAll(),
        appointmentsAPI.getAll()
      ]);

      console.log('Receptionist dashboard data:', {
        patients: patientsData?.length || 0,
        doctors: doctorsData?.length || 0,
        beds: bedsData?.length || 0, 
        appointments: appointmentsData?.length || 0
      });

      // Calculate bed stats
      const totalBeds = bedsData.length;
      const occupiedBeds = bedsData.filter(bed => bed.is_occupied).length;
      
      // Get all non-cancelled appointments and sort by date
      // Use consistent date format across all components
      const todayStr = getTodayString();
      
      const allAppointmentsList = appointmentsData
        .sort((a, b) => {
          // Sort by date first, then by time
          if (a.appointment_date === b.appointment_date) {
            return a.appointment_time.localeCompare(b.appointment_time);
          }
          return a.appointment_date.localeCompare(b.appointment_date);
        });
      
      const todayAppointmentsList = appointmentsData.filter(app => 
        app.appointment_date === todayStr && app.status !== 'cancelled'
      );

      // Set all appointments for detailed display
      setAppointments({
        today: todayAppointmentsList,
        all: allAppointmentsList // Show all appointments instead of just tomorrow
      });

      // Group beds by ward for display
      const wardBeds = bedsData.reduce((acc, bed) => {
        const ward = bed.ward || 'Ward A'; // Default ward if not specified
        if (!acc[ward]) acc[ward] = [];
        acc[ward].push(bed);
        return acc;
      }, {});

      setStats({
        totalPatients: patientsData.length,
        availableDoctors: doctorsData.length,
        occupiedBeds,
        totalBeds,
        todayAppointments: todayAppointmentsList.length,
        allAppointments: appointmentsData.length // Show total count including cancelled
      });

      setBeds(wardBeds);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-heading">Receptionist Dashboard</h2>

      <div className="dashboard-container">
        {/* Quick Actions */}
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <p>Perform common tasks quickly</p>
          <button
            className="action-btn primary"
            onClick={() => navigate("/patients")}
          >
            👤 Register Patient
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/beds")}
          >
            🛏️ Allocate Bed
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/appointments")}
          >
            📅 Book Appointment
          </button>

          <div className="stats">
            <h4>Quick Stats</h4>
            {loading ? (
              <p>Loading stats...</p>
            ) : (
              <>
                <p>Total Patients <span>{stats.totalPatients}</span></p>
                <p>Available Doctors <span>{stats.availableDoctors}</span></p>
                <p>Bed Occupancy <span>{stats.occupiedBeds}/{stats.totalBeds}</span></p>
              </>
            )}
          </div>
        </div>

        {/* Bed Status Overview */}
        <div className="dashboard-card">
          <h3>Bed Status Overview</h3>
          <p>Current ward and bed availability</p>

          {loading ? (
            <p>Loading bed information...</p>
          ) : (
            <>
              {Object.entries(beds).map(([wardName, wardBeds]) => (
                <div key={wardName} className="ward">
                  <strong>{wardName}</strong>
                  <div className="beds">
                    {wardBeds.map(bed => (
                      <span 
                        key={bed.id} 
                        className={`bed ${bed.is_occupied ? 'occupied' : 'available'}`}
                      >
                        {bed.bed_number}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(beds).length === 0 && (
                <p>No bed data available</p>
              )}
            </>
          )}

          <div className="legend">
            <div><span className="dot green"></span> Available</div>
            <div><span className="dot red"></span> Occupied</div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="dashboard-card">
          <h3>Upcoming Appointments</h3>
          <p>Today's and tomorrow's scheduled appointments</p>

          <div className="appointment-section">
            <h4>Today ({new Date().toLocaleDateString()})</h4>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.today.length > 0 ? (
              <div className="appointments-list">
                {appointments.today.map((appointment, index) => (
                  <div key={appointment.id || index} className="appointment-item">
                    <div className="appointment-header">
                      <span className="appointment-patient">{appointment.patient_name}</span>
                      <span className="appointment-time">{appointment.appointment_time}</span>
                    </div>
                    <div className="appointment-details">
                      <span className="appointment-doctor">Dr. {appointment.doctor_name}</span>
                      <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-appointments">
                No appointments scheduled for today
              </div>
            )}

            <h4>All Appointments ({appointments.all.length} total)</h4>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.all.length > 0 ? (
              <div className="appointments-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {appointments.all.map((appointment, index) => (
                  <div key={appointment.id || index} className="appointment-item">
                    <div className="appointment-header">
                      <span className="appointment-patient">{appointment.patient_name}</span>
                      <span className="appointment-time">{appointment.appointment_time}</span>
                    </div>
                    <div className="appointment-details">
                      <span className="appointment-doctor">Dr. {appointment.doctor_name}</span>
                      <span className="appointment-date">{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                      <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-appointments">
                No appointments found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDashboard;