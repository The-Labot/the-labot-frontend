import { useState } from "react";

interface SignUpProps {
  onCancelClick?: () => void;
  onSubmitSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onCancelClick, onSubmitSuccess }) => {
  const [form, setForm] = useState({
    userId: "",
    name: "",
    password: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // API는 나중에 연결할 예정이므로 지금은 submit만 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입 데이터:", form);

    alert("회원가입 요청됨 (API 연결 전)");

    if (onSubmitSuccess) onSubmitSuccess();
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
          <label className="form-label">아이디 *</label>
          <input
            type="text"
            className="form-input"
            name="userId"
            placeholder="아이디를 입력하세요"
            value={form.userId}
            onChange={handleChange}
          />
        </div>

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
            name="phone"
            placeholder="전화번호를 입력하세요"
            value={form.phone}
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