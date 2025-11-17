// src/components/Login.tsx
import { Building2 } from "lucide-react";
import { useState } from "react";

interface LoginProps {
  onSignUpClick: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onSignUpClick, onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt:", formData);
    // TODO: 실제 로그인 로직
    onLoginSuccess();
  };

  return (
    <div className="login-card">
      {/* 로고 + 타이틀 */}
      <div className="login-logo-wrapper">
        <div className="login-logo-circle">
          <Building2 size={32} color="#ffffff" />
        </div>
        <h1 className="login-title">본사관리자 로그인</h1>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="login-form">
        {/* 아이디 */}
        <div className="form-field">
          <label htmlFor="id" className="form-label">
            아이디
          </label>
          <input
            id="id"
            type="text"
            className="form-input"
            placeholder="아이디를 입력하세요"
            value={formData.id}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, id: e.target.value }))
            }
          />
        </div>

        {/* 비밀번호 */}
        <div className="form-field">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </div>

        {/* 로그인 버튼 */}
        <button type="submit" className="primary-button">
          로그인
        </button>
      </form>

      {/* 하단 링크 */}
      <div className="login-links">
        <button type="button" className="muted-link">
          아이디 / 비밀번호 찾기
        </button>
        <span className="login-divider">|</span>
        <button
          type="button"
          className="primary-link"
          onClick={onSignUpClick}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}