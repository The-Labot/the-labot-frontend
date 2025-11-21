// src/api/authApi.ts
import apiClient from "./apiClient";

// ✅ 회원가입 요청 타입 (이미 있던 거 그대로)
export interface AdminSignUpRequest {
  phoneNumber: string;
  password: string;
  name: string;
  email: string;
  address: string;
}

// 공통 응답 껍데기 – 다른 API에서 계속 사용
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const signUpAdmin = (data: AdminSignUpRequest) => {
  return apiClient.post<ApiResponse<unknown>>("/auth/signup/admin", data);
};

// ✅ 로그인 요청 타입
export interface LoginRequest {
  phoneNumber: string;
  password: string;
  clientType: string; // "WEB" 또는 "APP"
}

// ✅ 실제 로그인 응답 구조에 맞춰 새로 정의
// Login response: { token: "Bearer ...", role: "ROLE_ADMIN", userId: 3, name: "박찬홍" }
export interface LoginResponse {
  token: string;   // "Bearer eyJhbGci..." 형태
  role: string;
  userId: number;
  name: string;
}

// 로그인
export const login = (data: LoginRequest) => {
  return apiClient.post<LoginResponse>("/auth/login", data);
};