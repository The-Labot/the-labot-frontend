// src/pages/Site/SiteEditPage.tsx

import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../site_create/SiteCreatePage.css";
import { getCoordinatesByAddress } from "../api/kakaoApi";

/* ---------------------------
   타입 정의(등록과 동일)
---------------------------- */
interface SocialInsDTO {
  pensionDailyBizSymbol: string;
  pensionRegularBizSymbol: string;
  pensionDailyJoinDate: string;
  pensionRegularJoinDate: string;

  healthDailyBizSymbol: string;
  healthRegularBizSymbol: string;
  healthDailyJoinDate: string;
  healthRegularJoinDate: string;

  employDailyMgmtNum: string;
  employRegularMgmtNum: string;
  employDailyJoinDate: string;
  employRegularJoinDate: string;

  accidentDailyMgmtNum: string;
  accidentRegularMgmtNum: string;
  accidentDailyJoinDate: string;
  accidentRegularJoinDate: string;

  pensionFee: number | null;
  pensionPaid: number | null;

  healthFee: number | null;
  healthPaid: number | null;

  employFee: number | null;
  employPaid: number | null;

  accidentFee: number | null;
  accidentPaid: number | null;

  SeveranceTarget: boolean;
  severanceType: "MANDATORY" | "OPTIONAL" | "NONE";
  severanceDeductionNum: string;
  severanceJoinDate: string;
  dailyDeductionAmount: number | null;
  totalSeverancePaidAmount: number | null;
}

interface SiteFormState {
  projectName: string;
  contractType: string;

  siteManagerName: string;
  contractAmount: string;

  clientName: string;
  primeContractorName: string;

  address: string;
  latitude: string;
  longitude: string;

  contractDate: string;
  startDate: string;
  endDate: string;

  laborCostBankName: string;
  laborCostAccountNumber: string;
  laborCostAccountHolder: string;
  informPhoneNumber: string;

  insuranceResponsibility: string;

  employmentInsuranceSiteNum: string;
  primeContractorMgmtNum: string;
  isKisconReportTarget: boolean;

  socialIns: SocialInsDTO;
}

/* ---------------------------
        컴포넌트 시작
---------------------------- */
export default function SiteEditPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<SiteFormState | null>(null);
  const [retireEnabled, setRetireEnabled] = useState(false);

  /* =====================================================
      1) 상세 조회 → form 구조에 맞게 데이터 매핑
  ====================================================== */
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get(`/admin/sites/${siteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data.data;

        setForm({
          projectName: d.projectName,
          contractType: d.contractType,

          siteManagerName: d.siteManagerName,
          contractAmount: d.contractAmount?.toString() ?? "",

          clientName: d.clientName,
          primeContractorName: d.primeContractorName,

          address: d.address,
          latitude: d.latitude?.toString() ?? "",
          longitude: d.longitude?.toString() ?? "",

          contractDate: d.contractDate,
          startDate: d.startDate,
          endDate: d.endDate,

          // 계좌 정보 변환 매핑
          laborCostBankName: d.laborCostAccount.bankName,
          laborCostAccountNumber: d.laborCostAccount.accountNumber,
          laborCostAccountHolder: d.laborCostAccount.accountHolder,
          informPhoneNumber: d.laborCostAccount.informPhoneNumber,

          insuranceResponsibility: d.insuranceResponsibility,

          employmentInsuranceSiteNum: d.employmentInsuranceSiteNum,
          primeContractorMgmtNum: d.primeContractorMgmtNum,
          isKisconReportTarget: d.kisconReportTarget,

          // 4대 보험 전체 매핑
          socialIns: {
            pensionDailyBizSymbol: d.socialIns.pensionDailyBizSymbol,
            pensionRegularBizSymbol: d.socialIns.pensionRegularBizSymbol,
            pensionDailyJoinDate: d.socialIns.pensionDailyJoinDate,
            pensionRegularJoinDate: d.socialIns.pensionRegularJoinDate,

            healthDailyBizSymbol: d.socialIns.healthDailyBizSymbol,
            healthRegularBizSymbol: d.socialIns.healthRegularBizSymbol,
            healthDailyJoinDate: d.socialIns.healthDailyJoinDate,
            healthRegularJoinDate: d.socialIns.healthRegularJoinDate,

            employDailyMgmtNum: d.socialIns.employDailyMgmtNum,
            employRegularMgmtNum: d.socialIns.employRegularMgmtNum,
            employDailyJoinDate: d.socialIns.employDailyJoinDate,
            employRegularJoinDate: d.socialIns.employRegularJoinDate,

            accidentDailyMgmtNum: d.socialIns.accidentDailyMgmtNum,
            accidentRegularMgmtNum: d.socialIns.accidentRegularMgmtNum,
            accidentDailyJoinDate: d.socialIns.accidentDailyJoinDate,
            accidentRegularJoinDate: d.socialIns.accidentRegularJoinDate,

            pensionFee: d.socialIns.pensionFee,
            pensionPaid: d.socialIns.pensionPaid,

            healthFee: d.socialIns.healthFee,
            healthPaid: d.socialIns.healthPaid,

            employFee: d.socialIns.employFee,
            employPaid: d.socialIns.employPaid,

            accidentFee: d.socialIns.accidentFee,
            accidentPaid: d.socialIns.accidentPaid,

            SeveranceTarget: d.socialIns.severanceTarget,
            severanceType: d.socialIns.severanceType,
            severanceDeductionNum: d.socialIns.severanceDeductionNum,
            severanceJoinDate: d.socialIns.severanceJoinDate,
            dailyDeductionAmount: d.socialIns.dailyDeductionAmount,
            totalSeverancePaidAmount: d.socialIns.totalSeverancePaidAmount,
          },
        });

        setRetireEnabled(d.socialIns.severanceTarget);
      } catch (e) {
        alert("현장 정보를 불러오지 못했습니다.");
      }
    };

    load();
  }, [siteId]);

  if (!form) return <div>Loading...</div>;

  /* =====================================================
     2) 입력 핸들러
  ====================================================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name in form.socialIns) {
      setForm({
        ...form,
        socialIns: { ...form.socialIns, [name]: value },
      });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleBooleanChange = (name: string, value: boolean) => {
    if (name in form.socialIns) {
      setForm({
        ...form,
        socialIns: { ...form.socialIns, [name]: value },
      });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  /* =====================================================
     3) 좌표 조회
  ====================================================== */
  const handleSearchAddress = async () => {
    if (!form.address.trim()) {
      alert("주소를 입력해주세요.");
      return;
    }

    const coord = await getCoordinatesByAddress(form.address);
    if (!coord) return alert("주소를 찾을 수 없습니다.");

    setForm({ ...form, latitude: coord.latitude, longitude: coord.longitude });
    alert("좌표가 자동 입력되었습니다.");
  };

  /* =====================================================
     4) 퇴직공제 토글
  ====================================================== */
  const handleToggleRetire = () => {
    setRetireEnabled(!retireEnabled);
    handleBooleanChange("SeveranceTarget", !retireEnabled);
  };

  /* =====================================================
     5) PUT 제출
  ====================================================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const payload = {
      ...form,
      contractAmount: Number(form.contractAmount),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
    };

    await api.put(`/admin/sites/${siteId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("현장 정보가 수정되었습니다.");
    navigate(`/site/${siteId}`);
  };

  /* =====================================================
     6) Disable 조건
  ====================================================== */
  const employDisabled =
    form.insuranceResponsibility === "EMPLOYMENT_ONLY" ||
    form.insuranceResponsibility === "ALL";

  const accidentDisabled =
    form.insuranceResponsibility === "ACCIDENT_ONLY" ||
    form.insuranceResponsibility === "ALL";

  const retireDisabled = !retireEnabled;

  /* =====================================================
     7) UI — Create와 완전히 동일
  ====================================================== */

  return (
    <div className="site-create-page">
      {/* 헤더 */}
      <div className="site-create-header">
        <button className="ghost-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          <span>뒤로가기</span>
        </button>

        <h1 className="site-create-title">현장 정보 수정</h1>

        <div className="site-create-actions">
          <button type="submit" className="primary-button" form="site-edit-form">
            <Save size={16} />
            저장
          </button>
        </div>
      </div>

      {/* Form Start */}
      <form id="site-edit-form" className="site-create-form" onSubmit={handleSubmit}>
        
        {/* ----------------------------- */}
        {/* ① 기본 정보 */}
        {/* ----------------------------- */}
        <section className="form-card">
          <h2 className="form-card-title">현장 기본 정보</h2>

          <div className="form-grid">
            <div className="form-field">
              <label>공사명</label>
              <input
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>도급종류</label>
              <select
                name="contractType"
                value={form.contractType}
                onChange={handleChange}
              >
                <option value="">선택</option>
                <option value="PRIME">원청(PRIME)</option>
                <option value="SUB">하도(SUB)</option>
              </select>
            </div>

            <div className="form-field">
              <label>현장대리인</label>
              <input
                name="siteManagerName"
                value={form.siteManagerName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>인정승인</label>
              <select
                name="insuranceResponsibility"
                value={form.insuranceResponsibility}
                onChange={handleChange}
              >
                <option value="NONE">없음</option>
                <option value="ALL">고용+산재</option>
                <option value="EMPLOYMENT_ONLY">고용만</option>
                <option value="ACCIDENT_ONLY">산재만</option>
              </select>
            </div>

            {/* 주소 */}
            <div className="form-field form-field-full">
              <label>주소</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
                <button type="button" className="outline-button" onClick={handleSearchAddress}>
                  좌표조회
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>위도</label>
              <input name="latitude" value={form.latitude} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>경도</label>
              <input name="longitude" value={form.longitude} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* ----------------------------- */}
        {/* ② 계약 / 계좌 정보 */}
        {/* ----------------------------- */}
        <section className="form-card">
          <h2 className="form-card-title">계약 / 계좌 정보</h2>

          <div className="subsection">
            <h3 className="subsection-title">계약 정보</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>도급금액</label>
                <input
                  name="contractAmount"
                  value={form.contractAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>도급처</label>
                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>계약일</label>
                <input
                  name="contractDate"
                  value={form.contractDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>착공일</label>
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>준공일</label>
                <input
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field form-field-full">
                <label>원도급사</label>
                <input
                  name="primeContractorName"
                  value={form.primeContractorName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* 계좌 정보 */}
          <div className="subsection">
            <h3 className="subsection-title">노무비 전용 계좌번호</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>은행명</label>
                <input
                  name="laborCostBankName"
                  value={form.laborCostBankName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>계좌번호</label>
                <input
                  name="laborCostAccountNumber"
                  value={form.laborCostAccountNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>예금주</label>
                <input
                  name="laborCostAccountHolder"
                  value={form.laborCostAccountHolder}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label>통보 연락처</label>
                <input
                  name="informPhoneNumber"
                  value={form.informPhoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------- */}
        {/* ③ 4대 보험 */}
        {/* ----------------------------- */}

        <section className="form-card">
          <h2 className="form-card-title">4대 보험</h2>

          {/* 상단 */}
          <div className="insurance-options-row">
            <div className="form-field">
              <label>고용번호</label>
              <input
                name="employmentInsuranceSiteNum"
                value={form.employmentInsuranceSiteNum || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label>원수급번호</label>
              <input
                name="primeContractorMgmtNum"
                value={form.primeContractorMgmtNum || ""}
                onChange={handleChange}
              />
            </div>

            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={form.isKisconReportTarget}
                onChange={(e) =>
                  handleBooleanChange("isKisconReportTarget", e.target.checked)
                }
              />
              <span>건설공사대장 전자통보 대상</span>
            </label>

            {/* 퇴직공제 */}
            <div className="retire-group">
              <button
                type="button"
                className={"retire-toggle-btn" + (retireEnabled ? " active" : "")}
                onClick={handleToggleRetire}
              >
                퇴직공제 가입여부
              </button>

              <div
                className={
                  "radio-group-inline" + (retireEnabled ? "" : " disabled")
                }
              >
                <label>
                  <input
                    type="radio"
                    value="MANDATORY"
                    checked={form.socialIns.severanceType === "MANDATORY"}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "severanceType", value: e.target.value },
                      } as any)
                    }
                    disabled={!retireEnabled}
                  />
                  <span>의무</span>
                </label>

                <label>
                  <input
                    type="radio"
                    value="OPTIONAL"
                    checked={form.socialIns.severanceType === "OPTIONAL"}
                    onChange={(e) =>
                      handleChange({
                        target: { name: "severanceType", value: e.target.value },
                      } as any)
                    }
                    disabled={!retireEnabled}
                  />
                  <span>임의</span>
                </label>
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <div className="insurance-table-wrapper">
            <table className="insurance-table">
              <thead>
                <tr>
                  <th>보험종류</th>
                  <th>번호(일용/상용)</th>
                  <th>가입일(일용/상용)</th>
                  <th>부금액</th>
                  <th>납부액</th>
                </tr>
              </thead>

              <tbody>
                {/* 국민연금 */}
                <tr>
                  <td><div className="insurance-row-label">국민연금기초</div></td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="pensionDailyBizSymbol"
                        value={form.socialIns.pensionDailyBizSymbol || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="pensionRegularBizSymbol"
                        value={form.socialIns.pensionRegularBizSymbol || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="pensionDailyJoinDate"
                        value={form.socialIns.pensionDailyJoinDate || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="pensionRegularJoinDate"
                        value={form.socialIns.pensionRegularJoinDate || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </td>

                  <td>
                    <input
                      name="pensionFee"
                      value={form.socialIns.pensionFee ?? ""}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <input
                      name="pensionPaid"
                      value={form.socialIns.pensionPaid ?? ""}
                      onChange={handleChange}
                    />
                  </td>
                </tr>

                {/* 건강보험 */}
                <tr>
                  <td><div className="insurance-row-label">건강보험기초</div></td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="healthDailyBizSymbol"
                        value={form.socialIns.healthDailyBizSymbol || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="healthRegularBizSymbol"
                        value={form.socialIns.healthRegularBizSymbol || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="healthDailyJoinDate"
                        value={form.socialIns.healthDailyJoinDate || ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="healthRegularJoinDate"
                        value={form.socialIns.healthRegularJoinDate || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </td>

                  <td>
                    <input
                      name="healthFee"
                      value={form.socialIns.healthFee ?? ""}
                      onChange={handleChange}
                    />
                  </td>

                  <td>
                    <input
                      name="healthPaid"
                      value={form.socialIns.healthPaid ?? ""}
                      onChange={handleChange}
                    />
                  </td>
                </tr>

                {/* 고용보험 */}
                <tr>
                  <td><div className="insurance-row-label">고용보험</div></td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="employDailyMgmtNum"
                        value={form.socialIns.employDailyMgmtNum || ""}
                        onChange={handleChange}
                        disabled={employDisabled}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="employRegularMgmtNum"
                        value={form.socialIns.employRegularMgmtNum || ""}
                        onChange={handleChange}
                        disabled={employDisabled}
                      />
                    </div>
                  </td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="employDailyJoinDate"
                        value={form.socialIns.employDailyJoinDate || ""}
                        onChange={handleChange}
                        disabled={employDisabled}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="employRegularJoinDate"
                        value={form.socialIns.employRegularJoinDate || ""}
                        onChange={handleChange}
                        disabled={employDisabled}
                      />
                    </div>
                  </td>

                  <td>
                    <input
                      name="employFee"
                      value={form.socialIns.employFee ?? ""}
                      onChange={handleChange}
                      disabled={employDisabled}
                    />
                  </td>

                  <td>
                    <input
                      name="employPaid"
                      value={form.socialIns.employPaid ?? ""}
                      onChange={handleChange}
                      disabled={employDisabled}
                    />
                  </td>
                </tr>

                {/* 산재보험 */}
                <tr>
                  <td><div className="insurance-row-label">산재보험</div></td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="accidentDailyMgmtNum"
                        value={form.socialIns.accidentDailyMgmtNum || ""}
                        onChange={handleChange}
                        disabled={accidentDisabled}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="accidentRegularMgmtNum"
                        value={form.socialIns.accidentRegularMgmtNum || ""}
                        onChange={handleChange}
                        disabled={accidentDisabled}
                      />
                    </div>
                  </td>

                  <td>
                    <div className="dual-input-row">
                      <span>일용</span>
                      <input
                        name="accidentDailyJoinDate"
                        value={form.socialIns.accidentDailyJoinDate || ""}
                        onChange={handleChange}
                        disabled={accidentDisabled}
                      />
                    </div>

                    <div className="dual-input-row">
                      <span>상용</span>
                      <input
                        name="accidentRegularJoinDate"
                        value={form.socialIns.accidentRegularJoinDate || ""}
                        onChange={handleChange}
                        disabled={accidentDisabled}
                      />
                    </div>
                  </td>

                  <td>
                    <input
                      name="accidentFee"
                      value={form.socialIns.accidentFee ?? ""}
                      onChange={handleChange}
                      disabled={accidentDisabled}
                    />
                  </td>

                  <td>
                    <input
                      name="accidentPaid"
                      value={form.socialIns.accidentPaid ?? ""}
                      onChange={handleChange}
                      disabled={accidentDisabled}
                    />
                  </td>
                </tr>

                {/* 퇴직공제 */}
                <tr>
                  <td><div className="insurance-row-label">퇴직공제</div></td>

                  <td>
                    <input
                      name="severanceDeductionNum"
                      value={form.socialIns.severanceDeductionNum || ""}
                      onChange={handleChange}
                      disabled={retireDisabled}
                    />
                  </td>

                  <td>
                    <input
                      name="severanceJoinDate"
                      value={form.socialIns.severanceJoinDate || ""}
                      onChange={handleChange}
                      disabled={retireDisabled}
                    />
                  </td>

                  <td>
                    <input
                      name="dailyDeductionAmount"
                      value={form.socialIns.dailyDeductionAmount ?? ""}
                      onChange={handleChange}
                      disabled={retireDisabled}
                    />
                  </td>

                  <td>
                    <input
                      name="totalSeverancePaidAmount"
                      value={form.socialIns.totalSeverancePaidAmount ?? ""}
                      onChange={handleChange}
                      disabled={retireDisabled}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </form>
    </div>
  );
}
