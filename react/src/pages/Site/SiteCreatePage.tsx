import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import "./SiteCreatePage.css";
import api from "../../api/axios";

/* ---------------------------------------
   4대 보험 정보 DTO (API 명세 기준)
----------------------------------------- */
interface SocialInsDTO {
  /* 공통: 일용/상용으로 나뉘는 2개 */
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

  /* 공통: 하나의 값만 있는 컬럼 */
  pensionFee: number | null;
  pensionPaid: number | null;

  healthFee: number | null;
  healthPaid: number | null;

  employFee: number | null;
  employPaid: number | null;

  accidentFee: number | null;
  accidentPaid: number | null;

  /* 퇴직공제 */
  SeveranceTarget: boolean;
  severanceDeductionNum: string;
  severanceJoinDate: string;
  dailyDeductionAmount: number | null;
  totalSeverancePaidAmount: number | null;
  severanceType: "MANDATORY" | "OPTIONAL" | "";
}

/* ---------------------------------------
   현장 등록 전체 DTO
----------------------------------------- */
interface SiteFormState {
  projectName: string;
  contractType: "PRIME" | "SUB" | "";

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

  insuranceResponsibility:
    | "NONE"
    | "ALL"
    | "EMPLOYMENT_ONLY"
    | "ACCIDENT_ONLY"
    | "";

  primeContractorMgmtNum: string;
  isKisconReportTarget: boolean;

  socialIns: SocialInsDTO;
}

const SiteCreatePage: React.FC = () => {
  const [form, setForm] = useState<SiteFormState>({
    projectName: "",
    contractType: "",
    siteManagerName: "",
    contractAmount: "",
    clientName: "",
    primeContractorName: "",
    address: "",
    latitude: "",
    longitude: "",
    contractDate: "",
    startDate: "",
    endDate: "",
    laborCostBankName: "",
    laborCostAccountNumber: "",
    laborCostAccountHolder: "",
    informPhoneNumber: "",
    insuranceResponsibility: "",
    primeContractorMgmtNum: "",
    isKisconReportTarget: false,

    /* ---- 4대 보험 초기값 ---- */
    socialIns: {
      pensionDailyBizSymbol: "",
      pensionRegularBizSymbol: "",
      pensionDailyJoinDate: "",
      pensionRegularJoinDate: "",

      healthDailyBizSymbol: "",
      healthRegularBizSymbol: "",
      healthDailyJoinDate: "",
      healthRegularJoinDate: "",

      employDailyMgmtNum: "",
      employRegularMgmtNum: "",
      employDailyJoinDate: "",
      employRegularJoinDate: "",

      accidentDailyMgmtNum: "",
      accidentRegularMgmtNum: "",
      accidentDailyJoinDate: "",
      accidentRegularJoinDate: "",

      pensionFee: null,
      pensionPaid: null,

      healthFee: null,
      healthPaid: null,

      employFee: null,
      employPaid: null,

      accidentFee: null,
      accidentPaid: null,

      SeveranceTarget: false,
      severanceDeductionNum: "",
      severanceJoinDate: "",
      dailyDeductionAmount: null,
      totalSeverancePaidAmount: null,
      severanceType: "",
    },
  });
    /* ---------------------------------------
      뒤로가기 버튼 핸들러
----------------------------------------- */
const handleBack = () => {
  window.history.back();
};

/* ---------------------------------------
   공통 입력 핸들러
----------------------------------------- */
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (name in form.socialIns) {
    setForm(prev => ({
      ...prev,
      socialIns: {
        ...prev.socialIns,
        [name]: value
      }
    }));
    return;
  }

  setForm(prev => ({ ...prev, [name]: value }));
};

/* ---------------------------------------
 boolean 값 변경 핸들러
----------------------------------------- */
const handleBooleanChange = (
  name: keyof SiteFormState | keyof SocialInsDTO,
  value: boolean
) => {
  if (name in form.socialIns) {
    setForm(prev => ({
      ...prev,
      socialIns: { ...prev.socialIns, [name]: value }
    }));
  } else {
    setForm(prev => ({ ...prev, [name]: value }));
  }
};

/* ---------------------------------------
     제출 핸들러
----------------------------------------- */
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  // 숫자 변환
  const payload = {
    ...form,
    contractAmount: form.contractAmount ? Number(form.contractAmount) : null,
    latitude: form.latitude ? Number(form.latitude) : null,
    longitude: form.longitude ? Number(form.longitude) : null,
    isKisconReportTarget: Boolean(form.isKisconReportTarget),

    socialIns: {
      ...form.socialIns,

    },
  };

  try {
    const res = await api.post(
      "/admin/sites",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("현장 등록이 완료되었습니다!");
    console.log("📌 서버 응답:", res.data);

  } catch (err: any) {
    console.error(err);
    alert(
      "현장 등록 중 오류 발생: " +
        (err.response?.data?.message || err.message)
    );
  }
};

/* ---------------------------------------
      퇴직공제 토글
----------------------------------------- */
const [retireEnabled, setRetireEnabled] = useState(false);
const [retireJoin, setRetireJoin] = useState("");

const handleToggleRetire = () => {
  setRetireEnabled(prev => !prev);

  if (retireEnabled) {
    setRetireJoin("");
  }
};

const handleRetireJoinSelect = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setRetireJoin(e.target.value);
};
    return (
    <div className="site-create-page">
      {/* 상단 헤더 */}
      <div className="site-create-header">
        <button type="button" className="ghost-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>현장 대시보드로 돌아가기</span>
        </button>

        <h1 className="site-create-title">현장 등록</h1>

        <div className="site-create-actions">
          <button type="button" className="secondary-button" onClick={handleBack}>
            취소
          </button>
          <button type="submit" className="primary-button" form="site-create-form">
            <Save size={16} />
            <span>저장</span>
          </button>
        </div>
      </div>

      <form id="site-create-form" className="site-create-form" onSubmit={handleSubmit}>
        {/* ======================= */}
        {/* ① 현장 기본 정보 */}
        {/* ======================= */}
        <section className="form-card">
          <h2 className="form-card-title">현장 기본 정보</h2>

          <div className="form-grid">
            {/* 공사명 */}
            <div className="form-field">
              <label htmlFor="projectName">공사명 <span className="required">*</span></label>
              <input
                id="projectName"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="예) 강남 오피스텔 신축공사"
                required
              />
            </div>

            {/* 도급종류 */}
            <div className="form-field">
              <label htmlFor="contractType">도급종류 <span className="required">*</span></label>
              <select
                id="contractType"
                name="contractType"
                value={form.contractType}
                onChange={handleChange}
              >
                <option value="">선택</option>
                <option value="PRIME">원청(PRIME)</option>
                <option value="SUB">하도(SUB)</option>
              </select>
            </div>

            {/* 현장대리인 */}
            <div className="form-field">
              <label htmlFor="siteManagerName">현장대리인</label>
              <input
                id="siteManagerName"
                name="siteManagerName"
                value={form.siteManagerName}
                onChange={handleChange}
                placeholder="예) 홍길동"
              />
            </div>

            {/* 인정승인 */}
            <div className="form-field">
              <label htmlFor="insuranceResponsibility">인정승인</label>
              <select
                id="insuranceResponsibility"
                name="insuranceResponsibility"
                value={form.insuranceResponsibility}
                onChange={handleChange}
              >
                <option value="">선택</option>
                <option value="NONE">없음</option>
                <option value="ALL">고용+산재</option>
                <option value="EMPLOYMENT_ONLY">고용만</option>
                <option value="ACCIDENT_ONLY">산재만</option>
              </select>
            </div>

            {/* 주소 */}
            <div className="form-field form-field-full">
              <label htmlFor="address">주소 <span className="required">*</span></label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="도로명 주소"
              />
            </div>

            {/* 위도 */}
            <div className="form-field">
              <label htmlFor="latitude">위도</label>
              <input
                type="number"
                step="0.000001"
                id="latitude"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="예) 37.123456"
              />
            </div>

            {/* 경도 */}
            <div className="form-field">
              <label htmlFor="longitude">경도</label>
              <input
                type="number"
                step="0.000001"
                id="longitude"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="예) 127.123456"
              />
            </div>
          </div>
        </section>

        {/* ======================= */}
        {/* ② 계약 / 계좌 정보 */}
        {/* ======================= */}
        <section className="form-card">
          <h2 className="form-card-title">계약 / 계좌 정보</h2>

          {/* --- 계약 정보 --- */}
          <div className="subsection">
            <h3 className="subsection-title">계약 정보</h3>

            <div className="form-grid">
              {/* 도급금액 */}
              <div className="form-field">
                <label htmlFor="contractAmount">도급 금액(원)</label>
                <input
                  id="contractAmount"
                  name="contractAmount"
                  value={form.contractAmount}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="예) 500000000"
                />
              </div>

              {/* 도급처 */}
              <div className="form-field">
                <label htmlFor="clientName">도급처(발주처)</label>
                <input
                  id="clientName"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="예) 롯데건설"
                />
              </div>

              {/* 계약일 */}
              <div className="form-field">
                <label htmlFor="contractDate">계약일</label>
                <input
                  type="date"
                  id="contractDate"
                  name="contractDate"
                  value={form.contractDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field"></div>

              {/* 착공일 */}
              <div className="form-field">
                <label htmlFor="startDate">착공일</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>

              {/* 준공일 */}
              <div className="form-field">
                <label htmlFor="endDate">준공일</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </div>

              {/* 원도급사 */}
              <div className="form-field form-field-full">
                <label htmlFor="primeContractorName">원도급사</label>
                <input
                  id="primeContractorName"
                  name="primeContractorName"
                  value={form.primeContractorName}
                  onChange={handleChange}
                  placeholder="예) 현대건설"
                />
              </div>
            </div>
          </div>

          {/* --- 노무비 계좌 --- */}
          <div className="subsection">
            <h3 className="subsection-title">노무비 전용 계좌번호</h3>

            <div className="form-grid">
              {/* 은행명 */}
              <div className="form-field">
                <label htmlFor="laborCostBankName">은행명</label>
                <input
                  id="laborCostBankName"
                  name="laborCostBankName"
                  value={form.laborCostBankName}
                  onChange={handleChange}
                />
              </div>

              {/* 계좌번호 */}
              <div className="form-field">
                <label htmlFor="laborCostAccountNumber">계좌번호</label>
                <input
                  id="laborCostAccountNumber"
                  name="laborCostAccountNumber"
                  value={form.laborCostAccountNumber}
                  onChange={handleChange}
                />
              </div>

              {/* 예금주 */}
              <div className="form-field">
                <label htmlFor="laborCostAccountHolder">예금주</label>
                <input
                  id="laborCostAccountHolder"
                  name="laborCostAccountHolder"
                  value={form.laborCostAccountHolder}
                  onChange={handleChange}
                />
              </div>

              {/* 통보 휴대폰번호 */}
              <div className="form-field">
                <label htmlFor="informPhoneNumber">통보 휴대폰번호</label>
                <input
                  id="informPhoneNumber"
                  name="informPhoneNumber"
                  value={form.informPhoneNumber}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
          </div>
        </section>
        {/* ======================= */}
{/* ③ 4대 보험 */}
{/* ======================= */}
<section className="form-card">
  <h2 className="form-card-title">4대 보험</h2>

  {/* 상단 옵션 */}
  <div className="form-grid">
    <div className="form-field">
      <label>고용번호</label>
      <input placeholder="- - -" />
    </div>

    <div className="form-field">
      <label>원수급번호</label>
      <input placeholder="- - -" />
    </div>

    <div className="form-field form-field-full insurance-options-row">
      <label className="checkbox-inline">
        <input type="checkbox" />
        <span>건설공사대장 전자통보 대상</span>
      </label>

      <div className="retire-group">
        <button
          type="button"
          className={"retire-toggle-btn" + (retireEnabled ? " active" : "")}
          onClick={handleToggleRetire}
        >
          퇴직공제 가입여부
        </button>

        <div className={"radio-group-inline" + (retireEnabled ? "" : " disabled")}>
          <label>
            <input
              type="radio"
              name="retireJoin"
              value="MANDATORY"
              checked={form.socialIns.severanceType === "MANDATORY"}
              onChange={(e) => {
                handleBooleanChange("SeveranceTarget", true);
                handleChange({
                  target: { name: "severanceType", value: e.target.value },
                } as any);
              }}
              disabled={!retireEnabled}
            />
            <span>의무</span>
          </label>

            <label>
            <input
              type="radio"
              name="retireJoin"
              value="OPTIONAL"
              checked={form.socialIns.severanceType === "OPTIONAL"}
              onChange={(e) => {
                handleBooleanChange("SeveranceTarget", true);
                handleChange({
                  target: { name: "severanceType", value: e.target.value },
                } as any);
              }}
              disabled={!retireEnabled}
            />
            <span>임의</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  {/* ======================= */}
  {/* 보험 입력 테이블 */}
  {/* ======================= */}
  <div className="insurance-table-wrapper">
    <table className="insurance-table">
      <thead>
        <tr>
          <th>보험종류</th>
          <th>퇴직공제번호<br />(일용/상용)</th>
          <th>가입일<br />(일용/상용)</th>
          <th>부금액</th>
          <th>납부액</th>
          <th>납부율(%)</th>
        </tr>
      </thead>

      <tbody>

        {/* ================================= */}
        {/* 국민연금기초 */}
        {/* ================================= */}
        <tr>
          <td><div className="insurance-row-label">국민연금기초</div></td>

          {/* 퇴직공제번호 | 일용/상용 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                name="pensionDailyBizSymbol"
                className="table-input"
                value={form.socialIns.pensionDailyBizSymbol}
                onChange={handleChange}
              />
            </div>
            <div className="dual-input-row">
              <span>상용</span>
              <input
                name="pensionRegularBizSymbol"
                className="table-input"
                value={form.socialIns.pensionRegularBizSymbol}
                onChange={handleChange}
              />
            </div>
          </td>

          {/* 가입일 | 일용/상용 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                type="date"
                name="pensionDailyJoinDate"
                className="table-input"
                value={form.socialIns.pensionDailyJoinDate}
                onChange={handleChange}
              />
            </div>

            <div className="dual-input-row">
              <span>상용</span>
              <input
                type="date"
                name="pensionRegularJoinDate"
                className="table-input"
                value={form.socialIns.pensionRegularJoinDate}
                onChange={handleChange}
              />
            </div>
          </td>

          {/* 부금액 */}
          <td>
            <input
              type="number"
              name="pensionFee"
              className="table-input"
              placeholder="부금액"
              onChange={handleChange}
            />
          </td>

          {/* 납부액 */}
          <td>
            <input
              type="number"
              name="pensionPaid"
              className="table-input"
              placeholder="납부액"
              onChange={handleChange}
            />
          </td>

          {/* 납부율 */}
          <td>
            <input
              type="number"
              name="pensionRate"
              className="table-input"
              placeholder="%"
              onChange={handleChange}
            />
          </td>
        </tr>

        {/* ================================= */}
        {/* 건강보험기초 */}
        {/* ================================= */}
        <tr>
          <td><div className="insurance-row-label">건강보험기초</div></td>

          {/* 사업기호 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                name="healthDailyBizSymbol"
                className="table-input"
                value={form.socialIns.healthDailyBizSymbol}
                onChange={handleChange}
              />
            </div>

            <div className="dual-input-row">
              <span>상용</span>
              <input
                name="healthRegularBizSymbol"
                className="table-input"
                value={form.socialIns.healthRegularBizSymbol}
                onChange={handleChange}
              />
            </div>
          </td>

          {/* 가입일 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                type="date"
                name="healthDailyJoinDate"
                value={form.socialIns.healthDailyJoinDate}
                className="table-input"
                onChange={handleChange}
              />
            </div>

            <div className="dual-input-row">
              <span>상용</span>
              <input
                type="date"
                name="healthRegularJoinDate"
                value={form.socialIns.healthRegularJoinDate}
                className="table-input"
                onChange={handleChange}
              />
            </div>
          </td>

          {/* 부금액 */}
          <td>
            <input
              name="healthFee"
              type="number"
              className="table-input"
              placeholder="부금액"
              onChange={handleChange}
            />
          </td>

          {/* 납부액 */}
          <td>
            <input
              name="healthPaid"
              type="number"
              className="table-input"
              placeholder="납부액"
              onChange={handleChange}
            />
          </td>

          {/* 납부율 */}
          <td>
            <input
              name="healthRate"
              type="number"
              className="table-input"
              placeholder="%"
              onChange={handleChange}
            />
          </td>
        </tr>

        {/* ================================= */}
        {/* 고용보험 (인정승인 영향) */}
        {/* ================================= */}
        <tr>
          <td><div className="insurance-row-label">고용보험</div></td>

          {/* 사업관리번호 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                type="text"
                name="employDailyMgmtNum"
                className="table-input"
                disabled={form.insuranceResponsibility === "EMPLOYMENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.employDailyMgmtNum}
                onChange={handleChange}
              />
            </div>

            <div className="dual-input-row">
              <span>상용</span>
              <input
                type="text"
                name="employRegularMgmtNum"
                className="table-input"
                disabled={form.insuranceResponsibility === "EMPLOYMENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.employRegularMgmtNum}
                onChange={handleChange}
              />
            </div>
          </td>

          {/* 가입일 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                type="date"
                name="employDailyJoinDate"
                disabled={form.insuranceResponsibility === "EMPLOYMENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.employDailyJoinDate}
                onChange={handleChange}
                className="table-input"
              />
            </div>

            <div className="dual-input-row">
              <span>상용</span>
              <input
                type="date"
                name="employRegularJoinDate"
                disabled={form.insuranceResponsibility === "EMPLOYMENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.employRegularJoinDate}
                onChange={handleChange}
                className="table-input"
              />
            </div>
          </td>

          {/* 단일 부금액 */}
          <td>
            <input
              type="number"
              name="employFee"
              className="table-input"
              disabled={form.insuranceResponsibility === "EMPLOYMENT_ONLY" || form.insuranceResponsibility === "ALL"}
              placeholder="부금액"
              onChange={handleChange}
            />
          </td>

          {/* 단일 납부액 */}
          <td>
            <input
              type="number"
              name="employPaid"
              className="table-input"
              disabled={form.insuranceResponsibility === "EMPLOYMENT_ONLY" || form.insuranceResponsibility === "ALL"}
              placeholder="납부액"
              onChange={handleChange}
            />
          </td>

          {/* 단일 납부율 */}
          <td>
            <input
              type="number"
              name="employRate"
              className="table-input"
              disabled={form.insuranceResponsibility === "EMPLOYMENT_ONLY" || form.insuranceResponsibility === "ALL"}
              placeholder="%"
              onChange={handleChange}
            />
          </td>
        </tr>

        {/* ================================= */}
        {/* 산재보험 (인정승인 영향) */}
        {/* ================================= */}
        <tr>
          <td><div className="insurance-row-label">산재보험</div></td>

          {/* 사업관리번호 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                name="accidentDailyMgmtNum"
                className="table-input"
                disabled={form.insuranceResponsibility === "ACCIDENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.accidentDailyMgmtNum}
                onChange={handleChange}
              />
            </div>

            <div className="dual-input-row">
              <span>상용</span>
              <input
                name="accidentRegularMgmtNum"
                className="table-input"
                disabled={form.insuranceResponsibility === "ACCIDENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.accidentRegularMgmtNum}
                onChange={handleChange}
              />
            </div>
          </td>

          {/* 가입일 */}
          <td>
            <div className="dual-input-row">
              <span>일용</span>
              <input
                type="date"
                name="accidentDailyJoinDate"
                disabled={form.insuranceResponsibility === "ACCIDENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.accidentDailyJoinDate}
                onChange={handleChange}
                className="table-input"
              />
            </div>

            <div className="dual-input-row">
              <span>상용</span>
              <input
                type="date"
                name="accidentRegularJoinDate"
                disabled={form.insuranceResponsibility === "ACCIDENT_ONLY" || form.insuranceResponsibility === "ALL"}
                value={form.socialIns.accidentRegularJoinDate}
                onChange={handleChange}
                className="table-input"
              />
            </div>
          </td>

          {/* 부금액 */}
          <td>
            <input
              name="accidentFee"
              type="number"
              className="table-input"
              disabled={form.insuranceResponsibility === "ACCIDENT_ONLY" || form.insuranceResponsibility === "ALL"}
              placeholder="부금액"
              onChange={handleChange}
            />
          </td>

          {/* 납부액 */}
          <td>
            <input
              name="accidentPaid"
              type="number"
              className="table-input"
              disabled={form.insuranceResponsibility === "ACCIDENT_ONLY" || form.insuranceResponsibility === "ALL"}
              placeholder="납부액"
              onChange={handleChange}
            />
          </td>

          {/* 납부율 */}
          <td>
            <input
              name="accidentRate"
              type="number"
              className="table-input"
              disabled={form.insuranceResponsibility === "ACCIDENT_ONLY" || form.insuranceResponsibility === "ALL"}
              placeholder="%"
              onChange={handleChange}
            />
          </td>
        </tr>

        {/* ================================= */}
        {/* 퇴직공제 */}
        {/* ================================= */}
        <tr>
          <td><div className="insurance-row-label">퇴직공제</div></td>

          <td>
            <input
              type="text"
              name="severanceDeductionNum"
              className="table-input"
              disabled={!retireEnabled}
              value={form.socialIns.severanceDeductionNum}
              onChange={handleChange}
            />
          </td>

          <td>
            <input
              type="date"
              name="severanceJoinDate"
              className="table-input"
              disabled={!retireEnabled}
              value={form.socialIns.severanceJoinDate}
              onChange={handleChange}
            />
          </td>

          <td>
            <input
              type="number"
              name="dailyDeductionAmount"
              className="table-input"
              disabled={!retireEnabled}
              value={form.socialIns.dailyDeductionAmount ?? ""}
              onChange={handleChange}
            />
          </td>

          <td>
            <input
              type="number"
              name="totalSeverancePaidAmount"
              className="table-input"
              disabled={!retireEnabled}
              value={form.socialIns.totalSeverancePaidAmount ?? ""}
              onChange={handleChange}
            />
          </td>

          <td>
            
          </td>
        </tr>

      </tbody>
    </table>
  </div>
</section>
      </form>
    </div>
  );
};

export default SiteCreatePage;