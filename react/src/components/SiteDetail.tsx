// src/components/SiteDetail.tsx
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  GraduationCap,
  ClipboardList,
  User,
} from "lucide-react";
import { useState } from "react";
import "./SiteDetail.css";
import { WorkerManagementPanel } from "./WorkerManagementPanel";
import { SafetyTrainingPanel } from "./SafetyTrainingPanel";
import { DailyReportPanel } from "./DailyReportPanel";

interface SiteDetailProps {
  siteName: string;
  onBack: () => void;
}

interface RecentActivity {
  id: string;
  type: "safety" | "report" | "attendance";
  title: string;
  user: string;
  location: string;
  time: string;
  icon: typeof AlertTriangle;
  bgColor: string;
  iconColor: string;
}

type NavigationTab =
  | "work-status"
  | "worker-management"
  | "safety-education"
  | "work-report"
  | "my-page";

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "safety",
    title: "낙하물 위험 신고",
    user: "김철수",
    location: "2층 작업장",
    time: "6분 전",
    icon: AlertTriangle,
    bgColor: "#FEE2E2",
    iconColor: "#DC2626",
  },
  {
    id: "2",
    type: "report",
    title: "작업 일보 제출",
    user: "이영희",
    location: "A동 현장",
    time: "1분 전",
    icon: FileText,
    bgColor: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    id: "3",
    type: "attendance",
    title: "근로자 출근",
    user: "박민수",
    location: "출근 완료",
    time: "3분 전",
    icon: Users,
    bgColor: "#D1FAE5",
    iconColor: "#059669",
  },
];

export function SiteDetail({  onBack }: SiteDetailProps) {
  const [activeTab, setActiveTab] = useState<NavigationTab>("work-status");

  return (
    <div className="site-detail-container">
      {/* 왼쪽 사이드바 */}
      <aside className="site-detail-sidebar">
        {/* 로고 */}
        <div className="sidebar-logo">
          <BarChart3 className="sidebar-logo-icon" />
        </div>

        {/* 네비게이션 */}
        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveTab("work-status")}
            className={`sidebar-nav-item ${
              activeTab === "work-status" ? "active" : ""
            }`}
          >
            <BarChart3 className="sidebar-nav-icon" />
            <span className="sidebar-nav-label">작업 현황</span>
          </button>

          <button
            onClick={() => setActiveTab("worker-management")}
            className={`sidebar-nav-item ${
              activeTab === "worker-management" ? "active" : ""
            }`}
          >
            <Users className="sidebar-nav-icon" />
            <span className="sidebar-nav-label">근로자 관리</span>
          </button>

          <button
            onClick={() => setActiveTab("safety-education")}
            className={`sidebar-nav-item ${
              activeTab === "safety-education" ? "active" : ""
            }`}
          >
            <GraduationCap className="sidebar-nav-icon" />
            <span className="sidebar-nav-label">안전 교육</span>
          </button>

          <button
            onClick={() => setActiveTab("work-report")}
            className={`sidebar-nav-item ${
              activeTab === "work-report" ? "active" : ""
            }`}
          >
            <ClipboardList className="sidebar-nav-icon" />
            <span className="sidebar-nav-label">작업 일보</span>
          </button>
        </nav>

        {/* 마이페이지 버튼(하단 고정) */}
        <button
          onClick={() => setActiveTab("my-page")}
          className={`sidebar-nav-item sidebar-nav-item-bottom ${
            activeTab === "my-page" ? "active" : ""
          }`}
        >
          <User className="sidebar-nav-icon" />
          <span className="sidebar-nav-label">마이 페이지</span>
        </button>
      </aside>

      {/* 오른쪽 메인 영역 */}
      <main className="site-detail-main">
        {activeTab === "worker-management" ? (
          <WorkerManagementPanel onBack={onBack} />
        ) : activeTab === "safety-education" ? (
          <SafetyTrainingPanel />
        ) : activeTab === "work-report" ? (
          <DailyReportPanel />
        ) : activeTab === "my-page" ? (
          <div className="placeholder-panel">
            <p>마이페이지 화면은 추후 추가 예정입니다.</p>
          </div>
        ) : (
          <>
            {/* 상단 헤더 */}
            <header className="work-header">
              <div className="work-header-inner">
                <div className="work-header-left">
                  <button className="back-button" onClick={onBack}>
                    <ArrowLeft className="back-icon" />
                  </button>
                  <div>
                    <h1 className="work-title">작업 현황</h1>
                    <p className="work-subtitle">Work Status Overview</p>
                  </div>
                </div>
                <div className="work-header-right">
                  <span className="live-dot" />
                  <span className="live-text">실시간 · Live</span>
                </div>
              </div>
            </header>

            {/* 메인 컨텐츠 */}
            <div className="work-content">
              {/* 상단 카드 3개 */}
              <section className="status-card-grid">
                {/* 오늘 안전 신고 */}
                <article className="status-card status-card-danger">
                  <div className="status-card-top">
                    <div className="status-card-icon-wrap status-card-icon-danger">
                      <AlertTriangle className="status-card-icon" />
                    </div>
                    <div className="status-card-badge status-card-badge-danger">
                      긴급
                    </div>
                  </div>
                  <div className="status-card-count">3건</div>
                  <div className="status-card-label">오늘 안전 신고</div>
                  <div className="status-card-caption">
                    Today's Safety Reports
                  </div>
                </article>

                {/* 진행 중인 작업 */}
                <article className="status-card status-card-primary">
                  <div className="status-card-top">
                    <div className="status-card-icon-wrap status-card-icon-primary">
                      <FileText className="status-card-icon" />
                    </div>
                    <div className="status-card-badge status-card-badge-primary">
                      진행중
                    </div>
                  </div>
                  <div className="status-card-count">12건</div>
                  <div className="status-card-label">진행 중인 작업</div>
                  <div className="status-card-caption">Ongoing Works</div>
                </article>

                {/* 현장 근로자 */}
                <article className="status-card status-card-success">
                  <div className="status-card-top">
                    <div className="status-card-icon-wrap status-card-icon-success">
                      <Users className="status-card-icon" />
                    </div>
                    <div className="status-card-badge status-card-badge-success">
                      출근중
                    </div>
                  </div>
                  <div className="status-card-count">48명</div>
                  <div className="status-card-label">현장 근로자</div>
                  <div className="status-card-caption">Site Workers Count</div>
                </article>
              </section>

              {/* 최근 활동 */}
              <section className="recent-activities-card">
                <h2 className="section-title">최근 활동</h2>
                <div className="recent-activities-list">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="recent-activity-item">
                        <div
                          className="recent-activity-icon-wrap"
                          style={{ backgroundColor: activity.bgColor }}
                        >
                          <Icon
                            className="recent-activity-icon"
                            style={{ color: activity.iconColor }}
                          />
                        </div>
                        <div className="recent-activity-body">
                          <div className="recent-activity-title">
                            {activity.title}
                          </div>
                          <div className="recent-activity-meta">
                            {activity.user} · {activity.location}
                          </div>
                        </div>
                        <div className="recent-activity-time">
                          {activity.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 아래 2단 영역 */}
              <section className="bottom-grid">
                {/* 안전 상태 분석 */}
                <div className="bottom-card">
                  <div className="bottom-card-header">
                    <h2 className="section-title">안전 상태 분석</h2>
                    <button className="outline-button">상세보기</button>
                  </div>
                  <div className="safety-rows">
                    <div className="safety-row">
                      <span className="safety-label">고위험 구역</span>
                      <span className="safety-value safety-value-danger">
                        2개소
                      </span>
                    </div>
                    <div className="safety-row">
                      <span className="safety-label">중위험 구역</span>
                      <span className="safety-value safety-value-warning">
                        5개소
                      </span>
                    </div>
                    <div className="safety-row">
                      <span className="safety-label">안전 구역</span>
                      <span className="safety-value safety-value-success">
                        18개소
                      </span>
                    </div>
                  </div>
                </div>

                {/* 작업 진행 현황 */}
                <div className="bottom-card">
                  <div className="bottom-card-header">
                    <h2 className="section-title">작업 진행 현황</h2>
                    <button className="outline-button">상세보기</button>
                  </div>

                  <div className="progress-group">
                    <div className="progress-row">
                      <div className="progress-row-top">
                        <span className="progress-label">완료된 작업</span>
                        <span className="progress-value progress-value-success">
                          85%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill progress-fill-success"
                          style={{ width: "85%" }}
                        />
                      </div>
                    </div>

                    <div className="progress-row">
                      <div className="progress-row-top">
                        <span className="progress-label">진행 중</span>
                        <span className="progress-value progress-value-primary">
                          12%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill progress-fill-primary"
                          style={{ width: "12%" }}
                        />
                      </div>
                    </div>

                    <div className="progress-row">
                      <div className="progress-row-top">
                        <span className="progress-label">대기 중</span>
                        <span className="progress-value progress-value-muted">
                          3%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill progress-fill-muted"
                          style={{ width: "3%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}