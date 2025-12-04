// src/manager/ManagerHomeScreen.tsx

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

import { WorkStatusPanel } from "./WorkStatusPanel";
import WorkerManagementScreen from "./WorkerManagementScreen";
import SafetyReportScreen from "./ManagerHazardsScreen.tsx";
import ManagerAnnouncementsScreen from "./ManagerAnnouncementsScreen";
import SafetyTrainingScreen from "./SafetyTrainingScreen";
import DailyReportScreen from "./DailyReportScreen";
import { useRoute } from "@react-navigation/native";
import {
  BarChart3,
  Users,
  AlertTriangle,
  Megaphone,
  GraduationCap,
  FileText,
  User,
} from "lucide-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "ManagerHome">;

type NavigationItemId =
  | "work-status"
  | "worker-management"
  | "safety-report"
  | "announcements"
  | "training"
  | "daily-report"
  | "my-page";

type NavigationItem = {
  id: NavigationItemId;
  title: string;
  icon: any; // lucide icon component
};

const navigationItems: NavigationItem[] = [
  { id: "work-status", title: "작업 현황", icon: BarChart3 },
  { id: "worker-management", title: "근로자 관리", icon: Users },
  { id: "safety-report", title: "위험 신고 현황", icon: AlertTriangle },
  { id: "announcements", title: "공지사항", icon: Megaphone },
  { id: "training", title: "안전 교육 일지", icon: GraduationCap },
  { id: "daily-report", title: "작업 일보", icon: FileText },
  { id: "my-page", title: "마이 페이지", icon: User },
];

const ManagerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] =
    useState<NavigationItemId>("work-status");

  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const route = useRoute<any>();

useEffect(() => {
  if (route.params?.activeTab) {
    setActiveTab(route.params.activeTab);
  }
}, [route.params]);

  /** 퀵 링크 */
  const renderQuickLinks = () => (
    <View style={styles.quickRow}>
      <TouchableOpacity
        style={styles.quickBtn}
        onPress={() => navigation.navigate("MapManagement")}
        activeOpacity={0.85}
      >
        <Text style={styles.quickTxt}>현장 지도</Text>
      </TouchableOpacity>
    </View>
  );

  const renderScrollableTabs = () => {
    if (activeTab === "work-status") {
      return (
        <View style={{ gap: 12 }}>
          {renderQuickLinks()}
          <WorkStatusPanel />
        </View>
      );
    }

    if (activeTab === "training") {
      return (
        <View style={{ gap: 12 }}>
          <View style={styles.panelContainer}>
            <Text style={styles.panelTitle}>안전 교육 일지 패널</Text>
          </View>
        </View>
      );
    }

    return <View />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* =================== 사이드바 =================== */}
        <View style={styles.sidebar}>
          {/* 로고 */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>현장</Text>
            </View>
            <Text style={styles.logoText}>현장 관리</Text>
          </View>

          {/* 네비게이션 버튼 */}
          <View style={styles.navList}>
            {navigationItems.map((item) => {
              const isActive = item.id === activeTab;
              const Icon = item.icon;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[
                    styles.navButton,
                    isActive && styles.navButtonActive,
                  ]}
                  onPress={() => {
                    if (item.id === "my-page") {
                      navigation.navigate("ManagerMyPage");
                      return;
                    }
                    setActiveTab(item.id);
                  }}
                >
                  <Icon
                    size={26}
                    strokeWidth={2.4}
                    color={isActive ? "#FFFFFF" : "#4B5563"}
                    style={{ marginBottom: 6 }}
                  />

                  <Text
                    style={[
                      styles.navLabel,
                      isActive && styles.navLabelActive,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* =================== 메인 패널 =================== */}
        <View style={styles.main}>
          {activeTab === "worker-management" ||
          activeTab === "announcements" ||
          activeTab === "safety-report" ||
          activeTab === "training" ||
          activeTab === "daily-report" ? (
            <View
              style={{
                flex: 1,
                paddingHorizontal: isTablet ? 12 : 24,
                paddingVertical: isTablet ? 12 : 24,
              }}
            >
              {activeTab === "worker-management" && (
                <WorkerManagementScreen />
              )}
              {activeTab === "announcements" && (
                <ManagerAnnouncementsScreen />
              )}
              {activeTab === "safety-report" && (
                <SafetyReportScreen />
              )}
              {activeTab === "training" && (
                <SafetyTrainingScreen />
              )}
              {activeTab === "daily-report" && <DailyReportScreen />}
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={[
                styles.mainContent,
                {
                  paddingHorizontal: isTablet ? 12 : 24,
                  paddingVertical: isTablet ? 12 : 24,
                },
              ]}
              showsVerticalScrollIndicator={false}
            >
              {renderScrollableTabs()}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  root: { flex: 1, flexDirection: "row" },

  /* ========== 사이드바 ========== */
  sidebar: {
    width: 110,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    alignItems: "center",
  },

  logoArea: { alignItems: "center", marginBottom: 24 },

  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  logoEmoji: { fontSize: 20, color: "#FFFFFF" },
  logoText: { fontSize: 11, color: "#111827" },

  navList: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 8,
    paddingTop: 4,
    gap: 10,
  } as any,

  navButton: {
    width: "100%",
    height: 86,
    borderRadius: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  navButtonActive: {
    backgroundColor: "#2563EB",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  navLabel: {
    fontSize: 10,
    color: "#4B5563",
    textAlign: "center",
  },

  navLabelActive: {
    color: "#FFFFFF",
  },

  /* 메인 */
  main: { flex: 1, backgroundColor: "#F3F4F6" },
  mainContent: { flexGrow: 1 },

  panelContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  panelTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  /* 퀵 링크 */
  quickRow: { flexDirection: "row", gap: 8 },

  quickBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  quickTxt: { color: "#111827" },
});

export default ManagerHomeScreen;