// src/components/WorkerManagementPanel.tsx
import { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Camera,
  FileText,
  DollarSign,
  Award,
  ChevronRight,
  ArrowDownToLine,
  LogIn,
  LogOut,
  Edit2,
  Check,
  X,
  AlertCircle,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import "./WorkerManagementPanel.css";

type WorkerStatus = "working" | "resting" | "late";

interface AttendanceRecord {
  date: string;
  checkInTime: string;
  checkInPeriod: string;
  checkOutTime: string;
  checkOutPeriod: string;
  status: string;
  objection?: {
    hasObjection: boolean;
    message: string;
  };
}

interface Worker {
  id: number;
  name: string;
  initial: string;
  role: string;
  status: WorkerStatus;
  site: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  phone?: string;
  attendanceRecords: AttendanceRecord[];
}

interface WorkerManagementPanelProps {
  onAddWorker?: () => void;
  onBack?: () => void;
}

export function WorkerManagementPanel({
  onAddWorker,
  onBack,
}: WorkerManagementPanelProps) {
  const [checkInTime, setCheckInTime] = useState("08:00");
  const [checkOutTime, setCheckOutTime] = useState("18:00");

  // 필드 수정
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  // 이의제기 모달 상태
  const [showObjectionDialog, setShowObjectionDialog] = useState(false);
  const [objectionDate, setObjectionDate] = useState("2025-10-31");
  const [objectionCheckInTime, setObjectionCheckInTime] = useState("08:15");
  const [objectionCheckOutTime, setObjectionCheckOutTime] = useState("06:00");
  const [objectionCheckInPeriod, setObjectionCheckInPeriod] =
    useState("오전");
  const [objectionCheckOutPeriod, setObjectionCheckOutPeriod] =
    useState("오후");
  const [objectionStatus, setObjectionStatus] = useState("지각");

  const [showPayrollView, setShowPayrollView] = useState(false);
  const [showCertificatesView, setShowCertificatesView] = useState(false);

  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 1,
      name: "김철수",
      initial: "김",
      role: "배관공",
      status: "working",
      site: "세종 A현장",
      address: "서울시 강남구 테헤란로 123",
      birthDate: "1990. 05. 15.",
      gender: "남성",
      nationality: "대한민국",
      phone: "010-1234-5678",
      attendanceRecords: [
        {
          date: "2025-11-01",
          checkInTime: "08:00",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-31",
          checkInTime: "08:15",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "지각",
          objection: {
            hasObjection: true,
            message:
              "실제로는 8시에 도착했습니다. 단말기 오류로 인해 늦게 찍혔습니다",
          },
        },
        {
          date: "2025-10-30",
          checkInTime: "08:05",
          checkInPeriod: "오전",
          checkOutTime: "06:10",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-28",
          checkInTime: "07:58",
          checkInPeriod: "오전",
          checkOutTime: "06:05",
          checkOutPeriod: "오후",
          status: "정상",
        },
      ],
    },
    {
      id: 2,
      name: "이영희",
      initial: "이",
      role: "목공",
      status: "working",
      site: "세종 A현장",
      address: "서울시 강남구 테헤란로 123",
      birthDate: "1990. 05. 15.",
      gender: "여성",
      nationality: "대한민국",
      phone: "010-2345-6789",
      attendanceRecords: [
        {
          date: "2025-11-01",
          checkInTime: "07:55",
          checkInPeriod: "오전",
          checkOutTime: "05:58",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-31",
          checkInTime: "08:00",
          checkInPeriod: "오전",
          checkOutTime: "05:30",
          checkOutPeriod: "오후",
          status: "조퇴",
        },
        {
          date: "2025-10-30",
          checkInTime: "08:02",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-28",
          checkInTime: "07:50",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
      ],
    },
    {
      id: 3,
      name: "박민수",
      initial: "박",
      role: "전기공",
      status: "late",
      site: "서울 B현장",
      address: "서울시 강남구 테헤란로 123",
      birthDate: "1990. 05. 15.",
      gender: "남성",
      nationality: "대한민국",
      phone: "010-3456-7890",
      attendanceRecords: [
        {
          date: "2025-11-01",
          checkInTime: "08:25",
          checkInPeriod: "오전",
          checkOutTime: "06:15",
          checkOutPeriod: "오후",
          status: "지각",
        },
        {
          date: "2025-10-31",
          checkInTime: "08:20",
          checkInPeriod: "오전",
          checkOutTime: "06:05",
          checkOutPeriod: "오후",
          status: "지각",
        },
        {
          date: "2025-10-30",
          checkInTime: "08:00",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-28",
          checkInTime: "-",
          checkInPeriod: "-",
          checkOutTime: "-",
          checkOutPeriod: "-",
          status: "결근",
        },
      ],
    },
    {
      id: 4,
      name: "정수진",
      initial: "정",
      role: "배관공",
      status: "resting",
      site: "서울 B현장",
      address: "서울시 강남구 테헤란로 123",
      birthDate: "1990. 05. 15.",
      gender: "여성",
      nationality: "대한민국",
      phone: "010-4567-8901",
      attendanceRecords: [
        {
          date: "2025-11-01",
          checkInTime: "08:03",
          checkInPeriod: "오전",
          checkOutTime: "05:55",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-31",
          checkInTime: "07:58",
          checkInPeriod: "오전",
          checkOutTime: "06:02",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-30",
          checkInTime: "08:00",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-28",
          checkInTime: "08:01",
          checkInPeriod: "오전",
          checkOutTime: "06:03",
          checkOutPeriod: "오후",
          status: "정상",
        },
      ],
    },
    {
      id: 5,
      name: "최동욱",
      initial: "최",
      role: "용접공",
      status: "working",
      site: "서울 C현장",
      address: "서울시 강남구 테헤란로 123",
      birthDate: "1990. 05. 15.",
      gender: "남성",
      nationality: "대한민국",
      phone: "010-5678-9012",
      attendanceRecords: [
        {
          date: "2025-11-01",
          checkInTime: "08:10",
          checkInPeriod: "오전",
          checkOutTime: "06:20",
          checkOutPeriod: "오후",
          status: "지각",
        },
        {
          date: "2025-10-31",
          checkInTime: "08:00",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-30",
          checkInTime: "07:55",
          checkInPeriod: "오전",
          checkOutTime: "06:10",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-28",
          checkInTime: "08:05",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
      ],
    },
    {
      id: 6,
      name: "강민지",
      initial: "강",
      role: "도장공",
      status: "working",
      site: "서울 C현장",
      address: "서울시 강남구 테헤란로 123",
      birthDate: "1990. 05. 15.",
      gender: "여성",
      nationality: "대한민국",
      phone: "010-6789-0123",
      attendanceRecords: [
        {
          date: "2025-11-01",
          checkInTime: "07:52",
          checkInPeriod: "오전",
          checkOutTime: "05:58",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-31",
          checkInTime: "08:00",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
        {
          date: "2025-10-30",
          checkInTime: "08:30",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "지각",
          objection: {
            hasObjection: true,
            message:
              "버스가 연착되어 늦었습니다. 정류장 CCTV로 확인 가능합니다",
          },
        },
        {
          date: "2025-10-28",
          checkInTime: "08:00",
          checkInPeriod: "오전",
          checkOutTime: "06:00",
          checkOutPeriod: "오후",
          status: "정상",
        },
      ],
    },
  ]);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (workers.length > 0 && !selectedWorker) {
      setSelectedWorker(workers[0]);
    }
  }, [workers, selectedWorker]);

  const getStatusInfo = (status: WorkerStatus) => {
    switch (status) {
      case "working":
        return { label: "근무중", className: "wm-badge wm-badge-green" };
      case "resting":
        return { label: "대기중", className: "wm-badge wm-badge-gray" };
      case "late":
        return { label: "퇴근미처리", className: "wm-badge wm-badge-orange" };
    }
  };

  const hasObjections = (worker: Worker) =>
    worker.attendanceRecords.some((r) => r.objection?.hasObjection);

  const handleEditField = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    setTempValue(currentValue);
  };

  const handleSaveField = (fieldName: keyof Worker) => {
    if (selectedWorker && tempValue.trim()) {
      const updated = workers.map((w) =>
        w.id === selectedWorker.id ? { ...w, [fieldName]: tempValue } : w,
      );
      setWorkers(updated);
      const newSelected = updated.find((w) => w.id === selectedWorker.id);
      if (newSelected) setSelectedWorker(newSelected);
      setEditingField(null);
      setTempValue("");
    }
  };

  const handleOpenObjection = (record: AttendanceRecord) => {
    setObjectionDate(record.date);
    setObjectionCheckInTime(record.checkInTime);
    setObjectionCheckInPeriod(record.checkInPeriod);
    setObjectionCheckOutTime(record.checkOutTime);
    setObjectionCheckOutPeriod(record.checkOutPeriod);
    setObjectionStatus(record.status);
    setShowObjectionDialog(true);
  };

  const handleProcessObjection = () => {
    if (!selectedWorker) return;
    const updatedWorkers = workers.map((worker) => {
      if (worker.id !== selectedWorker.id) return worker;
      const updatedRecords = worker.attendanceRecords.map((r) =>
        r.date === objectionDate
          ? {
              ...r,
              checkInTime: objectionCheckInTime,
              checkInPeriod: objectionCheckInPeriod,
              checkOutTime: objectionCheckOutTime,
              checkOutPeriod: objectionCheckOutPeriod,
              status: objectionStatus,
              objection: undefined,
            }
          : r,
      );
      return { ...worker, attendanceRecords: updatedRecords };
    });
    setWorkers(updatedWorkers);
    const newSelected = updatedWorkers.find((w) => w.id === selectedWorker.id);
    if (newSelected) setSelectedWorker(newSelected);
    setShowObjectionDialog(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "정상":
      case "정상 출근":
        return "wm-badge wm-badge-green";
      case "지각":
        return "wm-badge wm-badge-orange";
      case "조퇴":
        return "wm-badge wm-badge-yellow";
      case "결근":
        return "wm-badge wm-badge-red";
      default:
        return "wm-badge wm-badge-gray";
    }
  };

  const formatTime = (time: string, period: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    if (period === "오후" && hour < 12) return `${hour + 12}:${m}`;
    if (period === "오전" && hour >= 12) return `${hour - 12}:${m}`;
    return time;
  };

  return (
    <div className="wm-container">
      {/* 상단 헤더 (뒤로가기) */}
      {onBack && (
        <header className="wm-header">
          <div className="wm-header-inner">
            <button className="wm-back-btn" onClick={onBack}>
              <ArrowLeft className="wm-back-icon" />
            </button>
            <div>
              <h1 className="wm-header-title">근로자 관리</h1>
              <p className="wm-header-subtitle">Worker Management</p>
            </div>
          </div>
        </header>
      )}

      {/* 메인 영역 */}
      <div className="wm-main">
        {/* 왼쪽: 근로자 목록 */}
        <aside className="wm-left">
          <div className="wm-left-header">
            <div className="wm-left-title-wrap">
              <h2 className="wm-left-title">근로자 목록</h2>
              <p className="wm-left-subtitle">Worker List</p>
            </div>

          </div>

          {/* 검색 */}
          <div className="wm-search-wrap">
            <Search className="wm-search-icon" />
            <input
              className="wm-search-input"
              placeholder="이름, 직종 검색..."
            />
          </div>

          {/* 요약 숫자 */}
          <div className="wm-summary-grid">
            <div className="wm-summary-item">
              <p className="wm-summary-label">전체</p>
              <p className="wm-summary-value wm-summary-blue">48</p>
            </div>
            <div className="wm-summary-item">
              <p className="wm-summary-label">근무중</p>
              <p className="wm-summary-value wm-summary-green">42</p>
            </div>
            <div className="wm-summary-item">
              <p className="wm-summary-label">대기중</p>
              <p className="wm-summary-value">6</p>
            </div>
            <div className="wm-summary-item">
              <p className="wm-summary-label">이의제기</p>
              <p className="wm-summary-value wm-summary-red">
                {workers.filter(hasObjections).length}
              </p>
            </div>
          </div>

          {/* 근로자 리스트 */}
          <div className="wm-worker-list">
            {workers.map((worker) => {
              const statusInfo = getStatusInfo(worker.status);
              const isSelected = selectedWorker?.id === worker.id;
              const workerHasObjections = hasObjections(worker);

              return (
                <div
                  key={worker.id}
                  className={
                    "wm-worker-item" +
                    (isSelected ? " wm-worker-item-selected" : "")
                  }
                  onClick={() => {
                    setSelectedWorker(worker);
                    setShowPayrollView(false);
                    setShowCertificatesView(false);
                  }}
                >
                  <div className="wm-avatar">
                    <span className="wm-avatar-fallback">
                      {worker.initial}
                    </span>
                  </div>

                  <div className="wm-worker-text">
                    <div className="wm-worker-top-row">
                      <span className="wm-worker-name">{worker.name}</span>
                      <span className={statusInfo.className}>
                        {statusInfo.label}
                      </span>
                      {workerHasObjections && (
                        <span className="wm-badge wm-badge-danger-outline">
                          이의제기 대기
                        </span>
                      )}
                    </div>
                    <p className="wm-worker-role">{worker.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 오른쪽: 근로자 상세 */}
        <section className="wm-right">
          {selectedWorker ? (
            <div className="wm-right-inner">
              {/* 프로필 카드 */}
              <div className="wm-card wm-card-profile">
                <div className="wm-card-profile-inner">
                  <div className="wm-avatar-large-wrap">
                    <div className="wm-avatar-large">
                      <span className="wm-avatar-large-text">
                        {selectedWorker.initial}
                      </span>
                    </div>
                    <button className="wm-avatar-camera-btn">
                      <Camera className="wm-avatar-camera-icon" />
                    </button>
                  </div>
                  <div>
                    <h2 className="wm-profile-name">{selectedWorker.name}</h2>
                    <p className="wm-profile-role-site">
                      {selectedWorker.role} • {selectedWorker.site}
                    </p>
                    <p className="wm-profile-phone">{selectedWorker.phone}</p>
                  </div>
                </div>
              </div>

              {/* 개인정보 */}
              <div className="wm-card">
                <div className="wm-card-body">
                  <h3 className="wm-card-title">개인정보</h3>
                  <div className="wm-info-grid">
                    <div className="wm-info-item">
                      <p className="wm-info-label">주소</p>
                      <p className="wm-info-value">{selectedWorker.address}</p>
                    </div>
                    <div className="wm-info-item">
                      <p className="wm-info-label">생년월일</p>
                      <p className="wm-info-value">
                        {selectedWorker.birthDate}
                      </p>
                    </div>
                    <div className="wm-info-item">
                      <p className="wm-info-label">직종</p>
                      {editingField === "role" ? (
                        <div className="wm-edit-row">
                          <input
                            className="wm-input"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            className="wm-icon-btn wm-icon-btn-primary"
                            onClick={() => handleSaveField("role")}
                          >
                            <Check className="wm-icon-small" />
                          </button>
                          <button
                            className="wm-icon-btn"
                            onClick={() => {
                              setEditingField(null);
                              setTempValue("");
                            }}
                          >
                            <X className="wm-icon-small" />
                          </button>
                        </div>
                      ) : (
                        <div className="wm-info-editable">
                          <p className="wm-info-value">
                            {selectedWorker.role}
                          </p>
                          <button
                            className="wm-edit-icon-btn"
                            onClick={() =>
                              handleEditField("role", selectedWorker.role)
                            }
                          >
                            <Edit2 className="wm-icon-small" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="wm-info-item">
                      <p className="wm-info-label">현장명</p>
                      {editingField === "site-personal" ? (
                        <div className="wm-edit-row">
                          <input
                            className="wm-input"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            className="wm-icon-btn wm-icon-btn-primary"
                            onClick={() => handleSaveField("site")}
                          >
                            <Check className="wm-icon-small" />
                          </button>
                          <button
                            className="wm-icon-btn"
                            onClick={() => {
                              setEditingField(null);
                              setTempValue("");
                            }}
                          >
                            <X className="wm-icon-small" />
                          </button>
                        </div>
                      ) : (
                        <div className="wm-info-editable">
                          <p className="wm-info-value">
                            {selectedWorker.site}
                          </p>
                          <button
                            className="wm-edit-icon-btn"
                            onClick={() =>
                              handleEditField(
                                "site-personal",
                                selectedWorker.site,
                              )
                            }
                          >
                            <Edit2 className="wm-icon-small" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 추가 정보 */}
              <div className="wm-card">
                <div className="wm-card-body">
                  <div className="wm-info-grid">
                    <div className="wm-info-item">
                      <p className="wm-info-label">성별</p>
                      <p className="wm-info-value">{selectedWorker.gender}</p>
                    </div>
                    <div className="wm-info-item">
                      <p className="wm-info-label">국적</p>
                      <p className="wm-info-value">
                        {selectedWorker.nationality}
                      </p>
                    </div>
                    <div className="wm-info-item">
                      <p className="wm-info-label">전화번호</p>
                      <p className="wm-info-value">{selectedWorker.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 문서 관련 버튼 */}
              <div className="wm-doc-buttons">
                <button className="wm-doc-btn">
                  <div className="wm-doc-left">
                    <div className="wm-doc-icon-box wm-doc-icon-blue-bg">
                      <FileText className="wm-doc-icon wm-doc-icon-blue" />
                    </div>
                    <div className="wm-doc-text">
                      <p className="wm-doc-title">근로 계약서 보기</p>
                      <p className="wm-doc-subtitle">View Work Contract</p>
                    </div>
                  </div>
                  <ChevronRight className="wm-doc-chevron" />
                </button>

                <button
                  className="wm-doc-btn wm-doc-btn-yellow"
                  onClick={() => setShowPayrollView(true)}
                >
                  <div className="wm-doc-left">
                    <div className="wm-doc-icon-box wm-doc-icon-white-bg">
                      <DollarSign className="wm-doc-icon wm-doc-icon-yellow" />
                    </div>
                    <div className="wm-doc-text">
                      <p className="wm-doc-title">급여 명세서 보기</p>
                      <p className="wm-doc-subtitle">
                        View Payroll Statement
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="wm-doc-chevron" />
                </button>

                <button
                  className="wm-doc-btn wm-doc-btn-green"
                  onClick={() => setShowCertificatesView(true)}
                >
                  <div className="wm-doc-left">
                    <div className="wm-doc-icon-box wm-doc-icon-white-bg">
                      <Award className="wm-doc-icon wm-doc-icon-green" />
                    </div>
                    <div className="wm-doc-text">
                      <p className="wm-doc-title">자격증 보기</p>
                      <p className="wm-doc-subtitle">View Certificate</p>
                    </div>
                  </div>
                  <ChevronRight className="wm-doc-chevron" />
                </button>
              </div>

              {/* 출퇴근 기록 테이블 */}
              <div className="wm-card">
                <div className="wm-card-body">
                  <div className="wm-att-header">
                    <div>
                      <h3 className="wm-card-title">출퇴근 기록</h3>
                      <p className="wm-att-subtitle">Attendance History</p>
                    </div>
                    <button className="wm-download-btn">
                      <ArrowDownToLine className="wm-download-icon" />
                      <span>다운로드</span>
                    </button>
                  </div>

                  <div className="wm-table-wrap">
                    <table className="wm-table">
                      <thead>
                        <tr>
                          <th>날짜</th>
                          <th>출근</th>
                          <th>퇴근</th>
                          <th>상태</th>
                          <th>이의제기</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedWorker.attendanceRecords.map((record) => (
                          <tr
                            key={record.date}
                            className={
                              "wm-table-row " +
                              (record.objection?.hasObjection ? "wm-table-row-objection" : "")
                            }
                            onClick={() => handleOpenObjection(record)}
                          >
                            <td>{record.date}</td>
                            <td>
                              <div className="wm-time-cell wm-time-in">
                                <LogIn className="wm-time-icon" />
                                {formatTime(
                                  record.checkInTime,
                                  record.checkInPeriod,
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="wm-time-cell wm-time-out">
                                <LogOut className="wm-time-icon" />
                                {formatTime(
                                  record.checkOutTime,
                                  record.checkOutPeriod,
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={getStatusBadgeColor(
                                record.status,
                              )}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td>
                              {record.objection?.hasObjection ? (
                                <div className="wm-objection-cell">
                                  <span className="wm-badge wm-badge-objection">
                                    이의제기
                                  </span>
                                  <p className="wm-objection-text">
                                    {record.objection.message}
                                  </p>
                                </div>
                              ) : (
                                <span className="wm-objection-dash">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="wm-right-empty">
              <p className="wm-right-empty-title">근로자를 선택하세요</p>
              <p className="wm-right-empty-subtitle">
                왼쪽 목록에서 근로자를 선택하면 상세 정보가 표시됩니다
              </p>
            </div>
          )}
        </section>
      </div>

      {/* 이의제기 처리 모달 */}
            {/* Objection Processing Dialog - 커스텀 모달 */}
      {showObjectionDialog && selectedWorker && (
        <div className="wm-dialog-overlay">
          <div className="wm-dialog">
            {/* 헤더 */}
            <div className="wm-dialog-header">
              <div className="wm-dialog-title-row">
                <AlertCircle className="wm-dialog-title-icon" />
                <h2 className="wm-dialog-title">이의제기 처리</h2>
              </div>
              <p className="wm-dialog-description">
                근로자가 제기한 출퇴근 이의를 확인하고 기록을 수정하세요
              </p>

              <button
                className="wm-dialog-close"
                onClick={() => setShowObjectionDialog(false)}
              >
                <X className="wm-dialog-close-icon" />
              </button>
            </div>

            {/* 바디 */}
            <div className="wm-dialog-body">
              {/* 근로자 정보 카드 */}
              <div className="wm-worker-mini">
                <div className="wm-worker-mini-avatar">
                  {selectedWorker.initial}
                </div>
                <div>
                  <div className="wm-worker-mini-name">
                    {selectedWorker.name}
                  </div>
                  <div className="wm-worker-mini-sub">
                    {selectedWorker.role} · {selectedWorker.site}
                  </div>
                </div>
              </div>

              {/* 근로자 이의제기 내용 배너 */}
              {selectedWorker.attendanceRecords.find(
                (r) => r.date === objectionDate && r.objection?.hasObjection,
              ) && (
                <div className="wm-objection-banner">
                  <div className="wm-objection-banner-title">
                    <AlertCircle className="wm-objection-banner-icon" />
                    근로자 이의제기 내용
                  </div>
                  <p className="wm-objection-banner-text">
                    "
                    {
                      selectedWorker.attendanceRecords.find(
                        (r) =>
                          r.date === objectionDate &&
                          r.objection?.hasObjection,
                      )?.objection?.message
                    }
                    "
                  </p>
                </div>
              )}

              {/* 날짜 */}
              <div className="wm-field">
                <div className="wm-field-label">
                  <Calendar className="wm-field-label-icon" />
                  날짜
                </div>
                <input
                  type="date"
                  value={objectionDate}
                  onChange={(e) => setObjectionDate(e.target.value)}
                  className="wm-field-input"
                  disabled
                />
              </div>

              {/* 현재 기록된 시간 */}
              <div className="wm-field">
                <div className="wm-field-label">현재 기록된 시간</div>
                <div className="wm-current-time-row">
                  <div className="wm-current-time-item">
                    <LogIn className="wm-current-time-icon in" />
                    <span className="wm-current-time-label">출근:</span>
                    <span className="wm-current-time-value">
                      {
                        selectedWorker.attendanceRecords.find(
                          (r) => r.date === objectionDate,
                        )?.checkInPeriod
                      }{" "}
                      {
                        selectedWorker.attendanceRecords.find(
                          (r) => r.date === objectionDate,
                        )?.checkInTime
                      }
                    </span>
                  </div>
                  <div className="wm-current-time-item">
                    <LogOut className="wm-current-time-icon out" />
                    <span className="wm-current-time-label">퇴근:</span>
                    <span className="wm-current-time-value">
                      {
                        selectedWorker.attendanceRecords.find(
                          (r) => r.date === objectionDate,
                        )?.checkOutPeriod
                      }{" "}
                      {
                        selectedWorker.attendanceRecords.find(
                          (r) => r.date === objectionDate,
                        )?.checkOutTime
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* 수정할 출근 시간 */}
              <div className="wm-field">
                <div className="wm-field-label wm-field-label-green">
                  <LogIn className="wm-field-label-icon" />
                  수정할 출근 시간
                </div>
                <div className="wm-time-edit-row">
                  <select
                    className="wm-field-select"
                    value={objectionCheckInPeriod}
                    onChange={(e) => setObjectionCheckInPeriod(e.target.value)}
                  >
                    <option value="오전">오전</option>
                    <option value="오후">오후</option>
                  </select>
                  <input
                    type="time"
                    className="wm-field-input"
                    value={objectionCheckInTime}
                    onChange={(e) => setObjectionCheckInTime(e.target.value)}
                  />
                </div>
              </div>

              {/* 수정할 퇴근 시간 */}
              <div className="wm-field">
                <div className="wm-field-label wm-field-label-red">
                  <LogOut className="wm-field-label-icon" />
                  수정할 퇴근 시간
                </div>
                <div className="wm-time-edit-row">
                  <select
                    className="wm-field-select"
                    value={objectionCheckOutPeriod}
                    onChange={(e) =>
                      setObjectionCheckOutPeriod(e.target.value)
                    }
                  >
                    <option value="오전">오전</option>
                    <option value="오후">오후</option>
                  </select>
                  <input
                    type="time"
                    className="wm-field-input"
                    value={objectionCheckOutTime}
                    onChange={(e) => setObjectionCheckOutTime(e.target.value)}
                  />
                </div>
              </div>

              {/* 출퇴근 상태 */}
              <div className="wm-field">
                <div className="wm-field-label">
                  <AlertCircle className="wm-field-label-icon blue" />
                  출퇴근 상태
                </div>
                <select
                  className="wm-field-select"
                  value={objectionStatus}
                  onChange={(e) => setObjectionStatus(e.target.value)}
                >
                  <option value="정상 출근">정상 출근</option>
                  <option value="지각">지각</option>
                  <option value="조퇴">조퇴</option>
                  <option value="결근">결근</option>
                </select>
              </div>
            </div>

            {/* 푸터 버튼 */}
            <div className="wm-dialog-footer">
              <button
                className="wm-btn wm-btn-outline"
                onClick={() => setShowObjectionDialog(false)}
              >
                취소
              </button>
              <button
                className="wm-btn wm-btn-primary"
                onClick={handleProcessObjection}
              >
                처리 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}