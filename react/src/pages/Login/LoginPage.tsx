// src/pages/Login/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import { Login } from "../../components/Login";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (accessToken: string) => {
    // ✅ 여기서 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    // 이후 흐름
    navigate("/office-select");
  };

  const handleSignUpClick = () => {
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