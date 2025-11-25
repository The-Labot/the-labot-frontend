import apiClient from "./apiClient";

export interface SiteDetailResponse {
  status: number;
  message: string;
  data: any; // 필요하면 타입 정의 확장 가능
}

export const getSiteDetail = async (accessToken: string, siteId: number) => {
  return apiClient.get<SiteDetailResponse>(`/admin/sites/${siteId}`, {
    params: { siteId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
/* 🔥 현장 수정 PATCH */
export const updateSiteDetail = async (
  accessToken: string,
  siteId: number,
  body: any
) => {
  return apiClient.patch(`/admin/sites/${siteId}`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
//삭제
export const deleteSite = async (accessToken: string, siteId: number) => {
  return apiClient.delete(`/admin/sites/${siteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const addSiteManager = async (
  accessToken: string,
  siteId: number,
  body: { phoneNumber: string; name: string }
) => {
  return apiClient.post(`/admin/sites/${siteId}/manager`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};