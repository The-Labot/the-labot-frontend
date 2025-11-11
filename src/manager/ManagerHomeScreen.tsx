// src/manager/ManagerHomeScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import WorkStatusPanel from './WorkStatusPanel'; // ✅ 추가

type Props = NativeStackScreenProps<RootStackParamList, 'ManagerHome'>;

type NavigationItemId =
  | 'work-status'
  | 'worker-management'
  | 'safety-report'
  | 'announcements'
  | 'training'
  | 'daily-report';

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
];

const ManagerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<NavigationItemId>('work-status'); // ✅ 기본값 유지 (작업 현황)
  const [isWorkerRegistration, setIsWorkerRegistration] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그인 화면으로 돌아갑니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        style: 'destructive',
        onPress: () => navigation.navigate('Login'),
      },
    ]);
  };

  const renderContent = () => {
    if (isWorkerRegistration) {
      return (
        <View style={styles.panelContainer}>
          <Text style={styles.panelTitle}>근로자 등록 화면 (임시)</Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'work-status':
        return <WorkStatusPanel />; // ✅ 실제 패널 표시
      case 'worker-management':
        return (
          <View style={styles.panelContainer}>
            <Text style={styles.panelTitle}>근로자 관리 패널 (WorkerManagementPanel)</Text>
          </View>
        );
      case 'safety-report':
        return (
          <View style={styles.panelContainer}>
            <Text style={styles.panelTitle}>안전 신고 현황 패널</Text>
          </View>
        );
      case 'announcements':
        return (
          <View style={styles.panelContainer}>
            <Text style={styles.panelTitle}>공지사항 패널</Text>
          </View>
        );
      case 'training':
        return (
          <View style={styles.panelContainer}>
            <Text style={styles.panelTitle}>안전 교육 일지 패널</Text>
          </View>
        );
      case 'daily-report':
        return (
          <View style={styles.panelContainer}>
            <Text style={styles.panelTitle}>작업 일보 패널</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* 왼쪽 사이드바 */}
        <View style={styles.sidebar}>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>현장</Text>
            </View>
            <Text style={styles.logoText}>현장 관리</Text>
          </View>

          {/* 네비게이션 */}
          <View style={styles.navList}>
            {navigationItems.map(item => {
              const isActive =
                item.id === activeTab && !isWorkerRegistration;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                    styles.navButton,
                    isActive && styles.navButtonActive,
                  ]}
                  onPress={() => {
                    setActiveTab(item.id);
                    setIsWorkerRegistration(false);
                  }}
                >
                  <Text
                    style={[
                      styles.navEmoji,
                      isActive && styles.navEmojiActive,
                    ]}
                  >
                    {item.emoji}
                  </Text>
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

          {/* 로그아웃 */}
          <View style={styles.logoutWrapper}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutEmoji}>↩️</Text>
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 메인 영역 */}
        <View style={styles.main}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.mainContent,
              { paddingHorizontal: isTablet ? 12 : 24, paddingVertical: isTablet ? 12 : 24 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 110,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  logoText: {
    fontSize: 11,
    color: '#111827',
  },
  navList: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 8,
    gap: 8,
  } as any,
  navButton: {
    width: '100%',
    aspectRatio: 1,
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
  navEmoji: {
    fontSize: 20,
    marginBottom: 4,
    color: '#4B5563',
  },
  navEmojiActive: {
    color: '#FFFFFF',
  },
  navLabel: {
    fontSize: 10,
    color: '#4B5563',
    textAlign: 'center',
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
  logoutWrapper: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 16,
  },
  logoutButton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
  },
  logoutEmoji: {
    fontSize: 20,
    color: '#DC2626',
    marginBottom: 4,
  },
  logoutText: {
    fontSize: 10,
    color: '#DC2626',
  },
  main: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  mainContent: {
    flexGrow: 1,
  },
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
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
});

export default ManagerHomeScreen;