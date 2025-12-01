import { useEffect, useState } from "react";
import { getAttendanceMonthly } from "../api/payrollApi";
import "./WorkerModalCommon.css";
import "./WorkerAttendanceCalendar.css"; // 캘린더 스타일

interface Props {
  workerId: number;
  workerName: string;
  siteId: number;
  year: number;
  month: number;
  onClose: () => void;
}

export default function WorkerAttendanceModal({
  workerId,
  workerName,
  siteId,
  year,
  month,
  onClose
}: Props) {
  const [records, setRecords] = useState<{ date: string; manHour: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, [workerId, siteId, year, month]);

  const loadAttendance = async () => {
    try {
      const data = await getAttendanceMonthly(siteId, workerId, year, month);
      setRecords(data || []);
    } catch (err) {
      console.error("출역내역 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 날짜 → 공수 매핑
  const recordMap: Record<string, number> = {};
  records.forEach((r) => (recordMap[r.date] = r.manHour));

  // 달력 계산
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const daysInMonth = lastDay.getDate();
  const firstDayOfWeek = firstDay.getDay();

  const calendarCells = [];

  // 시작 빈칸
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push({ empty: true });
  }

  // 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    calendarCells.push({
      empty: false,
      day,
      manHour: recordMap[dateStr] ?? null,
    });
  }

  // 총 42칸 맞추기
  while (calendarCells.length < 42) {
    calendarCells.push({ empty: true });
  }

  return (
    <div className="full-overlay worker-attendance-modal" onClick={onClose}>
      <div className="full-panel2" onClick={(e) => e.stopPropagation()}>
        <button className="full-close" onClick={onClose}>
          ×
        </button>

        {/* 제목 */}
        <h2 className="detail-title2">
          {workerName} – {year}년 {month}월 출역내역
        </h2>

        {/* 캘린더 전체 박스 */}
          <div className="calendar-wrapper">
          {/* 요일 헤더 */}
          <div className="calendar-week-header">
            <span className="sun">일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span className="sat">토</span>
          </div>

          {/* 달력 */}
          <div className="calendar-grid">
            {calendarCells.map((cell, idx) =>
              cell.empty ? (
                <div key={idx} className="calendar-cell empty"></div>
              ) : (
                <div key={idx} className="calendar-cell day">
                  <div className="day-number">{cell.day}</div>
                  <div className="manhour">
                    {cell.manHour !== null ? `${cell.manHour} 공수` : "-"}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
