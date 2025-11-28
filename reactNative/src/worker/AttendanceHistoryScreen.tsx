// src/worker/AttendanceHistoryScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react-native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

interface AttendanceRecord {
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
  const [selectedMonth, setSelectedMonth] = useState("09");

  const attendanceData: Record<string, Record<string, AttendanceRecord[]>> = {
    "2025": {
      "09": [
        {
          date: "2025.09.01",
          day: "월",
          checkIn: "08:00",
          checkOut: "17:30",
          hours: 8.5,
          status: "completed",
        },
        {
          date: "2025.09.02",
          day: "화",
          checkIn: "08:05",
          checkOut: "17:35",
          hours: 8.5,
          status: "completed",
        },
        {
          date: "2025.09.03",
          day: "수",
          checkIn: "07:55",
          checkOut: "-",
          hours: 0,
          status: "in-progress",
        },
      ],
    },
  };

  const currentData = attendanceData[selectedYear]?.[selectedMonth] || [];
  const totalHours = currentData.reduce((sum, item) => sum + item.hours, 0);
  const availableMonths = Object.keys(attendanceData[selectedYear] || {});

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

        {/* ===== Selectors ===== */}
        <View style={styles.selectorRow}>
          <View style={styles.selectorBox}>
            <Calendar size={16} color="#666" style={{ marginRight: 6 }} />
            <Picker
              selectedValue={selectedYear}
              onValueChange={(value) => {
                setSelectedYear(value);
                const months = Object.keys(attendanceData[value] || {});
                if (months.length > 0) setSelectedMonth(months[0]);
              }}
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
              {availableMonths.map((m) => (
                <Picker.Item label={`${m}월`} value={m} key={m} />
              ))}
            </Picker>
          </View>
        </View>

        {/* ===== Summary Card ===== */}
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

        {/* ===== Details ===== */}
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
              {/* ---- TOP ---- */}
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

              {/* ---- Middle Info ---- */}
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

              {/* ---- Dispute Button ---- */}
              {item.status === "completed" && (
                <TouchableOpacity style={styles.disputeBtn}>
                  <AlertCircle size={16} color="#ff7a00" />
                  <Text style={styles.disputeText}>이의제기</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  container: { flex: 1, backgroundColor: "#F3F4F6", paddingHorizontal: 20 },

  /* ===== Header ===== */
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
  backButton: {
    position: "absolute",
    left: 20,
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  /* ===== selector ===== */
  selectorRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  selectorBox: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  picker: { flex: 1, height: 48 },

  /* ===== summary ===== */
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
  summarySub: { color: "#dfe7ff", fontSize: 11, marginTop: 4 },

  detailTitle: { fontSize: 16, color: "#333", marginBottom: 10 },

  /* ===== empty card ===== */
  emptyCard: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  /* ===== record card ===== */
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

  /* info grid */
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

  /* dispute */
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
});