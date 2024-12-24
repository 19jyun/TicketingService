import React, { useState } from "react";
import styles from "../styles/components/ChangePasswordSection.module.css";
import { changePassword, verifyPassword } from "../services/authService";

interface ChangePasswordSectionProps {
  username: string;
  onLogout: () => void;
}

const ChangePasswordSection: React.FC<ChangePasswordSectionProps> = ({
  username,
  onLogout,
}) => {
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordFields;

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters long.");
      return;
    }

    try {
      const isPasswordValid = await verifyPassword(username, currentPassword);
      if (!isPasswordValid) {
        setPasswordError("Current password is incorrect.");
        return;
      }

      const success = await changePassword(username, newPassword);
      if (success) {
        alert("Password successfully changed. Please log in again.");
        onLogout();
      } else {
        setPasswordError("Failed to update password. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setPasswordError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div
      className={`${styles.card} ${isExpanded ? styles.expanded : ""}`}
      onClick={toggleExpand}
    >
      <h2>Change Password</h2>
      <div
        className={styles.expandableContent}
        onClick={(e) => e.stopPropagation()}
      >
        {passwordError && <p className={styles.error}>{passwordError}</p>}
        <input
          type="password"
          placeholder="Current Password"
          className={styles.input}
          value={passwordFields.currentPassword}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            setPasswordFields({ ...passwordFields, currentPassword: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="New Password"
          className={styles.input}
          value={passwordFields.newPassword}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            setPasswordFields({ ...passwordFields, newPassword: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className={styles.input}
          value={passwordFields.confirmPassword}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            setPasswordFields({ ...passwordFields, confirmPassword: e.target.value })
          }
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
  );
};

export default ChangePasswordSection;
