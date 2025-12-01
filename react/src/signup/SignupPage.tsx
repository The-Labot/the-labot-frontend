// 예: React Router 쓰는 경우
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
        <SignUp
          onCancelClick={() => navigate("/login")}
          onSubmitSuccess={() => navigate("/login")}
        />
    </div>
  );
}