// src/pages/Login/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import { Login } from "./Login";
import { checkHeadOfficeExists } from "../api/headOfficeApi";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (accessToken: string) => {
  // 토큰 저장
  localStorage.setItem("accessToken", accessToken);

  try {
    const response = await checkHeadOfficeExists();
    const hasHeadOffice = response.data.data.hasHeadOffice;

    if (hasHeadOffice) {
      navigate("/dashboard");
    } else {
      navigate("/office-select");
    }
  } catch (e) {
    console.error("본사 여부 조회 실패:", e);
    navigate("/office-select");
  }
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