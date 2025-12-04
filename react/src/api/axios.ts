// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

/* 토큰이 필요 없는 URL 목록 */
const noAuthURLs = ["/auth/login", "/auth/signup", "/auth/refresh"];

/* 요청 인터셉터 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    const isNoAuth = noAuthURLs.some((url) =>
      config.url?.includes(url)
    );

    if (!isNoAuth && token) {
      // headers가 없으면 초기화
      config.headers = config.headers || {};

      // Authorization 추가
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* 응답 인터셉터 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    if (status === 403) {
      alert("접근 권한이 없습니다.");
    }

    return Promise.reject(error);
  }
);

export default api;
