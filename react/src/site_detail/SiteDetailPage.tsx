// src/pages/Site/SiteDetailPage.tsx

import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../site_create/SiteCreatePage.css";

/* ---------------------------
   타입 정의(EDIT과 동일)
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

export default function SiteDetailPage() {
  const { siteId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<SiteFormState | null>(null);

  /* =====================================================
      1) 상세 조회 (Edit의 조회 그대로 사용)
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

          laborCostBankName: d.laborCostAccount.bankName,
          laborCostAccountNumber: d.laborCostAccount.accountNumber,
          laborCostAccountHolder: d.laborCostAccount.accountHolder,
          informPhoneNumber: d.laborCostAccount.informPhoneNumber,

          insuranceResponsibility: d.insuranceResponsibility,

          employmentInsuranceSiteNum: d.employmentInsuranceSiteNum,
          primeContractorMgmtNum: d.primeContractorMgmtNum,
          isKisconReportTarget: d.kisconReportTarget,

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
      } catch (e) {
        alert("현장 정보를 불러오지 못했습니다.");
      }
    };

    load();
  }, [siteId]);

  if (!form) return <div>Loading...</div>;

  /* =====================================================
        read-only helpers
  ====================================================== */

  const ro = { readOnly: true, disabled: true };

  return (
    <div className="site-create-page">
      {/* 헤더 */}
      <div className="site-create-header">
        <button className="ghost-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          <span>뒤로가기</span>
        </button>

        <h1 className="site-create-title">현장 상세 정보</h1>

      </div>

      {/* ============================= */}
      {/* Detail UI (전부 read-only) */}
      {/* ============================= */}
      <div className="site-create-form">

        {/* ① 기본 정보 */}
        <section className="form-card">
          <h2 className="form-card-title">현장 기본 정보</h2>

          <div className="form-grid">
            <div className="form-field">
              <label>공사명</label>
              <input value={form.projectName} {...ro} />
            </div>

            <div className="form-field">
              <label>도급 종류</label>
              <input value={form.contractType} {...ro} />
            </div>

            <div className="form-field">
              <label>현장대리인</label>
              <input value={form.siteManagerName} {...ro} />
            </div>

            <div className="form-field">
              <label>인정 승인</label>
              <input value={form.insuranceResponsibility} {...ro} />
            </div>

            <div className="form-field form-field-full">
              <label>주소</label>
              <input value={form.address} {...ro} />
            </div>

            <div className="form-field">
              <label>위도</label>
              <input value={form.latitude} {...ro} />
            </div>

            <div className="form-field">
              <label>경도</label>
              <input value={form.longitude} {...ro} />
            </div>
          </div>
        </section>

        {/* ② 계약 및 계좌 정보 */}
        <section className="form-card">
          <h2 className="form-card-title">계약 / 계좌 정보</h2>

          <div className="subsection">
            <h3 className="subsection-title">계약 정보</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>도급금액</label>
                <input value={form.contractAmount} {...ro} />
              </div>

              <div className="form-field">
                <label>도급처</label>
                <input value={form.clientName} {...ro} />
              </div>

              <div className="form-field">
                <label>계약일</label>
                <input value={form.contractDate} {...ro} />
              </div>

              <div className="form-field">
                <label>착공일</label>
                <input value={form.startDate} {...ro} />
              </div>

              <div className="form-field">
                <label>준공일</label>
                <input value={form.endDate} {...ro} />
              </div>

              <div className="form-field form-field-full">
                <label>원도급사</label>
                <input value={form.primeContractorName} {...ro} />
              </div>
            </div>
          </div>

          <div className="subsection">
            <h3 className="subsection-title">노무비 전용 계좌</h3>

            <div className="form-grid">
              <div className="form-field">
                <label>은행명</label>
                <input value={form.laborCostBankName} {...ro} />
              </div>

              <div className="form-field">
                <label>계좌번호</label>
                <input value={form.laborCostAccountNumber} {...ro} />
              </div>

              <div className="form-field">
                <label>예금주</label>
                <input value={form.laborCostAccountHolder} {...ro} />
              </div>

              <div className="form-field">
                <label>통보 연락처</label>
                <input value={form.informPhoneNumber} {...ro} />
              </div>
            </div>
          </div>
        </section>

        {/* ③ 4대 보험 */}
        <section className="form-card">
          <h2 className="form-card-title">4대 보험</h2>

          <div className="insurance-options-row">
            <div className="form-field">
              <label>고용보험 사업장 번호</label>
              <input value={form.employmentInsuranceSiteNum} {...ro} />
            </div>

            <div className="form-field">
              <label>원수급번호</label>
              <input value={form.primeContractorMgmtNum} {...ro} />
            </div>

            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={form.isKisconReportTarget}
                disabled
              />
              <span>건설공사대장 전자통보 대상</span>
            </label>
          </div>

          <div className="insurance-table-wrapper">
            <table className="insurance-table">
              <thead>
                <tr>
                  <th>보험종류</th>
                  <th>번호</th>
                  <th>가입일</th>
                  <th>부금</th>
                  <th>납부</th>
                </tr>
              </thead>

              <tbody>
                {/* 국민연금 */}
                <tr>
                  <td>국민연금</td>
                  <td>
                    일용: {form.socialIns.pensionDailyBizSymbol} / 상용:{" "}
                    {form.socialIns.pensionRegularBizSymbol}
                  </td>
                  <td>
                    일용: {form.socialIns.pensionDailyJoinDate} / 상용:{" "}
                    {form.socialIns.pensionRegularJoinDate}
                  </td>
                  <td>{form.socialIns.pensionFee}</td>
                  <td>{form.socialIns.pensionPaid}</td>
                </tr>

                {/* 건강보험 */}
                <tr>
                  <td>건강보험</td>
                  <td>
                    일용: {form.socialIns.healthDailyBizSymbol} / 상용:{" "}
                    {form.socialIns.healthRegularBizSymbol}
                  </td>
                  <td>
                    일용: {form.socialIns.healthDailyJoinDate} / 상용:{" "}
                    {form.socialIns.healthRegularJoinDate}
                  </td>
                  <td>{form.socialIns.healthFee}</td>
                  <td>{form.socialIns.healthPaid}</td>
                </tr>

                {/* 고용보험 */}
                <tr>
                  <td>고용보험</td>
                  <td>
                    일용: {form.socialIns.employDailyMgmtNum} / 상용:{" "}
                    {form.socialIns.employRegularMgmtNum}
                  </td>
                  <td>
                    일용: {form.socialIns.employDailyJoinDate} / 상용:{" "}
                    {form.socialIns.employRegularJoinDate}
                  </td>
                  <td>{form.socialIns.employFee}</td>
                  <td>{form.socialIns.employPaid}</td>
                </tr>

                {/* 산재보험 */}
                <tr>
                  <td>산재보험</td>
                  <td>
                    일용: {form.socialIns.accidentDailyMgmtNum} / 상용:{" "}
                    {form.socialIns.accidentRegularMgmtNum}
                  </td>
                  <td>
                    일용: {form.socialIns.accidentDailyJoinDate} / 상용:{" "}
                    {form.socialIns.accidentRegularJoinDate}
                  </td>
                  <td>{form.socialIns.accidentFee}</td>
                  <td>{form.socialIns.accidentPaid}</td>
                </tr>

                {/* 퇴직공제 */}
                <tr>
                  <td>퇴직공제</td>
                  <td>{form.socialIns.severanceDeductionNum}</td>
                  <td>{form.socialIns.severanceJoinDate}</td>
                  <td>{form.socialIns.dailyDeductionAmount}</td>
                  <td>{form.socialIns.totalSeverancePaidAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
