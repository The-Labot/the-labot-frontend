// 예: React Router 쓰는 경우
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignUp from "../../components/SignUp";

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-logo-wrapper">
          <div className="signup-logo-circle">
            <Building2 size={32} color="#ffffff" />
          </div>
          <h1 className="signup-title">본사관리자 회원가입</h1>
        </div>

        <SignUp
          onCancelClick={() => navigate("/login")}
          onSubmitSuccess={() => navigate("/login")}
        />
      </div>
    </div>
  );
}