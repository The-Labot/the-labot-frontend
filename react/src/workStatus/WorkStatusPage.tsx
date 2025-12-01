// src/pages/WorkStatusPage.tsx
import WorkStatus from "./WorkStatus";
import { useNavigate } from "react-router-dom";

export default function WorkStatusPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleOpenMyPage = () => {
    navigate("/mypage");
  };
  
  const handleDashBoard = () => {
    navigate("/dashboard");
  };

  return (
    <WorkStatus
      onLogout={handleLogout}
      onOpenMyPage={handleOpenMyPage}
      onDashBoard={handleDashBoard}
    />
  );
}

