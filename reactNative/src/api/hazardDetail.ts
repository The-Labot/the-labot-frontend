import { BASE_URL } from "./config";
import { getTempAccessToken } from "./auth";

export interface HazardDetail {
  id: number;
  hazardType: string;
  reporter: string;
  location: string;
  status: string;
  urgent: boolean;
  reportedAt: string;
  description: string;
  files: { url: string }[];
}

export async function fetchHazardDetail(hazardId: number): Promise<HazardDetail> {
  const token = getTempAccessToken();
  const res = await fetch(`${BASE_URL}/manager/hazards/${hazardId}`, {
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    throw new Error("상세 조회 실패");
  }

  const json = await res.json();
  return json.data;
}