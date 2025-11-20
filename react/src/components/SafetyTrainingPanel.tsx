// src/components/SafetyTrainingPanel.tsx
import { useState } from "react";
import {
  GraduationCap,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  User,
  MapPin,
  Edit2,
  Check,
  X,
  BookOpen,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import "./SafetyTrainingPanel.css";

interface TrainingLog {
  id: number;
  title: string;
  date: string;
  time: string;
  course: string;
  subject: string;
  content: string;
  instructor: string;
  location: string;
  participants: number;
  capacity: number;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

export function SafetyTrainingPanel() {
  const [selectedLog, setSelectedLog] = useState<TrainingLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLog, setEditedLog] = useState<TrainingLog | null>(null);

  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([
    {
      id: 1,
      title: "고소작업 안전교육",
      date: "2025-11-05",
      time: "09:00",
      course: "안전보건교육",
      subject: "추락재해 예방",
      content:
        "고소작업 시 안전수칙 및 안전장비 착용 방법, 추락 방지 설비 점검 요령에 대한 교육을 실시합니다.\n\n주요 내용:\n1. 안전대 및 안전모 착용법\n2. 작업발판 설치 기준\n3. 추락방지망 설치 방법\n4. 비상시 대응 절차\n\n실습 항목:\n- 안전장비 착용 실습\n- 작업발판 점검 실습",
      instructor: "김철수 (안전관리팀 과장)",
      location: "본관 1층 대회의실",
      participants: 24,
      capacity: 30,
      status: "scheduled",
      notes:
        "실습용 안전장비 30세트 준비 필요. 교육 후 수료증 발급 예정.",
    },
    {
      id: 2,
      title: "화재 예방 및 대응",
      date: "2025-11-03",
      time: "14:00",
      course: "소방안전교육",
      subject: "화재예방 및 초기진압",
      content:
        "현장 내 화재 예방 및 발생 시 초기 대응 방법에 대한 교육을 실시합니다.\n\n주요 내용:\n1. 화재 발생 원인 및 예방법\n2. 소화기 사용법\n3. 대피 경로 및 절차\n4. 비상연락체계\n\n실습 항목:\n- 소화기 실습\n- 비상대피 훈련",
      instructor: "이영희 (소방안전팀 과장)",
      location: "야외 실습장",
      participants: 18,
      capacity: 25,
      status: "scheduled",
      notes: "소화기 10대 준비. 우천 시 교육장 변경 가능 (2층 교육장)",
    },
    {
      id: 3,
      title: "전기 안전 기초",
      date: "2025-10-28",
      time: "10:00",
      course: "전기안전교육",
      subject: "감전재해 예방",
      content:
        "전기 작업 시 감전 사고 예방을 위한 기본 안전 수칙 교육을 실시했습니다.\n\n주요 내용:\n1. 전기의 위험성\n2. 절연장갑 및 절연화 착용\n3. 활선작업 금지 원칙\n4. 정전작업 절차\n\n실습 항목:\n- 절연장갑 착용 실습\n- 검전기 사용법",
      instructor: "박민수 (전기안전팀 과장)",
      location: "본관 1층 대회의실",
      participants: 30,
      capacity: 30,
      status: "completed",
      notes:
        "전원 근로자 참석 완료. 교육 만족도 평균 4.8/5.0. 수료증 발급 완료.",
    },
    {
      id: 4,
      title: "중장비 안전 교육",
      date: "2025-10-25",
      time: "13:00",
      course: "장비안전교육",
      subject: "중장비 안전운행",
      content:
        "현장 내 중장비 안전 운행 및 작업 시 안전 수칙에 대한 교육을 실시했습니다.\n\n주요 내용:\n1. 중장비 작업 전 점검사항\n2. 유도자 배치 및 신호 체계\n3. 작업 반경 내 출입 통제\n4. 장비 정비 및 관리\n\n실습 항목:\n- 중장비 점검 실습\n- 신호수 교육",
      instructor: "최영수 (설비관리팀 과장)",
      location: "야외 실습장",
      participants: 15,
      capacity: 20,
      status: "completed",
      notes:
        "중장비 운전자 15명 전원 참석. 실습 중 안전사고 없음. 다음 보수교육은 3개월 후 실시 예정.",
    },
    {
      id: 5,
      title: "밀폐공간 작업 안전",
      date: "2025-10-20",
      time: "09:00",
      course: "특수작업교육",
      subject: "밀폐공간 질식재해 예방",
      content:
        "밀폐공간 작업 시 질식 및 중독 사고 예방을 위한 안전 교육을 실시했습니다.\n\n주요 내용:\n1. 밀폐공간 정의 및 위험성\n2. 작업 전 산소농도 측정\n3. 환기 설비 운영\n4. 안전감시자 배치\n\n실습 항목:\n- 산소농도측정기 사용법\n- 송기마스크 착용 실습",
      instructor: "정대호 (안전관리팀 대리)",
      location: "본관 2층 교육장",
      participants: 12,
      capacity: 15,
      status: "completed",
      notes:
        "밀폐공간 작업 예정자 전원 이수. 측정기 및 보호구 지급 완료.",
    },
  ]);

  const scheduledCount = trainingLogs.filter(
    (log) => log.status === "scheduled",
  ).length;
  const completedCount = trainingLogs.filter(
    (log) => log.status === "completed",
  ).length;

  const getStatusBadge = (status: TrainingLog["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="st-badge st-badge-blue">
            <Clock className="st-badge-icon" />
            예정
          </span>
        );
      case "completed":
        return (
          <span className="st-badge st-badge-green">
            <CheckCircle className="st-badge-icon" />
            완료
          </span>
        );
      case "cancelled":
        return (
          <span className="st-badge st-badge-gray">
            <X className="st-badge-icon" />
            취소
          </span>
        );
      default:
        return null;
    }
  };

  const handleEditClick = () => {
    if (selectedLog) {
      setEditedLog({ ...selectedLog });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editedLog) return;
    setTrainingLogs((prev) =>
      prev.map((log) => (log.id === editedLog.id ? editedLog : log)),
    );
    setSelectedLog(editedLog);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedLog(null);
    setIsEditing(false);
  };

  return (
    <div className="st-container">
      {/* 상단 헤더 */}
      <header className="st-header">
        <div className="st-header-inner">
          <button
            className="st-back-btn"
            type="button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="st-back-icon" />
          </button>
          <div>
            <h1 className="st-header-title">안전 교육</h1>
            <p className="st-header-subtitle">Safety Education</p>
          </div>
        </div>
      </header>

      {/* 메인 영역 */}
      <div className="st-main">
        {/* 왼쪽 패널 */}
        <aside className="st-left">
          <div className="st-left-header">
            <div className="st-left-title-wrap">
              <h2 className="st-left-title">안전 교육 일지</h2>
              <p className="st-left-subtitle">Safety Training Log</p>
            </div>

            <div className="st-summary-grid">
              <div className="st-summary-box st-summary-box-blue">
                <Clock className="st-summary-icon" />
                <p className="st-summary-value">{scheduledCount}</p>
                <p className="st-summary-label">예정</p>
              </div>
              <div className="st-summary-box st-summary-box-green">
                <CheckCircle className="st-summary-icon" />
                <p className="st-summary-value">{completedCount}</p>
                <p className="st-summary-label">완료</p>
              </div>
            </div>
          </div>

          {/* 교육 일지 리스트 */}
          <div className="st-log-list">
            {trainingLogs.map((log) => {
              const isSelected = selectedLog?.id === log.id;

              return (
                <div
                  key={log.id}
                  className={
                    "st-log-item" + (isSelected ? " st-log-item-selected" : "")
                  }
                  onClick={() => {
                    setSelectedLog(log);
                    setIsEditing(false);
                  }}
                >
                  <div className="st-log-top-row">
                    {getStatusBadge(log.status)}
                    <span className="st-course-badge">{log.course}</span>
                  </div>
                  <h3 className="st-log-title">{log.title}</h3>
                  <p className="st-log-subject">{log.subject}</p>
                  <div className="st-log-meta">
                    <div className="st-log-meta-row">
                      <Calendar className="st-log-meta-icon" />
                      <span>
                        {log.date} {log.time}
                      </span>
                    </div>
                    <div className="st-log-meta-row">
                      <Users className="st-log-meta-icon" />
                      <span>
                        {log.participants}/{log.capacity}명
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 오른쪽 패널 */}
        <section className="st-right">
          {!selectedLog ? (
            <div className="st-right-empty">
              <GraduationCap className="st-right-empty-icon" />
              <p className="st-right-empty-title">교육 일지를 선택하세요</p>
              <p className="st-right-empty-subtitle">
                왼쪽 목록에서 교육 일지를 선택하면 상세 정보가 표시됩니다
              </p>
            </div>
          ) : !isEditing ? (
            <div className="st-right-inner">
              {/* 상단 카드 */}
              <div
                className={
                  "st-card st-card-header " +
                  (selectedLog.status === "scheduled"
                    ? "st-card-scheduled"
                    : selectedLog.status === "completed"
                    ? "st-card-completed"
                    : "")
                }
              >
                <div className="st-card-header-inner">
                  <div className="st-card-header-left">
                    <div className="st-card-badges">
                      {getStatusBadge(selectedLog.status)}
                      <span className="st-course-badge">
                        {selectedLog.course}
                      </span>
                    </div>
                    <h2 className="st-card-title">{selectedLog.title}</h2>
                    <p className="st-card-subject">{selectedLog.subject}</p>

                    <div className="st-card-info-grid">
                      <div className="st-card-info-row">
                        <Calendar className="st-card-info-icon" />
                        <span>
                          {selectedLog.date} {selectedLog.time}
                        </span>
                      </div>
                      <div className="st-card-info-row">
                        <Users className="st-card-info-icon" />
                        <span>
                          {selectedLog.participants} / {selectedLog.capacity}명
                        </span>
                      </div>
                      <div className="st-card-info-row">
                        <User className="st-card-info-icon" />
                        <span>{selectedLog.instructor}</span>
                      </div>
                      <div className="st-card-info-row">
                        <MapPin className="st-card-info-icon" />
                        <span>{selectedLog.location}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="st-btn st-btn-outline st-btn-small"
                    onClick={handleEditClick}
                  >
                    <Edit2 className="st-btn-icon-left" />
                    수정
                  </button>
                </div>
              </div>

              {/* 교육 내용 */}
              <div className="st-card">
                <div className="st-card-body">
                  <div className="st-section-header">
                    <BookOpen className="st-section-icon" />
                    <h3 className="st-section-title">교육 내용</h3>
                  </div>
                  <div className="st-card-text">
                    {selectedLog.content.split("\n").map((line, idx) => (
                      <p key={idx}>
                        {line}
                        <br />
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* 특이사항 */}
              {selectedLog.notes && (
                <div className="st-card">
                  <div className="st-card-body">
                    <div className="st-section-header">
                      <AlertCircle className="st-section-icon" />
                      <h3 className="st-section-title">특이사항</h3>
                    </div>
                    <div className="st-card-text">
                      {selectedLog.notes.split("\n").map((line, idx) => (
                        <p key={idx}>
                          {line}
                          <br />
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 수정 모드
            <div className="st-right-inner">
              <div className="st-card">
                <div className="st-card-body">
                  <div className="st-edit-header">
                    <h3 className="st-edit-title">교육 일지 수정</h3>
                    <div className="st-edit-actions">
                      <button
                        type="button"
                        className="st-btn st-btn-primary st-btn-small"
                        onClick={handleSaveEdit}
                      >
                        <Check className="st-btn-icon-left" />
                        저장
                      </button>
                      <button
                        type="button"
                        className="st-btn st-btn-outline st-btn-small"
                        onClick={handleCancelEdit}
                      >
                        <X className="st-btn-icon-left" />
                        취소
                      </button>
                    </div>
                  </div>

                  <div className="st-form-grid">
                    {/* 교육명 */}
                    <div className="st-form-field st-form-field-full">
                      <label className="st-label">교육명</label>
                      <input
                        className="st-input"
                        value={editedLog?.title || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev ? { ...prev, title: e.target.value } : prev,
                          )
                        }
                      />
                    </div>

                    {/* 날짜 / 시간 */}
                    <div className="st-form-field">
                      <label className="st-label">시행날짜</label>
                      <input
                        type="date"
                        className="st-input"
                        value={editedLog?.date || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev ? { ...prev, date: e.target.value } : prev,
                          )
                        }
                      />
                    </div>
                    <div className="st-form-field">
                      <label className="st-label">시행시간</label>
                      <input
                        type="time"
                        className="st-input"
                        value={editedLog?.time || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev ? { ...prev, time: e.target.value } : prev,
                          )
                        }
                      />
                    </div>

                    {/* 과정 / 과목 */}
                    <div className="st-form-field">
                      <label className="st-label">과정</label>
                      <input
                        className="st-input"
                        value={editedLog?.course || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev ? { ...prev, course: e.target.value } : prev,
                          )
                        }
                      />
                    </div>
                    <div className="st-form-field">
                      <label className="st-label">과목</label>
                      <input
                        className="st-input"
                        value={editedLog?.subject || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev ? { ...prev, subject: e.target.value } : prev,
                          )
                        }
                      />
                    </div>

                    {/* 인원 */}
                    <div className="st-form-field">
                      <label className="st-label">참여 인원</label>
                      <input
                        type="number"
                        className="st-input"
                        value={editedLog?.participants ?? 0}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  participants:
                                    parseInt(e.target.value, 10) || 0,
                                }
                              : prev,
                          )
                        }
                      />
                    </div>
                    <div className="st-form-field">
                      <label className="st-label">정원</label>
                      <input
                        type="number"
                        className="st-input"
                        value={editedLog?.capacity ?? 30}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  capacity: parseInt(e.target.value, 10) || 30,
                                }
                              : prev,
                          )
                        }
                      />
                    </div>

                    {/* 강사 / 장소 */}
                    <div className="st-form-field">
                      <label className="st-label">강사명</label>
                      <input
                        className="st-input"
                        value={editedLog?.instructor || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev
                              ? { ...prev, instructor: e.target.value }
                              : prev,
                          )
                        }
                      />
                    </div>
                    <div className="st-form-field">
                      <label className="st-label">장소</label>
                      <input
                        className="st-input"
                        value={editedLog?.location || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev
                              ? { ...prev, location: e.target.value }
                              : prev,
                          )
                        }
                      />
                    </div>

                    {/* 상태 */}
                    <div className="st-form-field st-form-field-full">
                      <label className="st-label">상태</label>
                      <select
                        className="st-select"
                        value={editedLog?.status || "scheduled"}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  status: e.target.value as TrainingLog["status"],
                                }
                              : prev,
                          )
                        }
                      >
                        <option value="scheduled">예정</option>
                        <option value="completed">완료</option>
                        <option value="cancelled">취소</option>
                      </select>
                    </div>

                    {/* 내용 */}
                    <div className="st-form-field st-form-field-full">
                      <label className="st-label">내용</label>
                      <textarea
                        className="st-textarea"
                        rows={10}
                        value={editedLog?.content || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev ? { ...prev, content: e.target.value } : prev,
                          )
                        }
                      />
                    </div>

                    {/* 특이사항 */}
                    <div className="st-form-field st-form-field-full">
                      <label className="st-label">특이사항</label>
                      <textarea
                        className="st-textarea"
                        rows={4}
                        value={editedLog?.notes || ""}
                        onChange={(e) =>
                          setEditedLog((prev) =>
                            prev ? { ...prev, notes: e.target.value } : prev,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}