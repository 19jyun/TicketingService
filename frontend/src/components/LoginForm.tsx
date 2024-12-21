import React, { useState } from "react";
import styles from "../styles/components/LoginForm.module.css";

interface LoginFormProps {
  onLogin: (data: { email: string; password: string }) => void;
  onSignup: () => void;
  errorMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSignup, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your Email"
          className={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your Password"
          className={styles.input}
          required
        />
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
      <button onClick={onSignup} className={styles.signupButton}>
        Signup
      </button>
    </div>
  );
};
