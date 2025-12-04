// src/api/authApi.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const requestTempPassword = async (name: string, phoneNumber: string) => {
  const res = await axios.post(`${API_URL}/auth/reset-password`, {
    name,
    phoneNumber,
  });

  return res.data;
};
