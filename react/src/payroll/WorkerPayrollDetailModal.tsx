import { useEffect, useState } from "react";
import { getPayrollDetail, updatePayrollDetail } from "../api/payrollApi";
import "./WorkerModalCommon.css";
import "./PayrollDetailCard.css";

interface Props {
  payrollId: number;
  workerId: number;
  workerName: string;
  siteId: number;
  year: number;
  month: number;
  onClose: () => void;
}

export default function WorkerPayrollDetailModal({
  payrollId,
  workerId,
  workerName,
  siteId,
  year,
  month,
  onClose
}: Props) {
  const [detail, setDetail] = useState<any>(null);
  const [backup, setBackup] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD DETAIL
  // =========================
  useEffect(() => {
    loadDetail();
  }, [payrollId]);

  const loadDetail = async () => {
    try {
      const data = await getPayrollDetail(payrollId, siteId, workerId);
      setDetail({ ...data });
    } catch (err) {
      console.error("급여 상세 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT MODE
  // =========================
  const startEdit = () => {
    setBackup(JSON.parse(JSON.stringify(detail)));
    setEditMode(true);
  };

  const cancelEdit = () => {
    setDetail(backup);
    setEditMode(false);
  };

  // =========================
  // SAVE CHANGES
  // =========================
  const saveChanges = async () => {
    try {
      const payload = {
        mealAllowance: detail.mealAllowance,
        incomeTax: detail.incomeTax,
        localIncomeTax: detail.localIncomeTax,

        isEmploymentInsuranceApplicable: detail.isEmploymentInsuranceApplicable,
        employmentInsurance: detail.employmentInsuranceAmount,

        isNationalPensionApplicable: detail.isNationalPensionApplicable,
        nationalPension: detail.nationalPensionAmount,

        isHealthInsuranceApplicable: detail.isHealthInsuranceApplicable,
        healthInsurance: detail.healthInsuranceAmount,

        isLongTermCareApplicable: detail.isLongTermCareApplicable,
        longTermCare: detail.longTermCareAmount,

        isRetirementDeductionApplicable: detail.isRetirementDeductionApplicable,
        reasonForLeaving: detail.reasonForLeaving,
      };

      await updatePayrollDetail(payrollId, siteId, payload);

      alert("급여가 성공적으로 수정되었습니다.");
      setEditMode(false);
      loadDetail();
    } catch (err) {
      console.error("급여 수정 실패:", err);
      alert("급여 수정 중 오류가 발생했습니다.");
    }
  };

  // =========================
  // FIELD CHANGE
  // =========================
  const changeField = (field: string, value: any) => {
    const newDetail = { ...detail };
    newDetail[field] = value;

    recalc(newDetail);
    setDetail(newDetail);
  };

  // =========================
  // INSURANCE TOGGLE
  // (금액 유지, 적용 여부만 변경)
  // =========================
  const toggleInsurance = (flagField: string) => {
    const newDetail = { ...detail };
    newDetail[flagField] = !newDetail[flagField];

    recalc(newDetail);
    setDetail(newDetail);
  };

  // =========================
  // RECALC TOTALS
  // 적용 여부에 따라 공제 포함/제외
  // =========================
  const recalc = (d: any) => {
    // 기본값 처리
    const incomeTax = d.incomeTax ?? 0;
    const localIncomeTax = d.localIncomeTax ?? 0;

    const employment = d.isEmploymentInsuranceApplicable
      ? (d.employmentInsuranceAmount ?? 0)
      : 0;

    const pension = d.isNationalPensionApplicable
      ? (d.nationalPensionAmount ?? 0)
      : 0;

    const health = d.isHealthInsuranceApplicable
      ? (d.healthInsuranceAmount ?? 0)
      : 0;

    const care = d.isLongTermCareApplicable
      ? (d.longTermCareAmount ?? 0)
      : 0;

    d.totalDeductions =
      incomeTax +
      localIncomeTax +
      employment +
      pension +
      health +
      care;

    const totalAmount = d.totalAmount ?? 0;
    d.netPay = totalAmount - d.totalDeductions;
  };

  if (loading || !detail) return null;

  return (
    <div className="full-overlay" onClick={onClose}>
      <div className="full-panel" onClick={(e) => e.stopPropagation()}>
        <button className="full-close" onClick={onClose}>×</button>

        <h2 className="detail-title">
          {workerName} — {year}년 {month}월 급여 상세
        </h2>

        {/* 수정 버튼 */}
        <div className="edit-toolbar">
          {!editMode && (
            <button className="edit-btn" onClick={startEdit}>수정하기</button>
          )}
          {editMode && (
            <>
              <button className="save-btn" onClick={saveChanges}>저장</button>
              <button className="cancel-btn" onClick={cancelEdit}>취소</button>
            </>
          )}
        </div>

        {/* 상단 실지급액 카드 */}
        <div className="big-number-card">
          <div className="big-title">실지급액</div>
          <div className="big-amount">{detail.netPay?.toLocaleString()}원</div>
          <div className="big-sub-info">
            총 지급액 {detail.totalAmount?.toLocaleString()}원 /
            총 공제액 {detail.totalDeductions?.toLocaleString()}원
          </div>
        </div>

        {/* 본문 카드 그룹 */}
        <div className="card-container">

          {/* 지급 요약 */}
          <div className="detail-card">
            <h3 className="card-title">지급 요약</h3>

            <div className="card-row">
              <span>총 지급액</span>
              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.totalAmount}
                  onChange={(e) => changeField("totalAmount", Number(e.target.value))}
                />
              ) : (
                <strong>{detail.totalAmount.toLocaleString()} 원</strong>
              )}
            </div>

            <div className="card-row">
              <span>식대</span>
              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.mealAllowance}
                  onChange={(e) => changeField("mealAllowance", Number(e.target.value))}
                />
              ) : (
                <span>{detail.mealAllowance.toLocaleString()} 원</span>
              )}
            </div>

            <div className="card-row">
              <span>보험 산정 월급여</span>
              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.monthlySalaryForInsurance}
                  onChange={(e) =>
                    changeField("monthlySalaryForInsurance", Number(e.target.value))
                  }
                />
              ) : (
                <span>{detail.monthlySalaryForInsurance.toLocaleString()} 원</span>
              )}
            </div>
          </div>

          {/* 세금 */}
          <div className="detail-card">
            <h3 className="card-title">세금</h3>

            <div className="card-row">
              <span>소득세</span>
              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.incomeTax}
                  onChange={(e) => changeField("incomeTax", Number(e.target.value))}
                />
              ) : (
                <span>{detail.incomeTax.toLocaleString()} 원</span>
              )}
            </div>

            <div className="card-row">
              <span>지방소득세</span>
              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.localIncomeTax}
                  onChange={(e) =>
                    changeField("localIncomeTax", Number(e.target.value))
                  }
                />
              ) : (
                <span>{detail.localIncomeTax.toLocaleString()} 원</span>
              )}
            </div>
          </div>

          {/* 4대보험 */}
          <div className="detail-card">
            <h3 className="card-title">4대 보험</h3>

            {/* 고용보험 */}
            <div className="card-row">
              <span className="label-with-switch">
                고용보험
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={detail.isEmploymentInsuranceApplicable}
                    onChange={() => toggleInsurance("isEmploymentInsuranceApplicable")}
                  />
                  <span className="slider"></span>
                </label>
              </span>

              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.employmentInsuranceAmount}
                  onChange={(e) =>
                    changeField("employmentInsuranceAmount", Number(e.target.value))
                  }
                />
              ) : (
                <span>{detail.employmentInsuranceAmount.toLocaleString()} 원</span>
              )}
            </div>

            {/* 국민연금 */}
            <div className="card-row">
              <span className="label-with-switch">
                국민연금
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={detail.isNationalPensionApplicable}
                    onChange={() => toggleInsurance("isNationalPensionApplicable")}
                  />
                  <span className="slider"></span>
                </label>
              </span>

              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.nationalPensionAmount}
                  onChange={(e) =>
                    changeField("nationalPensionAmount", Number(e.target.value))
                  }
                />
              ) : (
                <span>{detail.nationalPensionAmount.toLocaleString()} 원</span>
              )}
            </div>

            {/* 건강보험 */}
            <div className="card-row">
              <span className="label-with-switch">
                건강보험
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={detail.isHealthInsuranceApplicable}
                    onChange={() => toggleInsurance("isHealthInsuranceApplicable")}
                  />
                  <span className="slider"></span>
                </label>
              </span>

              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.healthInsuranceAmount}
                  onChange={(e) =>
                    changeField("healthInsuranceAmount", Number(e.target.value))
                  }
                />
              ) : (
                <span>{detail.healthInsuranceAmount.toLocaleString()} 원</span>
              )}
            </div>

            {/* 장기요양보험 */}
            <div className="card-row">
              <span className="label-with-switch">
                장기요양보험
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={detail.isLongTermCareApplicable}
                    onChange={() => toggleInsurance("isLongTermCareApplicable")}
                  />
                  <span className="slider"></span>
                </label>
              </span>

              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.longTermCareAmount}
                  onChange={(e) =>
                    changeField("longTermCareAmount", Number(e.target.value))
                  }
                />
              ) : (
                <span>{detail.longTermCareAmount.toLocaleString()} 원</span>
              )}
            </div>
          </div>

          {/* 퇴직 / 기타 */}
          <div className="detail-card">
            <h3 className="card-title">퇴직 / 기타</h3>

            {/* 퇴직공제 적용 */}
            <div className="card-row">
              <span className="label-with-switch">
                퇴직공제 적용
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={detail.isRetirementDeductionApplicable}
                    onChange={() =>
                      changeField(
                        "isRetirementDeductionApplicable",
                        !detail.isRetirementDeductionApplicable
                      )
                    }
                  />
                  <span className="slider"></span>
                </label>
              </span>

              <span>
                {detail.isRetirementDeductionApplicable ? "예" : "아니오"}
              </span>
            </div>

            {/* 퇴직공제 일수 */}
            <div className="card-row">
              <span>퇴직공제 일수</span>
              {editMode ? (
                <textarea
                  className="detail-textarea"
                  value={detail.retirementDeductionDays ?? ""}
                  onChange={(e) =>
                    changeField("retirementDeductionDays", Number(e.target.value))
                  }
                />
              ) : (
                <span>{detail.retirementDeductionDays ?? "-"}</span>
              )}
            </div>

            {/* 퇴사 사유 */}
            <div className="card-row">
              <span>퇴사 사유</span>
              {editMode ? (
                <textarea
                  className="detail-textarea"
                  style={{ textAlign: "left" }}
                  value={detail.reasonForLeaving ?? ""}
                  onChange={(e) => changeField("reasonForLeaving", e.target.value)}
                />
              ) : (
                <span>{detail.reasonForLeaving ?? "-"}</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
