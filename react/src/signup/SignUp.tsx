// src/components/SignUp.tsx
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { signUpAdmin } from "../api/authApi";
import "./SignUp.css";

interface SignUpProps {
  onCancelClick?: () => void;
  onSubmitSuccess?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onCancelClick, onSubmitSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    password: "",
    passwordConfirm: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      const onlyNum = value.replace(/[^0-9]/g, "");
      setForm((prev) => ({ ...prev, phoneNumber: onlyNum }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("이름은 필수 입력 항목입니다.");
    if (!form.phoneNumber.trim()) return alert("전화번호는 필수입니다.");
    if (form.phoneNumber.length < 10 || form.phoneNumber.length > 11)
      return alert("전화번호는 10~11자리 숫자만 입력 가능합니다.");
    if (form.password.length < 6) return alert("비밀번호는 6자 이상 입력해야 합니다.");
    if (form.password !== form.passwordConfirm)
      return alert("비밀번호가 서로 일치하지 않습니다.");
    if (!form.email.trim()) return alert("이메일은 필수 입력 항목입니다.");

    const payload = {
      name: form.name,
      phoneNumber: form.phoneNumber,
      password: form.password,
      email: form.email,
      address: form.address,
    };

    try {
      await signUpAdmin(payload);
      alert("회원가입이 완료되었습니다.");
      onSubmitSuccess?.();
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-container" onSubmit={handleSubmit}>
        {/* 헤더 */}
        <div className="signup-header">
          <div className="signup-icon">
            <UserPlus size={36} color="#ffffff" />
          </div>
          <h1 className="signup-title">본사관리자 회원가입</h1>
          <p className="signup-subtitle">Head Office Manager Registration</p>
        </div>

        {/* 섹션: 기본 정보 */}
        <div className="signup-section">
          <h3 className="signup-section-title">기본 정보</h3>

          <div className="signup-grid">
            <div className="signup-field">
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

            <div className="signup-field">
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

            <div className="signup-field">
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

            <div className="signup-field">
              <label className="form-label">주소</label>
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
        </div>

        {/* 섹션: 계정 정보 */}
        <div className="signup-section">
          <h3 className="signup-section-title"></h3>

          <div className="signup-grid">
            <div className="signup-field">
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

            <div className="signup-field">
              <label className="form-label">비밀번호 확인 *</label>
              <input
                type="password"
                className="form-input"
                name="passwordConfirm"
                placeholder="비밀번호를 다시 입력하세요"
                value={form.passwordConfirm}
                onChange={handleChange}
              />
            </div>
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
    </div>
  );
};

export default SignUp;
