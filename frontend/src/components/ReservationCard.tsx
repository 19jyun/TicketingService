import React, { useState } from "react";
import { Reservation } from "../types/Reservation";
import styles from "../styles/components/ReservationCard.module.css";
import { modifyReservation } from "../services/reservationService";

interface ReservationCardProps {
  reservation: Reservation;
  onModify?: (reservation_id: string, new_seat_type: "regular" | "vip", new_seat_count: number) => void;
  onDelete?: (reservation_id: string) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onModify,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [seatType, setSeatType] = useState<"regular" | "vip">(reservation.seat_type);
  const [seatCount, setSeatCount] = useState<number>(reservation.seat_count);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleExpand = () => {
    if (isExpanded) {
      setIsCollapsing(true);
      requestAnimationFrame(() => {
            setTimeout(() => {
              setIsExpanded(false);
              setIsCollapsing(false);
            }, 400);
          });
    } else {
      setIsExpanded(true);
    }
  };

  const handleSaveChanges = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await modifyReservation(reservation.reservation_id, seatType, seatCount);

      if (onModify) {
        onModify(reservation.reservation_id, seatType, seatCount);
      }

      alert("Reservation successfully modified.");
      toggleExpand();
    } catch (error) {
      console.error("Failed to modify reservation:", error);
      alert("Failed to modify the reservation. Please try again.");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    setTimeout(() => {
      if (onDelete) {
        onDelete(reservation.reservation_id);
      }
    }, 300);
  };

  const handleSeatCountChange = (delta: number) => {
    setSeatCount((prevCount) => {
      const newCount = Math.max(1, prevCount + delta);
      triggerSeatCountAnimation();
      return newCount;
    });
  };

  const triggerSeatCountAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <li
      className={`${styles.reservationCard} ${
        isExpanded || isCollapsing ? styles.expanded : ""
      } ${isDeleting ? styles.deleting : ""}`}
    >
      <div>
        <strong>Reservation Number:</strong> {reservation.reservation_id}
      </div>
      <div>
        <strong>Seat Type:</strong> {reservation.seat_type}
      </div>
      <div>
        <strong>Seat Count:</strong> {reservation.seat_count}
      </div>
      <div>
        <strong>Price:</strong> ${reservation.price}
      </div>
      <div className={styles.buttonContainer}>
        {onModify && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            className={styles.modifyButton}
          >
            {isExpanded ? "Cancel" : "Modify"}
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Delete
          </button>
        )}
      </div>
      {(isExpanded || isCollapsing) && (
        <div className={styles.modifySection}>
          <div>
            <label>
              <strong>Seat Type:</strong>
              <select
                value={seatType}
                onChange={(e) => setSeatType(e.target.value as "regular" | "vip")}
              >
                <option value="regular">Regular</option>
                <option value="vip">VIP</option>
              </select>
            </label>
          </div>
          <div>
            <strong>Seat Count:</strong>
            <div className={styles.seatCounter}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeatCountChange(-1);
                }}
              >
                -
              </button>
              <span className={isAnimating ? styles.animate : ""}>
                {seatCount}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeatCountChange(1);
                }}
              >
                +
              </button>
            </div>
          </div>
          <button onClick={handleSaveChanges} className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      )}
    </li>
  );
};

export default ReservationCard;
