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