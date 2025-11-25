// src/api/worker.ts
import { BASE_URL } from './config';

// TODO: 임시 토큰 (반드시 실제 accessToken으로 바꿔야 함)
const TEMP_ACCESS_TOKEN = '여기에_JWT_토큰_문자열';

export async function registerWorker(phoneNumber: string, name: string) {
  console.log('📡 registerWorker 호출', { phoneNumber, name, BASE_URL });

  const res = await fetch(`${BASE_URL}/manager/workers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: TEMP_ACCESS_TOKEN,
    },
    body: JSON.stringify({ phoneNumber, name }),
  });

  const text = await res.text(); // 응답 전체를 일단 문자열로
  console.log('📡 /manager/workers 응답', res.status, text);

  if (!res.ok) {
    // 서버가 JSON 형태로 에러를 줄 수도 있고, 아닐 수도 있어서 두 경우 다 처리
    let msg = `status ${res.status} 오류`;
    try {
      const data = JSON.parse(text);
      if (data?.message) {
        msg = `status ${res.status} - ${data.message}`;
      }
    } catch (e) {
      // JSON 아니면 그냥 text 그대로
      if (text) msg = `status ${res.status} - ${text}`;
    }
    throw new Error(msg);
  }

  // 성공이면 text를 JSON으로 다시 파싱
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}