import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import { signup, checkId, checkEmail } from "../services/authService";
import { SignupRequest } from "../types/auth";

export const Signup: React.FC = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (data: SignupRequest) => {
    const result = await signup(data);
    if (!result.success) {
      setError(result.error || "Signup failed.");
    } else {
      setError("");
      alert("Signup successful!");
      navigate("/login");
    }
  };

  const handleCheckId = async (username: string): Promise<boolean> => {
    return await checkId(username);
  };

  const handleCheckEmail = async (email: string): Promise<boolean> => {
    return await checkEmail(email);
  };

  return (
    <SignupForm
      onSignup={handleSignup}
      onCheckId={handleCheckId}
      onCheckEmail={handleCheckEmail}
      errorMessage={error}
    />
  );
};

export default Signup;
