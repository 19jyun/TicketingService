import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/components/MyReservationsSection.module.css";
import ReservationCard from "./ReservationCard";
import {
  getReservations,
  modifyReservation,
  deleteReservation,
} from "../services/reservationService";

interface Reservation {
  reservation_id: string;
  user_id: string;
  show_id: number;
  seat_type: "regular" | "vip";
  seat_count: number;
  date: string;
  price: number;
}

interface MyReservationsSectionProps {
  username: string;
}

const MyReservationsSection: React.FC<MyReservationsSectionProps> = ({
  username,
}) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (event: React.MouseEvent<HTMLDivElement>) => {
    if (sectionRef.current && sectionRef.current.contains(event.target as Node)) {
      return; 
    }
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservations(username);
        setReservations(response.reservations || []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to load reservations. Please try again later.");
      }
    };

    fetchReservations();
  }, [username]);

  const handleModifyReservation = async (
    reservation_id: string,
    new_seat_type: "regular" | "vip",
    new_seat_count: number
  ) => {
    try {
      await modifyReservation(reservation_id, new_seat_type, new_seat_count);
      alert("Reservation successfully modified.");
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res.reservation_id === reservation_id
            ? {
                ...res,
                seat_type: new_seat_type,
                seat_count: new_seat_count,
                price:
                  (res.price / res.seat_count) * new_seat_count, 
              }
            : res
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReservation = async (reservation_id: string) => {
    try {
      await deleteReservation(reservation_id);
      setReservations((prevReservations) =>
        prevReservations.filter((res) => res.reservation_id !== reservation_id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}
      onClick={toggleExpand}
    >
      <h2>My Reservations</h2>
      <div
        className={styles.expandableContent}
        ref={sectionRef} 
      >
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : reservations.length === 0 ? (
          <p className={styles.emptyMessage}>Reservation history is empty.</p>
        ) : (
          <div className={styles.scrollableList}>
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.reservation_id}
                reservation={reservation}
                onModify={handleModifyReservation}
                onDelete={handleDeleteReservation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservationsSection;
