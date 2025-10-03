import React, { useState } from "react";
import "./Appointment.css";

const Appointment = () => {
  const [appointments, setAppointments] = useState([
    {
      id: "A001",
      patient: "John Smith",
      patientId: "P001",
      doctor: "Dr. Emily Wilson",
      specialty: "Cardiology",
      date: "Dec 15, 2024",
      time: "10:00",
      status: "completed",
    },
    {
      id: "A002",
      patient: "Sarah Johnson",
      patientId: "P002",
      doctor: "Dr. Robert Davis",
      specialty: "Endocrinology",
      date: "Dec 15, 2024",
      time: "14:30",
      status: "scheduled",
    },
    {
      id: "A003",
      patient: "Michael Brown",
      patientId: "P003",
      doctor: "Dr. Emily Wilson",
      specialty: "Cardiology",
      date: "Dec 16, 2024",
      time: "09:00",
      status: "scheduled",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    patient: "",
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    status: "scheduled",
  });

  const patients = [
    { id: "P001", name: "John Smith" },
    { id: "P002", name: "Sarah Johnson" },
    { id: "P003", name: "Michael Brown" },
  ];

  const doctors = [
    { name: "Dr. Emily Wilson", specialty: "Cardiology" },
    { name: "Dr. Robert Davis", specialty: "Endocrinology" },
  ];

  const handleStatusChange = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleDelete = (id) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    
    // Convert date string back to YYYY-MM-DD format for the input
    const dateObj = new Date(appointment.date);
    const formattedDateForInput = dateObj.toISOString().split('T')[0];
    
    setNewAppointment({
      patient: appointment.patient,
      doctor: appointment.doctor,
      specialty: appointment.specialty,
      date: formattedDateForInput,
      time: appointment.time,
      status: appointment.status,
    });
    setShowForm(true);
  };

  const handleBook = () => {
    const patient = patients.find((p) => p.name === newAppointment.patient);
    const doctor = doctors.find((d) => d.name === newAppointment.doctor);

    const formattedDate = new Date(newAppointment.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (editingAppointment) {
      // Update existing appointment
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === editingAppointment.id
            ? {
                ...app,
                patient: patient?.name,
                patientId: patient?.id,
                doctor: doctor?.name,
                specialty: doctor?.specialty,
                date: formattedDate,
                time: newAppointment.time,
                status: newAppointment.status,
              }
            : app
        )
      );
      setEditingAppointment(null);
    } else {
      // Create new appointment
      const id = "A" + String(appointments.length + 1).padStart(3, "0");
      setAppointments([
        ...appointments,
        {
          id,
          patient: patient?.name,
          patientId: patient?.id,
          doctor: doctor?.name,
          specialty: doctor?.specialty,
          date: formattedDate,
          time: newAppointment.time,
          status: "scheduled",
        },
      ]);
    }

    setShowForm(false);
    setNewAppointment({ patient: "", doctor: "", specialty: "", date: "", time: "", status: "scheduled" });
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingAppointment(null);
    setNewAppointment({ patient: "", doctor: "", specialty: "", date: "", time: "", status: "scheduled" });
  };

  // Calculate dynamic stats
  const calculateStats = () => {
    const today = new Date();
    const todayStr = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const todaysAppointments = appointments.filter(
      (app) => app.date === todayStr && app.status !== "cancelled"
    ).length;

    const upcomingAppointments = appointments.filter((app) => {
      const appDate = new Date(app.date);
      return appDate > today && app.status === "scheduled";
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
        <button onClick={() => {
          setEditingAppointment(null);
          setNewAppointment({ patient: "", doctor: "", specialty: "", date: "", time: "", status: "scheduled" });
          setShowForm(true);
        }} className="btn-book">
          + Book Appointment
        </button>
      </div>

      <div className="stats">
        <div>Today's <br /> {stats.today}</div>
        <div>Upcoming <br /> {stats.upcoming}</div>
        <div>Patients <br /> {stats.patients}</div>
        <div>Doctors <br /> {stats.doctors}</div>
      </div>

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
                    {a.patient}
                    <div className="subtext">{a.patientId}</div>
                  </td>
                  <td>
                    {a.doctor}
                    <div className="subtext">{a.specialty}</div>
                  </td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>
                    <select
                      value={a.status}
                      onChange={(e) =>
                        handleStatusChange(a.id, e.target.value)
                      }
                      className={`status ${a.status}`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(a.id)}
                    >
                      Delete
                    </button>
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
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, patient: e.target.value })
              }
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <label>Doctor *</label>
            <select
              value={newAppointment.doctor}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, doctor: e.target.value })
              }
            >
              <option value="">Select doctor</option>
              {doctors.map((d, i) => (
                <option key={i} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <label>Appointment Date *</label>
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, date: e.target.value })
              }
            />

            <label>Time *</label>
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) =>
                setNewAppointment({ ...newAppointment, time: e.target.value })
              }
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
