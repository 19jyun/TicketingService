import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: (id: string, password: string, email: string) => void; // Parent function for signup
  onCheckId: (id: string) => boolean; // Parent function for checking ID availability
  errorMessage: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onCheckId, errorMessage }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [customEmailDomain, setCustomEmailDomain] = useState('');
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

    const completeEmail = emailDomain
      ? `${email}@${emailDomain}`
      : `${email}@${customEmailDomain}`;

    onSignup(id, password, completeEmail);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Signup</h2>
      {errorMessage && <p className="form-error">{errorMessage}</p>}
      {validationError && <p className="form-error">{validationError}</p>}
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">
          ID:
          <div className="form-id-container">
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="form-input"
              required
            />
            <button type="button" onClick={handleIdCheck} className="form-button">
              Check ID
            </button>
          </div>
          {idAvailable && <p className="form-success">ID is available.</p>}
        </label>
        <label className="form-label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        </label>
        <label className="form-label">
          Email:
          <div className="form-email-container">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Your email username"
              required
            />
            <select
              value={emailDomain}
              onChange={(e) => setEmailDomain(e.target.value)}
              className="form-input"
            >
              <option value="">Select Domain</option>
              <option value="gmail.com">gmail.com</option>
              <option value="yahoo.com">yahoo.com</option>
              <option value="custom">Custom</option>
            </select>
            {emailDomain === 'custom' && (
              <input
                type="text"
                value={customEmailDomain}
                onChange={(e) => setCustomEmailDomain(e.target.value)}
                className="form-input"
                placeholder="Custom domain"
              />
            )}
          </div>
        </label>
        <button
          type="submit"
          className="form-button"
          disabled={!idAvailable || password !== confirmPassword}
        >
          Signup
        </button>
      </form>
    </div>
  );
};

export default SignupForm;