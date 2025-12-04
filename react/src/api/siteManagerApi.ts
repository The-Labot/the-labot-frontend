// src/api/siteManagerApi.ts
import api from "./axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/* 공통 헤더 */
const authHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/* 현장관리자 목록 조회 */
export const getSiteManagers = async (siteId: number) => {
  const res = await api.get(
    `${API_URL}/admin/sites/${siteId}/manager`,
    { headers: authHeader() }
  );

  return res.data.data;
};

/* 현장관리자 등록 */
export const createSiteManager = async (
  siteId: number,
  data: { name: string; phoneNumber: string }
) => {
  const res = await api.post(
    `${API_URL}/admin/sites/${siteId}/manager`,
    data,
    { headers: authHeader() }
  );

  return res.data;
};
