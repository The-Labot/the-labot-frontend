// src/api/reports.ts
import { BASE_URL } from "./config";
import { getTempAccessToken } from "./auth";

// ------------------------------
// Daily Report 생성 (POST)
// ------------------------------
export async function createDailyReport(reportData: any) {
  const token = getTempAccessToken();

  console.log("📤 작업일보 POST 요청 데이터:", reportData);

  const res = await fetch(`${BASE_URL}/manager/reports`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportData),
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ------------------------------
// Daily Report 목록 조회 (GET)
// ------------------------------
export async function getDailyReportList() {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/reports`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ------------------------------
// Daily Report 상세 조회 (GET)
// ------------------------------
export async function getDailyReportDetail(id: number) {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/reports/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
// 작업일보 수정 (PUT)
export async function updateDailyReport(id: number, payload: any) {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/reports/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// 작업일보 삭제 (DELETE)
export async function deleteDailyReport(id: number) {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/reports/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    }
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}