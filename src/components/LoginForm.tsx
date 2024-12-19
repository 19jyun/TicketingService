import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (id: string, password: string) => void;
  errorMessage?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, errorMessage }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(id, password); // 부모 컴포넌트로 로그인 이벤트 전달
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          ID:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  error: {
    color: 'red',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};