// src/api/worker.ts
import { BASE_URL } from './config';
import { getTempAccessToken } from './auth';

// 🔥 JSON + 이미지 함께 보내는 multipart/form-data 방식
export async function registerWorker(workerData: any, contractImage?: any) {
  const token = getTempAccessToken();
  if (!token) throw new Error("로그인이 필요합니다.");

  const form = new FormData();

  // 1️⃣ JSON 데이터를 data에 문자열로 담기
  form.append("data", JSON.stringify(workerData));

  // 2️⃣ 이미지 파일 있으면 files에 추가
  if (contractImage) {
  const file = {
    uri: contractImage.uri.startsWith("file://")
      ? contractImage.uri
      : "file://" + contractImage.uri, // 🔥 Android 보정

    name:
      contractImage.fileName ??
      `contract_${Date.now()}.jpg`,  // 🔥 무조건 파일명 있어야 함

    type:
      contractImage.type ??
      (contractImage.uri.endsWith(".png")
        ? "image/png"
        : "image/jpeg"), // 🔥 MIME 타입 보정
  };

  console.log("📸 최종 업로드 파일:", file);

  form.append("files", file as any);
}

  console.log("📤 전송 FormData:", {
    data: workerData,
    hasFile: !!contractImage,
  });

  // 🔥🔥 FormData 실제 내부를 출력
  console.log("===== FormData 실제 내용 =====");
  (form as any)._parts?.forEach((p: any) => {
    console.log("KEY:", p[0], "VALUE:", p[1]);
  });

  const res = await fetch(`${BASE_URL}/manager/workers`, {
    method: "POST",
    headers: {
      Authorization: token,
      // ❗ Content-Type 설정 금지 (자동 설정 필요)
    },
    body: form,
  });

  const text = await res.text();
  const json = JSON.parse(text);

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
  console.log("📌 RAW TEXT:", text);

  const json = JSON.parse(text);
  console.log("📌 Detail Response PARSED:", json);

  return json.data; 
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

export async function fetchWorkerFile(fileId: number) {
  const token = getTempAccessToken();
  if (!token) throw new Error("토큰 없음");

  const res = await fetch(`${BASE_URL}/manager/workers/files/${fileId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();
  const json = JSON.parse(text);

  console.log("📄 Worker File Response:", json);

  
  return json;  // data wrapper 없이 바로 FileResponse 반환
}