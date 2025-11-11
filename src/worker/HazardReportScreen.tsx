// src/screens/HazardReportScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'HazardReport'>;

const RISK_TYPES = [
  '낙하물 위험 (Falling Objects)',
  '화재 위험 (Fire Risk)',
  '감전 위험 (Electric Shock)',
  '붕괴 위험 (Collapse Risk)',
  '기타 (Other)',
];

const HazardReportScreen: React.FC<Props> = ({ navigation }) => {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [location, setLocation] = useState('');
  const [riskType, setRiskType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    const isValid =
      hasPhoto && location.trim() !== '' && riskType && description.trim() !== '';

    if (!isValid) {
      setShowError(true);
      return;
    }

    // TODO: 실제 신고 API 연결
    setShowError(false);
    // 일단은 이전 화면으로만 돌아가도록
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* 상단 헤더 */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>위험요소 신고</Text>
            <Text style={styles.headerSubtitle}>Hazard Report</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 사진/영상 첨부 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              사진/영상 첨부 <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.photoBox,
                  hasPhoto && styles.photoBoxSelected,
                ]}
                onPress={() => {
                  // TODO: 카메라/갤러리 연동
                  setHasPhoto(true);
                }}
              >
                <View style={styles.photoIconCircle}>
                  <Text style={styles.photoIcon}>📷</Text>
                </View>
                <Text style={styles.photoText}>사진 추가</Text>
                <Text style={styles.photoSubText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 위치/구역 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              위치/구역 <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="예: 3층 동쪽 계단, 2구역 작업장 등"
                placeholderTextColor="#9CA3AF"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* 위험 유형 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              위험 유형 <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.card}>
              {RISK_TYPES.map(item => {
                const isSelected = riskType === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.riskItem,
                      isSelected && styles.riskItemSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setRiskType(item)}
                  >
                    <Text
                      style={[
                        styles.riskText,
                        isSelected && styles.riskTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 상세 설명 */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              상세 설명 <Text style={styles.required}>*</Text>
            </Text>

            <View style={styles.card}>
              <TextInput
                style={styles.textArea}
                placeholder="현장 상황을 정확하게 기술해주세요&#10;예: 3층 계단 난간이 부식되어 흔들림"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* 신고 제출 버튼 */}
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>⚠️  신고 제출하기</Text>
          </TouchableOpacity>

          {/* 에러 메시지 박스 */}
          {showError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorMain}>
                사진 첨부는 필수입니다
              </Text>
              <Text style={styles.errorMain}>
                현장 상황을 정확하게 기술해주세요
              </Text>
              <Text style={styles.errorSub}>
                Photo is required / Please accurately describe the site
                condition
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HazardReportScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
  headerWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backArrow: {
    fontSize: 22,
    color: '#111827',
  },
  headerTextWrapper: {
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  photoBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  photoBoxSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  photoIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  photoIcon: {
    fontSize: 32,
  },
  photoText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  photoSubText: {
    fontSize: 13,
    color: '#6B7280',
  },
  input: {
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
  },
  riskItem: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  riskItemSelected: {
    backgroundColor: '#F3F4FF',
  },
  riskText: {
    fontSize: 14,
    color: '#111827',
  },
  riskTextSelected: {
    fontWeight: '600',
    color: '#1D4ED8',
  },
  textArea: {
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 120,
    fontSize: 14,
    color: '#111827',
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  errorMain: {
    color: '#B91C1C',
    fontSize: 13,
    marginBottom: 2,
  },
  errorSub: {
    color: '#B91C1C',
    fontSize: 12,
    marginTop: 4,
  },
});