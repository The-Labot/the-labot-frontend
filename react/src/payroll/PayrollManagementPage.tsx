import {
  User,
  ChevronDown,
  LogOut,
  DollarSign
} from "lucide-react";
import iconMain from "../assets/logo.png";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../workStatus/WorkStatus.css";
import { getWorkersBySite, createMonthlyPayroll, deleteMonthlyPayroll } from "../api/payrollApi";
import WorkerAttendanceModal from "./WorkerAttendanceModal";
import WorkerPayrollDetailModal from "./WorkerPayrollDetailModal";

export default function PayrollManagementPage() {
  const navigate = useNavigate();
  const { siteId } = useParams();
  
  const [showUserMenu, setShowUserMenu] = useState(false);

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달
  // 선택된 workerId 저장
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);

  // 모달 상태
  const [selectedWorker, setSelectedWorker] = useState<{
  workerId: number;
  workerName: string;
  } | null>(null);
  
  const [selectedPayroll, setSelectedPayroll] = useState<{
  payrollId: number;
  workerId: number;
  workerName: string;
  } | null>(null);

  // 근로자 리스트 로딩 (딱 이것만!)
  const loadWorkers = async () => {
    if (!siteId) return;

    setLoading(true);
    try {
      const data = await getWorkersBySite(Number(siteId), year, month);
      console.log("근로자 리스트:", data);
      setWorkers(data || []);
    } catch (err) {
      console.error("근로자 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, [siteId, year, month]);

  // 체크박스 핸들러
  const toggleWorkerSelection = (workerId: number) => {
  setSelectedWorkers((prev) =>
    prev.includes(workerId)
      ? prev.filter((id) => id !== workerId)
      : [...prev, workerId]
  );
  };
  
  // 임금 생성 핸들러
  const handleCreateSelectedPayroll = async () => {
  if (selectedWorkers.length === 0) {
    alert("선택된 근로자가 없습니다.");
    return;
  }

  if (!confirm(`${selectedWorkers.length}명의 근로자 임금을 생성할까요?`)) return;

  try {
    await createMonthlyPayroll(Number(siteId), year, month, selectedWorkers);
    alert("선택 임금 생성 완료!");
    setSelectedWorkers([]); // 선택 초기화
    loadWorkers();
  } catch (err) {
    console.error(err);
    alert("임금 생성 실패");
  }
  };

  // 임금 삭제 핸들러
  const handleDeleteSelectedPayroll = async () => {
    if (selectedWorkers.length === 0) {
      alert("삭제할 근로자를 선택해주세요.");
      return;
    }

    if (!confirm(`${selectedWorkers.length}명의 급여를 삭제하시겠습니까?`)) return;

    try {
      await deleteMonthlyPayroll(Number(siteId), year, month, selectedWorkers);
      alert("선택한 급여가 삭제되었습니다.");

      setSelectedWorkers([]); // 선택 초기화
      loadWorkers(); // 목록 새로고침
    } catch (err) {
      console.error("임금 삭제 실패:", err);
      alert("임금 삭제 중 오류가 발생했습니다.");
    }
  };

  // 근로자 전체 선택 핸들러
  const handleSelectAll = (checked: boolean) => {
  if (checked) {
    setSelectedWorkers(workers.map((w) => w.workerId)); // 전체 추가
  } else {
    setSelectedWorkers([]); // 전체 해제
  }
  };

  return (
    <div className="common">
      {/* 네비게이션 */}
      <nav className="nav-bar">
        <div className="nav-inner">
          <div className="nav-left">

            <div
              className="nav-logo-box clickable"
              onClick={() => navigate(`/dashboard`)}
            >
              <img src={iconMain} alt="메인 아이콘" width="120px" />
            </div>

            <h1 className="nav-title">임금관리</h1>

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
              >
                근로자관리
              </span>

              <span
                className="nav-link"
                style={{ color: "#111", textDecoration: "underline" }}
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
              <span className="nav-user-text">
                관리자
              </span>
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

       <div className="work-status-wrapper">

      {/* ===== 섹션 ===== */}
      <section className="section-block">

        {/* 제목 */}
        <div className="title-inner">
          <div className="title-left">
            <div className="title-logo-box">
              <DollarSign className="title-logo-icon" />
            </div>
            <h1 className="title-text">임금 목록</h1>
          </div>
        </div>

        {/* 필터 */}
        <div className="report-header" style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <select
              className="date-filter"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {Array.from({ length: 6 }).map((_, i) => {
                const y = today.getFullYear() - 3 + i;
                return (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                );
              })}
            </select>

            <select
              className="date-filter"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}월
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
            <button className="small-btn-create" onClick={handleCreateSelectedPayroll}>
              임금 생성
            </button>

            <button className="small-btn-delete" onClick={handleDeleteSelectedPayroll}>
              임금 삭제
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <table className="ws-table">
          <thead>
            <tr>
              <th>
                <input
                type="checkbox"
                checked={selectedWorkers.length === workers.length && workers.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>번호</th>
              <th>이름</th>
              <th>생년월일</th>
              <th>근로형태</th>
              <th>단가</th>
              <th>총 공수</th>
              <th>총 지급액</th>
              <th>공제합계</th>
              <th>실지급액</th>
              <th>기능</th>
            </tr>
          </thead>

          <tbody>
              {workers.map((w, index) => (
                <tr key={w.workerId}>
                  {/* 체크박스 */}
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedWorkers.includes(w.workerId)}
                      onChange={() => toggleWorkerSelection(w.workerId)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{w.workerName}</td>
                  <td>{w.birthDate}</td>
                  <td>{w.wageType}</td>
                  <td>{w.unitPrice?.toLocaleString() ?? "-"}</td>
                  <td>{w.totalManHour ?? 0}</td>
                  <td>{w.totalAmount?.toLocaleString() ?? "-"}</td>
                  <td>{w.totalDeductions?.toLocaleString() ?? "-"}</td>
                  <td className="blue-text">
                    {w.netPay?.toLocaleString() ?? "-"}
                  </td>
                  <td style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="small-btn"
                    onClick={() => setSelectedWorker({
                      workerId: w.workerId,
                      workerName: w.workerName
                    })}
                  >
                    출역내역
                  </button>

                  <button
                    className="small-btn secondary"
                    onClick={() => {
                      if (!w.payrollId) {
                        alert("해당 근로자의 급여가 아직 생성되지 않았습니다.");
                        return;
                      }

                      setSelectedPayroll({
                        payrollId: w.payrollId,
                        workerId: w.workerId,
                        workerName: w.workerName
                      });
                    }}
                  >
                    급여상세
                  </button>
                </td>

                </tr>
              ))}
            </tbody>

        </table>
      </section>

      {/* ===== 모달 ===== */}
      {selectedWorker && (
        <WorkerAttendanceModal
          workerId={selectedWorker.workerId}
          workerName={selectedWorker.workerName}
          siteId={Number(siteId)}
          year={year}
          month={month}
          onClose={() => setSelectedWorker(null)}
        />
      )}

      {selectedPayroll && (
        <WorkerPayrollDetailModal
          payrollId={selectedPayroll.payrollId}
          workerId={selectedPayroll.workerId}
          workerName={selectedPayroll.workerName}
          siteId={Number(siteId)}
          year={year}
          month={month}
          onClose={() => setSelectedPayroll(null)}
        />
      )}
    </div>
    </div>
   
  );
}
