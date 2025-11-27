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

// =============================
// 📌 목록 조회
// =============================
export async function fetchHazards(): Promise<HazardListItem[]> {
  const token = getTempAccessToken();

  console.log("📡 [fetchHazards] 요청 →", `${BASE_URL}/manager/hazards`);

  const res = await fetch(`${BASE_URL}/manager/hazards`, {
    method: "GET",
    headers: { Authorization: token },
  });

  const text = await res.text();
  console.log("📡 [fetchHazards] 서버 Raw 응답:", text);

  try {
    const json = JSON.parse(text);
    console.log("📡 [fetchHazards] 파싱된 JSON:", json);

    console.log("📌 [fetchHazards] 최종 목록(json.data):", json.data);
    return json.data;
  } catch (e) {
    console.log("❌ [fetchHazards] JSON 파싱 실패:", e);
    throw e;
  }
}

// =============================
// 🚨 상태 변경 API (PATCH)
// =============================
export async function updateHazardStatus(
  hazardId: number,
  newStatus: 'WAITING' | 'IN_PROGRESS' | 'RESOLVED'
) {
  const token = getTempAccessToken();

  console.log(
    `📡 [updateHazardStatus] 요청 → ${BASE_URL}/manager/hazards/${hazardId}/status`,
    "payload:", { status: newStatus }
  );

  const res = await fetch(`${BASE_URL}/manager/hazards/${hazardId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  const text = await res.text();
  console.log("📡 [updateHazardStatus] 서버 Raw 응답:", text);

  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    console.log("❌ [updateHazardStatus] JSON 파싱 오류:", e);
    throw e;
  }

  console.log("📡 [updateHazardStatus] 파싱된 JSON:", json);

  if (!res.ok) {
    console.log("❌ [updateHazardStatus] 실패 응답:", json);
    throw new Error("상태 변경 실패");
  }

  return json.data;
}

// =============================
// 🚨 삭제 API
// =============================
export async function deleteHazard(hazardId: number) {
  const token = getTempAccessToken();

  console.log(
    `📡 [deleteHazard] 요청 → ${BASE_URL}/manager/hazards/${hazardId}`
  );

  const res = await fetch(`${BASE_URL}/manager/hazards/${hazardId}`, {
    method: "DELETE",
    headers: { Authorization: token },
  });

  const text = await res.text();
  console.log("📡 [deleteHazard] 서버 Raw 응답:", text);

  if (!res.ok) {
    console.log("❌ [deleteHazard] 실패 응답:", text);
    throw new Error("삭제 실패");
  }

  console.log("✅ [deleteHazard] 삭제 성공");
  return true;
}