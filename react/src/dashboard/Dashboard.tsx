// src/components/Dashboard.tsx
import {
  Building2,
  Users,
  Search,
  ChevronDown,
  Plus,
  LogOut,
  User,
} from "lucide-react";
import iconMain from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { getAdminDashboard } from "../api/adminSiteApi";

interface DashboardProps {
  onLogout: () => void;
  onCreateSite: () => void;
  onOpenMyPage: () => void;
  onDashBoard: () => void;
}

/* 🧩 site 구조 (백엔드 DTO 기반) */
export interface Site {
  siteId: number;
  siteName: string;
  siteAddress: string;
  managerCount: number;
  workerCount: number;
}

/* 🧩 dashboard API 응답 타입 */
interface DashboardResponse {
  totalSiteCount: number;
  activeWorkerCount: number;
  siteList: Site[];
}

export default function Dashboard({
  onLogout,
  onCreateSite,
  onOpenMyPage,
  onDashBoard,
}: DashboardProps) {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [showUserMenu, setShowUserMenu] = useState(false);

  /* 🔥 Dashboard API 호출 */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("❌ accessToken 없음");
          return;
        }

        console.log("📌 대시보드 요청 전송! token=", token);

        const data = await getAdminDashboard(token);
        console.log("📌 서버 응답 (dashboard):", data);

        setDashboard(data);
      } catch (err: any) {
        console.error("❌ 대시보드 조회 실패:", err);
      }
    };

    loadDashboard();
  }, []);

  const sites = dashboard?.siteList || [];

  /* 🔍 검색 + 필터 */
  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.siteName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesRegion =
      regionFilter === "all" || site.siteAddress.includes(regionFilter);

    return matchesSearch && matchesRegion;
  });

  /* 요약 데이터 */
  const totalSites = dashboard?.totalSiteCount ?? 0;
  const totalWorkers = dashboard?.activeWorkerCount ?? 0;

  return (
    <div className="dashboard-container">
      {/* 네비게이션 */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">
            <div className="nav-logo-box clickable" 
                onClick={onDashBoard}>
              <img src={iconMain} alt="메인 아이콘" width="200px" /> 
            </div>
            <h1 className="nav-title">현장 종합 대시보드</h1>
          </div>

          <div className="nav-right">
            <button
              className="nav-user-btn"
              onClick={() => setShowUserMenu(prev => !prev)}
>
              <div className="nav-user-icon-box">
                <User className="nav-user-icon" />
              </div>
              <span className="nav-user-text">관리자</span>
              <ChevronDown className="nav-chevron" />
            </button>

            {showUserMenu && (
              <div className="nav-menu">
                <button className="nav-menu-item" onClick={onOpenMyPage}>
                  <User className="w-4 h-4" />
                  마이페이지
                </button>
                <button onClick={onLogout} className="nav-menu-item">
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 메인 */}
      <main className="main">
        {/* 요약 카드 */}
        <div className="card-grid">
          <div className="summary-card">
            <div className="summary-icon-box blue-bg">
              <Building2 className="summary-icon blue-icon" />
            </div>
            <div className="summary-number">{totalSites}</div>
            <div className="summary-label">전체 현장</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon-box green-bg">
              <Users className="summary-icon green-icon" />
            </div>
            <div className="summary-number">
              {totalWorkers.toLocaleString()}
            </div>
            <div className="summary-label">활동 중인 근로자</div>
          </div>
        </div>

        {/* 검색/필터 */}
        <div className="toolbar">
          <div className="toolbar-left">
            <button className="btn-primary" onClick={onCreateSite}>
              <Plus className="btn-icon" />
              새 현장 추가
            </button>
          </div>

          <div className="toolbar-right">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                className="search-input"
                placeholder="현장명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <div className="table-wrapper">
          <table className="site-table">
            <thead>
              <tr>
                <th>현장명</th>
                <th>위치</th>
                <th className="text-center">관리자 수</th>
                <th className="text-center">근로자 수</th>
                <th className="text-center">현장조회</th>
                <th className="text-center">작업현황</th>
              </tr>
            </thead>

            <tbody>
  {filteredSites.map((site) => (
    <tr key={site.siteId}>
      <td>{site.siteName}</td>
      <td>{site.siteAddress}</td>

      <td className="text-center">
        {site.managerCount}명

        {/* 🔥 추가된 버튼 */}
        <button
          className="manager-button"
          onClick={() => navigate(`/site/${site.siteId}/managers`)}
        >
          관리
        </button>
      </td>
      <td className="text-center">
        {site.workerCount}명

        {/* 🔥 추가된 버튼 */}
        <button
          className="manager-button"
          onClick={() => navigate(`/site/${site.siteId}/work-management`)}
        >
          관리
        </button>
      </td>

      <td className="text-center">
        <button
          className="manager-button"
          onClick={() => navigate(`/site/${site.siteId}`)}
        >
          조회
        </button>
      </td>

      <td className="text-center">
        <button
          className="manager-button"
          onClick={() =>
            navigate(`/site/${site.siteId}/work-status`)
          }
        >
          작업현황
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>

          {filteredSites.length === 0 && (
            <div className="no-result">검색 결과가 없습니다.</div>
          )}
        </div>
      </main>
    </div>
  );
}