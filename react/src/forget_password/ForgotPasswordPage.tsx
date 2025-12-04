// src/pages/ForgotPassword/ForgotPasswordPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import { requestTempPassword } from "../api/passwordApi";

export default function ForgotPasswordPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await requestTempPassword(name, phone);

      setMessage(res.message || "임시 비밀번호가 문자로 발송되었습니다.");

      // 1.5초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        {/* ======== 뒤로가기 버튼 ======== */}
        <button className="back-btn" onClick={() => navigate("/login")}>
          ← 로그인으로 돌아가기
        </button>

        <h2 className="forgot-title">비밀번호 찾기</h2>
        <p className="forgot-sub">
          이름과 전화번호를 입력하면 임시 비밀번호를 전송해드립니다.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <label className="input-label">이름</label>
          <input
            className="input-field"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="input-label">전화번호</label>
          <input
            className="input-field"
            type="tel"
            placeholder="01012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <button className="forgot-btn" type="submit">
            임시 비밀번호 발급
          </button>
        </form>

        {message && <div className="success-msg">{message}</div>}
        {error && <div className="error-msg">{error}</div>}
      </div>
    </div>
  );
}
