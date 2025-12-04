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
  Image
  ,Modal
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getTempAccessToken, setTempAccessToken } from '../api/auth';
import { BASE_URL } from "../api/config";
import ScreenWrapper from '../ScreenWrapper';

// 🔵 근로자 파일 조회 API
async function fetchMyFile(fileId: number) {
  const token = getTempAccessToken();
  console.log("🔑 토큰:", token);
  console.log("📡 파일 조회 API 호출:", `${BASE_URL}/worker/mypage/files/${fileId}`);

  if (!token) throw new Error("토큰 없음");

  const res = await fetch(`${BASE_URL}/worker/files/${fileId}`, {
    method: "GET",
    headers: { Authorization: token },
  });
    console.log("📥 상태 코드:", res.status);

  const text = await res.text();
    console.log("📥 응답 RAW:", text);

  return JSON.parse(text); // { id, fileUrl, originalFileName }
}

type Props = NativeStackScreenProps<RootStackParamList, 'WorkerMyPage'>;
interface FileResponse {
  id: number;
  fileUrl: string;
  originalFileName: string;
}

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

  // ⬇️ 여기 완전 변경됨!!
  contractFile: FileResponse | null;
  payrollFiles: FileResponse[];
  certificateFiles: FileResponse[];
}

const MyPageScreen: React.FC<Props> = ({ navigation }) => {
  const [data, setData] = useState<WorkerMyPageData | null>(null);

  // 전체 수정 모드
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Partial<WorkerMyPageData>>({});


  const [contractPreviewUrl, setContractPreviewUrl] = useState("");
  const [contractPreviewOpen, setContractPreviewOpen] = useState(false);

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
      setEditedValues(json);

    } catch (err) {
      Alert.alert("에러", "마이페이지 데이터를 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    loadMyPage();
  }, []);

  // PATCH — 수정 가능한 항목만 전송
  async function saveAllEdits() {
    try {
      const token = getTempAccessToken();

      const patchBody: any = {
        address: editedValues.address,
        phoneNumber: editedValues.phone,
        emergencyNumber: editedValues.emergencyNumber,
        bankName: editedValues.bankName,
        accountNumber: editedValues.accountNumber,
        accountHolder: editedValues.accountHolder,
      };
      console.log("📤 PATCH 요청 보냄:", patchBody);
      const res = await fetch(`${BASE_URL}/worker/mypage`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(patchBody),
      });

      const json = await res.json();
      console.log("📨 PATCH 응답:", res.status, json);
      if (!res.ok) {
        Alert.alert("수정 실패", json.message || "오류 발생");
        return;
      }

      setData(prev => ({ ...(prev as any), ...patchBody }));
      console.log("🟢 화면 데이터 업데이트됨:", patchBody);
      setIsEditing(false);

      Alert.alert("성공", "정보가 수정되었습니다.");

    } catch (err) {
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    }
  }
  async function openContractFile() {
  try {
    if (!data?.contractFile?.id) {
      console.log("🚫 contractFile 없음:", data?.contractFile);
      Alert.alert("계약서 없음", "등록된 계약서 파일이 없습니다.");
      return;
    }

    const fileId = data.contractFile.id;
    console.log("📄 파일 조회:", fileId);

    const res = await fetchMyFile(fileId);

    setContractPreviewUrl(res.fileUrl);
    setContractPreviewOpen(true);

  } catch (e) {
    console.log("❌ 파일 조회 실패:", e);
    Alert.alert("에러", "계약서를 불러올 수 없습니다.");
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

  const handleChange = (field: keyof WorkerMyPageData, value: string) => {
    setEditedValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScreenWrapper>
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

        {/* 프로필 카드 */}
        <View style={styles.card}>
          <View style={styles.cardInner}>
            <View style={styles.profileWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {data.name?.[0] ?? '?'}
                </Text>
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

            {/* 개인정보 + 수정 버튼 */}
            <View style={styles.infoHeaderRow}>
              <Text style={styles.sectionTitle}>개인정보</Text>

              {!isEditing && (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.editAllBtn}>수정</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 주소 */}
            <FieldRow
              label="주소"
              editing={isEditing}
              value={editedValues.address}
              onChangeText={(t: string) => handleChange("address", t)}
            />

            {/* 수정 불가 항목 */}
            <FieldRow label="생년월일" value={data.birthDate} editing={false} />
            <FieldRow label="성별" value={data.gender} editing={false} />
            <FieldRow label="국적" value={data.nationality} editing={false} />

            {/* 수정 가능 항목 */}
            <FieldRow
              label="전화번호"
              editing={isEditing}
              value={editedValues.phone}
              onChangeText={(t: string) => handleChange("phone", t)}
            />

            <FieldRow
              label="비상전화"
              editing={isEditing}
              value={editedValues.emergencyNumber}
              onChangeText={(t: string) => handleChange("emergencyNumber", t)}
            />

            <FieldRow label="직종" value={data.jobRole} editing={false} />
            <FieldRow label="현장명" value={data.siteName} editing={false} />

            <FieldRow
              label="은행명"
              editing={isEditing}
              value={editedValues.bankName}
              onChangeText={(t: string) => handleChange("bankName", t)}
            />

            <FieldRow
              label="계좌번호"
              editing={isEditing}
              value={editedValues.accountNumber}
              onChangeText={(t: string) => handleChange("accountNumber", t)}
            />

            <FieldRow
              label="예금주"
              editing={isEditing}
              value={editedValues.accountHolder}
              onChangeText={(t: string) => handleChange("accountHolder", t)}
            />

            {/* 저장 버튼 */}
            {isEditing && (
              <TouchableOpacity style={styles.saveBtn} onPress={saveAllEdits}>
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

        {/* 문서 — 계약서만 남김 */}
        <View style={styles.docSection}>
          <DocButton
            title="근로 계약서 보기"
            subtitle={`파일명: ${data.contractFile?.originalFileName ?? '없음'}`}
            onPress={openContractFile}
              bg="#EFF6FF"   // 연한 파란색

          />
        </View>

      </ScrollView>
      <Modal
  visible={contractPreviewOpen}
  transparent
  animationType="fade"
  onRequestClose={() => setContractPreviewOpen(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.9)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <TouchableOpacity
      onPress={() => setContractPreviewOpen(false)}
      style={{
        position: "absolute",
        top: 40,
        right: 40,
        padding: 10,
      }}
    >
      <Text style={{ fontSize: 32, color: "white" }}>✕</Text>
    </TouchableOpacity>

    <Image
      source={{ uri: contractPreviewUrl }}
      style={{ width: "90%", height: "80%" }}
      resizeMode="contain"
    />
  </View>
</Modal>

    </ScreenWrapper>

  );
};

export default MyPageScreen;

/* ---------------------------------------
   필드 컴포넌트
--------------------------------------- */
function FieldRow({ label, value, editing, onChangeText }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      {editing ? (
        <TextInput
          value={value ?? ""}
          onChangeText={onChangeText}
          style={styles.input}
        />
      ) : (
        <View style={styles.readonlyBox}>
          <Text style={styles.readonlyValue}>{value ?? '-'}</Text>
        </View>
      )}
    </View>
  );
}

function DocButton({ title, subtitle, bg, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.docCard, { backgroundColor: bg }]}
    >
      <View style={styles.docInner}>
        <View style={styles.docLeft}>
          <View style={styles.docIconCircle}>
            <Text style={styles.docIcon}>📄</Text>
          </View>
          <View>
            <Text style={styles.docTitle}>{title}</Text>
            <Text
  style={styles.docSubtitle}
  numberOfLines={1}
  ellipsizeMode="tail"
>
  {subtitle}
</Text>
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
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarInitial: { fontSize: 32, color: '#2563EB', fontWeight: '700' },

  nameText: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  jobText: { fontSize: 14, color: '#4B5563' },
  phoneText: { fontSize: 13, color: '#6B7280' },

  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editAllBtn: { color: '#2563EB', fontSize: 14, fontWeight: '500' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  },
  readonlyValue: { fontSize: 14, color: '#111827' },
  docSubtitle: {
  fontSize: 12,
  color: '#6B7280',
  maxWidth: 220,   // 필요하면 조절 가능
},
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


  chevron: { fontSize: 20, color: '#9CA3AF' },

  saveBtn: {
    marginTop: 12,
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
    marginTop: 14,
  },
  passwordTitle: { fontSize: 14, color: '#111827', marginBottom: 2 },
  passwordDesc: { fontSize: 12, color: '#6B7280' },
});