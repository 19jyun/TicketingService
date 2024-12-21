import React, { useState } from 'react';
import styles from '../styles/components/ReservationForm.module.css';

const ReservationForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleReservation = () => {
    if (selectedDate && selectedTime) {
      alert(`Reservation Complete: ${selectedDate}, ${selectedTime}`);
    } else {
      alert('Please Select a date.');
    }
  };

  return (
    <div className={styles.reservationContainer}>
      <h2 className={styles.title}>Date</h2>
      <div className={styles.datePicker}>
        <button onClick={() => setSelectedDate('2025-01-09')}>2025-01-09</button>
        <button onClick={() => setSelectedDate('2025-01-12')}>2025-01-12</button>
      </div>
      <button className={styles.reservationButton} onClick={handleReservation}>
        Make a Reservation
      </button>
    </div>
  );
};

export default ReservationForm;
