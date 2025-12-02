// src/api/ocr.ts
import { BASE_URL } from "./config";
import { getTempAccessToken } from "./auth";

export async function uploadContractImage(base64Image: string) {
  const token = getTempAccessToken();

  const formData = new FormData();

  formData.append("contractFile", {
    uri: `data:image/jpeg;base64,${base64Image}`,
    name: "contract.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${BASE_URL}/manager/register/upload-contract`, {
    method: "POST",
    headers: {
      Authorization: token,
      // ⚠️ 절대 Content-Type 넣지 말 것 (자동 설정)
    },
    body: formData,
  });

  const text = await res.text();
  return JSON.parse(text);
}

// 백엔드 요청에 맞춘 최종 버전
export async function uploadIdCardImage(imageAsset: any) {
  const token = getTempAccessToken();
  const formData = new FormData();

  // ⚠️ Base64 대신 "파일 경로(uri)"를 그대로 전달 (정확한 JPG 파일 전송)
  formData.append("file", {
    uri: imageAsset.uri,                         // file:// 경로
    name: imageAsset.fileName || "idcard.jpg",   // 파일명
    type: imageAsset.type || "image/jpeg",       // MIME 타입
  } as any);

  console.log("📤 업로드 요청 시작:", imageAsset.uri);

  const res = await fetch(`${BASE_URL}/manager/register/upload-id-card`, {
    method: "POST",
    headers: {
      Authorization: token,
      // ❌ 절대 Content-Type 직접 넣지 말 것
      // fetch가 자동으로 multipart/form-data + boundary 생성함
    },
    body: formData,
  });

  const text = await res.text();
  console.log("📡 응답:", text);

  if (!res.ok) {
    throw new Error(`서버 오류: ${res.status} ${text}`);
  }

  return JSON.parse(text);
}