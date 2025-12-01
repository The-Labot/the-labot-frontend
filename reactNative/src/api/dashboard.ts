// src/api/dashboard.ts
import { BASE_URL } from "./config";
import { getTempAccessToken } from "./auth";

export interface DashboardSummary {
  todayHazardCount: number;
  ongoingWorkCount: number;
  workerCount: number;
}

export interface DashboardActivity {
  id: number;
  type: "REPORT" | "HAZARD" | "ATTENDANCE";
  title: string;
  description: string;
  timeAgo: string;
  status: string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  activities: DashboardActivity[];
}

export async function fetchDashboard(): Promise<DashboardResponse> {
  const token = getTempAccessToken();

  const res = await fetch(`${BASE_URL}/manager/dashboard`, {
    method: "GET",
    headers: { Authorization: token },
  });

  const text = await res.text();
  const json = JSON.parse(text);
  return json.data;
}