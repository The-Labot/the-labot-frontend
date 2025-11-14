// src/manager/MyPageScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'ManagerMyPage'>;

interface Manager {
  id: number;
  name: string;
  role: string;
  contact: string;
  isCurrentUser: boolean;
}

const worksiteInfo = {
  name: '서울 강남구 테헤란로 복합건설 현장',
  address: '서울특별시 강남구 테헤란로 123',
  description:
    '지상 25층, 지하 5층 규모의 업무시설 및 판매시설 복합건축물 신축공사',
  constructionPeriod: '2024.03.01 ~ 2026.12.31',
  scale: '연면적 45,000㎡ (지상 25층, 지하 5층)',
  type: '철근콘크리트조',
  client: '(주)강남개발',
  contractor: '(주)대한건설',
};

const managers: Manager[] = [
  {
    id: 1,
    name: '김현장',
    role: '총괄 현장소장',
    contact: '010-1234-5678',
    isCurrentUser: true,
  },
  {
    id: 2,
    name: '이관리',
    role: '공사 관리자',
    contact: '010-2345-6789',
    isCurrentUser: false,
  },
  {
    id: 3,
    name: '박현장',
    role: '안전 관리자',
    contact: '010-3456-7890',
    isCurrentUser: false,
  },
  {
    id: 4,
    name: '최기사',
    role: '품질 관리자',
    contact: '010-4567-8901',
    isCurrentUser: false,
  },
  {
    id: 5,
    name: '정주임',
    role: '공무 관리자',
    contact: '010-5678-9012',
    isCurrentUser: false,
  },
];

const ManagerMyPageScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?\n현재 작업중인 내용이 저장되지 않을 수 있습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            // TODO: 실제 로그아웃 로직 연동
            Alert.alert('알림', '로그아웃 되었습니다.');
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      '비밀번호 변경',
      '비밀번호 변경 기능은 준비 중입니다.\n관리자에게 문의해주세요.',
    );
  };

  const getInitial = (name: string) => name.charAt(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>마이페이지</Text>
            <Text style={styles.headerSubtitle}>My Page</Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.headerLogoutBtn}
            activeOpacity={0.9}
          >
            <Text style={styles.headerLogoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 내용 */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: isTablet ? 40 : 20,
              paddingVertical: isTablet ? 24 : 16,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 계정 관리 카드 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>계정 관리</Text>
            <View style={styles.accountButtonRow}>
              <TouchableOpacity
                onPress={handleChangePassword}
                style={[styles.primaryBtn, { flex: 1 }]}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBtnText}>비밀번호 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.outlineRedBtn, { flex: 1 }]}
                activeOpacity={0.9}
              >
                <Text style={styles.outlineRedBtnText}>로그아웃</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 현장 정보 카드 */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionIcon}>🏗️</Text>
              <Text style={styles.cardTitle}>현장 정보</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>현장명</Text>
              <Text style={styles.infoValue}>{worksiteInfo.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabelWithIcon}>
                <Text style={styles.infoLabelIcon}>📍</Text>
                <Text style={styles.infoLabel}>주소</Text>
              </View>
              <Text style={styles.infoValue}>{worksiteInfo.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>공사 내용</Text>
              <Text style={styles.infoValue}>{worksiteInfo.description}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabelWithIcon}>
                <Text style={styles.infoLabelIcon}>📆</Text>
                <Text style={styles.infoLabel}>공사 기간</Text>
              </View>
              <Text style={styles.infoValue}>
                {worksiteInfo.constructionPeriod}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabelWithIcon}>
                <Text style={styles.infoLabelIcon}>📏</Text>
                <Text style={styles.infoLabel}>공사 규모</Text>
              </View>
              <Text style={styles.infoValue}>{worksiteInfo.scale}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>구조</Text>
              <Text style={styles.infoValue}>{worksiteInfo.type}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>발주처</Text>
              <Text style={styles.infoValue}>{worksiteInfo.client}</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>시공사</Text>
              <Text style={styles.infoValue}>{worksiteInfo.contractor}</Text>
            </View>
          </View>

          {/* 현장 관리자 카드 */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionIcon}>👥</Text>
              <Text style={styles.cardTitle}>현장 관리자</Text>
              <Text style={styles.managerCountText}>
                총 {managers.length}명
              </Text>
            </View>

            {managers.map(m => (
              <View
                key={m.id}
                style={[
                  styles.managerRow,
                  m.isCurrentUser && styles.managerRowActive,
                ]}
              >
                {/* 아바타 */}
                <View
                  style={[
                    styles.avatar,
                    m.isCurrentUser ? styles.avatarActive : styles.avatarNormal,
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      m.isCurrentUser && styles.avatarTextActive,
                    ]}
                  >
                    {getInitial(m.name)}
                  </Text>
                </View>

                {/* 정보 */}
                <View style={{ flex: 1 }}>
                  <View style={styles.managerNameRow}>
                    <Text
                      style={[
                        styles.managerName,
                        m.isCurrentUser && styles.managerNameActive,
                      ]}
                    >
                      {m.name}
                    </Text>
                    {m.isCurrentUser && (
                      <View style={styles.meBadge}>
                        <Text style={styles.meBadgeText}>나</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.managerRole}>{m.role}</Text>
                  <Text style={styles.managerContact}>{m.contact}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
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
  },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  backArrow: {
    fontSize: 18,
    color: '#4B5563',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerLogoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  headerLogoutText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },

  scrollContent: {
    paddingBottom: 32,
    gap: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },

  /* 계정 관리 */
  accountButtonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  outlineRedBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
  },
  outlineRedBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },

  /* 섹션 공통 */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 6,
  },

  /* 현장 정보 */
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    width: 80,
    fontSize: 12,
    color: '#6B7280',
  },
  infoLabelWithIcon: {
    width: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabelIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },

  /* 현장 관리자 */
  managerCountText: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#6B7280',
  },
  managerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  managerRowActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarNormal: {
    backgroundColor: '#E5E7EB',
  },
  avatarActive: {
    backgroundColor: '#2563EB',
  },
  avatarText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: '600',
  },
  avatarTextActive: {
    color: '#FFFFFF',
  },
  managerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  managerName: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  managerNameActive: {
    color: '#1D4ED8',
  },
  meBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  meBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  managerRole: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 1,
  },
  managerContact: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});

export default ManagerMyPageScreen;