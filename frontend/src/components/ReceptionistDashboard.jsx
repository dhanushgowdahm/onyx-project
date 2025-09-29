import React from "react";
import "./ReceptionistDashboard.css";

function ReceptionistDashboard() {
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
            onClick={() => (window.location.href = "/patients")}
          >
            👤 Register Patient
          </button>
          <button
            className="action-btn"
            onClick={() => (window.location.href = "/beds")}
          >
            🛏️ Allocate Bed
          </button>
          <button
            className="action-btn"
            onClick={() => (window.location.href = "/appointments")}
          >
            📅 Book Appointment
          </button>

          <div className="stats">
            <h4>Quick Stats</h4>
            <p>Total Patients <span>3</span></p>
            <p>Available Doctors <span>3</span></p>
            <p>Bed Occupancy <span>2/12</span></p>
          </div>
        </div>

        {/* Bed Status Overview */}
        <div className="dashboard-card">
          <h3>Bed Status Overview</h3>
          <p>Current ward and bed availability</p>

          <div className="ward">
            <strong>Ward A</strong>
            <div className="beds">
              <span className="bed occupied">101</span>
              <span className="bed available">102</span>
              <span className="bed available">103</span>
              <span className="bed available">104</span>
            </div>
          </div>

          <div className="ward">
            <strong>Ward B</strong>
            <div className="beds">
              <span className="bed available">201</span>
              <span className="bed available">202</span>
              <span className="bed occupied">203</span>
              <span className="bed available">204</span>
            </div>
          </div>

          <div className="ward">
            <strong>Ward C</strong>
            <div className="beds">
              <span className="bed available">301</span>
              <span className="bed available">302</span>
              <span className="bed available">303</span>
              <span className="bed available">304</span>
            </div>
          </div>

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
            <h4>Today (Dec 15)</h4>
            <div className="appointment">
              <div>
                <strong>John Smith</strong>
                <p>Dr. Emily Wilson</p>
              </div>
              <span className="time">10:00</span>
            </div>

            <div className="appointment">
              <div>
                <strong>Sarah Johnson</strong>
                <p>Dr. Robert Davis</p>
              </div>
              <span className="time">14:30</span>
            </div>

            <h4>Tomorrow (Dec 16)</h4>
            <div className="appointment">
              <div>
                <strong>Michael Brown</strong>
                <p>Dr. Emily Wilson</p>
              </div>
              <span className="time">09:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceptionistDashboard;
