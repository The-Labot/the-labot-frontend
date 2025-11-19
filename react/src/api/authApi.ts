// src/api/authApi.ts
import apiClient from "./apiClient";

// ✅ 회원가입 요청 타입 (이미 있다면 그대로 사용)
export interface AdminSignUpRequest {
  phoneNumber: string;
  password: string;
  name: string;
  email: string;
  address: string;
}

// 공통 응답 껍데기
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// 회원가입
export const signUpAdmin = (data: AdminSignUpRequest) => {
  return apiClient.post<ApiResponse<unknown>>("/auth/signup/admin", data);
};

// ✅ 로그인 요청/응답 타입
export interface LoginRequest {
  phoneNumber: string;
  password: string;
  clientType: string; // "WEB" 또는 "APP"
}

// 백엔드 응답 구조 정확히 몰라서 느슨하게 any 사용
export type LoginResponse = ApiResponse<any>;

// 로그인
export const login = (data: LoginRequest) => {
  return apiClient.post<LoginResponse>("/auth/login", data);
};