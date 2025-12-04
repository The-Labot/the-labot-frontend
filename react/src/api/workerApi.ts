import api from "./axios";

//const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getWorkerList = async (siteId: number) => {
  const token = localStorage.getItem("accessToken");

  const response = await api.get(`/admin/workers/${siteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // { data: WorkerListItem[], ... }
};

export const getWorkerDetail = async (workerId: number) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.get(`/admin/workers/detail/${workerId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Bearer 포함
    },
  });

  // 응답 구조 = { status, message, data }
  return res.data.data;
};

export const getWorkerMonthlyAttendance = async (
  siteId: number,
  userId: number,
  year: number,
  month: number
) => {
  const token = localStorage.getItem("accessToken");
  
  const res = await api.get(
    `/admin/sites/${siteId}/workers/${userId}`,
    {
      params: { year, month },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data;
};