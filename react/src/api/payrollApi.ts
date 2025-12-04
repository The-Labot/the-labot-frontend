import api from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getWorkersBySite = async (
  siteId: number,
  year: number,
  month: number
) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.get(`${API_URL}/admin/sites/${siteId}/payrolls`, {
    params: { year, month },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("근로자 리스트:", res.data.data);

  return res.data.data;
};

export const getMonthlyPayroll = async (
  siteId: number,
  year: number,
  month: number
) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.get(`${API_URL}/admin/sites/${siteId}/payrolls`, {
    params: { year, month },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("API 응답 전체:", res);
  console.log("API 응답 data:", res.data);
  console.log("API 데이터 필드:", res.data.data);

  return res.data.data; // payroll 리스트
};

// ⭐ 월별 임금 자동 생성
export const createMonthlyPayroll = async (
  siteId: number,
  year: number,
  month: number,
  workerIds: number[]
) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.post(
    `${API_URL}/admin/sites/${siteId}/payrolls/create`,
    { 
      year, 
      month,
      workerIds
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// 임금 삭제
export const deleteMonthlyPayroll = async (
  siteId: number,
  year: number,
  month: number,
  workerIds: number[]
) => {
  const token = localStorage.getItem("accessToken");

  return api.post(
    `${API_URL}/admin/sites/${siteId}/payrolls/delete`,
    {
      year,
      month,
      workerIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// 출역 내역 조회
export const getAttendanceMonthly = async (
  siteId: number,
  workerId: number,
  year: number,
  month: number
) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.get(
    `${API_URL}/admin/sites/${siteId}/workers/${workerId}/manHour`,
    {
      params: { year, month },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.data.records; // [{ date: "2025-02-01", manHour: 6.5 }, ... ]
};

// 임금 상세 조회
export const getPayrollDetail = async (
  payrollId: number,
  siteId: number,
  workerId: number,
  ) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.get(
    `${API_URL}/admin/sites/${siteId}/payrolls/${workerId}/${payrollId}`, 
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;  // PayrollInsuranceResponse 형태
};

export const updatePayrollDetail = async (
  payrollId: number,
  siteId: number,
  payload: any
) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.patch(
    `${API_URL}/admin/sites/${siteId}/payrolls/${payrollId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};