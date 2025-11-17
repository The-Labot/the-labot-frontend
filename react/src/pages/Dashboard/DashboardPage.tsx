import { useNavigate } from "react-router-dom";
import  Dashboard  from "../../components/Dashboard";

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return <Dashboard onLogout={handleLogout} />;
}