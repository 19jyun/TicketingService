import React from 'react';
import styles from '../styles/components/ReservationCard.module.css';

interface Reservation {
  reservation_id: string;
  user_id: string;
  show_id: string;
  seat: string;
  date: string;
}

const ReservationCard: React.FC<{ reservation: Reservation }> = ({ reservation }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Reservation ID: {reservation.reservation_id}</h3>
      <p>Show ID: {reservation.show_id}</p>
      <p>Seat: {reservation.seat}</p>
      <p>Date: {reservation.date}</p>
    </div>
  );
};

export default ReservationCard;
