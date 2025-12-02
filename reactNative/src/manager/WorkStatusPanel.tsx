// src/manager/WorkStatusPanel.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import {
  AlertTriangle,
  FileText,
  Users,
} from "lucide-react-native";

import {
  fetchDashboard,
  DashboardActivity,
  DashboardSummary,
} from "../api/dashboard";

export function WorkStatusPanel() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const horizontalPadding = isTablet ? 32 : 20;

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);

  useEffect(() => {
    fetchDashboard()
      .then((res) => {
        setSummary(res.summary);
        setActivities(res.activities);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!summary) {
    return (
      <View style={styles.loadingWrapper}>
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  const getIconComponent = (type: string) => {
    switch (type) {
      case "HAZARD":
        return AlertTriangle;
      case "REPORT":
        return FileText;
      case "ATTENDANCE":
        return Users;
      default:
        return FileText;
    }
  };

  const getActivityStyle = (type: string) => {
    switch (type) {
      case "HAZARD":
        return {
          bg: "#FEE2E2",
          color: "#DC2626",
          lucide: AlertTriangle,
        };
      case "REPORT":
        return {
          bg: "#DBEAFE",
          color: "#2563EB",
          lucide: FileText,
        };
      case "ATTENDANCE":
        return {
          bg: "#D1FAE5",
          color: "#16A34A",
          lucide: Users,
        };
      default:
        return {
          bg: "#E5E7EB",
          color: "#6B7280",
          lucide: FileText,
        };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: horizontalPadding },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>작업 현황</Text>
          <Text style={styles.headerSubtitle}>Work Status Overview</Text>
        </View>

        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>실시간 • Live</Text>
        </View>
      </View>

      {/* 카드 3열 */}
      <View style={styles.cardRow}>
        {/* 안전 신고 */}
        <View style={[styles.card, styles.cardRed]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <AlertTriangle size={22} color="#DC2626" />
            </View>
            <View>
              <Text style={styles.cardTitle}>오늘 안전 신고</Text>
              <Text style={styles.cardSubtitle}>Today's Safety Reports</Text>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text style={[styles.cardNumber, { color: "#DC2626" }]}>
              {summary.todayHazardCount}건
            </Text>
            <View style={[styles.badge, { backgroundColor: "#DC2626" }]}>
              <Text style={styles.badgeText}>긴급</Text>
            </View>
          </View>
        </View>

        {/* 진행 중 작업 */}
        <View style={[styles.card, styles.cardBlue]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <FileText size={22} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.cardTitle}>진행 중인 작업</Text>
              <Text style={styles.cardSubtitle}>Ongoing Works</Text>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text style={[styles.cardNumber, { color: "#2563EB" }]}>
              {summary.ongoingWorkCount}건
            </Text>
            <View style={[styles.badge, { backgroundColor: "#2563EB" }]}>
              <Text style={styles.badgeText}>진행중</Text>
            </View>
          </View>
        </View>

        {/* 현장 근로자 */}
        <View style={[styles.card, styles.cardGreen]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Users size={22} color="#16A34A" />
            </View>
            <View>
              <Text style={styles.cardTitle}>현장 근로자</Text>
              <Text style={styles.cardSubtitle}>Site Workers Count</Text>
            </View>
          </View>

          <View style={styles.cardBottom}>
            <Text style={[styles.cardNumber, { color: "#16A34A" }]}>
              {summary.workerCount}명
            </Text>
            <View style={[styles.badge, { backgroundColor: "#16A34A" }]}>
              <Text style={styles.badgeText}>출근중</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 최근 활동 */}
      <View style={styles.section}>
        <Text style={styles.recentTitle}>최근 활동</Text>

        {activities.map((activity) => {
          const style = getActivityStyle(activity.type);
          const Icon = style.lucide;

          return (
            <View key={activity.id} style={styles.activityCard}>
              <View
                style={[
                  styles.activityIconWrapper,
                  { backgroundColor: style.bg },
                ]}
              >
                <Icon size={24} color={style.color} />
              </View>

              <View style={styles.activityTextWrapper}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>
                  {activity.description}
                </Text>
              </View>

              <Text style={styles.activityTime}>{activity.timeAgo}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // tailwind gray-50
  },

  content: {
    paddingTop: 32,
    paddingBottom: 80,
  },

  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ----------------------------------
   * HEADER
   * ---------------------------------- */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827", // gray-900
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280", // gray-500
  },
  liveBadge: {
    backgroundColor: "#D1FAE5", // green-100
    borderColor: "#A7F3D0", // green-200
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  liveBadgeText: {
    fontSize: 13,
    color: "#15803D", // green-700
    fontWeight: "600",
  },

  /* ----------------------------------
   * STATS 3-CARD ROW
   * ---------------------------------- */
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 32,
  },

  card: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },

  /* gradient 유사 색상 적용 */
  cardRed: { backgroundColor: "#FEF2F2" },
  cardBlue: { backgroundColor: "#EFF6FF" },
  cardGreen: { backgroundColor: "#ECFDF3" },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  cardNumber: {
    fontSize: 48,
    fontWeight: "700",
    lineHeight: 48,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  /* ----------------------------------
   * RECENT ACTIVITIES
   * ---------------------------------- */
  section: {
    marginTop: 8,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },

  activityIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  activityTextWrapper: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 2,
  },

  activitySubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  activityTime: {
    fontSize: 13,
    color: "#9CA3AF",
    marginLeft: 12,
  },
});