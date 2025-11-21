import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Edit3 } from "lucide-react";
import "./MyPagePage.css";
import apiClient from "../../api/apiClient";

// 백엔드 문서 기준 응답 예시:
// {
//   "status": 200,
//   "message": "본사 상세 조회 성공",
//   "data": {
//     "id": 3,
//     "name": "박찬홍 본사",
//     "address": "성남시 분당구",
//     "phoneNumber": "02-1111-2222",
//     "representative": "박찬홍",
//     "secretCode": "19fe46c6"
//   }
// }
interface HeadOfficeDetailResponse {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  representative: string;
  secretCode: string;
}

interface HeadOfficeApiResponse {
  status: number;
  message: string;
  data: HeadOfficeDetailResponse;
}

interface HeadOfficeInfo {
  headOfficeName: string;  // name
  headOfficeCode: string;  // secretCode
  ceoName: string;         // representative
  phoneNumber: string;     // phoneNumber
  email: string;           // (API엔 없어서 프론트에서만 관리)
  address: string;         // address
  addressDetail: string;   // (API엔 없어서 프론트에서만 관리)
}

export default function MyPagePage() {
  const navigate = useNavigate();

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

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    // TODO: 서버 값으로 롤백하려면, 처음 GET 결과를 별도로 저장해뒀다가 여기서 복원
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 여기서 PUT /api/admin/head-office 연동 예정
    console.log("본사 정보 수정 payload:", form);
    alert("본사 정보가 임시로 저장되었습니다. (PUT 연동 예정)");
    setIsEditing(false);
  };

  // ✅ 마이페이지 진입 시 본사 정보 조회
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

        // IMPORTANT:
        // apiClient의 baseURL이 "/api" 라고 가정하므로
        // 여기서는 "/admin/head-office" 만 작성
        const res = await apiClient.get<HeadOfficeApiResponse>(
          "/admin/head-office",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const apiData = res.data;

        if (!apiData || !apiData.data) {
          throw new Error(
            "서버 응답 형식이 예상과 다릅니다. (data 필드 없음)"
          );
        }

        const data = apiData.data;

        setForm((prev) => ({
          ...prev,
          headOfficeName: data.name ?? "",
          headOfficeCode: data.secretCode ?? "",
          ceoName: data.representative ?? "",
          phoneNumber: data.phoneNumber ?? "",
          address: data.address ?? "",
          // email, addressDetail은 API에서 안 주니까 기존 값 유지
        }));
      } catch (err: any) {
        console.error("본사 조회 실패:", err);

        // axios 에러 형태 처리
        if (err.response) {
          const status = err.response.status;
          const message =
            err.response.data?.message ||
            "서버에서 오류 응답을 반환했습니다.";
          setError(
            `본사 정보를 불러오지 못했습니다. (status: ${status}) ${message}`
          );
        } else if (err.request) {
          setError("서버에 연결할 수 없습니다. (네트워크 오류)");
        } else {
          setError(
            err.message ||
              "본사 정보를 불러오는 중 알 수 없는 오류가 발생했습니다."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHeadOffice();
  }, []);

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

      <form
        id="mypage-form"
        className="mypage-form"
        onSubmit={handleSubmit}
      >
        {loading && (
          <div style={{ marginBottom: 12, fontSize: 13, color: "#6b7280" }}>
            본사 정보를 불러오는 중입니다...
          </div>
        )}
        {error && (
          <div style={{ marginBottom: 12, fontSize: 13, color: "#b91c1c" }}>
            {error}
          </div>
        )}

        {/* 본사 정보 */}
        <section className="form-card">
          <h2 className="form-card-title">본사 정보</h2>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="headOfficeName">
                본사명 <span className="required">*</span>
              </label>
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

            <div className="form-field">
              <label htmlFor="email">대표 이메일</label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="hq@example.com"
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

        {/* 본사 코드 */}
        <section className="form-card">
          <h2 className="form-card-title">본사 코드</h2>
          <p className="help-text">
            회원가입 시 발급된 본사 코드입니다. 해당 코드를 다른 관리자에게
            전달하면 같은 본사로 가입할 수 있습니다.
          </p>
          <div className="code-row">
            <input
              className="code-input readonly-input"
              value={form.headOfficeCode}
              readOnly
            />
            <span className="code-hint">※ 본사 코드는 수정할 수 없습니다.</span>
          </div>
        </section>
      </form>
    </div>
  );
}