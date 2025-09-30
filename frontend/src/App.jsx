import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import LoginPage from "./components/login_page/login";
import ProtectedRoute from "./components/ProtectedRoute";

// Import existing components
import ReceptionistDashboard from "./components/reception_page/ReceptionistDashboard";
import DoctorDashboard from "./components/doctor_page/doctor";

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
              <ReceptionistDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/doctors" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <ReceptionistDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/beds" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <ReceptionistDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute requiredRole="receptionist">
            <NavigationBar />
            <div className="main-content">
              <ReceptionistDashboard />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Protected route for doctor */}
        <Route path="/doctor" element={
          <ProtectedRoute requiredRole="doctor">
            <NavigationBar />
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
