// src/pages/MyPage/MyPagePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Edit3 } from "lucide-react";
import "./MyPagePage.css";
import type { HeadOfficeData, ApiResponse } from "../../api/adminHeadOfficeApi";
import {
  getHeadOffice,
  updateHeadOffice,
  regenerateHeadOfficeCode
} from "../../api/adminHeadOfficeApi";

interface HeadOfficeInfo {
  headOfficeName: string;
  headOfficeCode: string;
  ceoName: string;
  phoneNumber: string;
  email: string;          // 프론트 전용
  address: string;
  addressDetail: string;  // 프론트 전용
}

export default function MyPagePage() {
  const navigate = useNavigate();

  // ------------------------------
  // 상태 관리
  // ------------------------------
  const [form, setForm] = useState<HeadOfficeInfo>({
    headOfficeName: "",
    headOfficeCode: "",
    ceoName: "",
    phoneNumber: "",
    email: "",
    address: "",
    addressDetail: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------
  // 입력 핸들러
  // ------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------------
  // 뒤로가기
  // ------------------------------
  const handleBack = () => {
    navigate("/dashboard");
  };

  // ------------------------------
  // 본사 정보 조회 (GET)
  // ------------------------------
  useEffect(() => {
    const fetchHeadOffice = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("로그인 정보가 없습니다. 다시 로그인 해주세요.");
          return;
        }

        const res = await getHeadOffice(token);
        const data: HeadOfficeData = res.data.data;

        // 프론트 전용 필드(email, addressDetail)는 유지
        setForm((prev) => ({
          ...prev,
          headOfficeName: data.name ?? "",
          headOfficeCode: data.secretCode ?? "",
          ceoName: data.representative ?? "",
          phoneNumber: data.phoneNumber ?? "",
          address: data.address ?? "",
        }));
      } catch (err: any) {
        console.error("❌ 본사 정보 조회 실패:", err);

        if (err.response) {
          setError(
            `본사 정보를 불러오지 못했습니다. (status: ${err.response.status})`
          );
        } else {
          setError("네트워크 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHeadOffice();
  }, []);
    // ------------------------------
  // 수정 취소
  // ------------------------------
  const handleCancel = () => {
    setIsEditing(false);
  };
  // 본사 코드 재생성 (GET /admin/head-office/secret-code)
// ------------------------------
const handleRegenerateCode = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const res = await regenerateHeadOfficeCode(token);
    const newCode = res.data.data;

    alert("본사 코드가 재생성되었습니다!");

    setForm((prev) => ({
      ...prev,
      headOfficeCode: newCode,
    }));
  } catch (err: any) {
    console.error("❌ 본사 코드 재생성 실패:", err);

    if (err.response) {
      alert(
        `재생성 실패 (status: ${err.response.status}) ${err.response.data?.message}`
      );
    } else {
      alert("네트워크 오류로 재생성에 실패했습니다.");
    }
  }
};
  // ------------------------------
  // 본사 수정 (PUT)
  // ------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const payload = {
        name: form.headOfficeName,
        address: form.address,
        phoneNumber: form.phoneNumber,
        representative: form.ceoName,
        secretCode: form.headOfficeCode, // 수정 불가지만 API는 요구
      };

      console.log("📌 본사 수정 요청 payload:", payload);

      const res = await updateHeadOffice(token, payload);
      console.log("📌 본사 수정 성공:", res);

      alert("본사 정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);
    } catch (err: any) {
      console.error("❌ 본사 수정 실패:", err);

      if (err.response) {
        alert(
          `본사 수정 실패: (status ${err.response.status}) ${err.response.data?.message}`
        );
      } else {
        alert("네트워크 오류로 본사 수정에 실패했습니다.");
      }
    }
  };

  // ------------------------------
  // 화면 렌더링
  // ------------------------------
  return (
    <div className="mypage-page">
      <div className="mypage-header">
        <button type="button" className="ghost-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>현장 대시보드로 돌아가기</span>
        </button>

        <h1 className="mypage-title">마이페이지</h1>

        <div className="mypage-actions">
          {!isEditing ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => setIsEditing(true)}
              disabled={loading || !!error}
            >
              <Edit3 size={16} />
              <span>정보 수정</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                type="submit"
                form="mypage-form"
                className="primary-button"
              >
                <Save size={16} />
                <span>저장</span>
              </button>
            </>
          )}
        </div>
      </div>

      <form id="mypage-form" className="mypage-form" onSubmit={handleSubmit}>
        {loading && (
          <div className="loading-text">본사 정보를 불러오는 중입니다...</div>
        )}
        {error && <div className="error-text">{error}</div>}

        {/* 📌 본사 정보 카드 */}
        <section className="form-card">
          <h2 className="form-card-title">본사 정보</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="headOfficeName">본사명 *</label>
              <input
                id="headOfficeName"
                name="headOfficeName"
                value={form.headOfficeName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-field">
              <label htmlFor="ceoName">대표자명</label>
              <input
                id="ceoName"
                name="ceoName"
                value={form.ceoName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-field">
              <label htmlFor="phoneNumber">대표 전화번호</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="02-000-0000"
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="address">사업장 주소</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="addressDetail">상세 주소</label>
              <input
                id="addressDetail"
                name="addressDetail"
                value={form.addressDetail}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </section>

        {/* 📌 본사 코드 카드 */}
        <section className="form-card">
          <h2 className="form-card-title">본사 코드</h2>
          <p className="help-text">
            회원가입 시 발급된 본사 코드입니다. 다른 관리자도 이 코드를 입력하면
            같은 본사로 가입됩니다.
          </p>

          <div className="code-row">
            <input
              className="code-input readonly-input"
              value={form.headOfficeCode}
              readOnly
            />
             <button
            type="button"
            className="regen-button"
            style={{ marginLeft: "12px", padding: "1px auto" }}
            onClick={handleRegenerateCode}
            disabled={!isEditing}   // 수정 모드에서만 활성화
          >
            본사 코드 재생성
          </button>
        </div>

        <p className="code-hint">※ 본사 코드를 재생성하면 기존 코드는 사용할 수 없습니다.</p>
        <p className="code-hint">※ 정보수정 버튼을 눌러야 본사코드재생성 버튼이 활성화 됩니다.</p>

        </section>
      </form>
    </div>
  );
}