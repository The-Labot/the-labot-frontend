// src/ForgotPasswordScreen.tsx
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetPassword } from "./api/auth";   // ★ 추가

import * as AuthApi from "./api/auth";
console.log("AUTH API →", AuthApi);

type Props = NativeStackScreenProps<RootStackParamList, "ForgotPassword">;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async () => {
  if (!name.trim() || !phone.trim()) {
    Alert.alert("알림", "이름과 전화번호를 입력해주세요.");
    return;
  }

  try {
    const res = await resetPassword(name, phone);

    Alert.alert(
      "완료",
      "임시비밀번호를 발급하였습니다.",
      [
        {
          text: "확인",
          onPress: () => navigation.replace("Login"), // ★ 로그인 화면으로 이동
        },
      ]
    );
  } catch (err: any) {
    Alert.alert("오류", err.message || "임시비밀번호 발급 실패");
    }
    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* ← 로그인으로 돌아가기 */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backRow}
        >
          <Text style={styles.backText}>← 로그인으로 돌아가기</Text>
        </TouchableOpacity>

        {/* 카드 전체 */}
        <View style={styles.card}>
          <Text style={styles.title}>비밀번호 찾기</Text>
          <Text style={styles.description}>
            이름과 전화번호를 입력하면 임시 비밀번호를 전송해드립니다.
          </Text>

          {/* 이름 */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* 전화번호 */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={styles.input}
              placeholder="01012345678"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* 버튼 */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>임시 비밀번호 발급</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },

  // 뒤로가기
  backRow: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 14,
    color: "#4B5563",
  },

  // 카드
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },

  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 15,
  },

  submitButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});