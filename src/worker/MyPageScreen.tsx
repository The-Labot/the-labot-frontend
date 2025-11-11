// src/screens/MyPageScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

import { Modal, Pressable } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'MyPage'>;

const MyPageScreen: React.FC<Props> = ({ navigation }) => {
const [gender, setGender] = useState<string | null>(null);
const [nationality, setNationality] = useState<string | null>(null);
const [isGenderModalVisible, setGenderModalVisible] = useState(false);
const [isNationalityModalVisible, setNationalityModalVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 👇 여기서부터 전체가 스크롤 대상 */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.profileWrapper}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>김</Text>
                </View>
                <TouchableOpacity style={styles.cameraButton} activeOpacity={0.8}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.nameText}>방성식</Text>
              <Text style={styles.jobText}>배관공 · 세종 A현장</Text>
              <Text style={styles.phoneText}>010-1234-5678</Text>
            </View>
          </View>
        </View>

        {/* 개인정보 카드 */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={styles.sectionTitle}>개인정보</Text>

            {/* 주소 */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>주소</Text>
              <TextInput
                placeholder="주소를 입력하세요"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.separator} />

            {/* 생년월일 */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>생년월일</Text>
              <TextInput
                placeholder="2025.10.31"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.separator} />

            {/* 성별 */}
<View style={styles.fieldBlock}>
  <Text style={styles.label}>성별</Text>
  <TouchableOpacity
    style={styles.selectBox}
    activeOpacity={0.7}
    onPress={() => setGenderModalVisible(true)}
  >
    <Text style={styles.selectPlaceholder}>
      {gender ? gender : '성별을 선택하세요'}
    </Text>
  </TouchableOpacity>
</View>

{/* 성별 선택 모달 */}
<Modal
  transparent={true}
  visible={isGenderModalVisible}
  animationType="fade"
  onRequestClose={() => setGenderModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>성별 선택</Text>
      {['남', '여'].map((option) => (
        <Pressable
          key={option}
          style={styles.modalOption}
          onPress={() => {
            setGender(option);
            setGenderModalVisible(false);
          }}
        >
          <Text style={styles.modalOptionText}>{option}</Text>
        </Pressable>
      ))}
      <Pressable onPress={() => setGenderModalVisible(false)}>
        <Text style={styles.modalCancel}>취소</Text>
      </Pressable>
    </View>
  </View>
</Modal>

<View style={styles.separator} />

{/* 국적 */}
<View style={styles.fieldBlock}>
  <Text style={styles.label}>국적</Text>
  <TouchableOpacity
    style={styles.selectBox}
    activeOpacity={0.7}
    onPress={() => setNationalityModalVisible(true)}
  >
    <Text style={styles.selectPlaceholder}>
      {nationality ? nationality : '국적을 선택하세요'}
    </Text>
  </TouchableOpacity>
</View>

{/* 국적 선택 모달 */}
<Modal
  transparent={true}
  visible={isNationalityModalVisible}
  animationType="fade"
  onRequestClose={() => setNationalityModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>국적 선택</Text>
      {['한국', '미국', '중국'].map((nation) => (
        <Pressable
          key={nation}
          style={styles.modalOption}
          onPress={() => {
            setNationality(nation);
            setNationalityModalVisible(false);
          }}
        >
          <Text style={styles.modalOptionText}>{nation}</Text>
        </Pressable>
      ))}
      <Pressable onPress={() => setNationalityModalVisible(false)}>
        <Text style={styles.modalCancel}>취소</Text>
      </Pressable>
    </View>
  </View>
</Modal>
            <View style={styles.separator} />

            {/* 전화번호 */}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>전화번호</Text>
              <TextInput
                defaultValue="010-1234-5678"
                style={styles.input}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.separator} />

            {/* 비밀번호 변경 */}
            <TouchableOpacity style={styles.passwordRow} activeOpacity={0.7}>
              <View>
                <Text style={styles.passwordTitle}>비밀번호 변경</Text>
                <Text style={styles.passwordDesc}>
                  보안을 위해 주기적으로 변경하세요
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 문서 카드들 */}
        <View style={styles.docSection}>
          <TouchableOpacity
            style={[styles.docCard, { backgroundColor: '#E5F0FF' }]}
            activeOpacity={0.8}
          >
            <View style={styles.docInner}>
              <View style={styles.docLeft}>
                <View style={[styles.docIconCircle, { backgroundColor: '#FFFFFF' }]}>
                  <Text style={styles.docIcon}>📄</Text>
                </View>
                <View>
                  <Text style={styles.docTitle}>근로 계약서 보기</Text>
                  <Text style={styles.docSubtitle}>View Work Contract</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docCard, { backgroundColor: '#FFEBD7' }]}
            activeOpacity={0.8}
          >
            <View style={styles.docInner}>
              <View style={styles.docLeft}>
                <View style={[styles.docIconCircle, { backgroundColor: '#FFFFFF' }]}>
                  <Text style={styles.docIcon}>💰</Text>
                </View>
                <View>
                  <Text style={styles.docTitle}>급여 명세서 보기</Text>
                  <Text style={styles.docSubtitle}>View Payroll Statement</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docCard, { backgroundColor: '#E5F7E9' }]}
            activeOpacity={0.8}
          >
            <View style={styles.docInner}>
              <View style={styles.docLeft}>
                <View style={[styles.docIconCircle, { backgroundColor: '#FFFFFF' }]}>
                  <Text style={styles.docIcon}>🏅</Text>
                </View>
                <View>
                  <Text style={styles.docTitle}>자격증 보기</Text>
                  <Text style={styles.docSubtitle}>View Certificate</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },

  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: { padding: 8, borderRadius: 8 },
  backArrow: { fontSize: 22, color: '#111827' },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  logoutText: { color: '#DC2626', fontSize: 14, fontWeight: '600' },

  // 👇 ScrollView 관련
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardInner: { padding: 16 },

  profileWrapper: { alignItems: 'center' },
  avatarWrapper: { marginBottom: 12 },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 32, color: '#2563EB', fontWeight: '700' },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: { color: '#FFFFFF', fontSize: 16 },

  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobText: { fontSize: 14, color: '#4B5563', marginBottom: 4 },
  phoneText: { fontSize: 13, color: '#6B7280' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  fieldBlock: { marginBottom: 12 },
  label: { fontSize: 13, color: '#374151', marginBottom: 6 },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
    color: '#111827',
  },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },

  selectBox: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
  },
  selectPlaceholder: { fontSize: 14, color: '#9CA3AF' },

  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  passwordTitle: { fontSize: 14, color: '#111827', marginBottom: 2 },
  passwordDesc: { fontSize: 12, color: '#6B7280' },

  chevron: { fontSize: 20, color: '#9CA3AF' },

  docSection: { marginTop: 8, marginBottom: 32 },
  docCard: {
    borderRadius: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  docInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docLeft: { flexDirection: 'row', alignItems: 'center' },
  docIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  docIcon: { fontSize: 22 },
  docTitle: { fontSize: 14, color: '#111827', marginBottom: 2 },
  docSubtitle: { fontSize: 12, color: '#6B7280' },
  // 선택 모달 관련 스타일
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  width: '80%',
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 12,
},
modalOption: {
  paddingVertical: 10,
  width: '100%',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#EEE',
},
modalOptionText: {
  fontSize: 15,
  color: '#111827',
},
modalCancel: {
  marginTop: 10,
  color: '#2563EB',
  fontSize: 14,
},
});

export default MyPageScreen;