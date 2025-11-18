// src/pages/Login/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import { Login } from "../../components/Login";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // 나중에 실제 로그인 성공 시 대시보드로 이동
    navigate("/office-select");
  };

  const handleSignUpClick = () => {
    // 회원가입 화면으로 이동
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSignUpClick={handleSignUpClick}
      />
    </div>
  );
}