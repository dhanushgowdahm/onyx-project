import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import LoginPage from "./components/login_page/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Doctors from "./components/docters_in_receptionist_page/Doctors";
import Appointment from "./components/appointments_page/Appointment";

// Import existing components
import ReceptionistDashboard from "./components/reception_page/ReceptionistDashboard";
import DoctorDashboard from "./components/doctor_page/doctor";
import PatientsPage from "./components/Patient_page/PatientsPage";
import BedsDashboard from "./components/beds_page/beds.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes for receptionist */}
        <Route path="/home" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <ReceptionistDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/receptionist" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <ReceptionistDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/patients" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <PatientsPage />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/doctors" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <Doctors />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/beds" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <BedsDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <Appointment />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/patients" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <PatientsPage />
            </div>
          </ProtectedRoute>
        } />


        {/* Protected route for doctor */}
        <Route path="/doctor" element={
          <ProtectedRoute requiredRole="doctor">
            {/* <NavigationBar /> */}
            <div className="main-content">
              <DoctorDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Catch-all route - redirect to login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
//kempegowda
//dhanush
