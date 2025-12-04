// src/api/authApi.ts
import api from "axios"
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const requestTempPassword = async (name: string, phoneNumber: string) => {
  const res = await api.post(`/auth/reset-password`, {
    name,
    phoneNumber,
  });

  return res.data;
};
