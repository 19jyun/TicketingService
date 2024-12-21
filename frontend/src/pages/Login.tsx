import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoginForm } from "../components/LoginForm";
import { login } from "../services/authService";
import { LoginRequest } from "../types/auth";

export const Login: React.FC = () => {
  const [error, setError] = useState("");
  const { login: setGlobalLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest) => {
    const result = await login(data);
    if (!result.success) {
      setError(result.error || "Login failed.");
    } else {
      setError("");
      setGlobalLogin(result.username!);
      navigate("/");
    }
  };

  return (
    <LoginForm
      onLogin={handleLogin}
      onSignup={() => navigate("/signup")}
      errorMessage={error}
    />
  );
};

export default Login;
