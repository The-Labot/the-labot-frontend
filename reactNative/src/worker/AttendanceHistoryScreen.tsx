// src/worker/AttendanceHistoryScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import { ArrowLeft, Calendar, CheckCircle, AlertCircle } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { BASE_URL } from "../api/config";
import { getTempAccessToken } from "../api/auth";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [selectedMonth, setSelectedMonth] = useState("12");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  const [isAppealModalVisible, setAppealModalVisible] = useState(false);
  const [appealMessage, setAppealMessage] = useState("");
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<number | null>(null);

  // 요일 계산
  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  };

  // 근무시간 계산
  const calcHours = (start: string, end: string | null) => {
    if (!end) return 0;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return ((eh * 60 + em - (sh * 60 + sm)) / 60).toFixed(1);
  };

  // 출퇴근 조회
  const fetchAttendance = async () => {
    try {
      const token = getTempAccessToken();
      const res = await fetch(`${BASE_URL}/worker/attendance`, {
        method: "GET",
        headers: { Authorization: token },
      });

      const json = await res.json();
      console.log("📌 출퇴근 응답:", json);

      const converted = json.data.map((item: any) => {
        const formatted = item.date.replace(/-/g, ".");
        const day = getDayOfWeek(item.date);

        const checkIn = item.clockInTime?.slice(0, 5) || "-";
        const checkOut = item.clockOutTime?.slice(0, 5) || "-";

        const hours = item.clockOutTime
          ? Number(calcHours(item.clockInTime, item.clockOutTime))
          : 0;

        return {
          attendanceId: item.attendanceId,
          date: formatted,
          day,
          checkIn,
          checkOut,
          hours,
          status: item.clockOutTime ? "completed" : "in-progress",
        };
      });

      setAttendanceData(converted.sort((a, b) => (a.date < b.date ? 1 : -1)));
    } catch (err) {
      console.log("🚨 출퇴근 오류:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const currentData = attendanceData.filter((item) =>
    item.date.startsWith(`${selectedYear}.${selectedMonth}`)
  );

  const totalHours = currentData.reduce((sum, item) => sum + item.hours, 0);

  // 이의제기 요청
  const submitAppeal = async () => {
    if (!appealMessage.trim()) return alert("이의제기 사유를 입력해주세요.");
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

      const text = await res.text();
      console.log("📥 RAW 응답:", text);

      const json = JSON.parse(text);

      if (json.status === 200) {
        alert("이의제기가 성공적으로 제출되었습니다.");
        setAppealMessage("");
        setAppealModalVisible(false);
      } else {
        alert(json.message || "이의제기 제출 실패");
      }
    } catch (err) {
      console.log("🚨 이의제기 오류:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 🔥 StatusBar를 여기에서 조절 → 달력 흐림 문제 해결 */}
      <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color="#374151" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>출퇴근 기록</Text>
          <Text style={styles.headerSubtitle}>Attendance History</Text>
        </View>
      </View>

      {/* Selectors */}
      <View style={styles.selectorWrapper}>
        <View style={styles.selectorRow}>
          {/* 연도 */}
          <View style={styles.selectorBox}>
            <Calendar size={16} color="#666" style={{ marginRight: 6 }} />
            <Picker
              selectedValue={selectedYear}
              onValueChange={setSelectedYear}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="2025년" value="2025" />
              <Picker.Item label="2024년" value="2024" />
            </Picker>
          </View>

          {/* 월 */}
          <View style={styles.selectorBox}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={setSelectedMonth}
              style={styles.picker}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, "0");
                return <Picker.Item label={`${m}월`} value={m} key={m} />;
              })}
            </Picker>
          </View>
        </View>
      </View>

      {/* Scroll content */}
      <ScrollView style={styles.scrollArea}>
        {/* Summary */}
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

        {/* 상세 기록 */}
        <Text style={styles.detailTitle}>출퇴근 상세 기록</Text>

        {currentData.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ color: "#777" }}>해당 기간에 출퇴근 기록이 없습니다</Text>
          </View>
        ) : (
          currentData.map((item, idx) => (
            <View key={idx} style={styles.recordCard}>
              <View style={styles.recordTop}>
                <View style={styles.dayBox}>
                  <Text style={styles.dayText}>{item.day}</Text>
                  <Text style={styles.dateText}>{item.date.split(".")[2]}</Text>
                </View>

                <View>
                  <Text style={styles.recordDate}>{item.date}</Text>
                  <Text style={styles.statusComplete}>완료</Text>
                </View>

                <CheckCircle size={20} color="#2663ff" />
              </View>

              <View style={styles.recordInfo}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>출근</Text>
                  <Text style={styles.infoValue}>{item.checkIn}</Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>퇴근</Text>
                  <Text style={styles.infoValue}>{item.checkOut}</Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>근무시간</Text>
                  <Text style={styles.infoValue}>
                    {item.hours > 0 ? `${item.hours}h` : "-"}
                  </Text>
                </View>
              </View>

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
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal */}
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

/* ================== 스타일 ================== */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: { position: "absolute", left: 20 },

  headerTitle: { fontSize: 17, fontWeight: "600", color: "#111" },
  headerSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  selectorWrapper: {
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 10,
  },
  selectorRow: {
    flexDirection: "row",
    gap: 12,
  },

  selectorBox: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  picker: {
    flex: 1,
    color: "#111",
  },

  pickerItem: {
    fontSize: 18,
    color: "#111",
    fontWeight: "600",
  },

  scrollArea: { paddingHorizontal: 20 },

  summaryCard: {
    backgroundColor: "#1b67ff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  summaryHeaderText: { color: "#dfe7ff", fontSize: 13 },
  summaryInner: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 16,
    borderRadius: 12,
  },
  summaryLabel: { color: "#dfe7ff", fontSize: 12 },
  summaryHours: { color: "white", fontSize: 26, fontWeight: "700" },
  summarySub: { color: "#dfe7ff", fontSize: 11 },

  detailTitle: { fontSize: 16, color: "#333", marginBottom: 10 },

  emptyCard: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 20,
  },

  recordCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 14,
  },
  recordTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dayBox: {
    width: 50,
    height: 50,
    backgroundColor: "#e5efff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: { fontSize: 11, color: "#2663ff" },
  dateText: { fontSize: 15, fontWeight: "700", color: "#2663ff" },

  recordDate: { fontSize: 14, color: "#333", marginBottom: 2 },
  statusComplete: {
    backgroundColor: "#e5efff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    color: "#2663ff",
    fontSize: 11,
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
  disputeText: {
    color: "#ff7a00",
    fontSize: 14,
  },

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
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    marginBottom: 14,
    color: "#555",
  },
  modalInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
    marginBottom: 16,
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