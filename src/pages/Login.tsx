import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Context API 사용
import { LoginForm } from '../components/LoginForm';
import { login } from '../services/authService'; // 로그인 서비스 호출

export const Login: React.FC = () => {
  const [error, setError] = useState('');
  const { login: setGlobalLogin } = useAuth(); // Context에서 login 함수 가져오기
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password); // 로그인 서비스 호출
    if (!result.success) {
      setError('Invalid email or password. Please try again.');
    } else {
      setError('');
      setGlobalLogin(result.username!); // 전역 상태 업데이트
      navigate('/'); // 로그인 성공 시 메인 페이지로 이동
    }
  };

  const handleSignup = () => {
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onSignup={handleSignup}
      errorMessage={error}
    />
  );
};

export default Login;
