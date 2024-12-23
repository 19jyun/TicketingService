import React, { useState } from "react";
import styles from "../styles/pages/UserProfile.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ChangePasswordSection from "../components/ChangePasswordSection";
import MyReservationsSection from "../components/MyReservationsSection";

const UserProfile: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    alert("Logged out successfully!");
    navigate("/");
  };

  const handleToggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Profile</h1>
      <div className={styles.profileSection}>
        <p>User ID: {username}</p>
        <p>Email: user@example.com</p>
      </div>

      <ChangePasswordSection username={username!} onLogout={handleLogout} />
      <MyReservationsSection username={username!} />

      <div className={styles.card} onClick={handleLogout}>
        <h2>Logout</h2>
      </div>
    </div>
  );
};

export default UserProfile;
