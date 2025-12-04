// src/api/authApi.ts
import api from "./axios"

export const requestTempPassword = async (name: string, phoneNumber: string) => {
  const res = await api.post(`/auth/reset-password`, {
    name,
    phoneNumber,
  });

  return res.data.data;
};
