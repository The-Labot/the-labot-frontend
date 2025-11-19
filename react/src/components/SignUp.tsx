// src/components/SignUp.tsx
import { useState } from "react";
import { signUpAdmin } from "../api/authApi"; // 경로는 프로젝트 구조에 맞게

interface SignUpProps {
  onCancelClick?: () => void;
  onSubmitSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onCancelClick, onSubmitSuccess }) => {
  const [form, setForm] = useState({
    phoneNumber: "",
    name: "",
    password: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("회원가입 요청 바디:", form);

      const res = await signUpAdmin(form);

      console.log("회원가입 응답:", res.data);
      alert("회원가입이 완료되었습니다.");

      onSubmitSuccess?.();
    } catch (error: any) {
      console.error("회원가입 실패:", error);

      if (error.response) {
        // 백엔드까지는 도달한 경우 (status 코드 있음)
        alert(`회원가입 실패 (${error.response.status})`);
      } else {
        // 네트워크 에러 (현재처럼 ERR_FAILED 등)
        alert("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <form className="signup-container" onSubmit={handleSubmit}>
      {/* 상단 아이콘 + 제목 */}
      <div className="signup-header">
        <div className="signup-icon">
          <img src="/assets/signup-icon.png" alt="" />
        </div>
        <h1 className="signup-title">본사관리자 회원가입</h1>
        <p className="signup-subtitle">Head Office Manager Registration</p>
      </div>

      {/* 입력 폼 */}
      <div className="signup-grid">
        <div>
          <label className="form-label">이름 *</label>
          <input
            type="text"
            className="form-input"
            name="name"
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label">비밀번호 *</label>
          <input
            type="password"
            className="form-input"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label">이메일 *</label>
          <input
            type="email"
            className="form-input"
            name="email"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">전화번호 *</label>
          <input
            type="text"
            className="form-input"
            name="phoneNumber"
            placeholder="전화번호를 입력하세요"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label className="form-label">주소 *</label>
          <input
            type="text"
            className="form-input"
            name="address"
            placeholder="주소를 입력하세요"
            value={form.address}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="signup-buttons">
        <button
          type="button"
          className="signup-btn signup-btn--secondary"
          onClick={onCancelClick}
        >
          취소
        </button>

        <button type="submit" className="signup-btn signup-btn--primary">
          회원가입
        </button>
      </div>
    </form>
  );
};

export default SignUp;