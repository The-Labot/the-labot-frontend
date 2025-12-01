// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    "Content-Type": "application/json",
    withCredentials: false,
  },
});

// 요청 인터셉터 — 항상 accessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 — 토큰 만료 감지
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 → 인증 실패 → 로그인 페이지로 이동
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");

      localStorage.removeItem("accessToken"); // 토큰 삭제
      window.location.href = "/login"; // 강제 이동
    }
    return Promise.reject(error);
  }
);


export default api;