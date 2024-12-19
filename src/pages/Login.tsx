import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { LoginForm } from '../components/LoginForm';

export const Login: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (id: string, password: string) => {
    const isValidUser = await login(id, password); // authService의 login 함수 호출
    if (!isValidUser) {
      setError('Invalid ID or password. Please try again.');
    } else {
      setError('');
      navigate('/'); // 로그인 성공 후 리디렉션
    }
  };

  return <LoginForm onLogin={handleLogin} errorMessage={error} />;
};