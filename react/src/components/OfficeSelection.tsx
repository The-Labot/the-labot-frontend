// src/components/OfficeSelection.tsx
import { Building2, Plus, Key, ArrowRight } from "lucide-react";
import { useState } from "react";
import "./OfficeSelection.css";
import { createHeadOffice, checkHeadOffice } from "../api/headOfficeApi";
import type { CreateHeadOfficeRequest } from "../api/headOfficeApi";

type Mode = "choice" | "new" | "code";

export default function OfficeSelection({
  onLogout,
  onComplete,
}: {
  onLogout: () => void;
  onComplete: () => void;
}) {
  const [mode, setMode] = useState<Mode>("choice");

  // 새로운 본사 등록용 상태
  const [officeName, setOfficeName] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 본사 코드 참여용 상태 (나중에 API 붙일 때 사용)
  const [joinCode, setJoinCode] = useState("");
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  // ✅ 새로운 본사 등록 제출 핸들러 (백엔드 연결)
  const handleNewOfficeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload: CreateHeadOfficeRequest = {
        name: officeName,
        address,
        phoneNumber: phone,
        representative: representativeName,
      };

      const res = await createHeadOffice(payload);

      // 디버깅용(한번만 찍어보면 좋아요)
      console.log("본사 등록 응답:", res.data);

      // ✅ secretCode 꺼내기
      const secretCode = res.data.data.secretCode;

      // secretCode 방어코드 (혹시 몰라서)
      if (!secretCode) {
        console.warn("secretCode가 응답에 없습니다:", res.data);
        alert("본사 등록은 되었지만 코드 정보를 받지 못했습니다.");
      } else {
        console.log("발급된 본사 코드:", secretCode);
        alert(`본사 등록이 완료되었습니다.\n발급된 본사 코드: ${secretCode}`);
      }

      onComplete();
    } catch (error) {
      console.error("본사 등록 실패:", error);
      alert("본사 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 본사 코드 참여는 아직 API 없으니 onComplete만 호출 (나중에 수정)
  // 🔁 이 함수 전체를 교체해줘
  // ✅ 본사 코드 검증 + 존재하는 코드일 때만 참여
const handleJoinCodeSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isCheckingCode) return;
  setIsCheckingCode(true);

  try {
    const code = joinCode.trim();
    if (!code) {
      alert("본사 코드를 입력해주세요.");
      return;
    }

    const res = await checkHeadOffice({ secretCode: code });
    console.log("본사 코드 검증 응답:", res.data);

    const { status, message, data } = res.data;

    // 1) status가 200이 아니거나
    // 2) data가 없거나(null)
    // 3) name이 없거나(null) 이면 → 유효하지 않은 코드로 처리
    if (status !== 200 || !data || !data.name) {
      alert(message || "유효하지 않은 본사 코드입니다.");
      return;            // ❗ 여기서 끝나므로 onComplete() 안 타고, 다음 페이지 안 감
    }

    // ✅ 여기까지 왔으면 존재하는 본사
    const officeName = data.name;
    alert(`"${officeName}" 본사 코드가 확인되었습니다.\n본사에 참여합니다.`);

    onComplete(); // 대시보드로 이동
  } catch (error: any) {
    console.error("본사 코드 검증 실패:", error);

    // 백엔드가 404를 주는 경우도 대비
    if (error.response?.status === 404) {
      alert("존재하지 않는 본사 코드입니다.");
    } else {
      alert("본사 코드 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  } finally {
    setIsCheckingCode(false);
  }
};

  /* -------------------- 모드별 렌더링 -------------------- */

  // 1) 첫 화면: 본사 선택
  if (mode === "choice") {
    return (
      <div className="office-wrapper">
        <div className="office-container">
          {/* Header */}
          <div className="office-header">
            <div className="icon-circle blue-bg">
              <Building2 className="icon-lg white" />
            </div>
            <h1>본사 선택</h1>
            <p>새로운 본사를 등록하거나 기존 본사 코드를 입력하세요</p>
          </div>

          {/* 두 개 카드 */}
          <div className="office-card-row">
            {/* 새로운 본사 등록 */}
            <div className="office-card" onClick={() => setMode("new")}>
              <div className="icon-square blue-light">
                <Plus className="icon-md blue" />
              </div>
              <h2>새로운 본사 등록하기</h2>
              <p className="desc">
                새로운 본사를 등록하고 관리를 시작합니다. 본사 정보를 입력하여 시스템을
                설정하세요.
              </p>
              <div className="card-link blue">
                시작하기 <ArrowRight className="arrow-small" />
              </div>
            </div>

            {/* 본사 코드 입력 */}
            <div className="office-card" onClick={() => setMode("code")}>
              <div className="icon-square yellow-light">
                <Key className="icon-md yellow" />
              </div>
              <h2>본사 코드 입력하기</h2>
              <p className="desc">
                기존 본사의 관리자로부터 받은 코드를 입력하여 본사에 참여합니다.
              </p>
              <div className="card-link yellow">
                참여하기 <ArrowRight className="arrow-small" />
              </div>
            </div>
          </div>

          {/* 로그아웃 */}
          <div className="office-logout">
            <button onClick={onLogout}>뒤로 가기</button>
          </div>
        </div>
      </div>
    );
  }

  // 2) 새로운 본사 등록 화면 (✅ 기존 레이아웃 + 본사코드 인풋 제거 + 서버연결)
  if (mode === "new") {
    return (
      <div className="office-wrapper">
        <div className="office-form-card">
          <h1>새로운 본사 등록</h1>
          <p style={{ textAlign: "center", color: "#6B7280", marginBottom: 24 }}>
            본사 정보를 입력하여 등록을 완료하세요
          </p>

          <form onSubmit={handleNewOfficeSubmit}>
            <label>
              본사명 *
              <input
                type="text"
                placeholder="본사명을 입력하세요"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                required
              />
            </label>

            <label>
              대표자명 *
              <input
                type="text"
                placeholder="대표자명을 입력하세요"
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                required
              />
            </label>

            <label>
              전화번호 *
              <input
                type="text"
                placeholder="전화번호를 입력하세요"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>

            <label>
              주소 *
              <input
                type="text"
                placeholder="주소를 입력하세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>

            <div className="form-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMode("choice")}
              >
                뒤로가기
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3) 본사 코드 입력 화면
    return (
      <div className="office-wrapper">
        <div className="office-form-card small">
          <h1>본사 코드 입력</h1>

          <form onSubmit={handleJoinCodeSubmit}>
            <label>
              본사 코드
              <input
                type="text"
                placeholder="본사 코드를 입력하세요"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
              />
            </label>

            <div className="form-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMode("choice")}
              >
                뒤로가기
              </button>
              <button
                type="submit"
                className="btn-yellow"
                disabled={isCheckingCode}
              >
                {isCheckingCode ? "확인 중..." : "참여하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}