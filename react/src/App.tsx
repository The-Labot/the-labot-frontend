// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import SignupPage from "./pages/Signup/SignupPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import OfficeSelectionPage from "./pages/Office/OfficeSelectionPage";
import SiteCreatePage from "./pages/Site/SiteCreatePage";
import MyPagePage from "./pages/MyPage/MyPagePage"; // ✅ 추가
import SiteDetailPage from "./pages/SiteDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 로그인 후 여기를 거쳐야 함 */}
        <Route path="/office-select" element={<OfficeSelectionPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/site/create" element={<SiteCreatePage />} />

        <Route path="/site/:siteId" element={<SiteDetailPage />} />
        {/* ✅ 마이페이지 */}
        <Route path="/mypage" element={<MyPagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;