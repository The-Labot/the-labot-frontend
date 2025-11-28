// src/manager/WorkerManagementScreen.tsx
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { registerWorker } from "../api/worker";

/* ------------------------------------------
   🔥 근로자 등록 입력 상태 (전체 필드)
   ------------------------------------------ */
export default function WorkerManagementScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ----------------------------------
  // 🔹 근로자 등록 입력 상태
  // ----------------------------------
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regResidentId, setRegResidentId] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regNationality, setRegNationality] = useState("내국인");

  const [regJobType, setRegJobType] = useState("");
  const [regContractType, setRegContractType] = useState("일용직"); // ⭐ 일용직 / 월정제
  const [regPayReceive, setRegPayReceive] = useState("");
  const [regSalary, setRegSalary] = useState("");
  const [regEmergencyNumber, setRegEmergencyNumber] = useState("");
  const [regSiteName, setRegSiteName] = useState("");

  const [regBankName, setRegBankName] = useState("");
  const [regAccountNumber, setRegAccountNumber] = useState("");
  const [regAccountHolder, setRegAccountHolder] = useState("");

  const [regContractStartDate, setRegContractStartDate] = useState("");
  const [regContractEndDate, setRegContractEndDate] = useState("");
  const [regWageStartDate, setRegWageStartDate] = useState("");
  const [regWageEndDate, setRegWageEndDate] = useState("");

  /* ------------------------------------------
     타입 정의
     ------------------------------------------ */
  type WorkerStatus = "working" | "resting" | "late";

  interface AttendanceRecord {
    date: string;
    checkInTime: string;
    checkInPeriod: "오전" | "오후" | "-";
    checkOutTime: string;
    checkOutPeriod: "오전" | "오후" | "-";
    status: "정상" | "정상 출근" | "지각" | "조퇴" | "결근";
    objection?: { hasObjection: boolean; message: string };
  }

  interface Worker {
    id: number;
    name: string;
    initial: string;
    role: string;
    status: WorkerStatus;
    site: string;
    address?: string;
    birthDate?: string;
    gender?: string;
    nationality?: string;
    phone?: string;
    attendanceRecords: AttendanceRecord[];
  }

  /* ------------------------------------------
     🔥 더미(임시) worker 목록 완전 삭제 —> 빈 배열
     ------------------------------------------ */
  const [workers, setWorkers] = useState<Worker[]>([]);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [search, setSearch] = useState("");
  const [showPayroll, setShowPayroll] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // 이의제기 상태값
  const [objectionOpen, setObjectionOpen] = useState(false);
  const [objDate, setObjDate] = useState("");
  const [objInPeriod, setObjInPeriod] = useState<"오전" | "오후">("오전");
  const [objInTime, setObjInTime] = useState("");
  const [objOutPeriod, setObjOutPeriod] = useState<"오전" | "오후">("오후");
  const [objOutTime, setObjOutTime] = useState("");
  const [objStatus, setObjStatus] =
    useState<"정상 출근" | "지각" | "조퇴" | "결근">("지각");
    /* ------------------------------------------
     🔍 필터링된 근로자 목록
     ------------------------------------------ */
  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return workers;
    return workers.filter((w) => w.name.includes(q) || w.role.includes(q));
  }, [workers, search]);

  /* ------------------------------------------
     근로자 상태 Badge 색상
     ------------------------------------------ */
  const hasObjection = (w: Worker) =>
    w.attendanceRecords.some((r) => r.objection?.hasObjection);

  const statusBadge = (s: WorkerStatus) => {
    switch (s) {
      case "working":
        return { label: "근무중", bg: "#E6F4EA", fg: "#1E7D32" };
      case "resting":
        return { label: "대기중", bg: "#F3F4F6", fg: "#374151" };
      case "late":
        return { label: "퇴근미처리", bg: "#FEF3E7", fg: "#9A3412" };
      default:
        return { label: "-", bg: "#eee", fg: "#333" };
    }
  };

  /* ------------------------------------------
     통계
     ------------------------------------------ */
  const statCounts = useMemo(
    () => ({
      total: workers.length,
      working: workers.filter((w) => w.status === "working").length,
      resting: workers.filter((w) => w.status === "resting").length,
      objections: workers.filter(hasObjection).length,
    }),
    [workers]
  );

  /* ------------------------------------------
     근로자 등록 API 호출
     ------------------------------------------ */
  const handleRegisterWorker = async () => {
    if (!regName.trim() || !regPhone.trim()) {
      Alert.alert("오류", "이름과 전화번호는 필수입니다.");
      return;
    }

    try {
      const payload = {
        name: regName,
        phoneNumber: regPhone,
        residentIdNumber: regResidentId,
        address: regAddress,
        nationality: regNationality,

        jobType: regJobType,
        contractType: regContractType, // 일용직 / 월정제
        payReceive: regPayReceive,
        salary: regSalary,
        emergencyNumber: regEmergencyNumber,
        siteName: regSiteName,

        bankName: regBankName,
        accountNumber: regAccountNumber,
        accountHolder: regAccountHolder,

        contractStartDate: regContractStartDate,
        contractEndDate: regContractEndDate,
        wageStartDate: regWageStartDate,
        wageEndDate: regWageEndDate,
      };

      console.log("📤 근로자 등록 요청:", payload);

      const res = await registerWorker(payload);
      console.log("📥 근로자 등록 응답:", res);

      Alert.alert("등록 완료", "근로자가 성공적으로 등록되었습니다.");

      // 입력값 초기화
      setRegName("");
      setRegPhone("");
      setRegResidentId("");
      setRegAddress("");
      setRegNationality("내국인");
      setRegJobType("");
      setRegContractType("일용직");
      setRegPayReceive("");
      setRegSalary("");
      setRegEmergencyNumber("");
      setRegSiteName("");
      setRegBankName("");
      setRegAccountNumber("");
      setRegAccountHolder("");
      setRegContractStartDate("");
      setRegContractEndDate("");
      setRegWageStartDate("");
      setRegWageEndDate("");

      setShowRegister(false);
    } catch (err: any) {
      console.log("🚨 근로자 등록 실패:", err);
      Alert.alert("등록 실패", err.message ?? "등록 중 오류가 발생했습니다.");
    }
  };

  /* ------------------------------------------
     LeftItem : 왼쪽 근로자 목록 한 줄
     ------------------------------------------ */
  const LeftItem = ({ item }: { item: Worker }) => {
    const sel = selectedWorker?.id === item.id;
    const b = statusBadge(item.status);


    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedWorker(item);
          setShowPayroll(false);
          setShowCertificates(false);
          setShowRegister(false);
        }}
        style={[styles.listItem, sel && styles.listItemSelected]}
        activeOpacity={0.8}
      >
        <View style={[styles.avatar, { backgroundColor: "#E0ECFF" }]}>
          <Text style={{ color: "#2563EB", fontWeight: "700" }}>
            {item.initial}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.listName}>{item.name}</Text>
            <View style={[styles.badge, { backgroundColor: b.bg }]}>
              <Text style={{ color: b.fg, fontSize: 11 }}>{b.label}</Text>
            </View>

            {hasObjection(item) && (
              <Text style={{ marginLeft: 6, color: "#DC2626", fontSize: 12 }}>
                이의제기 대기
              </Text>
            )}
          </View>

          <Text style={{ color: "#6B7280", fontSize: 12 }}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  /* ------------------------------------------
   🎯 이의제기 열기 / 처리 함수
------------------------------------------ */
function openObjection(rec: any) {
  // 여기는 네 기존 코드 위치에 맞추어 WorkerManagementScreen 안에서 선언해야 함.
}

function processObjection() {
  // 백엔드 이의제기 처리 연결 시 구현
}
    return (
    <View style={styles.root}>
      {/* ---------------- Left Panel ---------------- */}
      <View
        style={[
          styles.left,
          { width: isTablet ? 360 : Math.min(360, width) },
        ]}
      >
        {/* Left Header */}
        <View style={styles.leftHeader}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.title}>근로자 관리</Text>
            <Text style={styles.subtitle}>Worker Management</Text>
          </View>

          {/* + 근로자 추가 */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              setShowRegister(true);
              setShowPayroll(false);
              setShowCertificates(false);
              setSelectedWorker(null);
            }}
          >
            <Text style={styles.primaryBtnText}>+ 근로자 추가</Text>
          </TouchableOpacity>

          {/* 검색창 */}
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="이름, 직종 검색..."
            style={styles.search}
          />

          {/* 상단 통계 */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLbl}>전체</Text>
              <Text style={[styles.statVal, { color: "#2563EB" }]}>
                {statCounts.total}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLbl}>근무중</Text>
              <Text style={[styles.statVal, { color: "#16A34A" }]}>
                {statCounts.working}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLbl}>대기중</Text>
              <Text style={[styles.statVal, { color: "#374151" }]}>
                {statCounts.resting}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLbl}>이의제기</Text>
              <Text style={[styles.statVal, { color: "#DC2626" }]}>
                {statCounts.objections}
              </Text>
            </View>
          </View>
        </View>

        {/* 근로자 목록 */}
        <FlatList
          data={filtered}
          keyExtractor={(it) => String(it.id)}
          renderItem={LeftItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
      {/* ---------------- Right Panel (새 근로자 등록 패널) ---------------- */}
<View style={styles.right}>
  {showRegister ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------------- 서류 첨부 ---------------- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>서류 첨부</Text>
        <Text style={styles.subtitleSmall}>Document Attachments</Text>

        <View style={{ height: 16 }} />

        {/* 계약서 생성 */}
        <TouchableOpacity
          style={styles.docBtn}
          onPress={() => Alert.alert("계약서 생성 화면으로 이동 예정")}
        >
          <Text style={{ color: "#111827", fontWeight: "600" }}>계약서 생성</Text>
          <Text style={{ color: "#9CA3AF" }}>{">"}</Text>
        </TouchableOpacity>

        {/* 신분증 촬영 */}
        <TouchableOpacity
          style={styles.docBtn}
          onPress={() => Alert.alert("신분증 촬영 / OCR 기능 예정")}
        >
          <Text style={{ color: "#111827", fontWeight: "600" }}>신분증 촬영</Text>
          <Text style={{ color: "#9CA3AF" }}>{">"}</Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "#F3F9FF",
            borderRadius: 12,
            padding: 14,
            marginTop: 12,
          }}
        >
          <Text style={{ color: "#2563EB", fontSize: 12 }}>
            신분증 촬영 시 OCR 기술로 개인정보가 자동으로 입력됩니다.
            {"\n"}정확도 향상을 위해 신분증을 평평하게 놓고 촬영해주세요.
          </Text>
        </View>
      </View>

      {/* ---------------- 계약 정보 ---------------- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>계약 정보</Text>
        <Text style={styles.subtitleSmall}>Contract Details</Text>

        <View style={{ height: 16 }} />

        {/* 계약 시작일 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>계약 시작일</Text>
          <TextInput
            placeholder="연도. 월. 일."
            value={regContractStartDate}
            onChangeText={setRegContractStartDate}
            style={styles.input}
          />
        </View>

        {/* 계약 종료일 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>계약 종료일</Text>
          <TextInput
            placeholder="연도. 월. 일."
            value={regContractEndDate}
            onChangeText={setRegContractEndDate}
            style={styles.input}
          />
        </View>

        {/* 임금 산정 시작일 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>임금 산정 시작일</Text>
          <TextInput
            placeholder="2025-01-01"
            value={regWageStartDate}
            onChangeText={setRegWageStartDate}
            style={styles.input}
          />
        </View>

        {/* 임금 산정 종료일 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>임금 산정 종료일</Text>
          <TextInput
            placeholder="2025-12-31"
            value={regWageEndDate}
            onChangeText={setRegWageEndDate}
            style={styles.input}
          />
        </View>

        {/* 계약 형태 (일용직 / 월정제) */}
        <Text style={styles.inputLabel}>계약 형태</Text>
        <Toggle2
          values={["일용직", "월정제"]}
          value={regContractType}
          onChange={setRegContractType}
          wide
        />

        {/* 일급 */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.inputLabel}>일급</Text>
          <TextInput
            placeholder="일급을 입력하세요"
            keyboardType="numeric"
            value={regSalary}
            onChangeText={setRegSalary}
            style={styles.input}
          />
        </View>

        {/* 업무 내용 */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.inputLabel}>업무 내용</Text>
          <TextInput
            placeholder="담당 업무를 입력하세요"
            value={regJobType}
            onChangeText={setRegJobType}
            style={styles.input}
          />
        </View>
      </View>

      {/* ---------------- 개인정보 ---------------- */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>개인 정보</Text>
        <Text style={styles.subtitleSmall}>Personal Information</Text>

        <View style={{ height: 16 }} />

        {/* 이름 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>이름</Text>
          <TextInput
            placeholder="이름을 입력하세요"
            value={regName}
            onChangeText={setRegName}
            style={styles.input}
          />
        </View>

        {/* 주민등록번호 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>주민등록번호</Text>
          <TextInput
            placeholder="예: 900505-1234567"
            value={regResidentId}
            onChangeText={setRegResidentId}
            style={styles.input}
          />
        </View>

        {/* 성별 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>성별</Text>
          <TextInput
            placeholder="성별을 입력하세요"
            value={regNationality}
            onChangeText={setRegNationality}
            style={styles.input}
          />
        </View>

        {/* 연락처 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>연락처</Text>
          <TextInput
            placeholder="010-0000-0000"
            keyboardType="phone-pad"
            value={regPhone}
            onChangeText={setRegPhone}
            style={styles.input}
          />
        </View>

        {/* 비상 연락처 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>비상 연락처</Text>
          <TextInput
            placeholder="010-0000-0000"
            keyboardType="phone-pad"
            value={regEmergencyNumber}
            onChangeText={setRegEmergencyNumber}
            style={styles.input}
          />
        </View>

        {/* 주소 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>주소</Text>
          <TextInput
            placeholder="주소를 입력하세요"
            value={regAddress}
            onChangeText={setRegAddress}
            style={styles.input}
          />
        </View>

        {/* 현장명 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>현장명</Text>
          <TextInput
            placeholder="예: ○○건설 현장"
            value={regSiteName}
            onChangeText={setRegSiteName}
            style={styles.input}
          />
        </View>

        {/* 은행 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>은행</Text>
          <TextInput
            placeholder="예: 신한은행"
            value={regBankName}
            onChangeText={setRegBankName}
            style={styles.input}
          />
        </View>

        {/* 계좌번호 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>계좌번호</Text>
          <TextInput
            placeholder="입력하세요"
            keyboardType="numeric"
            value={regAccountNumber}
            onChangeText={setRegAccountNumber}
            style={styles.input}
          />
        </View>

        {/* 예금주 */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.inputLabel}>예금주</Text>
          <TextInput
            placeholder="예금주명"
            value={regAccountHolder}
            onChangeText={setRegAccountHolder}
            style={styles.input}
          />
        </View>
      </View>

      {/* ---------------- 등록 버튼 ---------------- */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity
          style={[styles.outlineBtn, { marginRight: 8 }]}
          onPress={() => setShowRegister(false)}
        >
          <Text>취소</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryBtnSmall} onPress={handleRegisterWorker}>
          <Text style={styles.primaryBtnText}>등록</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  ) : (
    <View style={styles.empty}>
      <Text style={{ color: "#9CA3AF" }}>근로자를 선택하세요</Text>
    </View>
  )}
</View>

      {/* -------- 이의제기 모달 -------- */}
      <Modal
        visible={objectionOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setObjectionOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>이의제기 처리</Text>

            {selectedWorker && (
              <>
                <Text style={{ marginTop: 8, color: "#374151" }}>
                  {selectedWorker.name} · {selectedWorker.role} · {selectedWorker.site}
                </Text>

                <View style={{ height: 12 }} />
                <Field label="날짜" value={objDate} />

                {/* 출근 시간 */}
                <View style={{ height: 12 }} />
                <Text style={styles.label}>수정할 출근 시간</Text>
                <View style={styles.row2}>
                  <Toggle2
                    values={["오전", "오후"]}
                    value={objInPeriod}
                    onChange={(v) => setObjInPeriod(v as any)}
                  />
                  <TextInput
                    value={objInTime}
                    onChangeText={setObjInTime}
                    style={styles.timeInput}
                  />
                </View>

                {/* 퇴근 시간 */}
                <View style={{ height: 12 }} />
                <Text style={styles.label}>수정할 퇴근 시간</Text>
                <View style={styles.row2}>
                  <Toggle2
                    values={["오전", "오후"]}
                    value={objOutPeriod}
                    onChange={(v) => setObjOutPeriod(v as any)}
                  />
                  <TextInput
                    value={objOutTime}
                    onChangeText={setObjOutTime}
                    style={styles.timeInput}
                  />
                </View>

                {/* 상태 변경 */}
                <View style={{ height: 12 }} />
                <Text style={styles.label}>출퇴근 상태</Text>
                <Toggle2
                  values={["정상 출근", "지각", "조퇴", "결근"]}
                  value={objStatus}
                  onChange={(v) => setObjStatus(v as any)}
                  wide
                />

                <View style={{ height: 16 }} />
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <TouchableOpacity
                    style={styles.outlineBtn}
                    onPress={() => setObjectionOpen(false)}
                  >
                    <Text>취소</Text>
                  </TouchableOpacity>
                  <View style={{ width: 8 }} />
                  <TouchableOpacity style={styles.primaryBtnSmall} onPress={processObjection}>
                    <Text style={styles.primaryBtnText}>처리 완료</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------------------------
   🎯 공통 Field 컴포넌트
------------------------------------------ */
function Field({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ marginVertical: 6 }}>
      <Text style={{ color: "#6B7280", fontSize: 12, marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ color: "#111827", fontSize: 14 }}>
        {value ?? "-"}
      </Text>
    </View>
  );
}

/* ------------------------------------------
   🎯 수정 가능한 EditableField
------------------------------------------ */
function EditableField({
  label,
  value,
  onSave,
}: {
  label: string;
  value?: string;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value ?? "");

  return (
    <View style={{ marginVertical: 6 }}>
      <Text style={{ color: "#6B7280", fontSize: 12, marginBottom: 4 }}>
        {label}
      </Text>

      {editing ? (
        <TextInput
          value={text}
          onChangeText={setText}
          style={{
            backgroundColor: "#F3F4F6",
            borderWidth: 1,
            borderColor: "#D1D5DB",
            borderRadius: 10,
            paddingHorizontal: 10,
            height: 40,
          }}
        />
      ) : (
        <Text style={{ color: "#111827", fontSize: 14 }}>
          {value ?? "-"}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => {
          if (editing) onSave(text);
          setEditing(!editing);
        }}
        style={{ marginTop: 6 }}
      >
        <Text style={{ color: "#2563EB", fontSize: 12 }}>
          {editing ? "저장" : "수정"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ------------------------------------------
   🎯 테이블용 컴포넌트
------------------------------------------ */
function TableTh({ text }: { text: string }) {
  return (
    <Text
      style={{
        flex: 1,
        paddingHorizontal: 8,
        fontSize: 12,
        fontWeight: "600",
        color: "#374151",
      }}
    >
      {text}
    </Text>
  );
}

function TableTd({ text, color }: { text: string; color?: string }) {
  return (
    <Text
      style={{
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 10,
        fontSize: 13,
        color: color ?? "#111827",
      }}
    >
      {text}
    </Text>
  );
}

function StatusPill({ status }: { status: string }) {
  const colorMap: any = {
    "정상": "#16A34A",
    "정상 출근": "#16A34A",
    "지각": "#DC2626",
    "조퇴": "#DC2626",
    "결근": "#9CA3AF",
  };

  return (
    <View
      style={{
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#F3F4F6",
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ fontSize: 12, color: colorMap[status] ?? "#374151" }}>
        {status}
      </Text>
    </View>
  );
}

/* ------------------------------------------
   🎯 문서 버튼
------------------------------------------ */
function DocButton({
  title,
  subtitle,
  tone,
  onPress,
}: {
  title: string;
  subtitle: string;
  tone?: "yellow" | "green";
  onPress: () => void;
}) {
  const colors: any = {
    yellow: "#FACC15",
    green: "#22C55E",
    default: "#111827",
  };

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View>
        <Text style={{ color: "#111827" }}>{title}</Text>
        <Text style={{ color: "#6B7280", fontSize: 12 }}>{subtitle}</Text>
      </View>
      <Text style={{ color: colors[tone ?? "default"] }}>{">"}</Text>
    </TouchableOpacity>
  );
}

/* ------------------------------------------
   🎯 Toggle2 (상태 선택)
------------------------------------------ */
function Toggle2({
  values,
  value,
  onChange,
  wide,
}: {
  values: string[];
  value: string;
  onChange: (v: string) => void;
  wide?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        padding: 4,
        borderRadius: 10,
        flex: wide ? 1 : undefined,
      }}
    >
      {values.map((v) => (
        <TouchableOpacity
          key={v}
          style={[
            {
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
              marginRight: 6,
            },
            value === v && { backgroundColor: "#2563EB" },
          ]}
          onPress={() => onChange(v)}
        >
          <Text style={{ color: value === v ? "#fff" : "#374151" }}>{v}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}



const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  muted: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  mutedSmall: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  root: { flex: 1, backgroundColor: '#FFFFFF', flexDirection: 'row' },
  left: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  leftHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: { fontSize: 18, color: '#111827', fontWeight: '600' },
  subtitle: { color: '#6B7280', fontSize: 12 },
  primaryBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnSmall: {
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '600' },
  search: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statLbl: { color: '#6B7280', fontSize: 11, marginBottom: 4 },
  statVal: { fontSize: 20, fontWeight: '700' },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  listItemSelected: {
    backgroundColor: '#EEF2FF',
    borderLeftColor: '#2563EB',
  },
  listName: { color: '#111827', fontSize: 14, marginRight: 6 },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bigAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: { flex: 1, backgroundColor: '#F9FAFB' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%',
    maxWidth: 880,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  subtitleSmall: { color: '#6B7280', fontSize: 12 },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  docBtn: {
    width: '100%',
    maxWidth: 880,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    marginTop: 8,
  },
  th: { flex: 1, paddingHorizontal: 8 },
  td: { flex: 1, paddingHorizontal: 8, paddingVertical: 10 },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  label: { color: '#374151', marginBottom: 6 },
  row2: { flexDirection: 'row', gap: 8 },
  timeInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 4,
    borderRadius: 10,
  },
  toggleItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  toggleItemSel: { backgroundColor: '#2563EB' },
    inputLabel: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 4,
  },
});