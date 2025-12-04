// src/api/siteManagerApi.ts
import api from "./axios";

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
    `/admin/sites/${siteId}/manager`,
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
    `/admin/sites/${siteId}/manager`,
    data,
    { headers: authHeader() }
  );

  return res.data;
};
