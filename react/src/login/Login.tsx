// src/components/Login.tsx
import { Building2 } from "lucide-react";
import { useState } from "react";
import { login } from "../api/authApi";
import "./Login.css";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onSignUpClick: () => void;
  onLoginSuccess?: (accessToken: string) => void;
}

export function Login({ onSignUpClick, onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      clientType: "WEB" as const,
    };

    try {
      const res = await login(payload);
      const rawToken = res.data?.token;

      if (!rawToken) {
        alert("로그인 token 을 찾을 수 없습니다.");
        return;
      }

      const accessToken = rawToken.startsWith("Bearer ")
        ? rawToken.substring(7)
        : rawToken;

      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("adminName", res.data?.name ?? "");
      localStorage.setItem("adminId", String(res.data?.userId ?? ""));

      onLoginSuccess?.(accessToken);
      alert("로그인 성공");
    } catch (err: any) {
      console.error("로그인 실패:", err);
      alert("로그인 실패");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Building2 size={34} color="#fff" />
          </div>
          <h1>본사관리자 로그인</h1>
          <p className="login-sub">Head Office Administrator</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>전화번호 (아이디)</label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="전화번호를 입력하세요"
            />
          </div>

          <div className="form-field">
            <label>비밀번호</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button className="login-btn" type="submit">
            로그인
          </button>
        </form>

        <div className="login-footer">
          <button className="footer-link muted" 
                  onClick={() => navigate(`/forgot-password`)}
          >비밀번호 찾기</button>
          <span className="divider">|</span>
          <button className="footer-link primary" onClick={onSignUpClick}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
