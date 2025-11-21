// src/components/Dashboard.tsx
import {
  Building2,
  Users,
  Search,
  ChevronDown,
  Plus,
  Download,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import "./Dashboard.css";
import { SiteDetail } from "./SiteDetail";

interface DashboardProps {
  onLogout: () => void;
  onCreateSite: () => void;
  onOpenMyPage: () => void; // ✅ 추가
}

interface Site {
  id: string;
  name: string;
  location: string;
  managerCount: number;
  activeWorkers: number;
  progress: number;
  safetyStatus: "normal" | "alert" | "danger";
  lastReportDate: string;
}

const mockSites: Site[] = [
  {
    id: "1",
    name: "강남 오피스텔 신축공사",
    location: "서울 강남구",
    managerCount: 3,
    activeWorkers: 125,
    progress: 85,
    safetyStatus: "normal",
    lastReportDate: "2024-11-10",
  },
  {
    id: "2",
    name: "판교 테크노밸리 복합건물",
    location: "경기 성남시",
    managerCount: 5,
    activeWorkers: 210,
    progress: 62,
    safetyStatus: "alert",
    lastReportDate: "2024-11-09",
  },
  {
    id: "3",
    name: "인천 물류센터 건설",
    location: "인천 서구",
    managerCount: 2,
    activeWorkers: 78,
    progress: 45,
    safetyStatus: "normal",
    lastReportDate: "2024-11-10",
  },
  {
    id: "4",
    name: "부산 아파트 단지 조성",
    location: "부산 해운대구",
    managerCount: 4,
    activeWorkers: 320,
    progress: 73,
    safetyStatus: "danger",
    lastReportDate: "2024-11-08",
  },
  {
    id: "5",
    name: "대전 산업단지 개발",
    location: "대전 유성구",
    managerCount: 3,
    activeWorkers: 156,
    progress: 91,
    safetyStatus: "normal",
    lastReportDate: "2024-11-10",
  },
  {
    id: "6",
    name: "수원 복합쇼핑몰 건축",
    location: "경기 수원시",
    managerCount: 4,
    activeWorkers: 198,
    progress: 58,
    safetyStatus: "alert",
    lastReportDate: "2024-11-09",
  },
];

export default function Dashboard({
  onLogout,
  onCreateSite,
  onOpenMyPage,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [safetyFilter, setSafetyFilter] = useState("all");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const filteredSites = mockSites.filter((site) => {
    const matchesSearch = site.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion =
      regionFilter === "all" || site.location.includes(regionFilter);
    const matchesSafety =
      safetyFilter === "all" || site.safetyStatus === safetyFilter;
    return matchesSearch && matchesRegion && matchesSafety;
  });

  const totalSites = mockSites.length;
  const totalWorkers = mockSites.reduce(
    (sum, site) => sum + site.activeWorkers,
    0
  );

  if (selectedSite) {
    return (
      <SiteDetail
        siteName={selectedSite.name}
        onBack={() => setSelectedSite(null)}
      />
    );
  }

  return (
    <div className="dashboard-container">
      {/* 네비게이션 */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">
            <div className="nav-logo-box">
              <Building2 className="nav-logo-icon" />
            </div>
            <h1 className="nav-title">현장 종합 대시보드</h1>
          </div>

          <div className="nav-right">
            <button
              className="nav-user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="nav-user-icon-box">
                <User className="nav-user-icon" />
              </div>
              <span className="nav-user-text">관리자</span>
              <ChevronDown className="nav-chevron" />
            </button>

            {showUserMenu && (
              <div className="nav-menu">
                <button
                  className="nav-menu-item"
                  onClick={onOpenMyPage}         // ✅ 마이페이지 이동
                >
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

      {/* 메인 이하 기존 코드 그대로 */}
      <main className="main">
        {/* 요약 카드 2개 */}
        <div className="card-grid">
          <div className="summary-card">
            <div className="summary-icon-box blue-bg">
              <Building2 className="summary-icon blue-icon" />
            </div>
            <div className="summary-number">{totalSites}</div>
            <div className="summary-label">전체 현장</div>
            <div className="summary-updated">2분 전 업데이트</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon-box green-bg">
              <Users className="summary-icon green-icon" />
            </div>
            <div className="summary-number">
              {totalWorkers.toLocaleString()}
            </div>
            <div className="summary-label">활동 중인 근로자</div>
            <div className="summary-updated">2분 전 업데이트</div>
          </div>
        </div>

        {/* 버튼 + 검색 필터 */}
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

            <select
              className="filter-select"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="all">전체 지역</option>
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="대전">대전</option>
            </select>
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
                <th className="text-center">최근 보고</th>
                <th className="text-center">작업현황</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => (
                <tr key={site.id}>
                  <td>{site.name}</td>
                  <td>{site.location}</td>
                  <td className="text-center">{site.managerCount}명</td>
                  <td className="text-center">{site.activeWorkers}명</td>
                  <td className="text-center">{site.lastReportDate}</td>
                  <td className="text-center">
                    <button
                      className="detail-btn"
                      onClick={() => setSelectedSite(site)}
                    >
                      상세보기
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