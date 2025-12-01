import axios from "axios";

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export async function getCoordinatesByAddress(address: string) {
  if (!address || address.trim().length < 3) return null;

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    address,
  )}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${KAKAO_API_KEY}`,
    },
  });

  const data = await res.json();

  console.log("KakaoKey:", import.meta.env.VITE_KAKAO_REST_API_KEY);

  if (!data.documents || data.documents.length === 0) return null;

  const doc = data.documents[0];

  return {
    latitude: doc.y,
    longitude: doc.x,
  };
}
