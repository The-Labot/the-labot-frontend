// src/screens/MyPageScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getTempAccessToken, setTempAccessToken } from '../api/auth';
import { BASE_URL } from "../api/config";

type Props = NativeStackScreenProps<RootStackParamList, 'WorkerMyPage'>;

interface WorkerMyPageData {
  name: string;
  phone: string;
  emergencyNumber: string;
  jobRole: string;
  siteName: string;
  address: string;
  birthDate: string;
  gender: string;
  nationality: string;
  profileImageUrl: string | null;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  contractFileId: number | null;
  payrollFileId: number | null;
  certificateFileId: number | null;
}

const MyPageScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<WorkerMyPageData | null>(null);

  // 수정 상태
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // GET
  async function loadMyPage() {
    try {
      const token = getTempAccessToken();

      const res = await fetch(`${BASE_URL}/worker/mypage`, {
        method: "GET",
        headers: { Authorization: token },
      });

      const json = await res.json();
      setData(json);

    } catch (err) {
      Alert.alert("에러", "마이페이지 데이터를 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    loadMyPage();
  }, []);

  // PATCH
  async function patchMyPage(field: string, value: string) {
    try {
      const token = getTempAccessToken();

      const body = { [field]: value };

      const res = await fetch(`${BASE_URL}/worker/mypage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        Alert.alert("수정 실패", json.message || "오류 발생");
        return;
      }

      setData(prev => prev ? { ...prev, [field]: value } : prev);
      setEditingField(null);
      Alert.alert("성공", "정보가 수정되었습니다.");

    } catch (err) {
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    }
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ marginTop: 40, textAlign: 'center', color: '#6B7280' }}>
          불러오는 중...
        </Text>
      </SafeAreaView>
    );
  }

  function startEdit(field: keyof WorkerMyPageData) {
    setEditingField(field);
    setEditValue(String(data[field] ?? ""));
  }

  function saveEdit() {
    if (!editingField) return;
    patchMyPage(editingField, editValue);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              setTempAccessToken("");
              navigation.replace("Login");
            }}
          >
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* 프로필 */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.profileWrapper}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>{data.name?.[0] ?? '?'}</Text>
                </View>

                <TouchableOpacity style={styles.cameraButton}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.nameText}>{data.name}</Text>
              <Text style={styles.jobText}>{data.jobRole} · {data.siteName}</Text>
              <Text style={styles.phoneText}>{data.phone}</Text>
            </View>
          </View>
        </View>

        {/* 개인정보 */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={styles.sectionTitle}>개인정보</Text>

            <FieldRow label="주소" value={data.address}
              editing={editingField === 'address'} editValue={editValue}
              onPressEdit={() => startEdit('address')} onChangeEdit={setEditValue}
              editable={true}
            />

            <FieldRow label="생년월일" value={data.birthDate} editable={false} />

            <FieldRow label="성별" value={data.gender} editable={false} />

            <FieldRow label="국적" value={data.nationality} editable={false} />

            <FieldRow label="전화번호" value={data.phone}
              editing={editingField === 'phone'} editValue={editValue}
              onPressEdit={() => startEdit('phone')} onChangeEdit={setEditValue}
              editable={true}
            />

            <FieldRow label="비상전화" value={data.emergencyNumber}
              editing={editingField === 'emergencyNumber'} editValue={editValue}
              onPressEdit={() => startEdit('emergencyNumber')} onChangeEdit={setEditValue}
              editable={true}
            />

            <FieldRow label="직종" value={data.jobRole} editable={false} />

            <FieldRow label="현장명" value={data.siteName} editable={false} />

            <FieldRow label="은행명" value={data.bankName}
              editing={editingField === 'bankName'} editValue={editValue}
              onPressEdit={() => startEdit('bankName')} onChangeEdit={setEditValue}
              editable={true}
            />

            <FieldRow label="계좌번호" value={data.accountNumber}
              editing={editingField === 'accountNumber'} editValue={editValue}
              onPressEdit={() => startEdit('accountNumber')} onChangeEdit={setEditValue}
              editable={true}
            />

            <FieldRow label="예금주" value={data.accountHolder}
              editing={editingField === 'accountHolder'} editValue={editValue}
              onPressEdit={() => startEdit('accountHolder')} onChangeEdit={setEditValue}
              editable={true}
            />

            {/* 저장 버튼 */}
            {editingField && (
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveText}>저장</Text>
              </TouchableOpacity>
            )}

            {/* 비밀번호 변경 */}
            <TouchableOpacity style={styles.passwordRow}>
              <View>
                <Text style={styles.passwordTitle}>비밀번호 변경</Text>
                <Text style={styles.passwordDesc}>정기적으로 변경하세요</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 문서 링크 */}
        <View style={styles.docSection}>
          <DocButton title="근로 계약서 보기" subtitle={`ID: ${data.contractFileId ?? '없음'}`} bg="#E5F0FF" />
          <DocButton title="급여 명세서 보기" subtitle={`ID: ${data.payrollFileId ?? '없음'}`} bg="#FFEBD7" />
          <DocButton title="자격증 보기" subtitle={`ID: ${data.certificateFileId ?? '없음'}`} bg="#E5F7E9" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPageScreen;

/* ---------------------------------------
   공통 컴포넌트
--------------------------------------- */
function FieldRow({
  label, value,
  editing, editValue,
  onChangeEdit, onPressEdit,
  editable = true,
}: any) {

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      {editing ? (
        <TextInput
          value={editValue}
          onChangeText={onChangeEdit}
          style={styles.input}
        />
      ) : (
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyValue}>{value ?? '-'}</Text>

          {editable && onPressEdit && (
            <TouchableOpacity onPress={onPressEdit}>
              <Text style={styles.editBtn}>수정</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

function DocButton({ title, subtitle, bg }: any) {
  return (
    <TouchableOpacity style={[styles.docCard, { backgroundColor: bg }]} activeOpacity={0.8}>
      <View style={styles.docInner}>
        <View style={styles.docLeft}>
          <View style={styles.docIconCircle}>
            <Text style={styles.docIcon}>📄</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>{title}</Text>
            <Text style={styles.docSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

/* ---------------------------------------
   스타일
--------------------------------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },

  headerWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 8 },
  backArrow: { fontSize: 22, color: '#111827' },

  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 15,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardInner: { padding: 16 },

  profileWrapper: { alignItems: 'center' },

  avatarWrapper: { marginBottom: 10 },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: { fontSize: 32, color: '#2563EB', fontWeight: '700' },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: { color: '#fff' },

  nameText: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  jobText: { fontSize: 14, color: '#4B5563' },
  phoneText: { fontSize: 13, color: '#6B7280' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },

  label: { fontSize: 13, color: '#374151', marginBottom: 6 },

  readonlyBox: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readonlyValue: { fontSize: 14, color: '#111827' },

  editBtn: { color: '#2563EB', fontSize: 13 },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },

  docSection: { marginTop: 8 },

  docCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
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
    backgroundColor: '#FFF',
  },
  docIcon: { fontSize: 22 },
  docTitle: { fontSize: 14, color: '#111827', marginBottom: 2 },
  docSubtitle: { fontSize: 12, color: '#6B7280' },

  chevron: { fontSize: 20, color: '#9CA3AF' },

  saveBtn: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "600",
  },

  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  passwordTitle: { fontSize: 14, color: '#111827', marginBottom: 2 },
  passwordDesc: { fontSize: 12, color: '#6B7280' },
});