// 📌 src/screens/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { BASE_URL } from '../api/config';
import { getTempAccessToken } from '../api/auth';
import ScreenWrapper from '../ScreenWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkerHome'>;

type Notice = {
  id: number;
  title: string;
  category: string;
  pinned: boolean;
  urgent: boolean;
  date: string;
  writer: string;
};

// 메뉴 아이템 유지
type WorkerMenuScreen =
  | 'WorkerMyPage'
  | 'Map'
  | 'HazardReport'
  | 'Attendance';

type MenuItem = {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  bgColor: string;
  screen: WorkerMenuScreen;
};

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: '마이페이지',
    subtitle: 'My Page',
    emoji: '👤',
    bgColor: '#E5F0FF',
    screen: 'WorkerMyPage',
  },
  {
    id: 2,
    title: '지도(현재위치)',
    subtitle: 'Map Location',
    emoji: '📍',
    bgColor: '#FFEBD7',
    screen: 'Map',
  },
  {
    id: 3,
    title: '위험요소 신고',
    subtitle: 'Safety Report',
    emoji: '⚠️',
    bgColor: '#FFE5E5',
    screen: 'HazardReport',
  },
  {
    id: 4,
    title: '출퇴근 등록',
    subtitle: 'Attendance',
    emoji: '⏰',
    bgColor: '#E5F7E9',
    screen: 'Attendance',
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [notices, setNotices] = useState<Notice[]>([]);

  // 🔥 공지사항 가져오기
  const fetchNotices = async () => {
  try {
    const token = getTempAccessToken();
    const res = await fetch(`${BASE_URL}/worker/notices`, {
      method: 'GET',
      headers: { Authorization: token },
    });

    const json = await res.json();
    console.log("공지사항 API 응답:", json);

    // 🔥 json 자체가 배열이므로 그대로 정렬
    const sorted = json.sort(
      (a: Notice, b: Notice) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setNotices(sorted.slice(0, 5));
  } catch (err) {
    console.log('공지사항 fetch 오류:', err);
  }
};

  useEffect(() => {
    fetchNotices();
  }, []);

  // 카테고리 색상 매핑
  const getTagStyle = (category: string) => {
    switch (category) {
      case '안전':
        return { bg: '#DBEAFE', color: '#1D4ED8' };
      case '일정':
        return { bg: '#FFEDD5', color: '#C2410C' };
      case '현장':
        return { bg: '#E2FBEA', color: '#15803D' };
      default:
        return { bg: '#F3F4F6', color: '#374151' };
    }
  };

  return (
    <ScreenWrapper>

      <StatusBar barStyle="dark-content" />

      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>현장</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>현장 근로자</Text>
              <Text style={styles.headerSubtitle}>Field Worker</Text>
            </View>
          </View>
        </View>

        {/* 내용 */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 메뉴 */}
          <View style={styles.menuGrid}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[styles.menuCard, { backgroundColor: item.bgColor }]}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.menuIconWrapper}>
                  <Text style={styles.menuEmoji}>{item.emoji}</Text>
                </View>
                <View style={styles.menuTextWrapper}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* 공지사항 */}
          <View style={styles.noticeSection}>
            <View style={styles.noticeHeader}>
              <Text style={styles.noticeTitle}>공지 사항</Text>

              {/* 🔵 전체 공지 보기 버튼 */}
              <TouchableOpacity
                style={styles.noticeAddButton}
                onPress={() => navigation.navigate('WorkerNoticeList')}
              >
                <Text style={styles.noticeAddPlus}>＋</Text>
              </TouchableOpacity>
            </View>

            {/* 최신 공지 5개 */}
            {notices.map(item => {
              const { bg, color } = getTagStyle(item.category);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.noticeCard}
                  onPress={() =>
                    navigation.navigate('WorkerNoticeDetail', { noticeId: item.id })
                  }
                >
                  <View style={styles.noticeRow}>
                    <View style={[styles.noticeTag, { backgroundColor: bg }]}>
                      <Text style={[styles.noticeTagText, { color }]}>{item.category}</Text>
                    </View>

                    <View style={styles.noticeTextWrapper}>
                <Text style={styles.noticeMain}>
                  {item.urgent ? '🚨 ' : ''}
                  {item.title}
                </Text>
                <Text style={styles.noticeDate}>{item.date}</Text>
              </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
  </ScreenWrapper>

  );
};

// 스타일은 기존에 쓰던 거 그대로
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerBadgeText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  headerTitle: { color: '#111827', fontSize: 18, fontWeight: '600' },
  headerSubtitle: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  menuCard: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  menuIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuEmoji: { fontSize: 28 },
  menuTextWrapper: { alignItems: 'center' },
  menuTitle: { color: '#111827', fontSize: 14, marginBottom: 2 },
  menuSubtitle: { color: '#6B7280', fontSize: 11 },
    // 공지사항
  noticeSection: {
    marginTop: 8,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  noticeAddButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeAddPlus: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -1,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  noticeTagSafe: {
    backgroundColor: '#DBEAFE', // blue-100
  },
  noticeTagSchedule: {
    backgroundColor: '#FFEDD5', // orange-100
  },
  noticeTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1D4ED8', // 기본은 파란색, 일정 태그는 아래에서 덮어씀
  },
  noticeTextWrapper: {
    flex: 1,
  },
  noticeMain: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  noticeDate: {
    fontSize: 11,
    color: '#6B7280',
  },
});

export default HomeScreen;