import axios from "axios";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../types/auth";

const API_BASE_URL = "http://localhost:5000/api/users";

export const checkId = async (username: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-id`, {
      params: { username },
    });
    return response.data.success;
  } catch (error: any) {
    return false;
  }
};

export const checkEmail = async (email: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-email`, {
      params: { email },
    });
    return response.data.success;
  } catch (error: any) {
    return false;
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axios.get<LoginResponse>(`${API_BASE_URL}/login`, {
      params: data,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to login",
    };
  }
};

export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await axios.post<SignupResponse>(
      `${API_BASE_URL}/signup`,
      null,
      {
        params: data,
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to sign up",
    };
  }
};

export const changePassword = async (
  username: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/change-password`, null, {
      params: { username, newPassword },
    });
    return response.data.success;
  } catch (error: any) {
    return false;
  }
};

export const verifyPassword = async (
  username: string,
  currentPassword: string
): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-password`, null, {
      params: { username, currentPassword },
    });
    return response.data.success;
  } catch (error: any) {
    console.error("Failed to verify password:", error);
    return false;
  }
};
