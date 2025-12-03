// src/api/authApi.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const requestTempPassword = async (name: string, phoneNumber: string) => {
  const res = await axios.post(`${API_URL}/auth/reset-password`, {
    name,
    phoneNumber,
  });

  return res.data;
};
