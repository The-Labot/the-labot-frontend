console.log("🔥 education.ts loaded");
console.log("🔥 exports:", {
  getEducationList,
  getEducationDetail,
  createEducationLog
});
import { BASE_URL } from "./config";
import { getTempAccessToken } from "./auth";

export async function getEducationList() {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/educations`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  const text = await res.text();

  try {
    return JSON.parse(text);  // { data: [...], status: 200 }
  } catch {
    return text;
  }
}

export async function createEducationLog(formData: FormData) {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/educations`, {
    method: "POST",
    headers: {
      Authorization: token,
      // ❗ Content-Type 설정 절대 금지 (RN 자동 설정)
    },
    body: formData,
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
export async function getEducationDetail(id: number) {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/educations/${id}`, {
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
export async function updateEducationLog(id: number, formData: FormData) {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/educations/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      // RN은 Content-Type 넣지 말 것!
    },
    body: formData,
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
export async function deleteEducationLog(id: number) {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/educations/${id}`, {
    method: "DELETE",
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