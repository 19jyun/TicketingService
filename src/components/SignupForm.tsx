import React, { useState } from 'react';
import styles from '../styles/components/SignupForm.module.css'; // CSS 모듈 import

interface SignupFormProps {
  onSignup: (id: string, password: string, email: string) => void;
  onCheckId: (id: string) => boolean;
  errorMessage: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onCheckId, errorMessage }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [idAvailable, setIdAvailable] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleIdCheck = () => {
    const isAvailable = onCheckId(id);
    if (isAvailable) {
      setIdAvailable(true);
      setValidationError('');
    } else {
      setIdAvailable(false);
      setValidationError('ID is already taken.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    onSignup(id, password, email);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Signup</h2>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {validationError && <p className={styles.error}>{validationError}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your ID"
            className={styles.input}
            required
          />
          <button type="button" onClick={handleIdCheck} className={styles.checkButton}>
            Check ID
          </button>
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className={styles.input}
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className={styles.input}
          required
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!idAvailable || password !== confirmPassword}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
