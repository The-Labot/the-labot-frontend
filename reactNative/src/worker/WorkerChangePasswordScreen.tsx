// src/worker/WorkerChangePasswordScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import ScreenWrapper from "../ScreenWrapper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { getTempAccessToken } from "../api/auth";
import { BASE_URL } from "../api/config";

type Props = NativeStackScreenProps<RootStackParamList, "WorkerChangePassword">;

export default function WorkerChangePasswordScreen({ navigation }: Props) {
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPwCheck, setNewPwCheck] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // 🔥 비밀번호 변경 요청 함수
  // =========================================
  const handleSubmit = async () => {
    if (!oldPw || !newPw || !newPwCheck) {
      Alert.alert("오류", "모든 항목을 입력해주세요.");
      return;
    }
    if (newPw !== newPwCheck) {
      Alert.alert("오류", "새로운 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      const token = getTempAccessToken();

      const response = await fetch(`${BASE_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // 이미 "Bearer ..." 형태
        },
        body: JSON.stringify({
          oldPassword: oldPw,
          newPassword: newPw,
        }),
      });

      const json = await response.json();
      console.log("📌 비밀번호 변경 응답:", json);

      if (response.status === 200) {
        Alert.alert("완료", json.message || "비밀번호 변경 완료");
        navigation.goBack();
      } else {
        Alert.alert("실패", json.message || "비밀번호 변경 실패");
      }
    } catch (err) {
      console.log("🚨 비밀번호 변경 오류:", err);
      Alert.alert("오류", "서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        
        {/* 상단 뒤로가기 */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={22} color="#111" />
          <Text style={styles.backText}>로그인으로 돌아가기</Text>
        </TouchableOpacity>

        {/* 카드 */}
        <View style={styles.card}>
          <Text style={styles.title}>비밀번호 변경</Text>
          <Text style={styles.subtitle}>
            기존 비밀번호를 입력하면 새로운 비밀번호로 변경됩니다.
          </Text>

          {/* 기존 비밀번호 */}
          <Text style={styles.label}>기존 비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="기존 비밀번호"
            secureTextEntry
            value={oldPw}
            onChangeText={setOldPw}
          />

          {/* 새로운 비밀번호 */}
          <Text style={styles.label}>새로운 비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="새로운 비밀번호"
            secureTextEntry
            value={newPw}
            onChangeText={setNewPw}
          />

          {/* 새로운 비밀번호 확인 */}
          <Text style={styles.label}>새로운 비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="새로운 비밀번호 확인"
            secureTextEntry
            value={newPwCheck}
            onChangeText={setNewPwCheck}
          />

          {/* 버튼 */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && { opacity: 0.5 }]}
            disabled={loading}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>
              {loading ? "변경 중..." : "비밀번호 변경하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  backText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    marginTop: 14,
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
  },
  submitBtn: {
    marginTop: 26,
    backgroundColor: "#2563EB",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});