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
  ScrollView,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { StyleSheet } from "react-native";
import { getTempAccessToken } from "../api/auth";
import { BASE_URL } from "../api/config";
import ScreenWrapper from '../ScreenWrapper';

export default function HazardReportScreen({ navigation }: any) {
  const [hazardType, setHazardType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [photo, setPhoto] = useState<any>(null);

  // ============================
  // 📌 이미지 선택
  // ============================
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 1,
    });

    if (result.didCancel) return;

    const asset = result.assets?.[0];
    if (!asset) return;

    setPhoto({
      uri: asset.uri,
      type: asset.type,
      fileName: asset.fileName,
    });
  };

  // ============================
  // 📌 위험요소 신고 API
  // ============================
  const submitHazard = async () => {
    try {
      if (!hazardType || !location || !description) {
        Alert.alert("오류", "모든 필드를 입력해주세요!");
        return;
      }

      const token = getTempAccessToken();
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("hazardType", hazardType);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("urgent", urgent.toString());

      if (photo) {
        formData.append("files", {
          uri: photo.uri,
          type: photo.type || "image/jpeg",
          name: photo.fileName || "hazard.jpg",
        } as any);
      }

      const response = await fetch(`${BASE_URL}/worker/hazards`, {
        method: "POST",
        headers: { Authorization: token },
        body: formData,
      });

      const resultText = await response.text();
      let json = null;
      try {
        json = JSON.parse(resultText);
      } catch {}

      if (!response.ok) {
        Alert.alert("오류", json?.message || "서버 오류가 발생했습니다.");
        return;
      }

      Alert.alert("성공", "위험요소 신고가 등록되었습니다!", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("오류", `신고 중 문제가 발생했습니다.\n${String(err)}`);
    }
  };

  return (
  <ScreenWrapper>

      {/* 헤더 */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle}>위험요소 신고</Text>
          </View>
        </View>
      </View>

      {/* 🔥 전체 스크롤 가능 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        {/* 🔥 제목 */}
        <Text style={styles.label}>제목</Text>
        <TextInput
          placeholder="위험 유형 (예: Electric Shock)"
          value={hazardType}
          onChangeText={setHazardType}
          style={styles.inputBox}
        />

        {/* 🔥 위치 */}
        <Text style={styles.label}>위치</Text>
        <TextInput
          placeholder="위치 (예: 3층 계단)"
          value={location}
          onChangeText={setLocation}
          style={styles.inputBox}
        />

        {/* 🔥 설명 */}
        <Text style={styles.label}>설명</Text>
        <TextInput
          placeholder="설명"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.textArea}
        />

        {/* 긴급 여부 */}
        <TouchableOpacity
          onPress={() => setUrgent(!urgent)}
          style={[styles.urgentBtn, urgent ? styles.urgentYes : styles.urgentNo]}
        >
          <Text>{urgent ? "긴급: 예" : "긴급: 아니오"}</Text>
        </TouchableOpacity>

        {/* 이미지 선택 */}
        <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>사진 선택</Text>
        </TouchableOpacity>

        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={styles.previewImage}
          />
        )}

        {/* 제출 버튼 */}
        <TouchableOpacity onPress={submitHazard} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>신고 제출</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenWrapper>

  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  backArrow: {
    fontSize: 22,
    color: "#111827",
  },
  headerTextWrapper: { flex: 1 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  // 🔥 Label 스타일
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
    marginTop: 8,
  },

  inputBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB", // 연한 회색
  },

  textArea: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    height: 200,
    marginBottom: 12,
    borderWidth: 1,
  borderColor: "#D1D5DB",
  },

  urgentBtn: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  urgentYes: {
    backgroundColor: "#FCA5A5",
  },
  urgentNo: {
    backgroundColor: "#E5E7EB",
  },

  photoButton: {
    backgroundColor: "#93C5FD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  photoButtonText: { color: "#fff", textAlign: "center" },

  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
  },

  submitButton: {
    backgroundColor: "#e22424ff",
    padding: 16,
    borderRadius: 10,
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});