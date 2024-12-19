import React, { useState } from 'react';
import SignupForm from '../components/SignupForm';

export const Signup: React.FC = () => {
  const [error, setError] = useState('');

  const handleSignup = (id: string, password: string, email: string) => {
    // Mock signup logic
    console.log(`Signing up user with ID: ${id}, Email: ${email}`);
    if (id === 'error') {
      setError('An error occurred during signup. Please try again.');
    } else {
      alert('Signup successful!');
    }
  };

  const handleCheckId = (id: string): boolean => {
    // Mock ID availability check
    const unavailableIds = ['taken', 'admin', 'error'];
    return !unavailableIds.includes(id);
  };

  return (
    <div>
      <SignupForm onSignup={handleSignup} onCheckId={handleCheckId} errorMessage={error} />
    </div>
  );
};

export default Signup;