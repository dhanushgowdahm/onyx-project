import React, { useState, useEffect } from "react";
import "./Appointment.css";
import { appointmentsAPI, patientsAPI, doctorsAPI } from "../../services/api";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    doctor: "",
    appointment_date: "",
    appointment_time: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentsAPI.getAll(),
        patientsAPI.getAll(),
        doctorsAPI.getAll()
      ]);

      setAppointments(appointmentsData || []);
      setPatients(patientsData || []);
      setDoctors(doctorsData || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
        const appointmentToUpdate = appointments.find(app => app.id === id);
        if (appointmentToUpdate) {
            await appointmentsAPI.update(id, { ...appointmentToUpdate, status: newStatus });
            fetchData(); // Refresh data
        }
    } catch (error) {
        console.error("Failed to update status", error);
        alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
        try {
            await appointmentsAPI.delete(id);
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Failed to delete appointment", error);
            alert("Failed to delete appointment.");
        }
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setNewAppointment({
      patient: appointment.patient,
      doctor: appointment.doctor,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
    });
    setShowForm(true);
  };

  const handleBook = async () => {
    const appointmentData = {
        ...newAppointment,
    };

    try {
        if (editingAppointment) {
            await appointmentsAPI.update(editingAppointment.id, appointmentData);
        } else {
            await appointmentsAPI.create(appointmentData);
        }
        setShowForm(false);
        resetForm();
        fetchData(); // Refresh data
    } catch (error) {
        console.error("Failed to save appointment", error);
        alert(`Failed to save appointment: ${error.message}`);
    }
  };
  
  const resetForm = () => {
    setEditingAppointment(null);
    setNewAppointment({ patient: "", doctor: "", appointment_date: "", appointment_time: "", status: "scheduled" });
  };

  const handleCloseModal = () => {
    setShowForm(false);
    resetForm();
  };
  
  const getDoctorName = (doctorId) => {
      const doctor = doctors.find(d => d.id === doctorId);
      return doctor ? doctor.name : 'Unknown';
  };
  
  const getPatientName = (patientId) => {
      const patient = patients.find(p => p.id === patientId);
      return patient ? patient.name : 'Unknown';
  }

  const calculateStats = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const todaysAppointments = appointments.filter(
      (app) => app.appointment_date === todayStr && app.status !== "cancelled"
    ).length;

    const upcomingAppointments = appointments.filter((app) => {
      return app.appointment_date > todayStr && app.status === "scheduled";
    }).length;

    return {
      today: todaysAppointments,
      upcoming: upcomingAppointments,
      patients: patients.length,
      doctors: doctors.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="appointment-container">
      <div className="header">
        <div className="header-content">
          <h2>Appointment Management</h2>
          <p>Book and manage patient appointments</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-book">
          + Book Appointment
        </button>
      </div>

      <div className="stats">
        <div>Today's <br /> {loading ? "..." : stats.today}</div>
        <div>Upcoming <br /> {loading ? "..." : stats.upcoming}</div>
        <div>Patients <br /> {loading ? "..." : stats.patients}</div>
        <div>Doctors <br /> {loading ? "..." : stats.doctors}</div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="appointments">
        <h3>All Appointments</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    {getPatientName(a.patient)}
                    <div className="subtext">ID: {a.patient}</div>
                  </td>
                  <td>
                    {getDoctorName(a.doctor)}
                    <div className="subtext">{doctors.find(d => d.id === a.doctor)?.specialization}</div>
                  </td>
                  <td>{new Date(a.appointment_date).toLocaleDateString()}</td>
                  <td>{a.appointment_time}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className={`status ${a.status}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(a)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}</h3>

            <label>Patient *</label>
            <select
              value={newAppointment.patient}
              onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <label>Doctor *</label>
            <select
              value={newAppointment.doctor}
              onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <label>Appointment Date *</label>
            <input
              type="date"
              value={newAppointment.appointment_date}
              onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
            />

            <label>Time *</label>
            <input
              type="time"
              value={newAppointment.appointment_time}
              onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={handleCloseModal}>Cancel</button>
              <button onClick={handleBook} className="btn-book">
                {editingAppointment ? 'Update Appointment' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;