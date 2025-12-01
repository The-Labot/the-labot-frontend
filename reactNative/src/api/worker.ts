// src/api/worker.ts
import { BASE_URL } from './config';
import { getTempAccessToken } from './auth';

// 계약 방식: "일용직" 또는 "월정제"
export async function registerWorker(workerData: any) {
  const token = getTempAccessToken();
  if (!token) throw new Error('로그인이 필요합니다.');

  const res = await fetch(`${BASE_URL}/manager/workers`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workerData),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "근로자 등록 실패");
  }
  return json;
}
// 🚀 GET /manager/workers - 근로자 목록 조회
export async function fetchWorkers() {
  const token = getTempAccessToken();
  if (!token) throw new Error("토큰 없음");

  const res = await fetch(`${BASE_URL}/manager/workers`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();

  // 🔥 전체 JSON 반환해야 res.data.totalCount 가 정상적으로 접근됨
  return JSON.parse(text);
}

export async function fetchWorkerDetail(workerId: number) {
  const token = getTempAccessToken();
  if (!token) throw new Error("토큰 없음");

  const res = await fetch(`${BASE_URL}/manager/workers/${workerId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();
  return JSON.parse(text).data; // data 객체만 반환
}
// 🚀 PATCH /api/manager/workers/{workerId} - 근로자 정보 수정
export async function updateWorker(workerId: number, payload: any) {
  const token = getTempAccessToken();
  if (!token) throw new Error("토큰 없음");

  const res = await fetch(`${BASE_URL}/manager/workers/${workerId}`, {
    method: "PATCH",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const json = JSON.parse(text);

  if (!res.ok) {
    throw new Error(json.message || "근로자 수정 실패");
  }

  return json.data; // 수정된 worker 정보 반환
}

export async function patchAttendance(attendanceId: number, payload: any) {
  const token = getTempAccessToken();
  const res = await fetch(`${BASE_URL}/manager/workers/attendance/${attendanceId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(payload),
  });

  return await res.json();
}