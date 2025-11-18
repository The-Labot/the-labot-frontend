import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // 백엔드 기본 주소
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default apiClient;