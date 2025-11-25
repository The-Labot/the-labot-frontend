// src/api/siteManagerApi.ts
import apiClient from "./apiClient";

// 요청 body 타입
export interface CreateSiteManagerRequest {
  phoneNumber: string; // 로그인용 전화번호
  name: string;        // 현장관리자 이름
}

// 응답 타입 (문서 예시 기준)
export interface CreateSiteManagerResponse {
  message: string; // "현장관리자 계정 생성 성공"
  status: number;  // 200
}

// siteId에 해당하는 현장에 관리자 계정 생성
export const createSiteManager = (
  siteId: string | number,
  data: CreateSiteManagerRequest
) => {
  // baseURL: http://localhost:8080/api 이라고 가정
  // 최종 URL: POST http://localhost:8080/api/admin/sites/{siteId}/manager
  return apiClient.post<CreateSiteManagerResponse>(
    `/admin/sites/${siteId}/manager`,
    data
  );
};