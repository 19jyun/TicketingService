import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/pages/ReservationResult.module.css";
import ReservationCard from "../components/ReservationCard";
import { updateInterest } from "../services/userInterestService";
import { useAuth } from "../contexts/AuthContext"; 

const ReservationResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = useAuth(); 

  const {
    show_title = "Unknown Show",
    show_date = "Unknown Date",
    reservedSeats = [],
    totalPrice = 0,
    genre = "Unknown Genre", 
  } = location.state || {};

  useEffect(() => {
    const updateUserInterest = async () => {
      if (username && genre !== "Unknown Genre") {
        await updateInterest(username, genre, "reservation");
      }
    };

    updateUserInterest();
  }, [username, genre]);

  if (reservedSeats.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <h2>Reservation Failed</h2>
        <p>No reservation details were found. Please try again.</p>
        <button onClick={() => navigate("/")}>Back to Shows</button>
      </div>
    );
  }

  return (
    <div className={styles.resultContainer}>
      <h2>Reservation Successful</h2>
      <p>Thank you, {username}, for reserving tickets to {show_title}!</p>
      <p>Date: {show_date}</p>
      <p>Total Price: {totalPrice} USD</p>
      <ul className={styles.reservationDetails}>
        {reservedSeats.map((reservation: any, index: number) => (
          <ReservationCard key={index} reservation={reservation} />
        ))}
      </ul>
      <button onClick={() => navigate("/")} className={styles.backButton}>
        Back to MainPage
      </button>
    </div>
  );
};

export default ReservationResult;