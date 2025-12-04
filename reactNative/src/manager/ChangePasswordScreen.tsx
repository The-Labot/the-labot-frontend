// src/manager/ChangePasswordScreen.tsx
console.log("I am ChangePasswordScreen file loaded");
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { getTempAccessToken } from "../api/auth";
import { BASE_URL } from "../api/config";

type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

export default function ChangePasswordScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!currentPw || !newPw || !confirmPw) {
    Alert.alert("입력 오류", "모든 칸을 입력해주세요.");
    return;
  }

  if (newPw !== confirmPw) {
    Alert.alert("불일치", "새로운 비밀번호가 동일하지 않습니다.");
    return;
  }

  try {
    setLoading(true);

    const token = getTempAccessToken();
    if (!token) throw new Error("로그인이 필요합니다.");

    const res = await fetch(`${BASE_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, 
      },
      body: JSON.stringify({
        oldPassword: currentPw,
        newPassword: newPw,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      Alert.alert("오류", json.message ?? "비밀번호 변경 실패");
      return;
    }

    Alert.alert(
      "완료",
      "비밀번호가 성공적으로 변경되었습니다.",
      [{ text: "확인", onPress: () => navigation.goBack() }]
    );
  } catch (err: any) {
    Alert.alert("에러", err.message ?? "비밀번호 변경 실패");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 변경</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingHorizontal: isTablet ? 80 : 24, paddingTop: isTablet ? 40 : 20 },
        ]}
      >
        <Text style={styles.title}>비밀번호 변경</Text>
        <Text style={styles.subtitle}>
          기존 비밀번호를 입력하면 새로운 비밀번호로 변경됩니다.
        </Text>

        {/* 기존 비밀번호 */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>기존 비밀번호</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="기존 비밀번호"
            value={currentPw}
            onChangeText={setCurrentPw}
          />
        </View>

        {/* 새 비밀번호 */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>새로운 비밀번호</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="새로운 비밀번호"
            value={newPw}
            onChangeText={setNewPw}
          />
        </View>

        {/* 새 비밀번호 확인 */}
        <View style={styles.inputBox}>
          <Text style={styles.label}>새로운 비밀번호 확인</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="새로운 비밀번호 확인"
            value={confirmPw}
            onChangeText={setConfirmPw}
          />
        </View>

        {/* 변경 버튼 */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>비밀번호 변경하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },

  /* 헤더 */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backArrow: { fontSize: 20, color: "#4B5563", marginRight: 12 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "600" },

  container: { paddingBottom: 40 },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 30,
  },

  inputBox: { marginBottom: 20 },

  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    fontSize: 14,
  },

  submitBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});