import React, { useState } from "react";
import styles from "../styles/components/SignupForm.module.css";

interface SignupFormProps {
  onSignup: (data: { username: string; email: string; password: string }) => void;
  onCheckId: (username: string) => Promise<boolean>;
  onCheckEmail: (email: string) => Promise<boolean>;
  errorMessage: string;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  onCheckId,
  onCheckEmail,
  errorMessage,
}) => {
  const [username, setUsername] = useState("");
  const [idAvailable, setIdAvailable] = useState(false); // 아이디 사용 가능 여부
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false); // 이메일 사용 가능 여부
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // 아이디 중복 확인
  const handleIdCheck = async () => {
    const isAvailable = await onCheckId(username);
    if (isAvailable) {
      setIdAvailable(true);
      setValidationError("");
    } else {
      setIdAvailable(false);
      setValidationError("Username is already taken.");
    }
  };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    const isAvailable = await onCheckEmail(email);
    if (isAvailable) {
      setEmailAvailable(true);
      setValidationError("");
    } else {
      setEmailAvailable(false);
      setValidationError("Email is already taken.");
    }
  };

  // 회원가입 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    if (!idAvailable || !emailAvailable) {
      setValidationError("Please ensure username and email are valid.");
      return;
    }
    setValidationError("");
    onSignup({ username, email, password });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Signup</h2>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {validationError && <p className={styles.error}>{validationError}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 아이디 입력 및 중복 확인 */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIdAvailable(false); // 아이디 변경 시 초기화
            }}
            placeholder="Enter your username"
            className={styles.input}
            required
          />
          <button
            type="button"
            onClick={handleIdCheck}
            className={styles.checkButton}
            disabled={idAvailable} // 이미 사용 가능 확인된 경우 비활성화
          >
            Check ID
          </button>
        </div>

        {/* 이메일 입력 및 중복 확인 */}
        <div className={styles.inputGroup}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false); // 이메일 변경 시 초기화
            }}
            placeholder="Enter your email"
            className={styles.input}
            required
          />
          <button
            type="button"
            onClick={handleEmailCheck}
            className={styles.checkButton}
            disabled={emailAvailable} // 이미 사용 가능 확인된 경우 비활성화
          >
            Check Email
          </button>
        </div>

        {/* 비밀번호 입력 */}
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
        <p
          className={styles.passwordMatch}
          style={{
            color: password && confirmPassword && password !== confirmPassword ? "red" : "green",
          }}
        >
          {password && confirmPassword
            ? password === confirmPassword
              ? "Passwords match"
              : "Passwords do not match"
            : ""}
        </p>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!idAvailable || !emailAvailable || password !== confirmPassword}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
