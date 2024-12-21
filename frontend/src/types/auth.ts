// types/auth.ts

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  success: boolean;
  username?: string; // 로그인 성공 시 반환
  error?: string; // 로그인 실패 시 반환
}

// 회원가입 요청 타입
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// 회원가입 응답 타입
export interface SignupResponse {
  success: boolean;
  message?: string; // 회원가입 성공 시 반환
  error?: string; // 회원가입 실패 시 반환
}
