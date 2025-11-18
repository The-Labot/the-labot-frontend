// src/components/OfficeSelection.tsx
import { Building2, Plus, Key, ArrowRight } from "lucide-react";
import { useState } from "react";
import "./OfficeSelection.css";

type Mode = "choice" | "new" | "code";

export default function OfficeSelection({
  onLogout,
  onComplete,
}: {
  onLogout: () => void;
  onComplete: () => void;
}) {
  const [mode, setMode] = useState<Mode>("choice");

  if (mode === "choice") {
    return (
      <div className="office-wrapper">
        <div className="office-container">

          {/* Header */}
          <div className="office-header">
            <div className="icon-circle blue">
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
            <button onClick={onLogout}>로그아웃</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "new") {
    return (
      <div className="office-wrapper">
        <div className="office-form-card">
          <h1>새로운 본사 등록</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onComplete(); // 👉 등록 후 대시보드로 이동
            }}
          >
            <label>
              본사명 *
              <input type="text" placeholder="본사명을 입력하세요" required />
            </label>

            <label>
              본사 코드 *
              <input type="text" placeholder="고유 코드를 생성하세요" required />
            </label>

            <label>
              대표자명 *
              <input type="text" placeholder="대표자명을 입력하세요" required />
            </label>

            <label>
              전화번호 *
              <input type="text" placeholder="전화번호를 입력하세요" required />
            </label>

            <label>
              주소 *
              <input type="text" placeholder="주소를 입력하세요" required />
            </label>

            <div className="form-buttons">
              <button type="button" className="btn-secondary" onClick={() => setMode("choice")}>
                뒤로가기
              </button>
              <button type="submit" className="btn-primary">
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="office-wrapper">
      <div className="office-form-card small">
        <h1>본사 코드 입력</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onComplete(); // 👉 참여하기 → 대시보드 이동
          }}
        >
          <label>
            본사 코드
            <input type="text" placeholder="본사 코드를 입력하세요" required />
          </label>

          <div className="form-buttons">
            <button type="button" className="btn-secondary" onClick={() => setMode("choice")}>
              뒤로가기
            </button>
            <button type="submit" className="btn-yellow">
              참여하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}