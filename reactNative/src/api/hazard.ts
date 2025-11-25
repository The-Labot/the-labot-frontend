// src/api/hazard.ts
import { BASE_URL } from "./config";
import { getTempAccessToken } from "./auth";

export interface HazardListItem {
  id: number;
  hazardType: string;
  reporter: string;
  location: string;
  urgent: boolean;
  reportedAt: string;
  status: 'WAITING' | 'IN_PROGRESS' | 'RESOLVED';
}

export async function fetchHazards(): Promise<HazardListItem[]> {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/hazards`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();
  const json = JSON.parse(text);

  return json.data;
}
// 🚨 DELETE /api/manager/hazards/{hazardId}
// DELETE /api/manager/hazards/{hazardId}
export async function deleteHazard(hazardId: number) {
  const token = getTempAccessToken(); 
  if (!token) throw new Error("토큰 없음");

  const res = await fetch(
    `${BASE_URL}/manager/hazards/${hazardId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.log("삭제 실패 응답:", text);
    throw new Error("삭제 실패");
  }

  return true;
}