import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSiteDetail, updateSiteDetail } from "../api/siteApi";
import "./SiteDetailPage.css";
import { ArrowLeft, Pencil } from "lucide-react";

export default function SiteDetailPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  /* 📌 데이터 불러오기 */
  useEffect(() => {
    if (!siteId || !accessToken) return;

    const fetchData = async () => {
      try {
        const res = await getSiteDetail(accessToken, Number(siteId));
        setSiteData(res.data.data);
      } catch (error) {
        console.error("현장 조회 실패:", error);
      }
    };

    fetchData();
  }, [siteId, accessToken]);

  if (!siteData) return <div className="loading">로딩중...</div>;

  /* 입력값 핸들링 */
  const handleInputChange = (field: string, value: any) => {
    setSiteData((prev: any) => ({ ...prev, [field]: value }));
  };

  /* 📌 수정 요청 */
  const handleSave = async () => {
    try {
      await updateSiteDetail(accessToken!, Number(siteId), {
        projectName: siteData.projectName,
        address: siteData.address,
        startDate: siteData.startDate,
        laborCostBankName: siteData.laborCostAccount.bankName,
        laborCostAccountNumber: siteData.laborCostAccount.accountNumber,
        laborCostAccountHolder: siteData.laborCostAccount.accountHolder,
        kisconReportTarget: siteData.kisconReportTarget,
        socialIns: siteData.socialIns,
      });

      alert("수정 완료!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("수정 실패! 관리자에게 문의하세요.");
    }
  };

  return (
    <div className="site-detail-page">

      {/* --- 상단 헤더 --- */}
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>현장 상세정보</h1>

        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            <Pencil size={18} /> 정보 수정
          </button>
        )}
        {editing && (
          <button className="save-btn" onClick={handleSave}>
            저장하기
          </button>
        )}
      </div>

      {/* --- 기본 정보 카드 --- */}
      <div className="info-card">
        <h2>기본 정보</h2>

        <label>
          프로젝트명
          <input
            disabled={!editing}
            value={siteData.projectName}
            onChange={(e) => handleInputChange("projectName", e.target.value)}
          />
        </label>

        <label>
          현장 주소
          <input
            disabled={!editing}
            value={siteData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </label>

        <label>
          공사 시작일
          <input
            disabled={!editing}
            type="date"
            value={siteData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
          />
        </label>
      </div>

      {/* --- 노무비 계좌 정보 --- */}
      <div className="info-card">
        <h2>노무비 계좌 정보</h2>

        <label>
          은행
          <input
            disabled={!editing}
            value={siteData.laborCostAccount.bankName}
            onChange={(e) =>
              setSiteData({
                ...siteData,
                laborCostAccount: {
                  ...siteData.laborCostAccount,
                  bankName: e.target.value,
                },
              })
            }
          />
        </label>

        <label>
          계좌번호
          <input
            disabled={!editing}
            value={siteData.laborCostAccount.accountNumber}
            onChange={(e) =>
              setSiteData({
                ...siteData,
                laborCostAccount: {
                  ...siteData.laborCostAccount,
                  accountNumber: e.target.value,
                },
              })
            }
          />
        </label>

        <label>
          예금주
          <input
            disabled={!editing}
            value={siteData.laborCostAccount.accountHolder}
            onChange={(e) =>
              setSiteData({
                ...siteData,
                laborCostAccount: {
                  ...siteData.laborCostAccount,
                  accountHolder: e.target.value,
                },
              })
            }
          />
        </label>
      </div>

      {/* --- 사회보험 정보 --- */}
      <div className="info-card">
        <h2>사회보험 정보</h2>

        <label>
          국민연금(일용) 가입일
          <input
            disabled={!editing}
            value={siteData.socialIns.pensionDailyJoinDate}
            onChange={(e) =>
              setSiteData({
                ...siteData,
                socialIns: {
                  ...siteData.socialIns,
                  pensionDailyJoinDate: e.target.value,
                },
              })
            }
          />
        </label>
      </div>
    </div>
  );
}