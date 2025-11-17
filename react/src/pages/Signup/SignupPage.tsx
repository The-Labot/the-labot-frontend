// src/pages/Signup/SignupPage.tsx
import { Building2 } from "lucide-react";
import SignUp from "../../components/SignUp";

export default function SignupPage() {
  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* 로고 + 제목 */}
        <div className="signup-logo-wrapper">
          <div className="signup-logo-circle">
            <Building2 size={32} color="#ffffff" />
          </div>
          <h1 className="signup-title">본사관리자 회원가입</h1>
        </div>

        {/* 실제 폼 UI */}
        <SignUp />
      </div>
    </div>
  );
}