import React, { useState } from "react";
import { Reservation } from "../types/Reservation";
import styles from "../styles/components/ReservationCard.module.css";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [seatType, setSeatType] = useState<"regular" | "vip">(reservation.seat_type);
  const [seatCount, setSeatCount] = useState<number>(reservation.seat_count);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleSaveChanges = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 이벤트 차단
    if (onModify) {
      onModify(reservation.reservation_id, seatType, seatCount);
      setIsExpanded(false); // 수정 완료 후 접기
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 이벤트 차단
    setIsDeleting(true); // 삭제 애니메이션 시작
    setTimeout(() => {
      if (onDelete) {
        onDelete(reservation.reservation_id); // 삭제 후 부모 컴포넌트로 알림
      }
    }, 300); // 삭제 애니메이션 시간 (300ms)
  };

  return (
    <li
      className={`${styles.reservationCard} ${
        isExpanded ? styles.expanded : ""
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
              e.stopPropagation(); // 부모 이벤트 차단
              toggleExpand();
            }}
            className={styles.modifyButton}
          >
            {isExpanded ? "Cancel" : "Modify"}
          </button>
        )}
        {onDelete && (
          <button onClick={handleDelete} className={styles.deleteButton}>
            Delete
          </button>
        )}
      </div>
      {isExpanded && (
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
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 부모 이벤트 차단
                  setSeatCount((count) => Math.max(1, count - 1));
                }}
              >
                -
              </button>
              <span>{seatCount}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 부모 이벤트 차단
                  setSeatCount((count) => count + 1);
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
