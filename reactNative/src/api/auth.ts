// src/api/auth.ts
import { BASE_URL } from './config';

export interface LoginResponse {
  accessToken?: string;
  token?: string;
  [key: string]: any;
}

/**
 * 👉 앱이 켜져 있는 동안만 유지되는 임시 토큰 저장소
 *    (AsyncStorage 안 씀)
 */
let ACCESS_TOKEN_IN_MEMORY: string | null = null;

export function setTempAccessToken(token: string) {
  ACCESS_TOKEN_IN_MEMORY = token;
}

export function getTempAccessToken(): string | null {
  return ACCESS_TOKEN_IN_MEMORY;
}

/**
 * 현장 관리자 로그인 API
 * - 성공 시: 응답 데이터를 리턴하고, accessToken을 메모리에 저장
 * - 실패 시: Error 를 throw
 */
export async function loginManager(
  phoneNumber: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneNumber,
      password,
      clientType: 'APP', // 백엔드에서 요구했던 값
    }),
  });

  if (!res.ok) {
    let message = '아이디 또는 비밀번호를 확인해주세요.';
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        message = errorData.message;
      }
    } catch {
      // 응답이 JSON이 아니면 기본 메시지 유지
    }
    throw new Error(message);
  }

  const data = (await res.json()) as LoginResponse;

  // ✅ 로그인 성공하면 토큰을 메모리에 저장
  const tokenFromServer = data.accessToken ?? data.token;
  if (tokenFromServer) {
    setTempAccessToken(tokenFromServer);
  }

  return data;
}