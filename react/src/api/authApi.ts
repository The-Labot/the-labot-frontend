import apiClient from "./apiClient";

export interface AdminSignUpRequest {
  phoneNumber: string;
  password: string;
  name: string;
  email: string;
  address: string;
}

export const signUpAdmin = async (data: AdminSignUpRequest) => {
  return apiClient.post("/auth/signup/admin", data);
};