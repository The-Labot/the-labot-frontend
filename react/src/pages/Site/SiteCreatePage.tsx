// src/pages/Site/SiteCreatePage.tsx
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import "./SiteCreatePage.css";

interface SiteFormState {
  siteName: string;
  siteType: string;
  contractType: string;   // 도급종류
  approvalType: string;   // 인정승인
  managerName: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  contractAmount: string;
  clientName: string;
  mainContractor: string;
  startDate: string;
  endDate: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  notifyPhone: string;
}

const SiteCreatePage: React.FC = () => {
  const [form, setForm] = useState<SiteFormState>({
    siteName: "",
    siteType: "",
    contractType: "",
    approvalType: "",
    managerName: "",
    postalCode: "",
    address: "",
    addressDetail: "",
    contractAmount: "",
    clientName: "",
    mainContractor: "",
    startDate: "",
    endDate: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    notifyPhone: "",
  });

  // 퇴직공제 가입여부 토글 상태
  const [retireEnabled, setRetireEnabled] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: API 연동 예정
    console.log("현장 등록 payload:", form);
    alert("현장 정보가 임시로 저장되었습니다. (API 연동 예정)");
  };

  const handleToggleRetire = () => {
    setRetireEnabled((prev) => !prev);
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
          <button
            type="button"
            className="secondary-button"
            onClick={handleBack}
          >
            취소
          </button>
          <button
            type="submit"
            className="primary-button"
            form="site-create-form"
          >
            <Save size={16} />
            <span>저장</span>
          </button>
        </div>
      </div>

      <form
        id="site-create-form"
        className="site-create-form"
        onSubmit={handleSubmit}
      >
        {/* ===== 현장 기본 정보 ===== */}
        <section className="form-card">
          <h2 className="form-card-title">현장 기본 정보</h2>
          <div className="form-grid">
            {/* 1줄: 현장명 / 도급종류 */}
            <div className="form-field">
              <label htmlFor="siteName">
                현장명 <span className="required">*</span>
              </label>
              <input
                id="siteName"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                placeholder="예) 강남 오피스텔 신축공사"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="contractType">도급종류</label>
              <select
                id="contractType"
                name="contractType"
                value={form.contractType}
                onChange={handleChange}
              >
                <option value="">선택</option>
                <option value="하도급">하도급</option>
                <option value="직영">직영</option>
                <option value="혼합">혼합</option>
                <option value="기타">기타</option>
              </select>
            </div>

            {/* 2줄: 공사 종류 / 인정승인 */}
            <div className="form-field">
              <label htmlFor="siteType">공사 종류</label>
              <select
                id="siteType"
                name="siteType"
                value={form.siteType}
                onChange={handleChange}
              >
                <option value="">선택</option>
                <option value="건축">건축</option>
                <option value="토목">토목</option>
                <option value="전기">전기</option>
                <option value="설비">설비</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="approvalType">인정승인</label>
              <select
                id="approvalType"
                name="approvalType"
                value={form.approvalType}
                onChange={handleChange}
              >
                <option value="">선택</option>
                <option value="고용">고용</option>
                <option value="산재">산재</option>
                <option value="고용+산재">고용 + 산재</option>
              </select>
            </div>

            {/* 3줄: 현장대리인 / 우편번호 */}
            <div className="form-field">
              <label htmlFor="managerName">현장대리인</label>
              <input
                id="managerName"
                name="managerName"
                value={form.managerName}
                onChange={handleChange}
                placeholder="예) 홍길동"
              />
            </div>

            <div className="form-field">
              <label htmlFor="postalCode">우편번호</label>
              <div className="inline-group">
                <input
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="우편번호"
                />
                <button type="button" className="outline-button">
                  주소 검색
                </button>
              </div>
            </div>

            {/* 4줄: 주소 */}
            <div className="form-field form-field-full">
              <label htmlFor="address">주소</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="도로명 주소"
              />
            </div>

            {/* 5줄: 상세 주소 */}
            <div className="form-field form-field-full">
              <label htmlFor="addressDetail">상세 주소</label>
              <input
                id="addressDetail"
                name="addressDetail"
                value={form.addressDetail}
                onChange={handleChange}
                placeholder="동/호수 등 상세주소"
              />
            </div>
          </div>
        </section>

        {/* ===== 계약 / 계좌 정보 ===== */}
        <section className="form-card">
          <h2 className="form-card-title">계약 / 계좌 정보</h2>

          {/* --- 계약 정보 --- */}
          <div className="subsection">
            <h3 className="subsection-title">계약 정보</h3>
            <div className="form-grid">
              {/* 1줄: 도급 금액 / 도급처 */}
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

              <div className="form-field">
                <label htmlFor="clientName">도급처(발주처)</label>
                <input
                  id="clientName"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="발주처 명"
                />
              </div>

              {/* 2줄: 착공일 / 준공일 */}
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

              {/* 3줄: 원도급사 (full) */}
              <div className="form-field form-field-full">
                <label htmlFor="mainContractor">원도급사</label>
                <input
                  id="mainContractor"
                  name="mainContractor"
                  value={form.mainContractor}
                  onChange={handleChange}
                  placeholder="원도급사 명"
                />
              </div>
            </div>
          </div>

          {/* --- 노무비 전용 계좌번호 --- */}
          <div className="subsection">
            <h3 className="subsection-title">노무비 전용 계좌번호</h3>
            <div className="form-grid">
              {/* 1줄: 은행명 / 계좌번호 */}
              <div className="form-field">
                <label htmlFor="bankName">은행명</label>
                <input
                  id="bankName"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="accountNumber">계좌번호</label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  inputMode="numeric"
                />
              </div>

              {/* 2줄: 예금주 / 통보 휴대폰번호 */}
              <div className="form-field">
                <label htmlFor="accountHolder">예금주</label>
                <input
                  id="accountHolder"
                  name="accountHolder"
                  value={form.accountHolder}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="notifyPhone">통보 휴대폰번호</label>
                <input
                  id="notifyPhone"
                  name="notifyPhone"
                  value={form.notifyPhone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== 4대 보험 ===== */}
        <section className="form-card">
          <h2 className="form-card-title">4대 보험</h2>

          {/* 상단: 고용번호 / 원수급번호 + 체크/라디오 */}
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
                  className={
                    "retire-toggle-btn" + (retireEnabled ? " active" : "")
                  }
                  onClick={handleToggleRetire}
                >
                  퇴직공제 가입여부
                </button>

                <div
                  className={
                    "radio-group-inline" +
                    (retireEnabled ? "" : " disabled")
                  }
                >
                  <label>
                    <input
                      type="radio"
                      name="retireJoin"
                      value="의무"
                      disabled={!retireEnabled}
                    />
                    <span>의무</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="retireJoin"
                      value="임의"
                      disabled={!retireEnabled}
                    />
                    <span>임의</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 퇴직공제번호 ~ 표 */}
          <div className="insurance-table-wrapper">
            <table className="insurance-table">
              <thead>
                <tr>
                  <th>퇴직공제번호</th>
                  <th>가입일</th>
                  <th>부금액</th>
                  <th>납부액</th>
                  <th>납부율(%)</th>
                </tr>
              </thead>
              <tbody>
                {/* 국민연금기초 */}
                <tr>
                  <td>
                    <div className="insurance-row-label">국민연금기초</div>
                    <div className="radio-group-inline small">
                      <label>
                        <input type="radio" name="pensionType" />
                        <span>일용</span>
                      </label>
                      <label>
                        <input type="radio" name="pensionType" />
                        <span>상용</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <input className="table-input" type="date" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                </tr>

                {/* 건강보험기초 */}
                <tr>
                  <td>
                    <div className="insurance-row-label">건강보험기초</div>
                    <div className="radio-group-inline small">
                      <label>
                        <input type="radio" name="healthType" />
                        <span>일용</span>
                      </label>
                      <label>
                        <input type="radio" name="healthType" />
                        <span>상용</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <input className="table-input" type="date" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                </tr>

                {/* KT사회보험EDI */}
                <tr>
                  <td>
                    <div className="insurance-row-label">KT사회보험EDI</div>
                    <div className="radio-group-inline small">
                      <label>
                        <input type="radio" name="ktType" />
                        <span>일용</span>
                      </label>
                      <label>
                        <input type="radio" name="ktType" />
                        <span>상용</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <input className="table-input" type="date" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
                  </td>
                  <td>
                    <input className="table-input" type="text" />
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