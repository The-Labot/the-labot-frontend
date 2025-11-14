// src/manager/WorkStatusPanel.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

type Activity = {
  id: number;
  iconEmoji: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  time: string;
};

export function WorkStatusPanel() {
  const { width } = useWindowDimensions();

  // 아이패드(가로) 기준으로 padding 줄이기
  const isTablet = width >= 900;
  const horizontalPadding = isTablet ? 12 : 24;
  const verticalPadding = isTablet ? 16 : 24;

  const activities: Activity[] = [
    {
      id: 1,
      iconEmoji: '⚠️',
      iconBg: '#FEE2E2', // red-100
      iconColor: '#DC2626', // red-600
      title: '낙하물 위험 신고',
      subtitle: '김철수 • 2층 작업장',
      time: '5분 전',
    },
    {
      id: 2,
      iconEmoji: '📄',
      iconBg: '#DBEAFE', // blue-100
      iconColor: '#2563EB', // blue-600
      title: '작업 일보 제출',
      subtitle: '이영희 • A동 현장',
      time: '1분 전',
    },
    {
      id: 3,
      iconEmoji: '👷‍♂️',
      iconBg: '#D1FAE5', // green-100
      iconColor: '#16A34A', // green-600
      title: '근로자 출근',
      subtitle: '박민수 • 출근 완료',
      time: '3분 전',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: horizontalPadding,
          paddingVertical: verticalPadding,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* 상단 헤더 */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>작업 현황</Text>
          <Text style={styles.subtitle}>Work Status Overview</Text>
        </View>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>실시간 • Live</Text>
        </View>
      </View>

      {/* 상단 3개 카드 */}
      <View style={styles.statsRow}>
        {/* 오늘 안전 신고 */}
        <View style={[styles.statCard, styles.safetyCard]}>
          <View style={styles.statCardHeader}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFFFFF' }]}>
              <Text style={[styles.statIconEmoji, { color: '#DC2626' }]}>⚠️</Text>
            </View>
            <View>
              <Text style={styles.statTitle}>오늘 안전 신고</Text>
              <Text style={styles.statSubtitle}>Today's Safety Reports</Text>
            </View>
          </View>
          <View style={styles.statBottomRow}>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>3건</Text>
            <View style={[styles.badge, { backgroundColor: '#DC2626' }]}>
              <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>긴급</Text>
            </View>
          </View>
        </View>

        {/* 진행 중인 작업 */}
        <View style={[styles.statCard, styles.ongoingCard]}>
          <View style={styles.statCardHeader}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFFFFF' }]}>
              <Text style={[styles.statIconEmoji, { color: '#2563EB' }]}>📄</Text>
            </View>
            <View>
              <Text style={styles.statTitle}>진행 중인 작업</Text>
              <Text style={styles.statSubtitle}>Ongoing Works</Text>
            </View>
          </View>
          <View style={styles.statBottomRow}>
            <Text style={[styles.statNumber, { color: '#2563EB' }]}>12건</Text>
            <View style={[styles.badge, { backgroundColor: '#2563EB' }]}>
              <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>진행중</Text>
            </View>
          </View>
        </View>

        {/* 현장 근로자 수 */}
        <View style={[styles.statCard, styles.workersCard]}>
          <View style={styles.statCardHeader}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FFFFFF' }]}>
              <Text style={[styles.statIconEmoji, { color: '#16A34A' }]}>👥</Text>
            </View>
            <View>
              <Text style={styles.statTitle}>현장 근로자</Text>
              <Text style={styles.statSubtitle}>Site Workers Count</Text>
            </View>
          </View>
          <View style={styles.statBottomRow}>
            <Text style={[styles.statNumber, { color: '#16A34A' }]}>48명</Text>
            <View style={[styles.badge, { backgroundColor: '#16A34A' }]}>
              <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>출근중</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 최근 활동 리스트 */}
      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>최근 활동</Text>

        {activities.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <View
              style={[
                styles.activityIconCircle,
                { backgroundColor: activity.iconBg },
              ]}
            >
              <Text style={[styles.activityIconEmoji, { color: activity.iconColor }]}>
                {activity.iconEmoji}
              </Text>
            </View>
            <View style={styles.activityTextWrapper}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // gray-100
  },
  content: {
    flexGrow: 1, // 남는 공간도 채우기
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  liveBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#DCFCE7', // green-100
    borderWidth: 1,
    borderColor: '#A7F3D0', // green-200
  },
  liveBadgeText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  safetyCard: {
    backgroundColor: '#FEF2F2', // red-50
  },
  ongoingCard: {
    backgroundColor: '#EFF6FF', // blue-50
  },
  workersCard: {
    backgroundColor: '#ECFDF3', // green-50
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconEmoji: {
    fontSize: 22,
  },
  statTitle: {
    fontSize: 13,
    color: '#111827',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  statBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statNumber: {
    fontSize: 40,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  recentSection: {
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  activityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconEmoji: {
    fontSize: 22,
  },
  activityTextWrapper: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
});

export default WorkStatusPanel;