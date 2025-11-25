// 📌 src/worker/HazardReportScreen.tsx

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { StyleSheet } from "react-native";
import { getTempAccessToken } from "../api/auth";
import { BASE_URL } from "../api/config";

export default function HazardReportScreen({ navigation }: any) {
  const [hazardType, setHazardType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);

  const [photo, setPhoto] = useState<any>(null);

  // ================================
  // 📌 이미지 선택
  // ================================
    const pickImage = async () => {
    const fakePhoto = {
      uri: "https://picsum.photos/640/480",
      type: "image/jpeg",
      fileName: "hazard_test.jpg",
    };

    setPhoto(fakePhoto);
    Alert.alert("테스트 이미지가 선택되었습니다!");
  };

  // ================================
  // 📌 위험요소 신고 API
  // ================================
const submitHazard = async () => {
  try {
    console.log("=== 🔥 [HazardSubmit] START ===");
    console.log("입력값:", { hazardType, location, description, urgent, photo });

    if (!hazardType || !location || !description || !photo) {
      Alert.alert("오류", "모든 필드를 입력하고 사진을 첨부해주세요!");
      return;
    }

    const token = getTempAccessToken();
    console.log("토큰:", token);

    if (!token) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }

    // 🔥 FormData 로그 찍기
    const formData = new FormData();
    formData.append("hazardType", hazardType);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("urgent", urgent.toString());

    const fileToUpload: any = {
      uri: photo.uri,
      type: photo.type || "image/jpeg",
      name: photo.fileName || "hazard.jpg",
    };

    formData.append("file", fileToUpload as any);

    console.log("전송할 파일 정보:", fileToUpload);

    console.log("=== 🔥 [HazardSubmit] Fetch 요청 시작 ===");

    const response = await fetch(`${BASE_URL}/worker/hazards`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    console.log("=== 🔥 [HazardSubmit] Fetch 응답 도착 ===");
    console.log("응답 status:", response.status);
    console.log("응답 ok:", response.ok);
    console.log("응답 headers:", response.headers);

    const resultText = await response.text();
    console.log("🔥 서버 응답 원본 TEXT:", resultText);

    let json = null;
    try {
      json = JSON.parse(resultText);
      console.log("🔥 서버 응답 JSON:", json);
    } catch (e) {
      console.log("⚠ JSON 파싱 실패 — 서버가 JSON을 안줌:", e);
    }

    // ❗ 실패 처리
    if (!response.ok) {
      const errorMsg =
        json?.message ||
        `서버 오류 발생 (status ${response.status})`;
      Alert.alert("오류", errorMsg);
      return;
    }

    // 성공 처리
    Alert.alert("성공", "위험요소 신고가 등록되었습니다!", [
      { text: "확인", onPress: () => navigation.goBack() },
    ]);
  } catch (err) {
    console.log("🔥 [HazardSubmit] CATCH ERROR:", err);
    Alert.alert("오류", `신고 중 문제가 발생했습니다.\n${String(err)}`);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
        위험요소 신고
      </Text>

      {/* 위험 유형 */}
      <TextInput
        placeholder="위험 유형 (예: Electric Shock)"
        value={hazardType}
        onChangeText={setHazardType}
        style={{ backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />

      {/* 위치 */}
      <TextInput
        placeholder="위치 (예: 3층 계단)"
        value={location}
        onChangeText={setLocation}
        style={{ backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />

      {/* 설명 */}
      <TextInput
        placeholder="설명"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ backgroundColor: "#fff", padding: 12, borderRadius: 8, height: 200, marginBottom: 12 }}
      />

      {/* 긴급 여부 */}
      <TouchableOpacity
        onPress={() => setUrgent(!urgent)}
        style={{
          padding: 12,
          borderRadius: 8,
          backgroundColor: urgent ? "#FCA5A5" : "#E5E7EB",
          marginBottom: 12,
        }}
      >
        <Text>{urgent ? "긴급: 예" : "긴급: 아니오"}</Text>
      </TouchableOpacity>

      {/* 이미지 선택 */}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: "#93C5FD",
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>사진 선택</Text>
      </TouchableOpacity>

      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={{ width: "100%", height: 200, borderRadius: 8, marginBottom: 20 }}
        />
      )}

      {/* 제출 버튼 */}
      <TouchableOpacity
        onPress={submitHazard}
        style={{
          backgroundColor: "#e22424ff",
          padding: 16,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
          신고 제출
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


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