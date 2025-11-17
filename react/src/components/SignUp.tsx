// src/components/SignUp.tsx
import { useState } from "react";

type Mode = "new" | "existing";

interface SignUpProps {
  onCancelClick?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onCancelClick }) => {
  const [mode, setMode] = useState<Mode>("new");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연동 시 여기서 회원가입 요청
    console.log("submit, mode:", mode);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 탭 버튼 */}
      <div className="signup-tabs">
        <button
          type="button"
          className={
            "signup-tab " + (mode === "new" ? "signup-tab--active" : "")
          }
          onClick={() => setMode("new")}
        >
          새로운 본사 등록
        </button>
        <button
          type="button"
          className={
            "signup-tab " + (mode === "existing" ? "signup-tab--active" : "")
          }
          onClick={() => setMode("existing")}
        >
          기존 본사 참여
        </button>
      </div>

      {/* 사용자 정보 공통 섹션 */}
      <h2 className="signup-section-title">사용자 정보</h2>
      <div className="signup-grid" style={{ marginBottom: 32 }}>
        <div>
          <label className="form-label">아이디</label>
          <input
            className="form-input"
            placeholder="아이디를 입력하세요"
            type="text"
          />
        </div>
        <div>
          <label className="form-label">비밀번호</label>
          <input
            className="form-input"
            placeholder="비밀번호를 입력하세요"
            type="password"
          />
        </div>
        <div>
          <label className="form-label">이름</label>
          <input
            className="form-input"
            placeholder="이름을 입력하세요"
            type="text"
          />
        </div>
        <div>
          <label className="form-label">이메일</label>
          <input
            className="form-input"
            placeholder="이메일을 입력하세요"
            type="email"
          />
        </div>
        <div className="signup-grid--single" style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">주소</label>
          <input
            className="form-input"
            placeholder="주소를 입력하세요"
            type="text"
          />
        </div>
      </div>

      {/* 모드별 섹션 */}
      {mode === "new" ? (
        <>
          <h2 className="signup-section-title">본사 정보</h2>
          <div className="signup-grid">
            <div className="signup-grid--single" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">본사 코드</label>
              <input
                className="form-input"
                placeholder="본사 코드를 입력하세요"
                type="text"
              />
              <p className="signup-helper-text">
                이 코드는 다른 관리자가 본사에 참여할 때 사용됩니다.
              </p>
            </div>

            <div>
              <label className="form-label">본사명</label>
              <input
                className="form-input"
                placeholder="본사명을 입력하세요"
                type="text"
              />
            </div>
            <div>
              <label className="form-label">대표자명</label>
              <input
                className="form-input"
                placeholder="대표자명을 입력하세요"
                type="text"
              />
            </div>

            <div>
              <label className="form-label">사업자등록번호</label>
              <input
                className="form-input"
                placeholder="사업자등록번호를 입력하세요"
                type="text"
              />
            </div>

            <div className="signup-grid--single" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">주소</label>
              <input
                className="form-input"
                placeholder="주소를 입력하세요"
                type="text"
              />
            </div>

            <div>
              <label className="form-label">사무실 전화번호</label>
              <input
                className="form-input"
                placeholder="사무실 전화번호를 입력하세요"
                type="tel"
              />
            </div>
            <div>
              <label className="form-label">사무실 이메일</label>
              <input
                className="form-input"
                placeholder="사무실 이메일을 입력하세요"
                type="email"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="signup-section-title">본사 코드</h2>
          <div className="signup-grid signup-grid--single">
            <div>
              <label className="form-label">본사 코드</label>
              <input
                className="form-input"
                placeholder="관리자로부터 받은 본사 코드를 입력하세요"
                type="text"
              />
              <p className="signup-helper-text">
                관리자로부터 제공받은 본사 코드를 입력하세요.
              </p>
            </div>
          </div>
        </>
      )}

      {/* 버튼들 */}
       <div className="signup-buttons">
        <button
          type="button"
          className="signup-btn signup-btn--secondary"
          onClick={onCancelClick}
        >
          취소
        </button>
        <button
          type="submit"
          className="signup-btn signup-btn--primary"
        >
          등록
        </button>
      </div>
    </form>
  );
};

export default SignUp;