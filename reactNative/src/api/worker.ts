import { BASE_URL } from './config';
import { getTempAccessToken } from './auth';

export async function registerWorker(
  phoneNumber: string,
  name: string,
) {
  const token = getTempAccessToken();
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }

  const res = await fetch(`${BASE_URL}/manager/workers`, {
    method: 'POST',
    headers: {
      Authorization: token,   // 🚀 이미 Bearer 포함되어 있으므로 그대로 전달
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneNumber,
      name,
    }),
  });

  if (!res.ok) {
    let message = '근로자 등록 실패';
    try {
      const errorData = await res.json();
      if (errorData.message) message = errorData.message;
    } catch {}

    throw new Error(message);
  }

  return await res.json();
}