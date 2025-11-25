// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  // 예: VITE_API_BASE_URL = "http://localhost:8080/api"
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ✅ 요청 나가기 전에 토큰 자동으로 붙이는 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    // 로그인/회원가입 요청에는 토큰 붙이지 않음
    const noAuthNeeded =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/signup");

    if (!noAuthNeeded && token) {
      if (!config.headers) config.headers = {} as any;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;