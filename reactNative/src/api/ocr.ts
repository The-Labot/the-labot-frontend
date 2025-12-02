// src/api/ocr.ts

import { BASE_URL } from "./config";
import { getTempAccessToken } from "./auth";

/* -----------------------------------------
   📌 공통: 파일 업로드 FormData 구성
   (Base64 사용 ❌ — 파일 경로(uri) 그대로 전송)
----------------------------------------- */

/**
 * 🟦 계약서 OCR 업로드
 * - 신분증 촬영과 완전히 동일한 방식
 * - uri / fileName / type 그대로 전송
 */
export async function uploadContractImage(imageAsset: any) {
  const token = getTempAccessToken();
  const formData = new FormData();

  formData.append("contractFile", {
    uri: imageAsset.uri,
    name: imageAsset.fileName || "contract.jpg",
    type: imageAsset.type || "image/jpeg",
  } as any);

  console.log("📤 계약서 업로드 시작:", imageAsset.uri);

  const res = await fetch(`${BASE_URL}/manager/register/upload-contract`, {
    method: "POST",
    headers: {
      Authorization: token,
      // ⚠️ Content-Type 자동 설정됨 (절대 직접 넣으면 안됨)
    },
    body: formData,
  });

  const text = await res.text();
  console.log("📡 계약서 OCR 응답:", text);

  if (!res.ok) {
    throw new Error(`서버 오류: ${res.status} ${text}`);
  }

  return JSON.parse(text);
}


/**
 * 🟩 신분증 OCR 업로드 (기존 정상 동작)
 * - 파일 경로로 전송 방식 유지
 */
export async function uploadIdCardImage(imageAsset: any) {
  const token = getTempAccessToken();
  const formData = new FormData();

  formData.append("file", {
    uri: imageAsset.uri,             
    name: imageAsset.fileName || "idcard.jpg",
    type: imageAsset.type || "image/jpeg",
  } as any);

  console.log("📤 신분증 업로드 시작:", imageAsset.uri);

  const res = await fetch(`${BASE_URL}/manager/register/upload-id-card`, {
    method: "POST",
    headers: {
      Authorization: token,
      // ⚠️ Content-Type 자동 설정됨
    },
    body: formData,
  });

  const text = await res.text();
  console.log("📡 신분증 OCR 응답:", text);

  if (!res.ok) {
    throw new Error(`서버 오류: ${res.status} ${text}`);
  }

  return JSON.parse(text);
}