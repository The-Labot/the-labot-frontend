// src/components/WorkReportDetailModal.tsx
import { useEffect, useState } from "react";
import { getWorkReportDetail } from "../api/workStatusApi";
import "./WorkReportDetailModal.css"; // CSS 별도 분리

interface Props {
  reportId: number;
  onClose: () => void;
}

export default function WorkReportDetailModal({ reportId, onClose }: Props) {
  const [detail, setDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [reportId]);

  const loadDetail = async () => {
    try {
      const data = await getWorkReportDetail(reportId);
      setDetail(data);
    } catch (err) {
      console.error("작업일보 상세 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!detail || loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2 className="modal-title">{detail.workDate} 작업일보</h2>

        <p><strong>작성자:</strong> {detail.writerName}</p>
        <p><strong>공종:</strong> {detail.workType}</p>
        <p><strong>작업 위치:</strong> {detail.workLocation}</p>
        <p><strong>작업 내용:</strong> {detail.todayWork}</p>
        <p><strong>내일 작업 계획:</strong> {detail.tomorrowPlan}</p>
        <p><strong>인원:</strong> {detail.workerCount} 명</p>
        <p><strong>특이사항:</strong> {detail.specialNote}</p>

        {/* 장비 */}
        <h3 className="detail-subtitle">사용 장비</h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>장비명</th>
              <th>규격</th>
              <th>사용시간</th>
              <th>대수</th>
              <th>업체명</th>
            </tr>
          </thead>
          <tbody>
            {detail.equipmentList.map((e: any, idx: number) => (
              <tr key={idx}>
                <td>{e.equipmentName}</td>
                <td>{e.spec}</td>
                <td>{e.usingTime}</td>
                <td>{e.count}</td>
                <td>{e.vendorName}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 자재 */}
        <h3 className="detail-subtitle" style={{ marginTop: "24px" }}>
          사용 자재
        </h3>
        <table className="detail-table">
          <thead>
            <tr>
              <th>자재명</th>
              <th>규격·수량</th>
              <th>반입시간</th>
              <th>처리</th>
            </tr>
          </thead>
          <tbody>
            {detail.materialList.map((m: any, idx: number) => (
              <tr key={idx}>
                <td>{m.materialName}</td>
                <td>{m.specAndQuantity}</td>
                <td>{m.importTime}</td>
                <td>{m.exportDetail || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
