// ================================
//  DailyReportScreen.tsx (완전 재작성)
// ================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
  useWindowDimensions,
} from 'react-native';

import { createDailyReport } from "../api/reports";
import { getDailyReportList, getDailyReportDetail ,updateDailyReport, deleteDailyReport} from "../api/reports";
// -----------------------
// 백엔드 JSON 구조 타입
// -----------------------
type EquipmentItem = {
  equipmentName: string;
  spec: string;
  usingTime: string;
  count: number;
  vendorName: string;
};

type MaterialItem = {
  materialName: string;
  specAndQuantity: string;
  importTime: string;
  exportDetail: string;
};

interface DailyReport {
  id: number;                 // UI용
  workDate: string;           // 작업일자
  workType: string;           // 공종
  todayWork: string;          // 금일 작업
  tomorrowPlan: string;       // 명일 계획
  workLocation: string;       // 작업 위치
  specialNote: string;        // 특이사항
  equipmentList: EquipmentItem[];
  materialList: MaterialItem[];
}

// -------------------------------------
// 초기 더미 데이터 (필요하면 유지)
// -------------------------------------
const initialReports: DailyReport[] = [];

const DailyReportScreen: React.FC = () => {
  

  const [dailyReports, setDailyReports] = useState<DailyReport[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editedReport, setEditedReport] = useState<DailyReport | null>(null);

  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  useEffect(() => {
    loadDailyReports();
  }, []);

  // -------------------------------------
  // 새 보고서 작성 시작
  // -------------------------------------
  const startCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedReport(null);

    setEditedReport({
      id: dailyReports.length + 1,
      workDate: new Date().toISOString().slice(0, 10),
      workType: "",
      todayWork: "",
      tomorrowPlan: "",
      workLocation: "",
      specialNote: "",
      equipmentList: [],
      materialList: [],
    });
  };

  // -------------------------------------
  // 보고서 저장 (POST 요청할 곳)
  // -------------------------------------
  const saveCreate = async () => {
  if (!editedReport) return;

  try {
    // ---- POST 요청 ----
    const payload = {
      workDate: editedReport.workDate,
      workType: editedReport.workType,
      todayWork: editedReport.todayWork,
      tomorrowPlan: editedReport.tomorrowPlan,
      workLocation: editedReport.workLocation,
      specialNote: editedReport.specialNote,
      equipmentList: editedReport.equipmentList,
      materialList: editedReport.materialList,
    };

    const resp = await createDailyReport(payload);
    console.log("📘 작업일보 등록 응답:", resp);

    // 등록 성공 시 목록 반영
    setDailyReports(prev => [...prev, editedReport]);
    setSelectedReport(editedReport);
    setIsCreating(false);

  } catch (e) {
    console.log("작업일보 등록 실패:", e);
  }
};
  // ⬇⬇⬇ 여기에 추가 (startCreate / saveCreate 아래)
const loadDailyReports = async () => {
  try {
    const res = await getDailyReportList();
    console.log("📘 작업일보 목록 조회:", res);

    if (res?.data) {
      const mapped: DailyReport[] = res.data.map((item: any) => ({
        id: item.id,
        workDate: item.createdAt?.slice(0, 10) ?? "",
        workType: item.workType,
        todayWork: item.todayWork,
        tomorrowPlan: "",
        workLocation: "",
        specialNote: "",
        equipmentList: [],
        materialList: [],
      }));

      setDailyReports(mapped);
    }
  } catch (e) {
    console.log("작업일보 목록 조회 실패:", e);
  }
};

  // -------------------------------------
  // 수정 시작
  // -------------------------------------
  const startEdit = () => {
    if (!selectedReport) return;
    setEditedReport({ ...selectedReport });
    setIsEditing(true);
  };

  // -------------------------------------
  // 수정 저장 (PUT 요청할 곳)
  // -------------------------------------
  const saveEdit = async () => {
  if (!editedReport) return;

  const payload = {
    workDate: editedReport.workDate,
    workType: editedReport.workType,
    todayWork: editedReport.todayWork,
    tomorrowPlan: editedReport.tomorrowPlan,
    workLocation: editedReport.workLocation,
    specialNote: editedReport.specialNote,
    equipmentList: editedReport.equipmentList,
    materialList: editedReport.materialList,
  };

  try {
    const res = await updateDailyReport(editedReport.id, payload);
    console.log("📘 수정 완료:", res);

    // UI 업데이트
    setDailyReports(prev =>
      prev.map(r => (r.id === editedReport.id ? editedReport : r))
    );

    setSelectedReport(editedReport);
    setIsEditing(false);

  } catch (e) {
    console.log("❌ 수정 실패:", e);
  }
};

  // -------------------------------------
  // 삭제
  // -------------------------------------
 const deleteReport = () => {
  if (!selectedReport) return;

  Alert.alert(
    "삭제 확인",
    "보고서를 삭제하시겠습니까?",
    [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await deleteDailyReport(selectedReport.id);
            console.log("🗑 삭제 완료:", res);

            setDailyReports(prev =>
              prev.filter(r => r.id !== selectedReport.id)
            );

            setSelectedReport(null);
            setIsEditing(false);

          } catch (e) {
            console.log("❌ 삭제 실패:", e);
          }
        }
      }
    ]
  );
};
  const handleSelect = async (item: any) => {
  console.log("➡️ 상세 조회 요청:", item.id);

  try {
    const res = await getDailyReportDetail(item.id);
    console.log("📘 상세 조회 응답:", res);

    const d = res.data;

    const selected: DailyReport = {
      id: d.reportId,
      workDate: d.workDate,
      workType: d.workType,
      todayWork: d.todayWork,
      tomorrowPlan: d.tomorrowPlan,
      workLocation: d.workLocation,
      specialNote: d.specialNote,
      equipmentList: d.equipmentList || [],
      materialList: d.materialList || [],
    };

    setSelectedReport(selected);
    setIsCreating(false);
    setIsEditing(false);

  } catch (e) {
    console.log("❌ 상세 조회 실패:", e);
  }
};


  // -------------------------------------
  // 자재/장비 핸들러
  // -------------------------------------
  const addMaterial = () => {
    if (!editedReport) return;
    setEditedReport({
      ...editedReport,
      materialList: [
        ...editedReport.materialList,
        { materialName: "", specAndQuantity: "", importTime: "", exportDetail: "" },
      ],
    });
  };

  const updateMaterial = (i: number, f: keyof MaterialItem, v: string) => {
    if (!editedReport) return;
    const copy = [...editedReport.materialList];
    copy[i] = { ...copy[i], [f]: v };
    setEditedReport({ ...editedReport, materialList: copy });
  };

  const removeMaterial = (i: number) => {
    if (!editedReport) return;
    const copy = [...editedReport.materialList];
    copy.splice(i, 1);
    setEditedReport({ ...editedReport, materialList: copy });
  };

  const addEquipment = () => {
    if (!editedReport) return;
    setEditedReport({
      ...editedReport,
      equipmentList: [
        ...editedReport.equipmentList,
        { equipmentName: "", spec: "", usingTime: "", count: 0, vendorName: "" },
      ],
    });
  };

  const updateEquipment = (i: number, f: keyof EquipmentItem, v: string) => {
    if (!editedReport) return;
    const copy = [...editedReport.equipmentList];

    if (f === "count") {
      copy[i].count = parseInt(v, 10) || 0;
    } else {
      copy[i] = { ...copy[i], [f]: v };
    }

    setEditedReport({ ...editedReport, equipmentList: copy });
  };

  const removeEquipment = (i: number) => {
    if (!editedReport) return;
    const copy = [...editedReport.equipmentList];
    copy.splice(i, 1);
    setEditedReport({ ...editedReport, equipmentList: copy });
  };

  // -------------------------------------
  // 폼 렌더
  // -------------------------------------
  const renderForm = () => {
    if (!editedReport) return null;

    const setField = (field: keyof DailyReport, v: any) => {
      setEditedReport(prev => (prev ? { ...prev, [field]: v } : prev));
    };

    return (
      <View style={{ gap: 16 }}>

        {/* 날짜 */}
        <View>
          <Text style={styles.label}>작업일자</Text>
          <TextInput
            style={styles.input}
            value={editedReport.workDate}
            onChangeText={t => setField("workDate", t)}
          />
        </View>

        {/* 공종 */}
        <View>
          <Text style={styles.label}>공종</Text>
          <TextInput
            style={styles.input}
            value={editedReport.workType}
            onChangeText={t => setField("workType", t)}
          />
        </View>

        {/* 금일 작업 */}
        <View>
          <Text style={styles.label}>금일 작업내용</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={editedReport.todayWork}
            onChangeText={t => setField("todayWork", t)}
            multiline
          />
        </View>

        {/* 명일 작업 */}
        <View>
          <Text style={styles.label}>명일 계획</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={editedReport.tomorrowPlan}
            onChangeText={t => setField("tomorrowPlan", t)}
            multiline
          />
        </View>

        {/* 작업 위치 */}
        <View>
          <Text style={styles.label}>작업 위치</Text>
          <TextInput
            style={styles.input}
            value={editedReport.workLocation}
            onChangeText={t => setField("workLocation", t)}
          />
        </View>

        {/* 특이사항 */}
        <View>
          <Text style={styles.label}>특이사항</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={editedReport.specialNote}
            onChangeText={t => setField("specialNote", t)}
            multiline
          />
        </View>

        {/* ---------------- 장비 ---------------- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>장비 사용 현황</Text>
          <TouchableOpacity onPress={addEquipment} style={styles.outlineButtonSmall}>
            <Text>＋ 장비 추가</Text>
          </TouchableOpacity>
        </View>

        {editedReport.equipmentList.map((e, i) => (
          <View key={i} style={styles.materialEditRow}>
            <TextInput
              style={[styles.input, styles.flex1]}
              value={e.equipmentName}
              onChangeText={t => updateEquipment(i, "equipmentName", t)}
              placeholder="장비명"
            />
            <TextInput
              style={[styles.input, styles.w80]}
              value={e.spec}
              onChangeText={t => updateEquipment(i, "spec", t)}
              placeholder="규격"
            />
            <TextInput
              style={[styles.input, styles.w80]}
              value={e.usingTime}
              onChangeText={t => updateEquipment(i, "usingTime", t)}
              placeholder="사용시간"
            />
            <TextInput
              style={[styles.input, styles.w60]}
              value={String(e.count)}
              keyboardType="number-pad"
              onChangeText={t => updateEquipment(i, "count", t)}
              placeholder="대수"
            />
            <TextInput
              style={[styles.input, styles.w90]}
              value={e.vendorName}
              onChangeText={t => updateEquipment(i, "vendorName", t)}
              placeholder="업체명"
            />
            <TouchableOpacity onPress={() => removeEquipment(i)}>
              <Text style={{ color: "red" }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* ---------------- 자재 ---------------- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>자재 투입 현황</Text>
          <TouchableOpacity onPress={addMaterial} style={styles.outlineButtonSmall}>
            <Text>＋ 자재 추가</Text>
          </TouchableOpacity>
        </View>

        {editedReport.materialList.map((m, i) => (
          <View key={i} style={styles.materialEditRow}>
            <TextInput
              style={[styles.input, styles.flex1]}
              value={m.materialName}
              onChangeText={t => updateMaterial(i, "materialName", t)}
              placeholder="자재명"
            />
            <TextInput
              style={[styles.input, styles.w120]}
              value={m.specAndQuantity}
              onChangeText={t => updateMaterial(i, "specAndQuantity", t)}
              placeholder="규격/수량"
            />
            <TextInput
              style={[styles.input, styles.w80]}
              value={m.importTime}
              onChangeText={t => updateMaterial(i, "importTime", t)}
              placeholder="반입"
            />
            <TextInput
              style={[styles.input, styles.w120]}
              value={m.exportDetail}
              onChangeText={t => updateMaterial(i, "exportDetail", t)}
              placeholder="반출"
            />
            <TouchableOpacity onPress={() => removeMaterial(i)}>
              <Text style={{ color: "red" }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

      </View>
    );
  };

  // -------------------------------------
  // 리스트 아이템 렌더
  // -------------------------------------
  const renderItem = ({ item }: { item: DailyReport }) => {
    const isSelected = selectedReport?.id === item.id;

    return (
          <TouchableOpacity
        style={[styles.listItem, isSelected && styles.listItemActive]}
        onPress={() => handleSelect(item)}
      >
        <Text style={styles.listTitle}>{item.workType}</Text>
        <Text style={styles.listSmall}>📅 {item.workDate}</Text>
        <Text style={styles.listSmall}>📍 {item.workLocation}</Text>
      </TouchableOpacity>
    );
  };

  // -------------------------------------
  // 상세 뷰
  // -------------------------------------
  const renderDetail = () => {
    if (!selectedReport) return null;

    const r = selectedReport;

    return (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.rightScroll}>

        {/* 상단 카드 */}
        <View style={styles.card}>
          <Text style={styles.detailTitle}>{r.workType}</Text>
          <Text style={styles.detailMeta}>📅 {r.workDate}</Text>
          <Text style={styles.detailMeta}>📍 {r.workLocation}</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={startEdit} style={styles.outlineButtonSmall}>
              <Text>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteReport} style={styles.deleteButtonSmall}>
              <Text style={{ color: "red" }}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 금일 작업 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>금일 작업</Text>
          <Text style={styles.sectionBody}>{r.todayWork}</Text>
        </View>

        {/* 명일 계획 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>명일 작업</Text>
          <Text style={styles.sectionBody}>{r.tomorrowPlan}</Text>
        </View>

        {/* 특이사항 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>특이사항</Text>
          <Text style={styles.sectionBody}>{r.specialNote}</Text>
        </View>

        {/* 자재 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>자재 투입</Text>
          {r.materialList.map((m, i) => (
            <View key={i} style={styles.materialRow}>
              <Text>{m.materialName}</Text>
              <Text>{m.specAndQuantity}</Text>
              <Text>반입: {m.importTime}</Text>
              <Text>반출: {m.exportDetail}</Text>
            </View>
          ))}
        </View>

        {/* 장비 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>장비 사용</Text>
          {r.equipmentList.map((e, i) => (
            <View key={i} style={styles.materialRow}>
              <Text>{e.equipmentName}</Text>
              <Text>{e.spec}</Text>
              <Text>{e.usingTime}</Text>
              <Text>{e.count}대</Text>
              <Text>{e.vendorName}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    );
  };

  // -------------------------------------
  // 최종 UI 구조
  // -------------------------------------
  return (
    <View style={styles.container}>

      {/* LEFT LIST */}
      <View style={[styles.leftPanel, { width: isTablet ? 380 : 340 }]}>
        <View style={styles.leftHeader}>
          <Text style={styles.leftTitle}>작업 일보</Text>

          <TouchableOpacity onPress={startCreate} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>＋ 새 보고서</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={dailyReports}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
        />
      </View>

      {/* RIGHT PANEL */}
      <View style={styles.rightPanel}>
        {isCreating && editedReport ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.rightScroll}>
            <View style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.detailTitle}>작업 일보 작성</Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity onPress={saveCreate} style={styles.primaryButtonSmall}>
                    <Text style={{ color: "#fff" }}>저장</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsCreating(false)} style={styles.outlineButtonSmall}>
                    <Text>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {renderForm()}
            </View>
          </ScrollView>
        ) : selectedReport ? (
          isEditing && editedReport ? (
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.rightScroll}>
              <View style={styles.card}>
                <View style={styles.headerRow}>
                  <Text style={styles.detailTitle}>작업 일보 수정</Text>
                  <View style={styles.headerActions}>
                    <TouchableOpacity onPress={saveEdit} style={styles.primaryButtonSmall}>
                      <Text style={{ color: "#fff" }}>저장</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.outlineButtonSmall}>
                      <Text>취소</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {renderForm()}
              </View>
            </ScrollView>
          ) : (
            renderDetail()
          )
        ) : (
          <View style={styles.emptyRight}>
            <Text style={styles.emptyRightText}>작업 일보를 선택하세요</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// -------------------------------------
// 스타일
// -------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row", backgroundColor: "#fff" },

  leftPanel: {
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },

  leftHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  leftTitle: { fontSize: 18, fontWeight: "600" },

  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  primaryButtonText: { color: "#fff", fontWeight: "600" },

  listItem: {
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },

  listItemActive: {
    backgroundColor: "#EFF6FF",
    borderLeftColor: "#2563EB",
  },

  listTitle: { fontSize: 14, fontWeight: "600" },
  listSmall: { fontSize: 11, color: "#6B7280", marginTop: 4 },

  rightPanel: { flex: 1, backgroundColor: "#F3F4F6" },

  rightScroll: { padding: 20, gap: 16 },

  emptyRight: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyRightText: { fontSize: 16, color: "#9CA3AF" },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowColor: "#000",
    elevation: 3,
  },

  detailTitle: { fontSize: 18, fontWeight: "600" },
  detailMeta: { fontSize: 12, color: "#6B7280", marginTop: 4 },

  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  sectionBody: { fontSize: 14, color: "#374151", lineHeight: 20 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerActions: {
  flexDirection: "row",
  gap: 12,
  height: 50,          // 버튼 높이 보장
  alignItems: "center"
},
  primaryButtonSmall: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },

  outlineButtonSmall: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
  },

  deleteButtonSmall: {
    borderWidth: 1,
    borderColor: "#FCA5A5",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
  },

  label: { fontSize: 12, color: "#374151", marginBottom: 4 },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    backgroundColor: "#fff",
  },

  multiline: { minHeight: 100, textAlignVertical: "top" },

  flex1: { flex: 1 },
  w80: { width: 80 },
  w60: { width: 60 },
  w120: { width: 120 },
  w90: { width: 90 },

  materialEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  materialRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});

export default DailyReportScreen;