// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import SignupPage from "./signup/SignupPage";
import DashboardPage from "./dashboard/DashboardPage";
import OfficeSelectionPage from "./pages/Office/OfficeSelectionPage";
import SiteCreatePage from "./site_create/SiteCreatePage";
import MyPagePage from "./MyPage/MyPagePage"; // ✅ 추가
import SiteDetailPage from "./pages/SiteDetailPage";
import WorkStatusPage from "./workStatus/WorkStatusPage"
import WorkerList from "./worker_management/WorkerListPage"
import Payroll from "./payroll/PayrollManagementPage"


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

        <Route path="/site/:siteId/work-status" element={<WorkStatusPage />} />
        <Route path="/site/:siteId/work-management" element={<WorkerList />} />
        <Route path="/site/:siteId/payroll" element={<Payroll />} />
        {/* ✅ 마이페이지 */}
        <Route path="/mypage" element={<MyPagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;