import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SiteManagerPage.css";

import { getSiteManagers, createSiteManager } from "../api/siteManagerApi";

export default function SiteManagerPage() {
  const navigate = useNavigate();
  const { siteId } = useParams();

  const [managers, setManagers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phoneNumber: "" });

  useEffect(() => {
    if (siteId) fetchManagers(Number(siteId));
  }, [siteId]);

  const fetchManagers = async (id: number) => {
    try {
      const data = await getSiteManagers(id);
      setManagers(data);
    } catch (e) {
      console.error("관리자 조회 실패", e);
    }
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.phoneNumber.trim()) {
      alert("이름과 전화번호를 입력하세요.");
      return;
    }

    try {
      await createSiteManager(Number(siteId), form);
      alert("현장관리자가 등록되었습니다.");

      setForm({ name: "", phoneNumber: "" });
      setShowForm(false);
      fetchManagers(Number(siteId));

    } catch (e) {
      console.error("관리자 등록 실패", e);
      alert("등록 중 오류 발생");
    }
  };

  return (
    <div className="site-manager-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로가기</button>
      <div className="site-manager-container">
        {/* HEADER */}
        <div className="site-manager-header">
          <h2>현장관리자 관리</h2>
        </div>

        {/* ADD BUTTON */}
        <button
          className="add-manager-btn"
          onClick={() => setShowForm(!showForm)}
        >
          현장관리자 추가하기
        </button>

        {/* FORM BOX */}
        {showForm && (
          <div className="create-manager-box">
            <input
              placeholder="이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="전화번호 (예: 01012345678)"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />

            <button className="submit-btn" onClick={handleRegister}>
              등록
            </button>
          </div>
        )}

        {/* MANAGER LIST */}
        <div className="manager-list">
          {managers.length === 0 ? (
            <p className="empty-text">등록된 현장관리자가 없습니다.</p>
          ) : (
            managers.map((m) => (
              <div className="manager-card" key={m.id}>
                <div className="manager-name">{m.name}</div>
                <div className="manager-phone">{m.phone}</div>
              </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
