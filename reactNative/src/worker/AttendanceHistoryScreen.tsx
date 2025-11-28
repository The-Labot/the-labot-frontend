// src/worker/AttendanceHistoryScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { BASE_URL } from "../api/config";
import { getTempAccessToken } from "../api/auth";

interface AttendanceRecord {
  attendanceId: number;
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  status: "completed" | "in-progress";
}

type Props = NativeStackScreenProps<RootStackParamList, "AttendanceHistory">;

export default function AttendanceHistoryScreen({ navigation }: Props) {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("11");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  // ===== 이의제기 상태 =====
  const [isAppealModalVisible, setAppealModalVisible] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<number | null>(null);

  // ===== 이의제기 제출 =====
  const submitAppeal = async () => {
    if (!appealMessage.trim()) {
      alert("이의제기 사유를 입력해주세요.");
      return;
    }
    if (!selectedAttendanceId) return;

    try {
      const token = getTempAccessToken();

      const res = await fetch(
        `${BASE_URL}/worker/attendance/${selectedAttendanceId}/object`,
        {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: appealMessage }),
        }
      );

      const json = await res.json();
      console.log("📌 이의제기 응답:", json);

      if (json.status === 200) {
        alert("이의제기가 성공적으로 제출되었습니다.");
        setAppealMessage("");
        setAppealModalVisible(false);
      } else {
        alert(json.message || "이의제기 제출 실패");
      }
    } catch (err) {
      console.log("🚨 이의제기 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // ===== 요일 계산 =====
  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  };

  // ===== 근무시간 계산 =====
  const calcHours = (start: string, end: string | null) => {
    if (!end) return 0;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return ((eh * 60 + em - (sh * 60 + sm)) / 60).toFixed(1);
  };

  // ===== 출퇴근 조회 API =====
  const fetchAttendance = async () => {
    try {
      const token = getTempAccessToken();

      const res = await fetch(`${BASE_URL}/worker/attendance`, {
        method: "GET",
        headers: { Authorization: token },
      });

      const json = await res.json();
      console.log("📌 출퇴근 조회 응답:", json);

      const converted = json.data.map((item: any) => {
        const dateFormatted = item.date.replace(/-/g, ".");
        const day = getDayOfWeek(item.date);

        const checkIn = item.clockInTime?.slice(0, 5) || "-";
        const checkOut = item.clockOutTime?.slice(0, 5) || "-";

        const hours = item.clockOutTime
          ? Number(calcHours(item.clockInTime, item.clockOutTime))
          : 0;

        const status = item.clockOutTime ? "completed" : "in-progress";

        return {
          attendanceId: item.attendanceId,
          date: dateFormatted,
          day,
          checkIn,
          checkOut,
          hours,
          status,
        };
      });

      setAttendanceData(converted.sort((a, b) => (a.date < b.date ? 1 : -1)));
    } catch (err) {
      console.log("🚨 출퇴근 fetch 오류:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const currentData = attendanceData.filter((item) =>
    item.date.startsWith(`${selectedYear}.${selectedMonth}`)
  );

  const totalHours = currentData.reduce((sum, item) => sum + item.hours, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>

        {/* ===== Header ===== */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={22} color="#374151" />
          </TouchableOpacity>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerTitle}>출퇴근 기록</Text>
            <Text style={styles.headerSubtitle}>Attendance History</Text>
          </View>
        </View>

        {/* ===== Year/Month 선택 ===== */}
        <View style={styles.selectorRow}>
          <View style={styles.selectorBox}>
            <Calendar size={16} color="#666" style={{ marginRight: 6 }} />
            <Picker
              selectedValue={selectedYear}
              onValueChange={(value) => setSelectedYear(value)}
              style={styles.picker}
            >
              <Picker.Item label="2025년" value="2025" />
              <Picker.Item label="2024년" value="2024" />
              <Picker.Item label="2023년" value="2023" />
            </Picker>
          </View>

          <View style={styles.selectorBox}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
              style={styles.picker}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <Picker.Item label={`${m}월`} value={m} key={m} />;
              })}
            </Picker>
          </View>
        </View>

        {/* ===== Summary ===== */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Calendar size={18} color="#dfe7ff" />
            <Text style={styles.summaryHeaderText}>
              {selectedYear}년 {selectedMonth}월 근무 현황
            </Text>
          </View>

          <View style={styles.summaryInner}>
            <Text style={styles.summaryLabel}>총 근무시간</Text>
            <Text style={styles.summaryHours}>{totalHours}h</Text>
            <Text style={styles.summarySub}>Total Hours</Text>
          </View>
        </View>

        {/* ===== Detail List ===== */}
        <Text style={styles.detailTitle}>출퇴근 상세 기록</Text>

        {currentData.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ color: "#777" }}>해당 기간에 출퇴근 기록이 없습니다</Text>
          </View>
        ) : (
          currentData.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.recordCard,
                item.status === "in-progress" && styles.recordInProgress,
              ]}
            >
              {/* ===== TOP ===== */}
              <View style={styles.recordTop}>
                <View
                  style={[
                    styles.dayBox,
                    item.status === "in-progress" && { backgroundColor: "#2db765" },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      item.status === "in-progress" && { color: "#eafff0" },
                    ]}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      item.status === "in-progress" && { color: "white" },
                    ]}
                  >
                    {item.date.split(".")[2]}
                  </Text>
                </View>

                <View>
                  <Text style={styles.recordDate}>{item.date}</Text>
                  <Text
                    style={
                      item.status === "completed"
                        ? styles.statusComplete
                        : styles.statusProgress
                    }
                  >
                    {item.status === "completed" ? "완료" : "근무중"}
                  </Text>
                </View>

                {item.status === "completed" ? (
                  <CheckCircle size={20} color="#2663ff" />
                ) : (
                  <Clock size={20} color="#2db765" />
                )}
              </View>

              {/* ===== Middle Info ===== */}
              <View style={styles.recordInfo}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>출근</Text>
                  <Text style={styles.infoValue}>{item.checkIn}</Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>퇴근</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      item.checkOut === "-" && { color: "#bbb" },
                    ]}
                  >
                    {item.checkOut}
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>근무시간</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      item.hours === 0 && { color: "#bbb" },
                    ]}
                  >
                    {item.hours > 0 ? `${item.hours}h` : "-"}
                  </Text>
                </View>
              </View>

              {/* ===== 이의제기 버튼 ===== */}
              {item.status === "completed" && (
                <TouchableOpacity
                  style={styles.disputeBtn}
                  onPress={() => {
                    setSelectedAttendanceId(item.attendanceId);
                    setAppealModalVisible(true);
                  }}
                >
                  <AlertCircle size={16} color="#ff7a00" />
                  <Text style={styles.disputeText}>이의제기</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* ===== 모달 UI ===== */}
      {isAppealModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>이의제기</Text>
            <Text style={styles.modalSubtitle}>사유를 입력해주세요</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="예: 앱 렉으로 퇴근이 늦게 찍혔습니다."
              multiline
              value={appealMessage}
              onChangeText={setAppealMessage}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ddd" }]}
                onPress={() => setAppealModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#2563EB" }]}
                onPress={submitAppeal}
              >
                <Text style={[styles.modalBtnText, { color: "white" }]}>제출</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
/* --------------- 너가 준 스타일 그대로 --------------- */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  container: { flex: 1, backgroundColor: "#F3F4F6", paddingHorizontal: 20 },
  header: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  backButton: { position: "absolute", left: 20, padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#111827" },
  headerSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  selectorRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  selectorBox: {
    flex: 1, height: 48, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff",
    borderRadius: 10, paddingHorizontal: 10, flexDirection: "row", alignItems: "center",
  },
  picker: { flex: 1, height: 48 },
  summaryCard: {
    backgroundColor: "#1b67ff", borderRadius: 16, padding: 18, marginBottom: 25,
  },
  summaryHeader: {
    flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12,
  },
  summaryHeaderText: { color: "#dfe7ff", fontSize: 13 },
  summaryInner: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 16,
    borderRadius: 12,
  },
  summaryLabel: { color: "#dfe7ff", fontSize: 12 },
  summaryHours: { color: "white", fontSize: 26, fontWeight: "700" },
  summarySub: { color: "#dfe7ff", fontSize: 11, marginTop: 4 },
  detailTitle: { fontSize: 16, color: "#333", marginBottom: 10 },
  emptyCard: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  recordCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 14,
  },
  recordInProgress: {
    backgroundColor: "#f2fcf4",
    borderLeftWidth: 4,
    borderLeftColor: "#2db765",
  },
  recordTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#e5efff",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: { fontSize: 11, color: "#2663ff" },
  dateText: { fontSize: 15, color: "#2663ff", fontWeight: "700" },
  recordDate: { fontSize: 14, color: "#333", marginBottom: 2 },
  statusComplete: {
    backgroundColor: "#e5efff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    color: "#2663ff",
    fontSize: 11,
    alignSelf: "flex-start",
  },
  statusProgress: {
    backgroundColor: "#2db765",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    color: "white",
    fontSize: 11,
    alignSelf: "flex-start",
  },
  recordInfo: {
    marginTop: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: { alignItems: "center", flex: 1 },
  infoLabel: { color: "#777", fontSize: 11 },
  infoValue: { color: "#333", fontSize: 14, fontWeight: "500" },
  disputeBtn: {
    marginTop: 12,
    height: 42,
    borderWidth: 1,
    borderColor: "#ffddc2",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  disputeText: { color: "#ff7a00", fontSize: 14 },
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
},
modalBox: {
  width: "100%",
  backgroundColor: "white",
  borderRadius: 12,
  padding: 20,
},
modalTitle: {
  fontSize: 18,
  fontWeight: "600",
  color: "#111",
  marginBottom: 6,
},
modalSubtitle: {
  color: "#555",
  fontSize: 13,
  marginBottom: 14,
},
modalInput: {
  height: 100,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 10,
  textAlignVertical: "top",
  marginBottom: 16,
  backgroundColor: "#fafafa",
},
modalBtnRow: {
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: 10,
},
modalBtn: {
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 8,
},
modalBtnText: {
  fontSize: 14,
  fontWeight: "500",
},
});