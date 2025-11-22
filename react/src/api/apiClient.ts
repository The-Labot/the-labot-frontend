import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, //환경에 따라 다르게 작동
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default apiClient;