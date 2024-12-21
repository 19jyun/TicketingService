import React, { useState, useEffect } from "react";
import styles from "../styles/components/UserProfile.module.css";
import ReservationCard from "../components/ReservationCard";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { changePassword, verifyPassword } from "../services/authService"; // verifyPassword 추가

interface Reservation {
  reservation_id: string;
  user_id: string;
  show_id: string;
  seat: string;
  date: string;
}

export const UserProfile: React.FC = () => {
  const { username, logout } = useAuth();
  const [email, setEmail] = useState<string | null>("user@example.com");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [reservationsVisible, setReservationsVisible] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch("/data/reservations.csv");
      const text = await response.text();

      const rows = text.split("\n").slice(1); // 첫 번째 줄은 헤더
      const parsedReservations = rows
        .map((row) => {
          const [reservation_id, user_id, show_id, seat, date] = row.split(",");
          return { reservation_id, user_id, show_id, seat, date };
        })
        .filter((res) => res.user_id === username);

      setReservations(parsedReservations);
    };

    fetchReservations();
  }, [username]);

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
    setPasswordError(null); // 에러 메시지 초기화
  };

  const handleReservationsToggle = () => {
    setReservationsVisible(!reservationsVisible);
  };

  const handleLogout = () => {
    logout();
    alert("Logged out successfully!");
    navigate("/");
  };

  const handlePasswordChange = async () => {
    // 비밀번호 검증
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters long.");
      return;
    }

    try {
      // 현재 비밀번호 확인
      const isPasswordValid = await verifyPassword(username!, currentPassword);
      if (!isPasswordValid) {
        setPasswordError("Current password is incorrect.");
        return;
      }

      // 비밀번호 변경
      const success = await changePassword(username!, newPassword);
      if (success) {
        alert("Password successfully changed. Please log in again.");
        handleLogout(); // 로그아웃 처리
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setPasswordError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Profile</h1>
      <div className={styles.profileSection}>
        <p>User ID: {username}</p>
        <p>Email: {email}</p>
      </div>

      {/* Change Password Section */}
      <div className={`${styles.card}`} onClick={handlePasswordToggle}>
        <h2>Change Password</h2>
        <div
          className={`${styles.expandableContent} ${
            passwordVisible ? styles.visible : ""
          }`}
        >
          {passwordError && <p className={styles.error}>{passwordError}</p>}

          {/* Current Password */}
          <input
            type="password"
            placeholder="Current Password"
            className={styles.input}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          {/* New Password */}
          <input
            type="password"
            placeholder="New Password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Confirm New Password */}
          <input
            type="password"
            placeholder="Confirm New Password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className={styles.button}
            onClick={(e) => {
              e.stopPropagation();
              handlePasswordChange();
            }}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* My Reservations Section */}
      <div className={`${styles.card}`} onClick={handleReservationsToggle}>
        <h2>My Reservations</h2>
        <div
          className={`${styles.expandableContent} ${
            reservationsVisible ? styles.visible : ""
          }`}
        >
          {reservations.map((res) => (
            <ReservationCard key={res.reservation_id} reservation={res} />
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className={styles.card} onClick={handleLogout}>
        <h2>Logout</h2>
      </div>
    </div>
  );
};

export default UserProfile;
