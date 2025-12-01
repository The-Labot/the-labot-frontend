import { useEffect, useState } from "react";
import { getWorkerDetail, getWorkerMonthlyAttendance } from "../api/workerApi";
import "../workStatus/WorkStatus.css";
import "./WorkerDetailModal.css"

interface WorkerDetailProps {
  workerId: number;
  siteId: number;     // <-- 추가
  onClose: () => void;
}


export default function WorkerDetailModal({ workerId, siteId, onClose }: WorkerDetailProps) {
  const [worker, setWorker] = useState<any | null>(null);
  const [monthlyData, setMonthlyData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // 기본 필터: 현재 연도/월
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    loadDetail();
  }, [workerId]);

  const loadDetail = async () => {
    try {
      const data = await getWorkerDetail(workerId);

      console.log("=== getWorkerDetail 응답 ===");
    console.log(JSON.stringify(data, null, 2));

      setWorker(data);
    } catch (err) {
      console.error("상세 조회 실패:", err);
    }
  };

  // 월간 근태조회
  useEffect(() => {
    if (!worker) return; // worker 먼저 로드되어야 가능
    loadMonthlyAttendance();
  }, [worker, year, month]);

  const loadMonthlyAttendance = async () => {

    if (!siteId) {
      console.error("siteId 없음 → 월간 근태 조회 불가");
      return;
    }

    try {
      const res = await getWorkerMonthlyAttendance(
        siteId,
        workerId,
        year,
        month
      );
      setMonthlyData(res);
    } catch (err) {
      console.error("월간 근태 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!worker) {
    return (
      <div className="detail-overlay">
        <div className="detail-panel">
          <p>로딩중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="full-overlay" onClick={onClose}>
      <div className="full-panel" onClick={(e) => e.stopPropagation()}>
        <button className="full-close" onClick={onClose}>×</button>

        <h2 className="detail-title">{worker.name} 상세정보</h2>


        {/* ----------------------------- */}
        {/* 1. 기본 정보 */}
        {/* ----------------------------- */}
        <h3 className="detail-subtitle">기본 정보</h3>
        <table className="detail-table">
          <tbody>
            <tr>
              <th>이름</th><td>{worker.name}</td>
              <th>연락처</th><td>{worker.phone}</td>
            </tr>
            <tr>
              <th>생년월일</th><td>{worker.birthDate}</td>
              <th>성별</th><td>{worker.gender}</td>
            </tr>
            <tr>
              <th>주소</th><td colSpan={3}>{worker.address}</td>
            </tr>
            <tr>
              <th>비상연락처</th><td>{worker.emergencyNumber}</td>
              <th>국적</th><td>{worker.nationality}</td>
            </tr>
          </tbody>
        </table>


        {/* ----------------------------- */}
        {/* 2. 근무 정보 */}
        {/* ----------------------------- */}
        <h3 className="detail-subtitle">근무 정보</h3>
        <table className="detail-table">
          <tbody>
            <tr>
              <th>현장명</th><td>{worker.siteName || "-"}</td>
              <th>직종</th><td>{worker.position}</td>
            </tr>
            <tr>
              <th>계약 형태</th><td>{worker.contractType}</td>
              <th>단가</th>
              <td>{Number(worker.salary).toLocaleString()}원</td>
            </tr>
            <tr>
              <th>급여 적용 시작일</th><td>{worker.wageStartDate}</td>
              <th>급여 적용 종료일</th><td>{worker.wageEndDate}</td>
            </tr>
            <tr>
              <th>급여 수령일</th><td>매달 {worker.payReceive} 일</td>
            </tr>
          </tbody>
        </table>


        {/* ----------------------------- */}
        {/* 3. 계좌 정보 */}
        {/* ----------------------------- */}
        <h3 className="detail-subtitle">계좌 정보</h3>
        <table className="detail-table">
          <tbody>
            <tr>
              <th>은행명</th><td>{worker.bankName}</td>
              <th>계좌번호</th><td>{worker.accountNumber}</td>
            </tr>
            <tr>
              <th>예금주</th><td>{worker.accountHolder}</td>
            </tr>
          </tbody>
        </table>


        {/* ----------------------------- */}
        {/* 4. 월간 근태 기록 필터 */}
        {/* ----------------------------- */}
        <h3 className="detail-subtitle">월간 근태 기록</h3>

        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="date-filter"
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const y = today.getFullYear() - 2 + i;
              return <option key={y} value={y}>{y}년</option>;
            })}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="date-filter"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}월</option>
            ))}
          </select>
        </div>


        {/* ----------------------------- */}
        {/* 5. 월 총합 */}
        {/* ----------------------------- */}
        {monthlyData && (
          <>
            <table className="detail-table">
              <tbody>
                <tr>
                  <th>총 근로시간</th>
                  <td>{monthlyData.monthlyTotalWork} 시간</td>
                  <th>총 공수</th>
                  <td>{monthlyData.monthlyTotalManHour} 공수</td>
                </tr>
              </tbody>
            </table>

            {/* ----------------------------- */}
            {/* 6. 일자별 상세 기록 */}
            {/* ----------------------------- */}
            <table className="detail-table" style={{ marginTop: "12px" }}>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>출근</th>
                  <th>퇴근</th>
                  <th>총근로</th>
                  <th>기본</th>
                  <th>연장</th>
                  <th>야간</th>
                  <th>휴일</th>
                  <th>단가</th>
                  <th>공수</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.dailyRecords?.map((d: any) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{d.clockIn || "-"}</td>
                    <td>{d.clockOut || "-"}</td>
                    <td>{d.totalWork}</td>
                    <td>{d.basicWork}</td>
                    <td>{d.extendedWork}</td>
                    <td>{d.nightWork}</td>
                    <td>{d.holidayWork}</td>
                    <td>{d.unitPrice.toLocaleString()}원</td>
                    <td>{d.manHour}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
