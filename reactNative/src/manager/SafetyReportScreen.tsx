// src/manager/ManagerHazardsScreen.tsx
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
} from 'react-native';
import { fetchHazards, type HazardListItem } from '../api/hazard';

/** 백엔드 HazardStatus(enum)와 매핑 예정 */
export type HazardStatus = 'WAITING' | 'IN_PROGRESS' | 'RESOLVED';

export interface HazardItem {
  id: number;
  hazardType: string;
  reporter: string;
  location: string;
  status: HazardStatus; // WAITING / IN_PROGRESS / RESOLVED
  urgent: boolean; // 긴급 여부
  reportedAt: string; // "28분 전" 처럼 표시용 문자열
  description: string; // 상세 조회 API 연동 후 실제 값으로 교체
}

// 목업 (백업용) – 서버가 안 될 때 최소한 UI는 유지되도록
const MOCK_HAZARDS: HazardItem[] = [
  {
    id: 1,
    hazardType: '추락 위험',
    reporter: '홍길동',
    location: '3층 비계 구간',
    status: 'WAITING',
    urgent: true,
    reportedAt: '5분 전',
    description:
      '난간 미설치로 추락 위험이 있습니다. 3층 비계 구간에 난간이 설치되어 있지 않아 작업자 추락 위험이 매우 큽니다.',
  },
  {
    id: 2,
    hazardType: '낙하물 위험',
    reporter: '박영희',
    location: '타워크레인 작업 반경',
    status: 'IN_PROGRESS',
    urgent: false,
    reportedAt: '28분 전',
    description:
      '상부 자재 고정이 불량하여 낙하물 위험이 있습니다. 현재 부분 통제 후 조치 진행 중입니다.',
  },
  {
    id: 3,
    hazardType: '전기 감전 위험',
    reporter: '최민수',
    location: '지하 1층 분전반 주변',
    status: 'RESOLVED',
    urgent: false,
    reportedAt: '1시간 전',
    description:
      '전기 배선 일부 피복 손상으로 감전 위험이 있었습니다. 즉시 전원 차단 후 배선 교체 완료했습니다.',
  },
];

export default function SafetyReportScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [hazards, setHazards] = useState<HazardItem[]>(MOCK_HAZARDS);
  const [selected, setSelected] = useState<HazardItem | null>(
    MOCK_HAZARDS[0] ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --------- 서버에서 목록 조회 ---------
  useEffect(() => {
    const loadHazards = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // /api/manager/hazards 호출
        const list: HazardListItem[] = await fetchHazards();

        // 백엔드 응답 -> 화면에서 쓰는 HazardItem 으로 매핑
        const mapped: HazardItem[] = list.map(item => ({
          id: item.id,
          hazardType: item.hazardType,
          reporter: item.reporter,
          location: item.location,
          status: item.status as HazardStatus,
          urgent: item.urgent,
          reportedAt: item.reportedAt,
          // 지금 list 응답에는 상세 설명이 없어서 임시 문구
          description: '상세 설명은 상세 조회 API 연동 후 표시됩니다.',
        }));

        if (mapped.length > 0) {
          setHazards(mapped);
          setSelected(mapped[0]);
        } else {
          // 데이터 없으면 그냥 빈 배열
          setHazards([]);
          setSelected(null);
        }
      } catch (e) {
        console.error('위험요소 목록 조회 실패:', e);
        setErrorMsg('위험요소 신고 목록을 불러오는 중 오류가 발생했습니다.');
        // 실패해도 MOCK 은 그대로 보여주도록 hazards 는 안 건드림
      } finally {
        setLoading(false);
      }
    };

    loadHazards();
  }, []);

  // --------- 통계 ---------
  const urgentCount = useMemo(
    () => hazards.filter(h => h.urgent).length,
    [hazards],
  );
  const waitingCount = useMemo(
    () =>
      hazards.filter(
        h => h.status === 'WAITING' || h.status === 'IN_PROGRESS',
      ).length,
    [hazards],
  );
  const resolvedCount = useMemo(
    () => hazards.filter(h => h.status === 'RESOLVED').length,
    [hazards],
  );
  const totalCount = hazards.length;

  // 상태 뱃지
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

  // 좌측 리스트 아이템
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#111827' }} numberOfLines={1}>
              {item.hazardType}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
            {item.reporter} • {item.location}
          </Text>
          <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>
            {item.reportedAt}
          </Text>
          {item.urgent && (
            <Text style={{ color: '#B91C1C', fontSize: 11, marginTop: 2 }}>
              긴급 신고
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {/* 왼쪽: 목록 + 통계 */}
      <View style={[styles.leftPane, { width: isWide ? 420 : 360 }]}>
        <View style={styles.leftHeader}>
          <Text style={styles.h1}>위험요소 신고 현황</Text>
          <Text style={styles.h2}>Hazard Reports</Text>

          <View style={styles.summaryRow}>
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: '#FEE2E2', borderColor: '#FECACA' },
              ]}
            >
              <Text style={[styles.summaryNum, { color: '#B91C1C' }]}>
                {urgentCount}
              </Text>
              <Text style={[styles.summaryLbl, { color: '#991B1B' }]}>
                긴급
              </Text>
            </View>
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
              ]}
            >
              <Text style={[styles.summaryNum, { color: '#92400E' }]}>
                {waitingCount}
              </Text>
              <Text style={[styles.summaryLbl, { color: '#92400E' }]}>
                대기/진행
              </Text>
            </View>
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: '#DCFCE7', borderColor: '#A7F3D0' },
              ]}
            >
              <Text style={[styles.summaryNum, { color: '#166534' }]}>
                {resolvedCount}
              </Text>
              <Text style={[styles.summaryLbl, { color: '#166534' }]}>
                완료
              </Text>
            </View>
            <View
              style={[
                styles.summaryCard,
                { backgroundColor: '#DBEAFE', borderColor: '#BFDBFE' },
              ]}
            >
              <Text style={[styles.summaryNum, { color: '#1D4ED8' }]}>
                {totalCount}
              </Text>
              <Text style={[styles.summaryLbl, { color: '#1D4ED8' }]}>
                총 신고
              </Text>
            </View>
          </View>

          {/* 에러 메시지 */}
          {errorMsg && (
            <Text
              style={{
                color: '#B91C1C',
                fontSize: 12,
                marginTop: 8,
              }}
            >
              {errorMsg}
            </Text>
          )}
        </View>

        {loading && (
          <View style={{ paddingVertical: 8, alignItems: 'center' }}>
            <ActivityIndicator size="small" />
          </View>
        )}

        <FlatList
          data={hazards}
          keyExtractor={it => String(it.id)}
          renderItem={LeftItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={
            !loading ? (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
                  등록된 신고가 없습니다.
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* 오른쪽: 상세 */}
      <View style={styles.rightPane}>
        {!selected ? (
          <View style={styles.empty}>
            <Text style={{ color: '#9CA3AF' }}>신고를 선택하세요</Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
              왼쪽 목록에서 신고를 선택하면 상세 정보가 표시됩니다
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16 }}
          >
            {/* 상단 요약 카드 */}
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
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: '#DC2626' },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 12 }}>긴급</Text>
                  </View>
                )}
              </View>
              <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
                신고 시각 · {selected.reportedAt}
              </Text>
            </View>

            {/* 기본 정보 */}
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
              <Text
                style={{
                  color: '#374151',
                  marginTop: 8,
                  lineHeight: 20,
                }}
              >
                {selected.description}
              </Text>
            </View>

            {/* 액션 버튼 (상태 변경 / 삭제 - 나중에 PATCH/DELETE 연동) */}
            <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1 }]}
                onPress={() => {
                  // TODO: /api/manager/hazards/{id}/status PATCH 연동
                  console.log('상태 변경 버튼 클릭', selected.id);
                }}
              >
                <Text style={styles.primaryBtnText}>상태 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.outlineBtn, { flex: 1 }]}
                onPress={() => {
                  // TODO: /api/manager/hazards/{id} DELETE 연동
                  console.log('신고 삭제 버튼 클릭', selected.id);
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

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View style={{ marginVertical: 4 }}>
      <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ color: '#111827' }}>{value ?? '-'}</Text>
    </View>
  );
}

function statusLabel(status: HazardStatus): string {
  if (status === 'WAITING') return '대기';
  if (status === 'IN_PROGRESS') return '조치중';
  return '완료';
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
  },

  // Left
  leftPane: {
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  leftHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
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
  leftIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
  },

  // Right
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