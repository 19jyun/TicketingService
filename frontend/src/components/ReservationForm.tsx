import React, { useState, useEffect } from "react";
import styles from "../styles/components/ReservationForm.module.css";
import { addReservation } from "../services/reservationService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Show } from "../types/Show";

interface ReservationFormProps {
  showData: Show;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ showData }) => {
  const { username } = useAuth();
  const navigate = useNavigate();

  const [regularCount, setRegularCount] = useState(0);
  const [vipCount, setVipCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const regularPrice = parseInt(showData.price.regular.split(" ")[0]);
    const vipPrice = parseInt(showData.price.vip.split(" ")[0]);
    setTotalPrice(regularCount * regularPrice + vipCount * vipPrice);
  }, [regularCount, vipCount, showData]);

  const handleReservation = async () => {
    if (!username) {
      alert("Login Required");
      return;
    }

    const seat_types: string[] = [];
    const seat_counts: number[] = [];

    if (regularCount > 0) {
      seat_types.push("regular");
      seat_counts.push(regularCount);
    }
    if (vipCount > 0) {
      seat_types.push("vip");
      seat_counts.push(vipCount);
    }

    if (seat_types.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      const response = await addReservation(
        username,
        showData.show_id,
        seat_types,
        seat_counts
      );

      navigate("/reservation-result", {
        state: {
          user_id: username,
          show_title: showData.title,
          show_date: showData.release_date,
          genre: showData.genre,
          reservedSeats: response.reservations,
          totalPrice,
        },
      });
    } catch (error: any) {
      console.error("Error in addReservation:", error);
      alert(`Error occurred while reserving: ${error.response?.data?.message || error.message}`);
    }
  };

return (
  <div className={styles.reservationContainer}>
    <div className={styles.titleContainer}>
      <h2 className={styles.title}>Reserve Tickets</h2>
    </div>

    <div className={styles.contentContainer}>
      <div className={styles.seatSelection}>
        <div className={styles.seatType}>
          <h3>Regular Seats ({showData.price.regular})</h3>
          <div className={styles.seatControls}>
            <button
              onClick={() => setRegularCount((count) => Math.max(0, count - 1))}
              disabled={regularCount <= 0}
            >
              -
            </button>
            <span>{regularCount}</span>
            <button
              onClick={() =>
                setRegularCount((count) =>
                  Math.min(showData.seats.regular, count + 1)
                )
              }
              disabled={regularCount >= showData.seats.regular}
            >
              +
            </button>
          </div>
        </div>
        <div className={styles.seatType}>
          <h3>VIP Seats ({showData.price.vip})</h3>
          <div className={styles.seatControls}>
            <button
              onClick={() => setVipCount((count) => Math.max(0, count - 1))}
              disabled={vipCount <= 0}
            >
              -
            </button>
            <span>{vipCount}</span>
            <button
              onClick={() =>
                setVipCount((count) =>
                  Math.min(showData.seats.vip, count + 1)
                )
              }
              disabled={vipCount >= showData.seats.vip}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className={styles.totalPrice}>
        <h3>Total: {totalPrice} USD</h3>
      </div>
      <button className={styles.reservationButton} onClick={handleReservation}>
        Reserve
      </button>
    </div>
  </div>
);
};

export default ReservationForm;
