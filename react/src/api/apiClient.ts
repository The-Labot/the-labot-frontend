// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 예: http://localhost:8080/api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ✅ 요청 나가기 전에 토큰 자동으로 붙이는 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // 로그인 시 저장한 토큰 ("Bearer ...")

    if (token) {
      // headers가 없으면 우선 any로 빈 객체 생성
      if (!config.headers) {
        config.headers = {} as any;
      }

      // 타입스크립트 때문에 any로 한 번 캐스팅해서 사용
      const headers = config.headers as any;
      headers.Authorization = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;