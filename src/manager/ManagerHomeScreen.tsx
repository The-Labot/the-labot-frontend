// src/manager/ManagerHomeScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

import WorkStatusPanel from './WorkStatusPanel';
import WorkerManagementScreen from './WorkerManagementScreen';
import SafetyReportScreen from './SafetyReportScreen';
import ManagerAnnouncementsScreen from './ManagerAnnouncementsScreen';
import SafetyTrainingScreen from './SafetyTrainingScreen';
import DailyReportScreen from './DailyReportScreen';   // ✅ 이 줄 추가

type Props = NativeStackScreenProps<RootStackParamList, 'ManagerHome'>;

type NavigationItemId =
  | 'work-status'
  | 'worker-management'
  | 'safety-report'
  | 'announcements'
  | 'training'
  | 'daily-report'
  | 'my-page';

type NavigationItem = {
  id: NavigationItemId;
  title: string;
  emoji: string;
};

const navigationItems: NavigationItem[] = [
  { id: 'work-status',       title: '작업 현황',      emoji: '📊' },
  { id: 'worker-management', title: '근로자 관리',    emoji: '👥' },
  { id: 'safety-report',     title: '안전 신고 현황', emoji: '⚠️' },
  { id: 'announcements',     title: '공지사항',       emoji: '📢' },
  { id: 'training',          title: '안전 교육 일지', emoji: '🎓' },
  { id: 'daily-report',      title: '작업 일보',      emoji: '📄' },
  { id: 'my-page',           title: '마이 페이지',    emoji: '👤' },
];

const ManagerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<NavigationItemId>('work-status');
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  /** 퀵 링크(지도/근태/신고) — 데모용 */
  const renderQuickLinks = () => (
    <View style={styles.quickRow}>
      <TouchableOpacity
        style={styles.quickBtn}
        onPress={() => navigation.navigate('Map')}
        activeOpacity={0.85}
      >
        <Text style={styles.quickTxt}>현장 지도</Text>
      </TouchableOpacity>
    </View>
  );

  /** ScrollView를 써도 되는 탭의 내용만 반환 */
  const renderScrollableTabs = () => {
    if (activeTab === 'work-status') {
      return (
        <View style={{ gap: 12 }}>
          {renderQuickLinks()}
          <WorkStatusPanel />
        </View>
      );
    }
    if (activeTab === 'training') {
      return (
        <View style={{ gap: 12 }}>
          <View style={styles.panelContainer}>
            <Text style={styles.panelTitle}>안전 교육 일지 패널</Text>
          </View>
        </View>
      );
    
    }
    // 기본: 빈 뷰
    

    return <View />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* 사이드바 */}
        <View style={styles.sidebar}>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>현장</Text>
            </View>
            <Text style={styles.logoText}>현장 관리</Text>
          </View>

          {/* 네비게이션 */}
          <View style={styles.navList}>
            {navigationItems.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={[styles.navButton, isActive && styles.navButtonActive]}
                  onPress={() => {
                    if (item.id === 'my-page') {
                      navigation.navigate('ManagerMyPage');
                      return;
                    }
                    setActiveTab(item.id);
                  }}
                >
                  <Text style={[styles.navEmoji, isActive && styles.navEmojiActive]}>
                    {item.emoji}
                  </Text>
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 메인 */}
        <View style={styles.main}>
          {/* ⚠️ FlatList가 내부에 있는 탭(근로자관리/공지/안전신고)은 바깥 ScrollView 금지 */}
          {activeTab === 'worker-management' ||
          activeTab === 'announcements' ||
          activeTab === 'safety-report' ||
          activeTab === 'training' ||
          activeTab === 'daily-report' ? (
            <View
              style={{
                flex: 1,
                paddingHorizontal: isTablet ? 12 : 24,
                paddingVertical: isTablet ? 12 : 24,
              }}
            >
              {activeTab === 'worker-management' && <WorkerManagementScreen />}
              {activeTab === 'announcements' && <ManagerAnnouncementsScreen />}
              {activeTab === 'safety-report' && <SafetyReportScreen />}
              {activeTab === 'training' && <SafetyTrainingScreen />}
              {activeTab === 'daily-report' && <DailyReportScreen />}
            </View>
          ) : (
            // 그 외 탭은 부모 ScrollView 사용 OK
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
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  root: { flex: 1, flexDirection: 'row' },

  /* 사이드바 */
  sidebar: {
    width: 110,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoArea: { alignItems: 'center', marginBottom: 24 },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: { fontSize: 24, color: '#FFFFFF' },
  logoText: { fontSize: 11, color: '#111827' },
  navList: {
    flex: 1,              // ✅ 오타 수정 (lex → flex)
    width: '100%',
    paddingHorizontal: 8,
    paddingTop: 4,
    gap: 10,
  } as any,
  navButton: {
    width: '100%',
    height: 86,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  navButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  navEmoji: { fontSize: 20, marginBottom: 4, color: '#4B5563' },
  navEmojiActive: { color: '#FFFFFF' },
  navLabel: { fontSize: 10, color: '#4B5563', textAlign: 'center' },
  navLabelActive: { color: '#FFFFFF' },

  /* 메인 */
  main: { flex: 1, backgroundColor: '#F3F4F6' },
  mainContent: { flexGrow: 1 },

  /* 공통 패널 */
  panelContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  panelTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  /* 퀵 링크 */
  quickRow: { flexDirection: 'row', gap: 8 },
  quickBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickTxt: { color: '#111827' },
});

export default ManagerHomeScreen;