import api from "axios";

const API_URL = "http://localhost:8080/api";

export const getWorkerList = async (siteId: number) => {
  const token = localStorage.getItem("accessToken");

  const response = await api.get(`${API_URL}/admin/workers/${siteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // { data: WorkerListItem[], ... }
};

export const getWorkerDetail = async (workerId: number) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.get(`${API_URL}/admin/workers/detail/${workerId}`, {
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
    `${API_URL}/admin/sites/${siteId}/workers/${userId}`,
    {
      params: { year, month },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data;
};