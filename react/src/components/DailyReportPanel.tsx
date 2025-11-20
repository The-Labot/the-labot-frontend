// src/components/DailyReportPanel.tsx
import { useState } from "react";
import {
  Users,
  Download,
  Calendar,
  FileText,
  Edit2,
  Check,
  X,
  Briefcase,
  ClipboardList,
  Package,
  Truck,
  AlertCircle,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import "./DailyReportPanel.css";

interface DailyReport {
  id: number;
  siteName: string;
  author: string;
  date: string;
  workType: string;
  todayWork: string;
  tomorrowPlan: string;
  workerCount: number;
  materials: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  equipment: {
    name: string;
    quantity: number;
    hours: string;
  }[];
  notes: string;
  status: "submitted" | "draft";
}

export function DailyReportPanel() {
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedReport, setEditedReport] = useState<DailyReport | null>(null);

  const [dailyReports, setDailyReports] = useState<DailyReport[]>([
    {
      id: 1,
      siteName: "A동 건설 현장",
      author: "김현장",
      date: "2025-11-01",
      workType: "철근 콘크리트 공사",
      todayWork:
        "3층 철근 배근 작업 완료\n- 기둥 철근 배근 100% 완료\n- 보 철근 배근 95% 완료\n- 슬라브 철근 배근 진행중 (70%)\n\n콘크리트 타설 준비\n- 거푸집 검사 완료\n- 철근 피복두께 확인 완료\n- 타설 계획 수립",
      tomorrowPlan:
        "3층 슬라브 철근 배근 완료 예정\n콘크리트 타설 실시 (3층 전체)\n양생 준비 및 거푸집 자재 확보\n4층 작업 준비 (자재 반입)",
      workerCount: 48,
      materials: [
        { name: "철근 (D19)", quantity: "2.5", unit: "톤" },
        { name: "철근 (D13)", quantity: "1.8", unit: "톤" },
        { name: "콘크리트 (25-24-12)", quantity: "45", unit: "m³" },
        { name: "거푸집 합판", quantity: "120", unit: "매" },
      ],
      equipment: [
        { name: "타워크레인 (25톤)", quantity: 2, hours: "8시간" },
        { name: "콘크리트 펌프카", quantity: 1, hours: "4시간" },
        { name: "용접기", quantity: 3, hours: "8시간" },
      ],
      notes: "날씨 양호, 안전사고 없음. 철근 자재 추가 발주 필요 (내일 타설분)",
      status: "submitted",
    },
    {
      id: 2,
      siteName: "B동 건설 현장",
      author: "이관리",
      date: "2025-11-01",
      workType: "전기 설비 공사",
      todayWork:
        "지하 1층 전기실 배관 작업\n- 간선 배관 설치 완료\n- 분전반 설치 위치 마킹\n- 케이블 트레이 설치 (80%)\n\n1층 전등 배선 작업\n- 천장 매입 배선 완료\n- 스위치 박스 설치",
      tomorrowPlan:
        "지하 1층 케이블 트레이 마무리\n분전반 설치 작업\n1층 전등 설치 및 결선 작업\n비상조명 설치 준비",
      workerCount: 45,
      materials: [
        { name: "PVC 전선관 (32mm)", quantity: "250", unit: "m" },
        { name: "케이블 트레이 (300mm)", quantity: "80", unit: "m" },
        { name: "CV케이블 (35sq)", quantity: "120", unit: "m" },
        { name: "분전반 (6회로)", quantity: "8", unit: "대" },
      ],
      equipment: [
        { name: "고소작업대 (12m)", quantity: 2, hours: "8시간" },
        { name: "전동드릴", quantity: 5, hours: "8시간" },
        { name: "케이블 커터", quantity: 3, hours: "6시간" },
      ],
      notes: "안전점검 완료. 케이블 트레이 자재 추가 필요 (50m)",
      status: "submitted",
    },
    {
      id: 3,
      siteName: "C동 건설 현장",
      author: "박현장",
      date: "2025-11-01",
      workType: "마감 공사",
      todayWork:
        "2층 석고보드 설치 작업\n- 벽체 석고보드 설치 완료\n- 천장 석고보드 설치 (60%)\n- 조인트 처리 준비\n\n타일 붙이기 작업\n- 화장실 벽 타일 시공 완료\n- 바닥 타일 밑작업",
      tomorrowPlan:
        "2층 천장 석고보드 마무리\n조인트 처리 및 퍼티 작업\n화장실 바닥 타일 시공\n3층 마감 자재 반입",
      workerCount: 42,
      materials: [
        { name: "석고보드 (12T)", quantity: "180", unit: "매" },
        { name: "경량천장틀", quantity: "320", unit: "m" },
        { name: "벽 타일 (300x600)", quantity: "45", unit: "박스" },
        { name: "바닥 타일 (600x600)", quantity: "28", unit: "박스" },
      ],
      equipment: [
        { name: "리프트", quantity: 1, hours: "8시간" },
        { name: "타일커터", quantity: 2, hours: "7시간" },
        { name: "믹서기", quantity: 1, hours: "5시간" },
      ],
      notes: "석고보드 양생 중. 특이사항 없음.",
      status: "submitted",
    },
  ]);

  const handleEditClick = () => {
    if (selectedReport) {
      setEditedReport({ ...selectedReport });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (editedReport) {
      setDailyReports((prev) =>
        prev.map((r) => (r.id === editedReport.id ? editedReport : r)),
      );
      setSelectedReport(editedReport);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedReport(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (
      selectedReport &&
      window.confirm(
        `"${selectedReport.siteName}" 작업 일보를 삭제하시겠습니까?`,
      )
    ) {
      setDailyReports((prev) =>
        prev.filter((r) => r.id !== selectedReport.id),
      );
      setSelectedReport(null);
      setIsEditing(false);
    }
  };

  /* ===== 자재 / 장비 편집 (수정 모드에서만 사용) ===== */

  const addMaterial = () => {
    if (!editedReport) return;
    setEditedReport({
      ...editedReport,
      materials: [
        ...editedReport.materials,
        { name: "", quantity: "", unit: "" },
      ],
    });
  };

  const removeMaterial = (index: number) => {
    if (!editedReport) return;
    const newMaterials = [...editedReport.materials];
    newMaterials.splice(index, 1);
    setEditedReport({ ...editedReport, materials: newMaterials });
  };

  const updateMaterial = (
    index: number,
    field: "name" | "quantity" | "unit",
    value: string,
  ) => {
    if (!editedReport) return;
    const newMaterials = [...editedReport.materials];
    newMaterials[index][field] = value;
    setEditedReport({ ...editedReport, materials: newMaterials });
  };

  const addEquipment = () => {
    if (!editedReport) return;
    setEditedReport({
      ...editedReport,
      equipment: [
        ...editedReport.equipment,
        { name: "", quantity: 0, hours: "" },
      ],
    });
  };

  const removeEquipment = (index: number) => {
    if (!editedReport) return;
    const newEquipment = [...editedReport.equipment];
    newEquipment.splice(index, 1);
    setEditedReport({ ...editedReport, equipment: newEquipment });
  };

  const updateEquipment = (
    index: number,
    field: "name" | "quantity" | "hours",
    value: string | number,
  ) => {
    if (!editedReport) return;
    const newEquipment = [...editedReport.equipment];
    if (field === "quantity") {
      newEquipment[index][field] =
        typeof value === "number" ? value : parseInt(value) || 0;
    } else {
      newEquipment[index][field] = value as string;
    }
    setEditedReport({ ...editedReport, equipment: newEquipment });
  };

  const submittedCount = dailyReports.filter(
    (r) => r.status === "submitted",
  ).length;
  const totalWorkers = dailyReports.reduce(
    (sum, r) => sum + r.workerCount,
    0,
  );

  return (
    <div className="drp-container">
      {/* 상단 헤더 */}
      <header className="drp-header">
        <div className="drp-header-inner">
          <button
            type="button"
            className="drp-back-btn"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="drp-back-icon" />
          </button>
          <div>
            <h1 className="drp-header-title">작업 일보</h1>
            <p className="drp-header-subtitle">Daily Work Report</p>
          </div>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="drp-main">
        {/* 왼쪽 패널 */}
        <aside className="drp-left">
          <div className="drp-left-header">
            <div className="drp-left-title-wrap">
              <h2 className="drp-left-title">작업 일보</h2>
              <p className="drp-left-subtitle">Daily Work Report</p>
            </div>

            {/* 여기서는 +새 보고서 제거, 다운로드만 남김 */}
            <div className="drp-action-row">
              <button
                type="button"
                className="drp-download-btn"
                // TODO: 나중에 API 연결
              >
                <Download className="drp-download-icon" />
              </button>
            </div>

            {/* 통계 카드 */}
            <div className="drp-stats-grid">
              <div className="drp-stat-card drp-stat-card-blue">
                <FileText className="drp-stat-icon drp-stat-icon-blue" />
                <p className="drp-stat-value drp-stat-value-blue">
                  {submittedCount}
                </p>
                <p className="drp-stat-label drp-stat-label-blue">제출완료</p>
              </div>
              <div className="drp-stat-card drp-stat-card-purple">
                <Users className="drp-stat-icon drp-stat-icon-purple" />
                <p className="drp-stat-value drp-stat-value-purple">
                  {totalWorkers}
                </p>
                <p className="drp-stat-label drp-stat-label-purple">
                  투입인원
                </p>
              </div>
            </div>
          </div>

          {/* 일보 리스트 */}
          <div className="drp-scroll">
            {dailyReports.map((report) => {
              const isSelected = selectedReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  className={
                    "drp-list-item " +
                    (isSelected ? "drp-list-item-selected" : "")
                  }
                  onClick={() => {
                    setSelectedReport(report);
                    setIsEditing(false);
                  }}
                >
                  <div className="drp-list-badge-row">
                    <span className="drp-badge drp-badge-submitted">
                      제출완료
                    </span>
                    <ChevronRight
                      className={
                        "drp-chevron " +
                        (isSelected ? "drp-chevron-selected" : "")
                      }
                    />
                  </div>
                  <h3 className="drp-list-title">{report.siteName}</h3>
                  <p className="drp-list-subtitle">{report.workType}</p>
                  <div className="drp-list-meta">
                    <div className="drp-list-meta-row">
                      <Calendar className="drp-list-meta-icon" />
                      <span>{report.date}</span>
                    </div>
                    <div className="drp-list-meta-row">
                      <Users className="drp-list-meta-icon" />
                      <span>투입: {report.workerCount}명</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 오른쪽 패널 */}
        <section className="drp-right">
          {selectedReport ? (
            <div className="drp-right-inner">
              {!isEditing ? (
                <>
                  {/* 상단 카드 */}
                  <div className="drp-card drp-card-header">
                    <div className="drp-card-header-main">
                      <div className="drp-header-left">
                        <div className="drp-badge-row">
                          <span className="drp-badge drp-badge-submitted">
                            제출완료
                          </span>
                        </div>
                        <h2 className="drp-detail-title">
                          {selectedReport.siteName}
                        </h2>
                        <p className="drp-detail-subtitle">
                          {selectedReport.workType}
                        </p>
                        <div className="drp-detail-meta-grid">
                          <div className="drp-detail-meta-row">
                            <Calendar className="drp-detail-meta-icon" />
                            <span>{selectedReport.date}</span>
                          </div>
                          <div className="drp-detail-meta-row">
                            <Users className="drp-detail-meta-icon" />
                            <span>
                              투입 인원: {selectedReport.workerCount}명
                            </span>
                          </div>
                          <div className="drp-detail-meta-row">
                            <FileText className="drp-detail-meta-icon" />
                            <span>작성자: {selectedReport.author}</span>
                          </div>
                        </div>
                      </div>
                      <div className="drp-header-actions">
                        <button
                          type="button"
                          className="drp-btn drp-btn-outline"
                          onClick={handleEditClick}
                        >
                          <Edit2 className="drp-btn-icon" />
                          수정
                        </button>
                        <button
                          type="button"
                          className="drp-btn drp-btn-outline drp-btn-danger-outline"
                          onClick={handleDelete}
                        >
                          <Trash2 className="drp-btn-icon" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 금일/명일 */}
                  <div className="drp-two-column">
                    <div className="drp-card drp-card-block drp-card-full">
                      <div className="drp-card-title-row">
                        <Briefcase className="drp-card-title-icon" />
                        <h3 className="drp-card-title">금일 작업사항</h3>
                      </div>
                      <p className="drp-card-text">
                        {selectedReport.todayWork}
                      </p>
                    </div>

                    <div className="drp-card drp-card-block drp-card-full">
                      <div className="drp-card-title-row">
                        <ClipboardList className="drp-card-title-icon" />
                        <h3 className="drp-card-title">명일 예정 사항</h3>
                      </div>
                      <p className="drp-card-text">
                        {selectedReport.tomorrowPlan}
                      </p>
                    </div>
                  </div>

                  {/* 자재 / 장비 */}
                  <div className="drp-two-column">
                    <div className="drp-card drp-card-block">
                      <div className="drp-card-title-row">
                        <Package className="drp-card-title-icon" />
                        <h3 className="drp-card-title">자재 투입 현황</h3>
                      </div>
                      <div className="drp-resource-list">
                        {selectedReport.materials.map((m, idx) => (
                          <div key={idx} className="drp-resource-item">
                            <span className="drp-resource-name">{m.name}</span>
                            <span className="drp-resource-amount">
                              {m.quantity} {m.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="drp-card drp-card-block">
                      <div className="drp-card-title-row">
                        <Truck className="drp-card-title-icon" />
                        <h3 className="drp-card-title">장비 투입 현황</h3>
                      </div>
                      <div className="drp-resource-list">
                        {selectedReport.equipment.map((e, idx) => (
                          <div key={idx} className="drp-equipment-item">
                            <div className="drp-equipment-top">
                              <span className="drp-resource-name">
                                {e.name}
                              </span>
                              <span className="drp-resource-amount">
                                {e.quantity}대
                              </span>
                            </div>
                            <span className="drp-equipment-hours">
                              가동시간: {e.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 특이사항 */}
                  {selectedReport.notes && (
                    <div className="drp-card drp-card-block">
                      <div className="drp-card-title-row">
                        <AlertCircle className="drp-card-title-icon" />
                        <h3 className="drp-card-title">특이사항</h3>
                      </div>
                      <p className="drp-card-text">{selectedReport.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                /* 수정 모드 */
                <div className="drp-card drp-card-edit">
                  <div className="drp-edit-header">
                    <h3 className="drp-edit-title">작업 일보 수정</h3>
                    <div className="drp-edit-actions">
                      <button
                        type="button"
                        className="drp-btn drp-btn-primary"
                        onClick={handleSaveEdit}
                      >
                        <Check className="drp-btn-icon" />
                        저장
                      </button>
                      <button
                        type="button"
                        className="drp-btn drp-btn-outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="drp-btn-icon" />
                        취소
                      </button>
                    </div>
                  </div>

                  <div className="drp-edit-body">
                    {/* 기본 정보 */}
                    <div className="drp-grid-2">
                      <div className="drp-field">
                        <label className="drp-label" htmlFor="edit-siteName">
                          현장명
                        </label>
                        <input
                          id="edit-siteName"
                          className="drp-input"
                          value={editedReport?.siteName || ""}
                          onChange={(e) =>
                            setEditedReport((prev) =>
                              prev
                                ? { ...prev, siteName: e.target.value }
                                : null,
                            )
                          }
                        />
                      </div>
                      <div className="drp-field">
                        <label className="drp-label" htmlFor="edit-author">
                          작성자
                        </label>
                        <input
                          id="edit-author"
                          className="drp-input"
                          value={editedReport?.author || ""}
                          onChange={(e) =>
                            setEditedReport((prev) =>
                              prev
                                ? { ...prev, author: e.target.value }
                                : null,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="drp-grid-2">
                      <div className="drp-field">
                        <label className="drp-label" htmlFor="edit-date">
                          작업일자
                        </label>
                        <input
                          id="edit-date"
                          type="date"
                          className="drp-input"
                          value={editedReport?.date || ""}
                          onChange={(e) =>
                            setEditedReport((prev) =>
                              prev ? { ...prev, date: e.target.value } : null,
                            )
                          }
                        />
                      </div>
                      <div className="drp-field">
                        <label
                          className="drp-label"
                          htmlFor="edit-workerCount"
                        >
                          투입 인원
                        </label>
                        <input
                          id="edit-workerCount"
                          type="number"
                          className="drp-input"
                          value={editedReport?.workerCount || 0}
                          onChange={(e) =>
                            setEditedReport((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    workerCount:
                                      parseInt(e.target.value) || 0,
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="drp-field">
                      <label className="drp-label" htmlFor="edit-workType">
                        공종명
                      </label>
                      <input
                        id="edit-workType"
                        className="drp-input"
                        value={editedReport?.workType || ""}
                        onChange={(e) =>
                          setEditedReport((prev) =>
                            prev
                              ? { ...prev, workType: e.target.value }
                              : null,
                          )
                        }
                      />
                    </div>

                    <div className="drp-field">
                      <label
                        className="drp-label"
                        htmlFor="edit-todayWork"
                      >
                        금일 작업사항
                      </label>
                      <textarea
                        id="edit-todayWork"
                        className="drp-textarea"
                        rows={6}
                        value={editedReport?.todayWork || ""}
                        onChange={(e) =>
                          setEditedReport((prev) =>
                            prev
                              ? { ...prev, todayWork: e.target.value }
                              : null,
                          )
                        }
                      />
                    </div>

                    <div className="drp-field">
                      <label
                        className="drp-label"
                        htmlFor="edit-tomorrowPlan"
                      >
                        명일 예정 사항
                      </label>
                      <textarea
                        id="edit-tomorrowPlan"
                        className="drp-textarea"
                        rows={5}
                        value={editedReport?.tomorrowPlan || ""}
                        onChange={(e) =>
                          setEditedReport((prev) =>
                            prev
                              ? { ...prev, tomorrowPlan: e.target.value }
                              : null,
                          )
                        }
                      />
                    </div>

                    {/* 자재 */}
                    <div className="drp-field">
                      <div className="drp-field-header">
                        <span className="drp-label">자재 투입 현황</span>
                        <button
                          type="button"
                          className="drp-btn drp-btn-outline drp-btn-sm"
                          onClick={addMaterial}
                        >
                          <Plus className="drp-btn-icon" />
                          자재 추가
                        </button>
                      </div>
                      <div className="drp-dynamic-list">
                        {editedReport?.materials.map((m, idx) => (
                          <div key={idx} className="drp-dynamic-row">
                            <input
                              className="drp-input flex-1"
                              placeholder="자재명"
                              value={m.name}
                              onChange={(e) =>
                                updateMaterial(idx, "name", e.target.value)
                              }
                            />
                            <input
                              className="drp-input drp-input-short"
                              placeholder="수량"
                              value={m.quantity}
                              onChange={(e) =>
                                updateMaterial(
                                  idx,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                            />
                            <input
                              className="drp-input drp-input-short"
                              placeholder="단위"
                              value={m.unit}
                              onChange={(e) =>
                                updateMaterial(idx, "unit", e.target.value)
                              }
                            />
                            <button
                              type="button"
                              className="drp-icon-btn"
                              onClick={() => removeMaterial(idx)}
                            >
                              <X className="drp-icon-btn-icon drp-icon-danger" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 장비 */}
                    <div className="drp-field">
                      <div className="drp-field-header">
                        <span className="drp-label">장비 투입 현황</span>
                        <button
                          type="button"
                          className="drp-btn drp-btn-outline drp-btn-sm"
                          onClick={addEquipment}
                        >
                          <Plus className="drp-btn-icon" />
                          장비 추가
                        </button>
                      </div>
                      <div className="drp-dynamic-list">
                        {editedReport?.equipment.map((e, idx) => (
                          <div key={idx} className="drp-dynamic-row">
                            <input
                              className="drp-input flex-1"
                              placeholder="장비명"
                              value={e.name}
                              onChange={(ev) =>
                                updateEquipment(
                                  idx,
                                  "name",
                                  ev.target.value,
                                )
                              }
                            />
                            <input
                              className="drp-input drp-input-short"
                              type="number"
                              placeholder="대수"
                              value={e.quantity}
                              onChange={(ev) =>
                                updateEquipment(
                                  idx,
                                  "quantity",
                                  parseInt(ev.target.value) || 0,
                                )
                              }
                            />
                            <input
                              className="drp-input drp-input-short"
                              placeholder="시간"
                              value={e.hours}
                              onChange={(ev) =>
                                updateEquipment(
                                  idx,
                                  "hours",
                                  ev.target.value,
                                )
                              }
                            />
                            <button
                              type="button"
                              className="drp-icon-btn"
                              onClick={() => removeEquipment(idx)}
                            >
                              <X className="drp-icon-btn-icon drp-icon-danger" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="drp-field">
                      <label className="drp-label" htmlFor="edit-notes">
                        특이사항
                      </label>
                      <textarea
                        id="edit-notes"
                        className="drp-textarea"
                        rows={3}
                        value={editedReport?.notes || ""}
                        onChange={(e) =>
                          setEditedReport((prev) =>
                            prev
                              ? { ...prev, notes: e.target.value }
                              : null,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="drp-right-empty-wrapper">
              <div className="drp-right-empty">
                <FileText className="drp-right-empty-icon" />
                <p className="drp-right-empty-title">작업 일보를 선택하세요</p>
                <p className="drp-right-empty-subtitle">
                  왼쪽 목록에서 작업 일보를 선택하면 상세 정보가 표시됩니다
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}