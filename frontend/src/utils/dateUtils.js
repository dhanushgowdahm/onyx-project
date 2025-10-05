/**
 * Utility functions for consistent date handling across the application
 */

/**
 * Get today's date in YYYY-MM-DD format (consistent across all components)
 * This avoids timezone issues that can occur with toISOString()
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayString = () => {
  const today = new Date();
  return today.getFullYear() + '-' + 
         String(today.getMonth() + 1).padStart(2, '0') + '-' + 
         String(today.getDate()).padStart(2, '0');
};

/**
 * Get tomorrow's date in YYYY-MM-DD format
 * @returns {string} Tomorrow's date in YYYY-MM-DD format
 */
export const getTomorrowString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getFullYear() + '-' + 
         String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + 
         String(tomorrow.getDate()).padStart(2, '0');
};

/**
 * Format a date object to YYYY-MM-DD string
 * @param {Date} date - The date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateString = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.getFullYear() + '-' + 
         String(d.getMonth() + 1).padStart(2, '0') + '-' + 
         String(d.getDate()).padStart(2, '0');
};

/**
 * Check if an appointment is for today
 * @param {object} appointment - Appointment object with appointment_date property
 * @returns {boolean} True if appointment is for today
 */
export const isAppointmentToday = (appointment) => {
  return appointment.appointment_date === getTodayString();
};

/**
 * Check if an appointment is for tomorrow
 * @param {object} appointment - Appointment object with appointment_date property
 * @returns {boolean} True if appointment is for tomorrow
 */
export const isAppointmentTomorrow = (appointment) => {
  return appointment.appointment_date === getTomorrowString();
};