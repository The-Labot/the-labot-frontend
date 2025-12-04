// src/manager/WorkerManagementScreen.tsx
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import React, { useEffect, useMemo, useState, useRef } from "react";
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
  Image,
} from "react-native";
import { registerWorker, fetchWorkers, fetchWorkerDetail, updateWorker, patchAttendance, fetchWorkerFile } from "../api/worker";

/* ------------------------------------------
   🔥 근로자 등록 입력 상태 (전체 필드)
   ------------------------------------------ */
export default function WorkerManagementScreen() {
  const { width } = useWindowDimensions();
  // 1️⃣ 수정: 태블릿 기준을 900에서 700으로 낮춤 (목록이 더 잘 보이도록)
  const isTablet = width >= 700; 
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  // ----------------------------------
  // 🔹 근로자 등록 입력 상태
  // ----------------------------------
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regResidentId, setRegResidentId] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regNationality, setRegNationality] = useState("내국인");

  const [regJobType, setRegJobType] = useState("");
  const [regContractType, setRegContractType] = useState("일용직");
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

  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPosition, setEditPosition] = useState("");
  const [editSiteName, setEditSiteName] = useState("");

  const [contractPreviewUrl, setContractPreviewUrl] = useState("");
  const [contractPreviewOpen, setContractPreviewOpen] = useState(false);

  // ----------------------------------
  // 🔹 데이터 수신 로직 (useEffect)
  // 2️⃣ 수정: return 제거하여 데이터가 씹히지 않도록 함
  // ----------------------------------
  useEffect(() => {
    const p = route.params;
    if (!p) return;

    console.log("📥 [WorkerManagement] 파라미터 수신:", JSON.stringify(p, null, 2));

    let hasDataUpdate = false;

    // 1) OCR 데이터 (계약서 텍스트)
    if (p.ocrData) {
      const o = p.ocrData;
      setShowRegister(true);

      setRegContractType(o.contractType ?? "");
      setRegJobType(o.jobType ?? "");
      setRegSalary(o.salary ?? "");
      setRegPayReceive(o.payReceive ?? "");
      setRegSiteName(o.siteName ?? "");
      setRegBankName(o.bankName ?? "");
      setRegAccountHolder(o.accountHolder ?? "");
      setRegAccountNumber(o.accountNumber ?? "");
      setRegPhone(o.phoneNumber ?? "");
      setRegEmergencyNumber(o.emergencyNumber ?? "");
      setRegContractStartDate(o.contractStartDate ?? "");
      setRegContractEndDate(o.contractEndDate ?? "");
      setRegWageStartDate(o.wageStartDate ?? "");
      setRegWageEndDate(o.wageEndDate ?? "");
      
      hasDataUpdate = true;
    }

    // 2) 계약서 이미지
    if (p.contractImage) {
      console.log("🖼 계약서 이미지 설정됨");
      setContractImage(p.contractImage);
      setShowRegister(true);
      hasDataUpdate = true;
    }

    // 3) 신분증 데이터
    if (p.idCardData) {
      console.log("💳 신분증 데이터 설정됨");
      const o = p.idCardData;
      setShowRegister(true);
      setRegName(o.name ?? "");
      setRegAddress(o.address ?? "");
      setRegResidentId(o.residentIdNumber ?? "");
      hasDataUpdate = true;
    }

    // 처리가 끝났으면 파라미터 비우기 (중복 실행 방지)
    if (hasDataUpdate) {
      navigation.setParams({
        ocrData: undefined,
        contractImage: undefined,
        idCardData: undefined,
      });
    }

  }, [route.params]);

  /* ------------------------------------------
     타입 정의
     ------------------------------------------ */
  interface Worker {
    id: number;
    name: string;
    position: string;
    status: "ACTIVE" | "WAITING";
    initial: string;
    site?: string;
    hasObjection?: boolean;
  }
  interface WorkerDetail {
    id: number;
    name: string;
    phone: string;
    address: string;
    birthDate: string;
    gender: string;
    nationality: string;
    position: string;
    status: "ACTIVE" | "WAITING";
    contractType: string;
    salary: string;
    payReceive: string;
    wageStartDate: string;
    wageEndDate: string;
    emergencyNumber: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    siteName: string;
    attendanceHistory: {
      attendanceId: number;
      date: string;
      clockInTime: string | null;
      clockOutTime: string | null;
      status: string;
      objectionMessage: string | null;
    }[];
    contractFile?: {
      id: number;
      fileUrl: string;
      originalFileName: string;
    };
  }

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [search, setSearch] = useState("");
  const [showPayroll, setShowPayroll] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // 이의제기 상태값
  const [objectionOpen, setObjectionOpen] = useState(false);
  const [objDate, setObjDate] = useState("");
  const [objInTime, setObjInTime] = useState("");
  const [objOutTime, setObjOutTime] = useState("");
  const [objStatus, setObjStatus] = useState<"정상 출근" | "지각" | "조퇴" | "결근">("지각");

  const [detail, setDetail] = useState<WorkerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const currentAttendanceIdRef = useRef<number | null>(null);
  const [contractImage, setContractImage] = useState<any>(null);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    waiting: 0,
    objections: 0,
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    if (detail) {
      setEditPosition(detail.position ?? "");
      setEditSiteName(detail.siteName ?? "");
    }
  }, [detail]);

  // 3️⃣ 수정: FocusEffect에서 초기화 로직 제거 (작성 중인 데이터 보호)
  useFocusEffect(
    React.useCallback(() => {
      // 화면이 포커스될 때 아무것도 하지 않습니다.
      // 필요하다면 리스트 갱신 정도만 수행합니다.
      // loadWorkers(); 
    }, [])
  );

  function openObjection(rec: any) {
    setObjDate(rec.date);
    setObjInTime(rec.clockInTime?.split(":").slice(0, 2).join(":") ?? "");
    setObjOutTime(rec.clockOutTime?.split(":").slice(0, 2).join(":") ?? "");

    const statusMap: any = {
      PRESENT: "정상 출근",
      LATE: "지각",
      EARLY_LEAVE: "조퇴",
      ABSENT: "결근",
    };
    setObjStatus(statusMap[rec.status] ?? "정상 출근");
    currentAttendanceIdRef.current = rec.attendanceId;
    setObjectionOpen(true);
  }

  async function processObjection() {
    if (!detail) return;
    try {
      const clockIn = objInTime.length === 5 ? `${objInTime}:00` : objInTime;
      const clockOut = objOutTime.length === 5 ? `${objOutTime}:00` : objOutTime;
      const reverseStatusMap: any = {
        "정상 출근": "PRESENT",
        "지각": "LATE",
        "조퇴": "EARLY_LEAVE",
        "결근": "ABSENT",
      };
      const payload = {
        clockInTime: clockIn,
        clockOutTime: clockOut,
        status: reverseStatusMap[objStatus],
      };
      await patchAttendance(currentAttendanceIdRef.current, payload);
      Alert.alert("완료", "이의제기가 처리되었습니다.");
      setObjectionOpen(false);
      const refreshed = await fetchWorkerDetail(detail.id);
      setDetail(refreshed);
    } catch (err) {
      console.log("❌ 이의제기 PATCH 실패:", err);
      Alert.alert("에러", "처리에 실패했습니다.");
    }
  }

  async function loadWorkers() {
    try {
      const res = await fetchWorkers();
      const workerList = res.data?.workers ?? [];
      setWorkers(
        workerList.map((w: any) => ({
          id: w.id,
          name: w.name,
          position: w.position,
          status: w.status,
          initial: w.name?.[0] ?? "",
          hasObjection: w.hasObjection ?? false,
        }))
      );
      setStats({
        total: res.data.totalCount,
        active: res.data.activeCount,
        waiting: res.data.waitingCount,
        objections: res.data.objectionCount,
      });
    } catch (err) {
      console.log("🚨 근로자 목록 불러오기 실패:", err);
    }
  }

  async function handleWorkerUpdate(changes: any) {
    if (!detail) return;
    try {
      const updated = await updateWorker(detail.id, changes);
      const refreshed = await fetchWorkerDetail(detail.id);
      setDetail(refreshed);
      await loadWorkers();
      Alert.alert("완료", "변경이 저장되었습니다.");
    } catch (err) {
      Alert.alert("에러", "수정에 실패했습니다.");
    }
  }

  async function openContractFile() {
    try {
      if (!detail?.contractFile) {
        Alert.alert("계약서 없음", "등록된 계약서 파일이 없습니다.");
        return;
      }
      const fileId = detail.contractFile.id;
      const res = await fetchWorkerFile(fileId);
      setContractPreviewUrl(res.fileUrl);
      setContractPreviewOpen(true);
    } catch (err) {
      Alert.alert("에러", "계약서를 불러오지 못했습니다.");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return workers;
    return workers.filter((w) => w.name.includes(q) || w.position.includes(q));
  }, [workers, search]);

  const statusBadge = (status: "ACTIVE" | "WAITING") => {
    if (status === "ACTIVE")
      return { label: "출근", bg: "#E6F4EA", fg: "#1E7D32" };
    return { label: "퇴근", bg: "#F3F4F6", fg: "#374151" };
  };

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
        contractType: regContractType,
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

      await registerWorker(payload, contractImage);
      Alert.alert("등록 완료", "근로자가 성공적으로 등록되었습니다.");
      await loadWorkers();
      
      // 등록 성공 시에만 초기화
      setShowRegister(false);
      setSelectedWorker(null);
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
      setContractImage(null);

    } catch (err: any) {
      console.log("🚨 근로자 등록 실패:", err);
      Alert.alert("등록 실패", err.message ?? "등록 중 오류가 발생했습니다.");
    }
  };

  const LeftItem = ({ item }: { item: Worker }) => {
    const sel = selectedWorker?.id === item.id;
    const b = statusBadge(item.status);

    return (
      <TouchableOpacity
        onPress={async () => {
          setSelectedWorker(item);
          setShowRegister(false);
          setShowPayroll(false);
          setShowCertificates(false);
          setLoadingDetail(true);
          try {
            const d = await fetchWorkerDetail(item.id);
            setDetail(d);
          } finally {
            setLoadingDetail(false);
          }
        }}
        style={[styles.listItem, sel && styles.listItemSelected]}
      >
        <View style={[styles.avatar, { backgroundColor: "#E0ECFF" }]}>
          <Text style={{ color: "#2563EB", fontWeight: "700" }}>
            {item.initial}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.listName}>{item.name}</Text>
            <View style={[styles.badge, { backgroundColor: b.bg, marginRight: 4 }]}>
              <Text style={{ color: b.fg, fontSize: 11 }}>{b.label}</Text>
            </View>
            {item.hasObjection && (
              <View
                style={{
                  backgroundColor: "#FEE2E2",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "#DC2626", fontSize: 11 }}>이의제기</Text>
              </View>
            )}
          </View>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>
            {item.position}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  /* ------------------------------------------
     🔥 4️⃣ 수정: 렌더링 (화면 레이아웃)
     넓은 화면(isTablet)이면 둘 다 표시
     좁은 화면이면 조건에 따라 하나만 표시
     ------------------------------------------ */
  return (
    <View style={styles.root}>
      {/* --- Left Panel --- */}
      {(isTablet || (!showRegister && !selectedWorker)) && (
        <View style={[styles.left, { width: isTablet ? 360 : "100%" }]}>
          <View style={styles.leftHeader}>
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.title}>근로자 관리</Text>
              <Text style={styles.subtitle}>Worker Management</Text>
            </View>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => {
                setShowRegister(true);
                setShowPayroll(false);
                setShowCertificates(false);
                setSelectedWorker(null);
                setContractImage(null); // 신규 등록 누를때만 이미지 초기화
              }}
            >
              <Text style={styles.primaryBtnText}>+ 근로자 추가</Text>
            </TouchableOpacity>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="이름, 직종 검색..."
              style={styles.search}
            />
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statLbl}>전체</Text>
                <Text style={[styles.statVal, { color: "#2563EB" }]}>{stats.total}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLbl}>출근</Text>
                <Text style={[styles.statVal, { color: "#16A34A" }]}>{stats.active}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLbl}>퇴근</Text>
                <Text style={[styles.statVal, { color: "#374151" }]}>{stats.waiting}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLbl}>이의제기</Text>
                <Text style={[styles.statVal, { color: "#DC2626" }]}>{stats.objections}</Text>
              </View>
            </View>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(it) => String(it.id)}
            renderItem={({ item }) => <LeftItem item={item} />}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </View>
      )}

      {/* --- Right Panel --- */}
      {(isTablet || showRegister || selectedWorker) && (
        <View style={styles.right}>
          {showRegister ? (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
              {/* === 서류 첨부 === */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>서류 첨부</Text>
                <Text style={styles.subtitleSmall}>Document Attachments</Text>
                <View style={{ height: 16 }} />
                <TouchableOpacity
                  style={styles.docBtn}
                  onPress={() => navigation.navigate("ContractCamera")}
                >
                  <Text style={{ color: "#111827", fontWeight: "600" }}>계약서 촬영</Text>
                  <Text style={{ color: "#9CA3AF" }}>{">"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.docBtn}
                  onPress={() => navigation.navigate("IdCardCamera")}
                >
                  <Text style={{ color: "#111827", fontWeight: "600" }}>신분증 촬영</Text>
                  <Text style={{ color: "#9CA3AF" }}>{">"}</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: "#F3F9FF", borderRadius: 12, padding: 14, marginTop: 12 }}>
                  <Text style={{ color: "#2563EB", fontSize: 12 }}>
                    신분증 촬영 시 OCR 기술로 개인정보가 자동으로 입력됩니다.{"\n"}
                    정확도 향상을 위해 신분증을 평평하게 놓고 촬영해주세요.
                  </Text>
                </View>
              </View>

              {/* 계약서 이미지 미리보기 */}
              {contractImage && (
                <View style={{ backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 16, marginTop: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>첨부된 계약서 이미지</Text>
                  <View style={{ height: 12 }} />
                  <View style={{ height: 180, borderRadius: 12, overflow: "hidden", backgroundColor: "#E5E7EB" }}>
                    <TouchableOpacity onPress={() => setImageViewerOpen(true)}>
                      <Image source={{ uri: contractImage.uri }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* === 계약 정보 === */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>계약 정보</Text>
                <Text style={styles.subtitleSmall}>Contract Details</Text>
                <View style={{ height: 16 }} />
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>계약 시작일</Text>
                  <TextInput placeholder="2025-01-01" value={regContractStartDate} onChangeText={setRegContractStartDate} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>계약 종료일</Text>
                  <TextInput placeholder="2025-12-31" value={regContractEndDate} onChangeText={setRegContractEndDate} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>임금 산정 시작일</Text>
                  <TextInput placeholder="2025-01-01" value={regWageStartDate} onChangeText={setRegWageStartDate} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>임금 산정 종료일</Text>
                  <TextInput placeholder="2025-12-31" value={regWageEndDate} onChangeText={setRegWageEndDate} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>급여 수령일</Text>
                    <TextInput
                      placeholder="예: 매월 10일 / 매주 금요일"
                      value={regPayReceive}
                      onChangeText={setRegPayReceive}
                      style={styles.input}
                    />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>계약 형태</Text>
                  <TextInput placeholder="예: 일용직 / 월정제" value={regContractType} onChangeText={setRegContractType} style={styles.input} />
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.inputLabel}>일급</Text>
                  <TextInput placeholder="일급 입력" keyboardType="numeric" value={regSalary} onChangeText={setRegSalary} style={styles.input} />
                </View>
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.inputLabel}>업무 내용</Text>
                  <TextInput placeholder="담당 업무 입력" value={regJobType} onChangeText={setRegJobType} style={styles.input} />
                </View>
              </View>

              {/* === 개인 정보 === */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>개인 정보</Text>
                <Text style={styles.subtitleSmall}>Personal Information</Text>
                <View style={{ height: 16 }} />
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>이름</Text>
                  <TextInput placeholder="이름 입력" value={regName} onChangeText={setRegName} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>주민등록번호</Text>
                  <TextInput placeholder="900505-1234567" value={regResidentId} onChangeText={setRegResidentId} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>성별/국적</Text>
                  <TextInput placeholder="내국인" value={regNationality} onChangeText={setRegNationality} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>연락처</Text>
                  <TextInput placeholder="010-0000-0000" keyboardType="phone-pad" value={regPhone} onChangeText={setRegPhone} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>비상 연락처</Text>
                  <TextInput placeholder="010-0000-0000" keyboardType="phone-pad" value={regEmergencyNumber} onChangeText={setRegEmergencyNumber} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>주소</Text>
                  <TextInput placeholder="주소 입력" value={regAddress} onChangeText={setRegAddress} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>현장명</Text>
                  <TextInput placeholder="예: ○○건설 현장" value={regSiteName} onChangeText={setRegSiteName} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>은행</Text>
                  <TextInput placeholder="예: 신한은행" value={regBankName} onChangeText={setRegBankName} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>계좌번호</Text>
                  <TextInput placeholder="입력하세요" keyboardType="numeric" value={regAccountNumber} onChangeText={setRegAccountNumber} style={styles.input} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>예금주</Text>
                  <TextInput placeholder="예금주명" value={regAccountHolder} onChangeText={setRegAccountHolder} style={styles.input} />
                </View>
              </View>

              {/* === 버튼 === */}
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
          ) : detail ? (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
              {/* === 상세 정보 (기존 코드 유지) === */}
              <View style={styles.card}>
                <TouchableOpacity
                  style={{
                    position: "absolute", top: 16, right: 16, paddingVertical: 6, paddingHorizontal: 12,
                    backgroundColor: detail.status === "WAITING" ? "#111" : "#16A34A", borderRadius: 8,
                  }}
                  onPress={() => handleWorkerUpdate({ status: detail.status === "WAITING" ? "ACTIVE" : "WAITING" })}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {detail.status === "WAITING" ? "출근으로 변경" : "퇴근으로 변경"}
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.bigAvatar}>
                    <Text style={{ fontSize: 28, color: "#2563EB", fontWeight: "700" }}>{detail.name[0]}</Text>
                  </View>
                  <View style={{ marginLeft: 20, flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
                      <Text style={{ fontSize: 30, fontWeight: "700", color: "#111827", marginRight: 12 }}>{detail.name}</Text>
                      <Text style={{ fontSize: 19, color: "#4B5563", marginRight: 12 }}>{detail.position}</Text>
                      <Text style={{ fontSize: 15, color: "#6B7280" }}>{detail.phone}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.card}>
                <TouchableOpacity
                  style={{ position: "absolute", top: 16, right: 16, paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#2563EB", borderRadius: 8 }}
                  onPress={() => {
                    if (editMode) {
                      handleWorkerUpdate({ position: editPosition, siteName: editSiteName });
                    }
                    setEditMode(!editMode);
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>{editMode ? "저장" : "수정"}</Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>개인정보</Text>
                <View style={{ height: 12 }} />
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>직종</Text>
                  <TextInput editable={editMode} value={editPosition} onChangeText={setEditPosition} style={[styles.input, { backgroundColor: editMode ? "#fff" : "#F3F4F6" }]} />
                </View>
                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.inputLabel}>현장명</Text>
                  <TextInput editable={editMode} value={editSiteName} onChangeText={setEditSiteName} style={[styles.input, { backgroundColor: editMode ? "#fff" : "#F3F4F6" }]} />
                </View>
                <InfoItem label="주소" value={detail.address} />
                <InfoItem label="생년월일" value={detail.birthDate} />
                <InfoItem label="성별" value={detail.gender} />
                <InfoItem label="국적" value={detail.nationality} />
                <InfoItem label="전화번호" value={detail.phone} />
                <InfoItem label="비상 연락처" value={detail.emergencyNumber} />
                <InfoItem label="은행" value={detail.bankName} />
                <InfoItem label="계좌번호" value={detail.accountNumber} />
                <InfoItem label="예금주" value={detail.accountHolder} />
              </View>

              <View style={styles.card}>
                <DocButton title="근로 계약서 보기" subtitle={detail.contractFile?.originalFileName ?? "계약서 없음"} onPress={openContractFile} />
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>출퇴근 기록</Text>
                <View style={styles.tableHeader}>
                  <TableTh text="날짜" />
                  <TableTh text="출근" />
                  <TableTh text="퇴근" />
                  <TableTh text="상태" />
                  <TableTh text="이의제기" />
                </View>
                {detail.attendanceHistory.map((h) => (
                  <View key={h.attendanceId} style={styles.tableRow}>
                    <TableTd text={h.date} />
                    <TableTd text={h.clockInTime ?? "-"} color="#16A34A" />
                    <TableTd text={h.clockOutTime ?? "-"} color="#DC2626" />
                    <TableTd><StatusPill status={h.status} /></TableTd>
                    <TableTd>
                      <TouchableOpacity
                        onPress={() => h.objectionMessage && openObjection(h)}
                        disabled={!h.objectionMessage}
                        style={{ backgroundColor: h.objectionMessage ? "#FEE2E2" : "#E5E7EB", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, alignItems: "center" }}
                      >
                        <Text style={{ color: h.objectionMessage ? "#DC2626" : "#6B7280" }}>{h.objectionMessage ? "이의제기" : "-"}</Text>
                      </TouchableOpacity>
                    </TableTd>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.empty}>
              <Text style={{ color: "#9CA3AF" }}>근로자를 선택하세요</Text>
            </View>
          )}
        </View>
      )}

      {/* --- Modals --- */}
      <Modal visible={imageViewerOpen} transparent animationType="fade" onRequestClose={() => setImageViewerOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setImageViewerOpen(false)} style={{ position: "absolute", top: 40, right: 40, padding: 10 }}>
            <Text style={{ fontSize: 30, color: "white" }}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: contractImage?.uri }} style={{ width: "90%", height: "80%" }} resizeMode="contain" />
        </View>
      </Modal>

      <Modal visible={objectionOpen} transparent animationType="fade" onRequestClose={() => setObjectionOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>이의제기 처리</Text>
            {selectedWorker && (
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Text style={{ marginTop: 8, color: "#374151", fontSize: 16 }}>{selectedWorker.name} · {selectedWorker.position}</Text>
                <View style={{ height: 16 }} />
                <Field label="날짜" value={objDate} />
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.label}>수정할 출근 시간</Text>
                  <TextInput value={objInTime} onChangeText={setObjInTime} placeholder="예: 09:30" style={styles.timeInput} />
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.label}>수정할 퇴근 시간</Text>
                  <TextInput value={objOutTime} onChangeText={setObjOutTime} placeholder="예: 18:00" style={styles.timeInput} />
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={styles.label}>출퇴근 상태</Text>
                  <Toggle2 values={["정상 출근", "지각", "조퇴", "결근"]} value={objStatus} onChange={(v) => setObjStatus(v as any)} wide />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 30 }}>
                  <TouchableOpacity style={styles.outlineBtn} onPress={() => setObjectionOpen(false)}><Text>취소</Text></TouchableOpacity>
                  <View style={{ width: 12 }} />
                  <TouchableOpacity style={styles.primaryBtnSmall} onPress={processObjection}><Text style={styles.primaryBtnText}>처리 완료</Text></TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={contractPreviewOpen} transparent animationType="fade" onRequestClose={() => setContractPreviewOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setContractPreviewOpen(false)} style={{ position: "absolute", top: 40, right: 40, padding: 10 }}>
            <Text style={{ fontSize: 32, color: "white" }}>✕</Text>
          </TouchableOpacity>
          <Image source={{ uri: contractPreviewUrl }} style={{ width: "90%", height: "80%" }} resizeMode="contain" />
        </View>
      </Modal>
    </View>
  );
}

/* ------------------------------------------
   🎯 하위 컴포넌트들
------------------------------------------ */
function Field({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ marginVertical: 6 }}>
      <Text style={{ color: "#6B7280", fontSize: 12, marginBottom: 4 }}>{label}</Text>
      <Text style={{ color: "#111827", fontSize: 14 }}>{value ?? "-"}</Text>
    </View>
  );
}
function TableTh({ text }: { text: string }) {
  return (
    <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 8 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>{text}</Text>
    </View>
  );
}
function TableTd({ text, color, children }: { text?: string; color?: string; children?: any }) {
  return (
    <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8 }}>
      {children ? children : <Text style={{ fontSize: 13, color: color ?? "#111827" }}>{text}</Text>}
    </View>
  );
}
function StatusPill({ status }: { status: string }) {
  const colorMap: any = { "정상": "#16A34A", "정상 출근": "#16A34A", "지각": "#DC2626", "조퇴": "#DC2626", "결근": "#9CA3AF", "PRESENT": "#16A34A", "LATE": "#DC2626", "EARLY_LEAVE": "#DC2626", "ABSENT": "#9CA3AF" };
  const labelMap: any = { "PRESENT": "정상 출근", "LATE": "지각", "EARLY_LEAVE": "조퇴", "ABSENT": "결근" };
  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, backgroundColor: "#F3F4F6", alignSelf: "flex-start" }}>
      <Text style={{ fontSize: 12, color: colorMap[status] ?? "#374151" }}>{labelMap[status] ?? status}</Text>
    </View>
  );
}
function DocButton({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={{ borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} onPress={onPress}>
      <View><Text style={{ color: "#111827" }}>{title}</Text><Text style={{ color: "#6B7280", fontSize: 12 }}>{subtitle}</Text></View>
      <Text style={{ color: "#111827" }}>{">"}</Text>
    </TouchableOpacity>
  );
}
function Toggle2({ values, value, onChange, wide }: { values: string[]; value: string; onChange: (v: string) => void; wide?: boolean }) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: "#F3F4F6", padding: 4, borderRadius: 10, flex: wide ? 1 : undefined }}>
      {values.map((v) => (
        <TouchableOpacity key={v} style={[{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 6 }, value === v && { backgroundColor: "#2563EB" }]} onPress={() => onChange(v)}>
          <Text style={{ color: value === v ? "#fff" : "#374151" }}>{v}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, padding: 12, marginBottom: 10 }}>
      <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{label}</Text>
      <Text style={{ fontSize: 15, color: "#111827", fontWeight: "500" }}>{value ?? "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', flexDirection: 'row' },
  left: { borderRightWidth: 1, borderRightColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  leftHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 18, color: '#111827', fontWeight: '600' },
  subtitle: { color: '#6B7280', fontSize: 12 },
  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  primaryBtnSmall: { backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '600' },
  search: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, height: 40, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statLbl: { color: '#6B7280', fontSize: 11, marginBottom: 4 },
  statVal: { fontSize: 20, fontWeight: '700' },
  listItem: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 16, borderLeftWidth: 4, borderLeftColor: 'transparent' },
  listItemSelected: { backgroundColor: '#EEF2FF', borderLeftColor: '#2563EB' },
  listName: { color: '#111827', fontSize: 14, marginRight: 6 },
  badge: { marginLeft: 6, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  bigAvatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  right: { flex: 1, backgroundColor: '#F9FAFB' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', maxWidth: 880, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  sectionTitle: { fontSize: 16, color: '#111827', fontWeight: '600' },
  subtitleSmall: { color: '#6B7280', fontSize: 12 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, height: 40 },
  docBtn: { width: '100%', maxWidth: 880, borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  outlineBtn: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#FFFFFF' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 8, marginTop: 8 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 720, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  label: { color: '#374151', marginBottom: 6 },
  timeInput: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 14, height: 48, fontSize: 16, color: '#111827' },
  inputLabel: { color: "#6B7280", fontSize: 12, marginBottom: 4 },
});