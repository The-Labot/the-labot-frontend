// src/pages/Dashboard/DashboardPage.tsx
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const handleCreateSite = () => {
    navigate("/site/create");
  };

  const handleOpenMyPage = () => {
    navigate("/mypage");
  };

  const handleDashBoard = () => {
    navigate("/dashboard");
  };

  return (
    <Dashboard
      onLogout={handleLogout}
      onCreateSite={handleCreateSite}
      onOpenMyPage={handleOpenMyPage} // ✅ 추가
      onDashBoard={handleDashBoard}
    />
  );
}