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