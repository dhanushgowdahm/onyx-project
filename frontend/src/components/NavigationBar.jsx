import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="navbar">
      <h2 className="logo">Hospital Management</h2>
      <nav className="nav-menu">
        <NavLink to="/receptionist" end className="nav-link">
          <i className="fa fa-home"></i> Home
        </NavLink>
        <NavLink to="/patients" className="nav-link">
          <i className="fa fa-users"></i> Patients
        </NavLink>
        <NavLink to="/doctors" className="nav-link">
          <i className="fa fa-user-md"></i> Doctors
        </NavLink>
        <NavLink to="/beds" className="nav-link">
          <i className="fa fa-bed"></i> Beds
        </NavLink>
        <NavLink to="/appointments" className="nav-link">
          <i className="fa fa-calendar"></i> Appointments
        </NavLink>
      </nav>
      <div className="user-info">
        <span>Welcome, Alice Johnson</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default NavigationBar;
