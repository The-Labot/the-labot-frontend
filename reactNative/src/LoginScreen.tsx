// src/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image, // ★ Image 컴포넌트 추가
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';


// ★ 새로운 로고 이미지 가져오기 (경로를 실제 프로젝트에 맞게 수정해주세요)
// 예: assets 폴더에 image_0.png 파일을 logo.png로 저장했다고 가정
import logoImage from './assets/logo.png'; 

import { loginManager} from './api/auth';
import { SafeAreaView } from 'react-native-safe-area-context';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
type UserType = 'manager' | 'worker';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>('worker');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('알림', '전화번호와 비밀번호를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginManager(phone, password);
      console.log('로그인 성공 응답:', data);

      const role = data.role;

      if (role === 'ROLE_MANAGER') {
        navigation.replace('ManagerHome');
      } else if (role === 'ROLE_WORKER') {
        navigation.replace('WorkerHome');
      } else {
        Alert.alert('로그인 오류', '알 수 없는 사용자 유형입니다.');
      }
    } catch (e) {
      Alert.alert('로그인 실패', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 / 로고 */}
          <View style={styles.header}>
            {/* ★ 기존의 logoBox와 이모지 텍스트를 제거하고 이미지로 교체 */}
            <Image
              source={logoImage}
              style={styles.logoImage}
              resizeMode="contain" // 이미지 비율 유지하며 영역에 맞춤
            />
            {/* 기존 텍스트 타이틀은 이미지에 포함되어 있으므로 주석 처리하거나 제거 */}
            {/* <Text style={styles.title}>The-Labot</Text> */}
            <Text style={styles.subtitle}>노무관리 도움 봇</Text>
          </View>

          {/* 사용자 유형 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>사용자 유형 선택</Text>
            <View style={styles.userTypeRow}>
              {/* 관리자 버튼 */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.userTypeButton,
                  { marginRight: 6 },
                  selectedUserType === 'manager' && styles.userTypeButtonSelected,
                ]}
                onPress={() => setSelectedUserType('manager')}
              >
                <Text
                  style={[
                    styles.userTypeIcon,
                    selectedUserType === 'manager' && styles.userTypeIconSelected,
                  ]}
                >
                  👤
                </Text>
                <Text
                  style={[
                    styles.userTypeTitle,
                    selectedUserType === 'manager' && styles.userTypeTitleSelected,
                  ]}
                >
                  현장 관리자
                </Text>
                <Text
                  style={[
                    styles.userTypeSubtitle,
                    selectedUserType === 'manager' && styles.userTypeSubtitleSelected,
                  ]}
                >
                  Field Manager
                </Text>
              </TouchableOpacity>

              {/* 근로자 버튼 */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.userTypeButton,
                  { marginLeft: 6 },
                  selectedUserType === 'worker' && styles.userTypeButtonSelected,
                ]}
                onPress={() => setSelectedUserType('worker')}
              >
                <Text
                  style={[
                    styles.userTypeIcon,
                    selectedUserType === 'worker' && styles.userTypeIconSelected,
                  ]}
                >
                  👷‍♂️
                </Text>
                <Text
                  style={[
                    styles.userTypeTitle,
                    selectedUserType === 'worker' && styles.userTypeTitleSelected,
                  ]}
                >
                  현장 근로자
                </Text>
                <Text
                  style={[
                    styles.userTypeSubtitle,
                    selectedUserType === 'worker' && styles.userTypeSubtitleSelected,
                  ]}
                >
                  Field Worker
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 로그인 폼 카드 */}
          <View style={styles.card}>
            <View style={styles.cardInner}>
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>아이디</Text>
                <TextInput
                  style={styles.input}
                  placeholder="-없이 010 포함하여 기입하시오"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.loginButton}
                onPress={loading ? undefined : handleLogin}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? '로그인 중...' : '로그인'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 하단 링크 */}
          <View style={styles.bottomRow}>
            <TouchableOpacity activeOpacity={0.7}
              onPress={() => navigation.navigate("ForgotPassword")}
>
              <Text style={styles.bottomLink}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>

          {/* 푸터 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>The labot</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  // ★ 기존 logoBox, logoIcon 스타일 제거
  /*
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  logoIcon: { fontSize: 40, color: '#FFFFFF' },
  */
  // ★ 새로운 로고 이미지 스타일 추가
  logoImage: {
    width: '100%', // 화면 너비의 80% 차지 (원하는 크기로 조절 가능)
    height: 120,   // 적절한 높이 설정 (원본 이미지 비율에 맞춰 조절 필요)
    marginBottom: 0, // 부제목과의 간격
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center' },

  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 14, color: '#374151', marginBottom: 8 },
  userTypeRow: { flexDirection: 'row' },
  userTypeButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  userTypeButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  userTypeIcon: { fontSize: 24, marginBottom: 6, color: '#2563EB' },
  userTypeIconSelected: { color: '#FFFFFF' },
  userTypeTitle: { fontSize: 14, color: '#111827' },
  userTypeTitleSelected: { color: '#FFFFFF' },
  userTypeSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  userTypeSubtitleSelected: { color: '#DBEAFE' },

  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  cardInner: { padding: 16 },
  fieldBlock: { marginBottom: 14 },
  label: { fontSize: 13, color: '#374151', marginBottom: 6 },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
    color: '#111827',
  },
  loginButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  bottomRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  bottomLink: { fontSize: 13, color: '#4B5563' },

  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#9CA3AF' },
});

export default LoginScreen;