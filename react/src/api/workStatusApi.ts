import api from "axios";

//const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getDailyReports = async (
  siteId: number,
  year: number,
  month: number,
  day: number
) => {
  const token = localStorage.getItem("accessToken");

  const res = await api.get(
    `/admin/reports/sites/${siteId}`,
    {
      params: { 
        year,
        month,
        day 
      },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data;
};

export async function getWorkReportDetail(reportId: number) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No token");

  const res = await api.get(
    `http://localhost:8080/api/admin/reports/${reportId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data;
}
