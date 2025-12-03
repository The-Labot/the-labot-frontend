import {
  User,
  ChevronDown,
  LogOut,
  Users as UsersIcon,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import iconMain from "../assets/logo.png";
import "../workStatus/WorkStatus.css"; // 기존 스타일 그대로 사용

import { getWorkerList } from "../api/workerApi";
import WorkerDetailModal from "./WorkerDetailModal";

import type { WorkerListItem } from "./Worker";

export default function WorkerManagementPage() {
  const navigate = useNavigate();
  const { siteId } = useParams();

  const [showUserMenu, setShowUserMenu] = useState(false);

  // 근로자 리스트
  const [workers, setWorkers] = useState<WorkerListItem[]>([]);

  // 상세 모달 상태
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);

  // 근로자 목록 불러오기
  useEffect(() => {
    if (!siteId) return;
    loadWorkers();
  }, [siteId]);

  const loadWorkers = async () => {
    try {
      const res = await getWorkerList(Number(siteId));
      setWorkers(res.data);
    } catch (err) {
      console.error("근로자 목록 조회 실패:", err);
    }
  };


  
  return (
    <div className="common">

      {/* 네비게이션 */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">

            <div className="nav-logo-box clickable" 
                  onClick={() => navigate(`/dashboard`)}
            >
              <img src={iconMain} alt="메인 아이콘" width="200px" />
            </div>

            <h1 className="nav-title">근로자 관리</h1>

            <div className="nav-links">
              <span
                className="nav-link"
                onClick={() => navigate(`/site/${siteId}/work-status`)}
              >
                작업현황
              </span>

              <span
                className="nav-link"
                onClick={() => navigate(`/site/${siteId}/work-management`)}
                style={{ color: "#111", textDecoration: "underline" }}
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

          {/* 우측 사용자 메뉴 */}
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
                <button className="nav-menu-item" onClick={() => navigate(`/mypage`)}>
                  <User className="w-4 h-4" />
                  마이페이지
                </button>

                <button className="nav-menu-item" onClick={() => navigate(`/login`)}>
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 본문 */}
      <div className="work-status-wrapper">

        {/* 근로자 목록 카드 */}
        <section className="section-block">
          <div className="title-inner">
            <div className="title-left">
              <div className="title-logo-box">
                <UsersIcon className="title-logo-icon" />
              </div>
              <h1 className="title-text">근로자 목록</h1>
            </div>
          </div>

          <table className="ws-table">
            <thead>
              <tr>
                <th>#</th>
                <th>이름</th>
                <th>현장명</th>
                <th>직종</th>
                <th>상태</th>
                <th>전화번호</th>
                <th>계약형태</th>
                <th>단가(급여)</th>
              </tr>
            </thead>

            <tbody>
              {workers.map((w, index) => (
                <tr
                  key={w.workerId}
                  onClick={() => setSelectedWorkerId(w.workerId)}
                >
                  <td>{index + 1}</td>
                  <td>{w.name}</td>
                  <td>{w.siteName}</td>
                  <td>{w.position}</td>
                  <td>{w.status}</td>
                  <td>{w.phone}</td>
                  <td>{w.contractType}</td>
                  <td>{Number(w.salary).toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>

      {/* 상세보기 모달 */}
      {selectedWorkerId && (
        <WorkerDetailModal
          workerId={selectedWorkerId}
          siteId={Number(siteId)}   // <-- 추가
          onClose={() => setSelectedWorkerId(null)}
        />
      )}
    </div>
  );
}
