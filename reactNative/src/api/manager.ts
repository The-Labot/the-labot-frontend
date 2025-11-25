import { BASE_URL } from './config';
import { getTempAccessToken } from './auth';

export async function getManagerSites() {
  const token = getTempAccessToken();
  if (!token) throw new Error("로그인이 필요합니다");

  const res = await fetch(`${BASE_URL}/manager/sites`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "현장 조회 실패");
  }

  return await res.json();
}