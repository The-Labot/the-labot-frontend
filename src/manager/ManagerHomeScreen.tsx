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
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import WorkStatusPanel from './WorkStatusPanel';                 // ✅ 작업 현황 패널
import WorkerManagementScreen from './WorkerManagementScreen';   // ✅ 근로자 관리(실 화면 연결)

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

// 임시 현장 목록(헤더의 현장 변경 버튼 테스트용)
const sites = ['세종 A현장', '서울 B현장', '서울 C현장'] as const;

const ManagerHomeScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<NavigationItemId>('work-status');
  const [isWorkerRegistration, setIsWorkerRegistration] = useState(false);
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  // 상단 공통 컨텍스트(현장/날짜/새로고침)
  const [site, setSite] = useState<typeof sites[number]>('세종 A현장');
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그인 화면으로 돌아갑니다.', [
      { text: '취소', style: 'cancel' },
      { text: '확인', style: 'destructive', onPress: () => navigation.navigate('Login') },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: site/dateStr 기준으로 각 패널 데이터 리로드
    setTimeout(() => setRefreshing(false), 600);
  };

  /** 상단 헤더 바 (현장/날짜/새로고침) */
  

  /** 퀵 링크(지도/근태/신고) */
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
        return (
          <View style={{ gap: 12 }}>
            {renderQuickLinks()}
            <WorkStatusPanel /* site={site} date={dateStr} */ />
          </View>
        );
      case 'worker-management':
        return (
          <View style={{ gap: 12 }}>

            <WorkerManagementScreen />
          </View>
        );
      case 'safety-report':
        return (
          <View style={{ gap: 12 }}>

            <View style={styles.panelContainer}>
              <Text style={styles.panelTitle}>안전 신고 현황 패널</Text>
            </View>
          </View>
        );
      case 'announcements':
        return (
          <View style={{ gap: 12 }}>

            <View style={styles.panelContainer}>
              <Text style={styles.panelTitle}>공지사항 패널</Text>
            </View>
          </View>
        );
      case 'training':
        return (
          <View style={{ gap: 12 }}>

            <View style={styles.panelContainer}>
              <Text style={styles.panelTitle}>안전 교육 일지 패널</Text>
            </View>
          </View>
        );
      case 'daily-report':
        return (
          <View style={{ gap: 12 }}>

            <View style={styles.panelContainer}>
              <Text style={styles.panelTitle}>작업 일보 패널</Text>
            </View>
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
            {navigationItems.map((item) => {
              const isActive = item.id === activeTab && !isWorkerRegistration;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.85}
                  style={[styles.navButton, isActive && styles.navButtonActive]}
                  onPress={() => {
                    if (item.id === 'my-page') {
                      navigation.navigate('MyPage');      // 👈 마이페이지 화면으로 이동
                      return;
                    }
                    setActiveTab(item.id);
                    setIsWorkerRegistration(false);
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

        {/* 메인 영역 */}
<View style={styles.main}>
  {activeTab === 'worker-management' ? (
    // 근로자 관리일 때: 바깥 ScrollView 쓰지 않음
    <View style={{ flex: 1, paddingHorizontal: isTablet ? 12 : 24, paddingVertical: isTablet ? 12 : 24 }}>
      <WorkerManagementScreen />
    </View>
  ) : (
    // 그 외 탭: 기존처럼 스크롤
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
  navList: { lex: 1,
  width: '100%',
  paddingHorizontal: 8,
  paddingTop: 4,
  gap: 10,   } as any,
  navButton: {
    width: '100%',
  height: 86,               // ⬅︎ 고정 높이(정사각형 대신)
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

  logoutWrapper: { width: '100%', paddingHorizontal: 8, marginTop: 16 },
  logoutButton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
  },
  logoutEmoji: { fontSize: 20, color: '#DC2626', marginBottom: 4 },
  logoutText: { fontSize: 10, color: '#DC2626' },

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

  /* 상단 헤더 바 */
  headerBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerSite: { fontSize: 16, fontWeight: '700', color: '#111827' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerBtnPrimary: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  headerBtnText: { color: '#111827' },

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