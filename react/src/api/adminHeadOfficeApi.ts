// src/api/adminHeadOfficeApi.ts
import apiClient from "./apiClient";

/* ===========================
   본사 정보 타입
=========================== */
export interface HeadOfficeData {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  representative: string;
  secretCode: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/* ===========================
   1) 본사 상세 조회 (GET)
   GET /api/admin/head-office
=========================== */
export const getHeadOffice = (accessToken: string) => {
  return apiClient.get<ApiResponse<HeadOfficeData>>(
    "/admin/head-office",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

/* ===========================
   2) 본사 정보 수정 (PUT)
   PUT /api/admin/head-office
=========================== */
export interface UpdateHeadOfficeRequest {
  name: string;
  address: string;
  phoneNumber: string;
  representative: string;
  secretCode: string;
}

export const updateHeadOffice = (
  accessToken: string,
  data: UpdateHeadOfficeRequest
) => {
  return apiClient.put<ApiResponse<HeadOfficeData>>(
    "/admin/head-office",
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
// 📌 본사 코드 재생성 API
export const regenerateHeadOfficeCode = (accessToken: string) => {
  return apiClient.get<ApiResponse<string>>(
    "/admin/head-office/secret-code",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};