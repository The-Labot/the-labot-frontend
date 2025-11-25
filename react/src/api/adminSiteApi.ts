// src/api/adminSiteApi.ts
import api from "./axios";

export const getAdminDashboard = async (accessToken: string) => {
  const res = await api.get("/admin/sites/dashboard", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.data; // API 구조에 맞게 반환
};