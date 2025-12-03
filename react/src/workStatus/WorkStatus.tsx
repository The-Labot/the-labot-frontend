// src/components/WorkStatus.tsx
import {
  User,
  ChevronDown,
  LogOut,
  BookText,
  ClipboardList,
  Wrench,
  Package,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WorkReportDetailModal from "./WorkReportDetailModal";
import "./WorkStatus.css";
import iconMain from "../assets/logo.png";

interface WorkStatusProps {
  onLogout: () => void;
  onOpenMyPage: () => void;
  onDashBoard: () => void;
}

import {
  getDailyReports,       // ★ 날짜 기반 작업일보 조회 API
  getWorkReportDetail,   // 상세 조회 API
} from "../api/workStatusApi";

export default function WorkStatus({
  onLogout,
  onOpenMyPage,
  onDashBoard
}: WorkStatusProps) {
  const navigate = useNavigate();
  const { siteId } = useParams();

  // 날짜 필터: 기본 현재 날짜
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());

  const [showUserMenu, setShowUserMenu] = useState(false);

  // 작업일보 목록
  const [reports, setReports] = useState<any[]>([]);

  // 상세 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportDetail, setReportDetail] = useState<any | null>(null);

  // ========================================
  // 선택된 날짜 기준 작업일보 조회
  // ========================================
  const loadReports = async () => {
    if (!siteId) return;

    try {
      const data = await getDailyReports(Number(siteId), year, month, day);
      setReports(data || []);
    } catch (err) {
      console.error("작업일보 조회 실패:", err);
    }
  };

  // 날짜 변경 → 자동 조회
  useEffect(() => {
    loadReports();
  }, [siteId, year, month, day]);

  // ========================================
  // 상세 조회
  // ========================================
  useEffect(() => {
    if (!selectedReportId) return;

    const fetchDetail = async () => {
      try {
        const detail = await getWorkReportDetail(selectedReportId);
        setReportDetail(detail);
      } catch (err) {
        console.error("작업일보 상세 조회 실패:", err);
      }
    };

    fetchDetail();
  }, [selectedReportId]);

  const openModal = (id: number) => {
    setSelectedReportId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReportId(null);
    setReportDetail(null);
  };

  // ========================================
  // 장비/자재 누적
  // ========================================
  const allEquipments = reports.flatMap((r) =>
    r.equipmentList.map((e: any) => ({
      ...e,
      workType: r.workType,
      workLocation: r.workLocation,
    }))
  );

  const allMaterials = reports.flatMap((r) =>
    r.materialList.map((m: any) => ({
      ...m,
      workType: r.workType,
      workLocation: r.workLocation,
    }))
  );

  return (
    <div className="common">
      {/* ================= 네비게이션 ================= */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">
            <div
              className="nav-logo-box clickable"
              onClick={() => navigate(`/dashboard`)}
            >
              <img src={iconMain} alt="메인 아이콘" width="200px" />
            </div>

            <h1 className="nav-title">작업 현황</h1>

            {/* 탭 이동 */}
            <div className="nav-links">
              <span
                className="nav-link"
                style={{ textDecoration: "underline", color: "#111" }}
                onClick={() => navigate(`/site/${siteId}/work-status`)}
              >
                작업현황
              </span>
              <span
                className="nav-link"
                onClick={() => navigate(`/site/${siteId}/work-management`)}
              >
                근로자관리
              </span>
              <span
                className="nav-link"
                onClick={() => navigate(`/site/${siteId}/payroll`)}
              >
                임금관리
              </span>
            </div>
          </div>

          {/* 사용자 메뉴 */}
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
                  onClick={() => navigate(`/mypage`)}
                >
                  <User className="w-4 h-4" />
                  마이페이지
                </button>

                <button
                  className="nav-menu-item"
                  onClick={() => navigate(`/login`)}
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ================= 본문 ================= */}
      <div className="work-status-wrapper">

        {/* 날짜 필터 */}
        <section className="section-block">
          <div className="title-inner">
            <h1 className="title-text">날짜 선택</h1>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <select className="date-filter" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {Array.from({ length: 6 }).map((_, i) => {
                const y = today.getFullYear() - 3 + i;
                return <option key={y} value={y}>{y}년</option>;
              })}
            </select>

            <select className="date-filter" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}월</option>
              ))}
            </select>

            <select className="date-filter" value={day} onChange={(e) => setDay(Number(e.target.value))}>
              {Array.from({ length: 31 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}일</option>
              ))}
            </select>

            <button className="small-btn" onClick={loadReports}>
              조회
            </button>
          </div>
        </section>

        {/* ========= 작업 상황 요약 ========= */}
        <section className="section-block">
          <div className="title-inner">
            <div className="title-left">
              <div className="title-logo-box">
                <ClipboardList className="title-logo-icon" />
              </div>
              <h1 className="title-text">작업 상황 요약</h1>
            </div>
          </div>

          <table className="ws-table">
            <thead>
              <tr>
                <th>공종명</th>
                <th>인원</th>
                <th>위치</th>
                <th>작업 내용</th>
                <th>특이사항</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.workType}</td>
                  <td>{r.workerCount}명</td>
                  <td>{r.workLocation}</td>
                  <td>{r.todayWork}</td>
                  <td>{r.specialNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ========= 장비 ========= */}
        <section className="section-block">
          <div className="title-inner">
            <div className="title-left">
              <div className="title-logo-box">
                <Wrench className="title-logo-icon" />
              </div>
              <h1 className="title-text">사용 장비</h1>
            </div>
          </div>

          <table className="ws-table">
            <thead>
              <tr>
                <th>공종</th>
                <th>위치</th>
                <th>장비명</th>
                <th>규격</th>
                <th>사용시간</th>
                <th>대수</th>
                <th>업체</th>
              </tr>
            </thead>
            <tbody>
              {allEquipments.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.workType}</td>
                  <td>{e.workLocation}</td>
                  <td>{e.equipmentName}</td>
                  <td>{e.spec}</td>
                  <td>{e.usingTime}</td>
                  <td>{e.count}</td>
                  <td>{e.vendorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ========= 자재 ========= */}
        <section className="section-block">
          <div className="title-inner">
            <div className="title-left">
              <div className="title-logo-box">
                <Package className="title-logo-icon" />
              </div>
              <h1 className="title-text">사용 자재</h1>
            </div>
          </div>

          <table className="ws-table">
            <thead>
              <tr>
                <th>공종</th>
                <th>위치</th>
                <th>자재명</th>
                <th>규격·수량</th>
                <th>반입시간</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {allMaterials.map((m, idx) => (
                <tr key={idx}>
                  <td>{m.workType}</td>
                  <td>{m.workLocation}</td>
                  <td>{m.materialName}</td>
                  <td>{m.specAndQuantity}</td>
                  <td>{m.importTime}</td>
                  <td>{m.exportDetail || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ========= 작업일보 카드 목록 ========= */}
        <section className="section-block">
          <div className="section-header">
            <div className="title-left">
              <div className="title-logo-box">
                <BookText className="title-logo-icon" />
              </div>
              <h1 className="title-text">작업일보 목록</h1>
            </div>
          </div>

          <div className="report-list">
            {reports.map((r) => (
              <div
                key={r.id}
                className="report-card"
                onClick={() => openModal(r.reportId)}
              >
                <div className="rc-row">
                  <span className="rc-label">공종:</span>
                  <span>{r.workType}</span>
                </div>

                <div className="rc-row">
                  <span className="rc-label">작업내용:</span>
                  <span>{r.todayWork}</span>
                </div>

                <div className="rc-row">
                  <span className="rc-label">작성일:</span>
                  <span>{r.createdAt.substring(0, 10)}</span>
                </div>

                <div className="rc-row">
                  <span className="rc-label">특이사항:</span>
                  <span>{r.specialNote}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ================= 모달 ================= */}
      {isModalOpen && selectedReportId && (
        <WorkReportDetailModal
          reportId={selectedReportId}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
