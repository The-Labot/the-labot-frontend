import api from "./axios";

export interface CreateHeadOfficeRequest {
  name: string;
  address: string;
  phoneNumber: string;
  representative: string;
}

export interface HeadOfficeData {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  representative: string;
  secretCode: string;
}

// 공통 응답형
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export type CreateHeadOfficeResponse = ApiResponse<HeadOfficeData>;

export const createHeadOffice = (data: CreateHeadOfficeRequest) => {
  return api.post<CreateHeadOfficeResponse>("/admin/head-office", data);
};

export interface CheckHeadOfficeRequest {
  secretCode: string;
}

export const checkHeadOffice = (data: CheckHeadOfficeRequest) => {
  return api.post<ApiResponse<HeadOfficeData>>(
    "/admin/head-office/select",
    data
  );
};

export interface HeadOfficeExistsResponse {
  hasHeadOffice: boolean;
}

export const checkHeadOfficeExists = () => {
  return api.get<ApiResponse<HeadOfficeExistsResponse>>(
    "/admin/head-office/exists"
  );
};