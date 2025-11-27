// src/manager/ManagerHazardsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  FlatList,
  Image,
  Modal,
} from 'react-native';

import { fetchHazards, updateHazardStatus, deleteHazard } from '../api/hazard';
import { fetchHazardDetail } from '../api/hazardDetail';

export type HazardStatus = 'WAITING' | 'IN_PROGRESS' | 'RESOLVED';

export default function SafetyReportScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [hazards, setHazards] = useState([]);
  const [selected, setSelected] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  // ===============================
  // 1) 로딩: 목록 최초 1회 불러오기
  // ===============================
  useEffect(() => {
    loadHazards();
  }, []);

  const loadHazards = async () => {
    try {
      const list = await fetchHazards();

      const mapped = list.map(item => ({
        ...item,
        description: "",
        files: [],
      }));

      setHazards(mapped);

      if (mapped.length > 0) {
        setSelected(mapped[0]);
      }
    } catch (e) {
      console.warn("목록 로딩 오류:", e);
    }
  };

  // ===============================
  // 2) 선택 항목이 바뀌면 상세정보 불러옴
  // ===============================
  useEffect(() => {
    if (!selected) return;

    (async () => {
      try {
        const detail = await fetchHazardDetail(selected.id);

        setSelected(prev =>
          prev
            ? {
                ...prev,
                description: detail.description ?? "",
                files: detail.files ?? [],
              }
            : prev
        );
      } catch (e) {
        console.warn("상세 조회 실패:", e);
      }
    })();
  }, [selected?.id]);

  // ===============================
  // 3) 상태 변경
  // ===============================
  const handleStatusChange = async (newStatus: HazardStatus) => {
    if (!selected) return;

    try {
      await updateHazardStatus(selected.id, newStatus);

      // 선택 상태 업데이트
      setSelected(prev =>
        prev ? { ...prev, status: newStatus } : prev
      );

      // 목록 업데이트
      setHazards(prev =>
        prev.map(h =>
          h.id === selected.id ? { ...h, status: newStatus } : h
        )
      );

      alert("상태가 변경되었습니다.");
    } catch (e) {
      alert("상태 변경 실패");
    }

    setModalVisible(false);
  };

  // ===============================
  // 4) 삭제 기능
  // ===============================
  const handleDelete = async () => {
    if (!selected) return;

    try {
      await deleteHazard(selected.id);

      setHazards(prev => prev.filter(h => h.id !== selected.id));

      const next = hazards.find(h => h.id !== selected.id) ?? null;
      setSelected(next);

      alert("삭제되었습니다.");
    } catch (e) {
      alert("삭제 중 오류 발생");
    }
  };

  // ===============================
  // 5) 상태 표시 Badge
  // ===============================
  const StatusBadge = ({ status }) => {
    let bg = "#EEE", fg = "#333", label = "";

    if (status === "WAITING") { bg = "#FDE68A"; fg = "#92400E"; label = "대기중"; }
    else if (status === "IN_PROGRESS") { bg = "#BFDBFE"; fg = "#1D4ED8"; label = "진행중"; }
    else if (status === "RESOLVED") { bg = "#BBF7D0"; fg = "#166534"; label = "완료"; }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={{ color: fg, fontSize: 12 }}>{label}</Text>
      </View>
    );
  };

  // ===============================
  // 6) 목록 렌더 아이템
  // ===============================
  const LeftItem = ({ item }) => {
    const isSel = selected?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => setSelected(item)}
        style={[
          styles.leftItem,
          isSel && { backgroundColor: "#EFF6FF", borderLeftColor: "#2563EB" },
        ]}
      >
        <View style={styles.leftIcon} />

        <View style={{ flex: 1 }}>
          <Text>{item.hazardType}</Text>
          <StatusBadge status={item.status} />
          <Text style={{ color: "#6B7280", fontSize: 12 }}>
            {item.reporter} • {item.location}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ===============================
  // 통계
  // ===============================
  const urgentCount = hazards.filter(h => h.urgent).length;
  const waitingCount = hazards.filter(h => h.status === "WAITING").length;
  const progressCount = hazards.filter(h => h.status === "IN_PROGRESS").length;
  const resolvedCount = hazards.filter(h => h.status === "RESOLVED").length;

  // ===============================
  // 화면 UI
  // ===============================
  return (
    <View style={styles.root}>

      {/* 왼쪽 영역 */}
      <View style={[styles.leftPane, { width: isWide ? 420 : 360 }]}>
        <View style={styles.leftHeader}>
          <Text style={styles.h1}>위험요소 신고 현황</Text>
          <Text style={styles.h2}>Hazard Reports</Text>

          <View style={styles.summaryRow}>
            <SummaryCard label="긴급" count={urgentCount} bg="#FEE2E2" fg="#B91C1C" />
            <SummaryCard label="대기" count={waitingCount} bg="#FEF3C7" fg="#92400E" />
            <SummaryCard label="진행중" count={progressCount} bg="#DBEAFE" fg="#1D4ED8" />
            <SummaryCard label="완료" count={resolvedCount} bg="#DCFCE7" fg="#166534" />
          </View>
        </View>

        <FlatList
          data={hazards}
          renderItem={LeftItem}
          keyExtractor={it => String(it.id)}
        />
      </View>

      {/* 오른쪽 상세 */}
      <View style={styles.rightPane}>
        {!selected ? (
          <View style={styles.empty}>
            <Text style={{ color: '#9CA3AF' }}>신고를 선택하세요</Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            {/* 요약 */}
            <View style={styles.card}>
              <Text style={styles.title}>{selected.hazardType}</Text>

              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <StatusBadge status={selected.status} />
                {selected.urgent && (
                  <View style={[styles.badge, { backgroundColor: "#DC2626", marginLeft: 6 }]}>
                    <Text style={{ color: "#FFF" }}>긴급</Text>
                  </View>
                )}
              </View>

              <Text style={{ color: "#6B7280", marginTop: 8 }}>
                신고 위치 · {selected.location}
              </Text>
              <Text style={{ color: "#6B7280", marginTop: 2 }}>
                신고 시간 · {selected.reportedAt}
              </Text>
            </View>

            {/* 정보 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>신고 정보</Text>
              <Row label="신고자" value={selected.reporter} />
              <Row label="위치" value={selected.location} />
              <Row label="긴급 여부" value={selected.urgent ? "예" : "아니오"} />
              <Row label="상태" value={statusLabel(selected.status)} />
            </View>

            {/* 상세 설명 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>상세 설명</Text>
              <Text style={{ marginTop: 8 }}>{selected.description}</Text>
            </View>

            {/* 이미지 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>이미지 증빙</Text>

              {selected.files?.length > 0 ? (
                <ScrollView horizontal>
                  {selected.files.map((f, idx) => (
                    <Image key={idx} source={{ uri: f.url }} style={styles.imageBox} />
                  ))}
                </ScrollView>
              ) : (
                <Text style={{ marginTop: 8, color: "#6B7280" }}>등록된 이미지가 없습니다.</Text>
              )}
            </View>

            {/* 버튼 */}
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.primaryBtnText}>상태 변경</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outlineBtn, { flex: 1 }]}
                onPress={handleDelete}
              >
                <Text style={styles.outlineBtnText}>신고 삭제</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 16 }}>
              상태 선택
            </Text>

            <TouchableOpacity style={styles.modalBtn} onPress={() => handleStatusChange("WAITING")}>
              <Text style={styles.modalBtnText}>대기중</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleStatusChange("IN_PROGRESS")}>
              <Text style={styles.modalBtnText}>진행중</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={() => handleStatusChange("RESOLVED")}>
              <Text style={styles.modalBtnText}>완료</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#E5E7EB", marginTop: 6 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: "#374151" }]}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

function SummaryCard({ label, count, bg, fg }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: bg }]}>
      <Text style={[styles.summaryNum, { color: fg }]}>{count}</Text>
      <Text style={[styles.summaryLbl, { color: fg }]}>{label}</Text>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={{ marginVertical: 4 }}>
      <Text style={{ color: "#6B7280", fontSize: 12 }}>{label}</Text>
      <Text style={{ color: "#111827", marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function statusLabel(status) {
  if (status === "WAITING") return "대기중";
  if (status === "IN_PROGRESS") return "진행중";
  return "완료";
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F6', flexDirection: 'row' },

  leftPane: { backgroundColor: '#FFFFFF', borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  leftHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },

  h1: { color: '#111827', fontSize: 18, fontWeight: '700' },
  h2: { color: '#6B7280', fontSize: 12, marginTop: 2 },

  summaryRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#0000',
  },
  summaryNum: { fontSize: 18, fontWeight: '700' },
  summaryLbl: { fontSize: 12, marginTop: 2 },

  leftItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  leftIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },

  rightPane: { flex: 1, backgroundColor: '#F9FAFB' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  cardTitle: { color: '#111827', fontWeight: '600' },

  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFF', fontWeight: '600' },

  outlineBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  outlineBtnText: { color: '#374151', fontWeight: '600' },

  imageBox: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },

  modalWrap: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});