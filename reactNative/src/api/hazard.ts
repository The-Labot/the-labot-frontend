// src/api/hazard.ts
import { BASE_URL } from './config';
import { getTempAccessToken } from './auth';

/** 백엔드 HazardStatus(enum)에 맞춘 상태 값 */
export type HazardStatus = 'WAITING' | 'IN_PROGRESS' | 'RESOLVED';

/** 백엔드에서 내려주는 리스트 아이템 형태 */
export interface HazardListItem {
  id: number;
  hazardType: string;
  reporter: string;
  location: string;
  status: HazardStatus;
  reportedAt: string; // "28분 전"
  urgent: boolean;
}

/**
 * 위험요소 신고 목록 조회
 * GET /api/manager/hazards
 */
export async function fetchHazards(): Promise<HazardListItem[]> {
  const token = getTempAccessToken();

  if (!token) {
    throw new Error(
      '접근 토큰이 없습니다. 먼저 로그인한 다음에 다시 시도해주세요.',
    );
  }

  const res = await fetch(`${BASE_URL}/manager/hazards`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // 토큰 앞에 Bearer 붙이기
    },
  });

  if (!res.ok) {
    let msg = `status ${res.status}`;
    try {
      const err = await res.json();
      if (err?.message) msg = err.message;
    } catch {
      // 그냥 status만 보여줌
    }
    throw new Error(msg);
  }

  const body = await res.json();
  // Notion 예시 기준: { status, message, data: [...] }
  return (body.data ?? []) as HazardListItem[];
}