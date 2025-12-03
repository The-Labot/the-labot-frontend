import { useNavigate } from "react-router-dom";
import OfficeSelection from "./OfficeSelection";

export default function OfficeSelectionPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <OfficeSelection 
      onLogout={handleLogout}
      onComplete={handleComplete}
    />
  );
}