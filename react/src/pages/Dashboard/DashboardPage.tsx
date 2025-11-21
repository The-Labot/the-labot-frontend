// src/pages/Dashboard/DashboardPage.tsx
import { useNavigate } from "react-router-dom";
import Dashboard from "../../components/Dashboard";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleCreateSite = () => {
    navigate("/site/create");
  };

  const handleOpenMyPage = () => {
    navigate("/mypage");
  };

  return (
    <Dashboard
      onLogout={handleLogout}
      onCreateSite={handleCreateSite}
      onOpenMyPage={handleOpenMyPage} // ✅ 추가
    />
  );
}