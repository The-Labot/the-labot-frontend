// src/components/Login.tsx
import { Building2 } from "lucide-react";
import { useState } from "react";
import { login } from "../api/authApi";

interface LoginProps {
  onSignUpClick: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onSignUpClick, onLoginSuccess }: LoginProps) {
  // 🔹 화면에서 실제로 입력받는 값만 상태로 관리
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🔹 요청 보낼 때만 clientType: "WEB" 붙여서 전송
    const payload = {
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      clientType: "WEB" as const,
    };

    try {
      console.log("Login attempt:", payload);

      const res = await login(payload); // { phoneNumber, password, clientType }

      console.log("Login response:", res.data);

      // 필요하면 여기서 토큰 꺼내서 localStorage에 저장
      // const accessToken = res.data.data.accessToken;
      // if (accessToken) {
      //   localStorage.setItem("accessToken", accessToken);
      // }

      alert("로그인에 성공했습니다.");
      onLoginSuccess(); // 👉 대시보드로 이동 등
    } catch (error: any) {
      console.error("로그인 실패:", error);

      if (error.response) {
        alert(`로그인 실패 (${error.response.status})`);
      } else {
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
    }
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
        {/* 전화번호(아이디) */}
        <div className="form-field">
          <label htmlFor="phoneNumber" className="form-label">
            전화번호 (아이디)
          </label>
          <input
            id="phoneNumber"
            type="text"
            className="form-input"
            placeholder="로그인용 전화번호를 입력하세요"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
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