// src/components/Login.tsx
import { Building2 } from "lucide-react";
import { useState } from "react";
import { login } from "../api/authApi";

interface LoginProps {
  onSignUpClick: () => void;
  // 선택사항: accessToken(앞의 Bearer 제거된 순수 토큰)을 상위로 넘겨줌
  onLoginSuccess?: (accessToken: string) => void;
}

export function Login({ onSignUpClick, onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      clientType: "WEB" as const,
    };

    try {
      console.log("Login attempt:", payload);

      const res = await login(payload);
      console.log("Login response:", res.data);

      // 로그인 응답: { token: "Bearer ...", role: "ROLE_ADMIN", userId, name }
      const rawToken: string | undefined = res.data?.token;

      if (!rawToken) {
        alert("로그인 응답에서 token 값을 찾을 수 없습니다.");
        return;
      }

      // ✅ 백엔드가 "Bearer ..." 를 주면 앞부분 잘라내고, 아니면 그대로 사용
      const accessToken = rawToken.startsWith("Bearer ")
        ? rawToken.slice("Bearer ".length)
        : rawToken;

      // ✅ 이후 모든 API에서 쓰도록 localStorage 에 '순수 토큰' 저장
      localStorage.setItem("authToken", accessToken); // axios 인터셉터에서 Bearer 붙임
      localStorage.setItem("adminName", res.data?.name ?? "");
      localStorage.setItem("adminId", String(res.data?.userId ?? ""));

      // 선택적으로 상위 컴포넌트에 토큰 전달
      if (onLoginSuccess) {
        onLoginSuccess(accessToken);
      }

      alert("로그인에 성공했습니다.");
    } catch (error: any) {
      console.error("로그인 실패:", error);

      if (error.response) {
        alert(
          `로그인 실패 (${error.response.status})\n${
            error.response.data?.message ?? ""
          }`
        );
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