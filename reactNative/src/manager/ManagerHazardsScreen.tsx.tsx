// ================================
// src/manager/ManagerHazardsScreen.tsx
// 상세 API + 이미지 공간 포함 + UI 변경 없음
// ================================

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

import { fetchHazards, type HazardListItem } from '../api/hazard';
import { fetchHazardDetail } from '../api/hazardDetail';
import { deleteHazard } from '../api/hazard';
// 상태 타입
export type HazardStatus = 'WAITING' | 'IN_PROGRESS' | 'RESOLVED';

// 기본 HazardItem 모델
export interface HazardItem {
  id: number;
  hazardType: string;
  reporter: string;
  location: string;
  status: HazardStatus;
  urgent: boolean;
  reportedAt: string;
  description: string;
  files?: { url: string }[];
}

// ================================
export default function SafetyReportScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [hazards, setHazards] = useState<HazardItem[]>([]);
  const [selected, setSelected] = useState<HazardItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ================================
  // 🚨 목록 조회 + 첫 번째 항목 상세조회
  // ================================
  useEffect(() => {
    const loadHazards = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // 목록 조회
        const list: HazardListItem[] = await fetchHazards();

        const mapped: HazardItem[] = list.map(item => ({
          id: item.id,
          hazardType: item.hazardType,
          reporter: item.reporter,
          location: item.location,
          status: item.status as HazardStatus,
          urgent: item.urgent,
          reportedAt: item.reportedAt,
          description: '상세 설명은 상세 조회 API 연동 후 표시됩니다.',
          files: [],
        }));

        setHazards(mapped);

        // 첫 번째 항목 자동 선택
        if (mapped.length > 0) {
          const first = mapped[0];
          setSelected(first);

          // 상세 API 호출
          try {
            const detail = await fetchHazardDetail(first.id);
            setSelected({
              ...first,
              description: detail.description,
              files: detail.files ?? [],
            });
          } catch (err) {
            console.log('초기 상세조회 실패:', err);
          }
        }
      } catch (e) {
        console.error('위험요소 목록 조회 실패:', e);
        setErrorMsg('위험요소 신고 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadHazards();
  }, []);

  // ================================
  // 📌 selected 변경 시 상세 조회 (목록 클릭)
  // ================================
  useEffect(() => {
    if (!selected) return;

    const loadDetail = async () => {
      try {
        const detail = await fetchHazardDetail(selected.id);

        setSelected(prev =>
          prev
            ? {
                ...prev,
                description: detail.description,
                files: detail.files ?? [],
              }
            : prev
        );
      } catch (err) {
        console.warn('상세 조회 실패:', err);
      }
    };

    loadDetail();
  }, [selected?.id]);

  // ================================
  // 📌 통계 계산
  // ================================
  const urgentCount = useMemo(() => hazards.filter(h => h.urgent).length, [hazards]);
  const waitingCount = useMemo(
    () => hazards.filter(h => h.status === 'WAITING' || h.status === 'IN_PROGRESS').length,
    [hazards],
  );
  const resolvedCount = useMemo(
    () => hazards.filter(h => h.status === 'RESOLVED').length,
    [hazards],
  );
  const totalCount = hazards.length;

  // ================================
  // 상태 뱃지
  // ================================
  const StatusBadge = ({ status }: { status: HazardStatus }) => {
    let bg = '#F3F4F6';
    let fg = '#374151';
    let label = '대기';

    if (status === 'WAITING') {
      bg = '#FEF3C7';
      fg = '#92400E';
      label = '대기';
    } else if (status === 'IN_PROGRESS') {
      bg = '#DBEAFE';
      fg = '#1D4ED8';
      label = '조치중';
    } else if (status === 'RESOLVED') {
      bg = '#DCFCE7';
      fg = '#166534';
      label = '완료';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={{ color: fg, fontSize: 12 }}>{label}</Text>
      </View>
    );
  };

  // ================================
  // 좌측 리스트 아이템
  // ================================
  const LeftItem = ({ item }: { item: HazardItem }) => {
    const sel = selected?.id === item.id;

    const leftBg = item.urgent
      ? '#FEE2E2'
      : item.status === 'RESOLVED'
      ? '#DCFCE7'
      : '#E5E7EB';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setSelected(item)}
        style={[
          styles.leftItem,
          sel && {
            backgroundColor: '#EFF6FF',
            borderLeftColor: '#2563EB',
          },
        ]}
      >
        <View style={[styles.leftIcon, { backgroundColor: leftBg }]} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#111827' }} numberOfLines={1}>
            {item.hazardType}
          </Text>
          <StatusBadge status={item.status} />

          <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
            {item.reporter} • {item.location}
          </Text>

          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>
            {item.reportedAt}
          </Text>

          {item.urgent && (
            <Text style={{ color: '#B91C1C', fontSize: 11, marginTop: 2 }}>긴급 신고</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // ================================
  // 화면 렌더링
  // ================================
  return (
    <View style={styles.root}>
      {/* 왼쪽: 목록 */}
      <View style={[styles.leftPane, { width: isWide ? 420 : 360 }]}>
        {/* 헤더 + 통계 */}
        <View style={styles.leftHeader}>
          <Text style={styles.h1}>위험요소 신고 현황</Text>
          <Text style={styles.h2}>Hazard Reports</Text>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: '#FEE2E2', borderColor: '#FECACA' }]}>
              <Text style={[styles.summaryNum, { color: '#B91C1C' }]}>{urgentCount}</Text>
              <Text style={[styles.summaryLbl, { color: '#991B1B' }]}>긴급</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
              <Text style={[styles.summaryNum, { color: '#92400E' }]}>{waitingCount}</Text>
              <Text style={[styles.summaryLbl, { color: '#92400E' }]}>대기/진행</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#DCFCE7', borderColor: '#A7F3D0' }]}>
              <Text style={[styles.summaryNum, { color: '#166534' }]}>{resolvedCount}</Text>
              <Text style={[styles.summaryLbl, { color: '#166534' }]}>완료</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' }]}>
              <Text style={[styles.summaryNum, { color: '#1D4ED8' }]}>{totalCount}</Text>
              <Text style={[styles.summaryLbl, { color: '#1D4ED8' }]}>총 신고</Text>
            </View>
          </View>
        </View>

        {/* 목록 */}
        <FlatList
          data={hazards}
          keyExtractor={it => String(it.id)}
          renderItem={LeftItem}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            !loading ? (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>등록된 신고가 없습니다.</Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* 오른쪽 상세 */}
      <View style={styles.rightPane}>
        {!selected ? (
          <View style={styles.empty}>
            <Text style={{ color: '#9CA3AF' }}>신고를 선택하세요</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
              왼쪽 목록에서 신고를 선택하면 상세 정보가 표시됩니다
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            {/* 요약 카드 */}
            <View
              style={[
                styles.card,
                selected.urgent
                  ? { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }
                  : selected.status === 'RESOLVED'
                  ? { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }
                  : { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
              ]}
            >
              <Text style={styles.title}>{selected.hazardType}</Text>
              <Text style={styles.sub}>신고 위치: {selected.location}</Text>

              <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                <StatusBadge status={selected.status} />
                {selected.urgent && (
                  <View style={[styles.badge, { backgroundColor: '#DC2626' }]}>
                    <Text style={{ color: '#fff', fontSize: 12 }}>긴급</Text>
                  </View>
                )}
              </View>

              <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
                신고 시각 · {selected.reportedAt}
              </Text>
            </View>

            {/* 신고 정보 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>신고 정보</Text>
              <View style={{ height: 8 }} />

              <Row label="신고자" value={selected.reporter} />
              <Row label="위치" value={selected.location} />
              <Row label="긴급 여부" value={selected.urgent ? '예' : '아니오'} />
              <Row label="상태" value={statusLabel(selected.status)} />
            </View>

            {/* 상세 설명 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>상세 설명</Text>
              <Text style={{ color: '#374151', marginTop: 8, lineHeight: 20 }}>
                {selected.description}
              </Text>
            </View>

            {/* 이미지 증빙 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>이미지 증빙</Text>

              {selected.files && selected.files.length > 0 ? (
                <ScrollView
                  horizontal
                  style={{ marginTop: 12 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {selected.files.map((f, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: f.url }}
                      style={styles.imageBox}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text style={{ color: '#6B7280', marginTop: 8 }}>
                  등록된 이미지가 없습니다.
                </Text>
              )}
            </View>

            {/* 버튼 영역 */}
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
              <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]}>
                <Text style={styles.primaryBtnText}>상태 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={[styles.outlineBtn, { flex: 1 }]}
              onPress={async () => {
                if (!selected) return;

                try {
                  await deleteHazard(selected.id);

                  // UI 목록에서 제거
                  setHazards(prev => prev.filter(h => h.id !== selected.id));

                  // 다음 항목 자동 선택
                  const next = hazards.find(h => h.id !== selected.id) ?? null;
                  setSelected(next);

                  alert('신고가 삭제되었습니다.');
                } catch (e) {
                  console.error('신고 삭제 실패:', e);
                  alert('신고 삭제 중 오류가 발생했습니다.');
                }
              }}
            >
                <Text style={styles.outlineBtnText}>신고 삭제</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// ================================
function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ marginVertical: 4 }}>
      <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 2 }}>{label}</Text>
      <Text style={{ color: '#111827' }}>{value ?? '-'}</Text>
    </View>
  );
}

// ================================
function statusLabel(status: HazardStatus): string {
  if (status === 'WAITING') return '대기';
  if (status === 'IN_PROGRESS') return '조치중';
  return '완료';
}

// ================================
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
  leftIcon: { width: 32, height: 32, borderRadius: 8, marginRight: 10 },

  rightPane: { flex: 1, backgroundColor: '#F9FAFB' },
  
 
  imageBox: {
  width: 140,
  height: 140,
  borderRadius: 12,
  backgroundColor: '#E5E7EB',
  marginRight: 12,
},
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: { color: '#111827', fontSize: 16, fontWeight: '700' },
  sub: { color: '#6B7280', marginTop: 2 },

  cardTitle: { color: '#111827', fontWeight: '600' },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  outlineBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  outlineBtnText: {
    color: '#374151',
    fontWeight: '600',
  },
});