// src/api/adminSiteApi.ts
import api from "./axios";

// 🔥 본사 대시보드 조회
export const getAdminDashboard = async (accessToken: string) => {
  const res = await api.get("/admin/sites/dashboard", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data.data; // API 구조에 맞게 반환
};