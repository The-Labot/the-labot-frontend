// src/screen/IdCardCameraScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import { uploadIdCardImage } from "../api/ocr";
import { useNavigation, useRoute } from "@react-navigation/native";

// Lucide Icons
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Send,
} from "lucide-react-native";

export default function IdCardCameraScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();   // ✅ 이 줄 추가

  const [step, setStep] = useState<"guide" | "capture">("guide");
  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ------------------------
  // 📸 카메라 촬영
  // ------------------------
  const openCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: "photo",
        includeBase64: false,
        quality: 0.8,
      });

      if (result.didCancel) return;

      const asset = result.assets?.[0];
      if (asset) {
        console.log("📸 촬영된 신분증:", asset);
        setPhoto(asset);
      }
    } catch (err) {
      console.log("❌ 카메라 오류:", err);
    }
  };

  // ------------------------
  // 📤 OCR 전송
  // ------------------------
  const sendToOCR = async () => {
    if (!photo?.uri) return;

    try {
      setLoading(true);

      const res = await uploadIdCardImage({
        uri: photo.uri,
        fileName: photo.fileName || "idcard.jpg",
        type: photo.type || "image/jpeg",
      });

      setLoading(false);

      // ✅ WorkerManagement에서 내려준 콜백 호출
      route.params?.onOcrDone?.(res);

      // ✅ 새 WorkerManagement 열지 말고, 원래 화면으로 돌아가기
      navigation.goBack();
    } catch (err) {
      setLoading(false);
      console.log("❌ 신분증 OCR 오류:", err);
      Alert.alert("에러", "OCR 처리 중 문제가 발생했습니다.");
    }
  };

  // ------------------------
  // 🔙 뒤로가기
  // ------------------------
  const goBack = () => navigation.goBack();

  // ============================================================
  // ======================= GUIDE SCREEN ========================
  // ============================================================
  if (step === "guide") {
    return (
      <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <TouchableOpacity
            onPress={goBack}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            <ArrowLeft size={20} color="#4B5563" />
            <Text style={{ color: "#4B5563", fontSize: 16 }}>이전으로</Text>
          </TouchableOpacity>

          <Text
            style={{ marginTop: 16, color: "#111827", fontSize: 20, fontWeight: "700" }}
          >
            신분증 촬영 가이드
          </Text>

          <Text style={{ color: "#6B7280", marginTop: 4 }}>
            촬영 전 아래 가이드를 확인해주세요
          </Text>
        </View>

        {/* Body */}
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          {/* Guide Box */}
          <View
            style={{
              backgroundColor: "#EFF6FF",
              borderWidth: 1,
              borderColor: "#DBEAFE",
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "#111827",
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 16,
              }}
            >
              촬영 예시
            </Text>

            <View
              style={{
                backgroundColor: "#fff",
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: "#D1D5DB",
                borderRadius: 12,
                padding: 36,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "#EFF6FF",
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Camera size={40} color="#2563EB" />
              </View>

              <Text style={{ color: "#6B7280" }}>
                신분증을 프레임 안에 맞춰주세요
              </Text>
            </View>
          </View>

          {/* Do / Dont */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            {/* Do */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "#D1FAE5",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 color="#059669" size={24} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>이렇게 촬영해주세요</Text>
              </View>

              <View style={{ marginTop: 16 }}>
                {[
                  "신분증을 평평한 곳에 놓고 촬영해주세요",
                  "조명이 밝은 곳에서 촬영해주세요",
                  "신분증의 네 모서리가 모두 보이도록 촬영해주세요",
                  "초점이 맞고 글씨가 선명하게 보이도록 촬영해주세요",
                ].map((t, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <Text style={{ color: "#374151" }}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Dont */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "#FEE2E2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlertCircle color="#DC2626" size={24} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>주의사항</Text>
              </View>

              <View style={{ marginTop: 16 }}>
                {[
                  "반사광이 생기지 않도록 주의해주세요",
                  "그림자가 지지 않도록 주의해주세요",
                  "흔들림 없이 촬영해주세요",
                  "훼손되거나 구겨진 부분이 없도록 주의해주세요",
                ].map((t, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
                    <AlertCircle size={18} color="#DC2626" />
                    <Text style={{ color: "#374151" }}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Button */}
          <View style={{ marginTop: 36, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setStep("capture")}
              style={{
                backgroundColor: "#2563EB",
                paddingVertical: 14,
                paddingHorizontal: 48,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Camera size={22} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 18 }}>촬영 시작하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ============================================================
  // ======================= CAPTURE SCREEN ======================
  // ============================================================
  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={goBack}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <ArrowLeft size={20} color="#4B5563" />
          <Text style={{ color: "#4B5563", fontSize: 16 }}>이전으로</Text>
        </TouchableOpacity>

        <Text
          style={{ marginTop: 16, color: "#111827", fontSize: 20, fontWeight: "700" }}
        >
          신분증 촬영
        </Text>

        <Text style={{ color: "#6B7280", marginTop: 4 }}>
          파일을 업로드하거나 촬영해주세요
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* ================== 촬영 전 ================== */}
        {!photo && (
          <>
            <TouchableOpacity
              onPress={openCamera}
              style={{
                backgroundColor: "#fff",
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: "#D1D5DB",
                borderRadius: 20,
                minHeight: 360,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Camera size={64} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={sendToOCR}
              style={{
                marginTop: 32,
                backgroundColor: "#2563EB",
                paddingVertical: 14,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Send size={20} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 16 }}>OCR 등록</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ================== 촬영 후 ================== */}
        {photo && (
          <>
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#111827",
                  fontWeight: "600",
                  marginBottom: 12,
                }}
              >
                촬영된 이미지
              </Text>

              <Image
                source={{ uri: photo.uri }}
                style={{
                  width: "100%",
                  height: 480,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 12,
                }}
                resizeMode="contain"
              />
            </View>

            {!loading ? (
              <View style={{ flexDirection: "row", gap: 12 }}>
                {/* 다시 촬영 */}
                <TouchableOpacity
                  onPress={() => setPhoto(null)}
                  style={{
                    flex: 1,
                    backgroundColor: "#F3F4F6",
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <RotateCw size={20} color="#111827" />
                  <Text style={{ color: "#111827" }}>재촬영</Text>
                </TouchableOpacity>

                {/* OCR 보내기 */}
                <TouchableOpacity
                  onPress={sendToOCR}
                  style={{
                    flex: 1,
                    backgroundColor: "#2563EB",
                    paddingVertical: 14,
                    borderRadius: 12,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Send size={20} color="#fff" />
                  <Text style={{ color: "#fff" }}>OCR 보내기</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#EFF6FF",
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#DBEAFE",
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderWidth: 4,
                    borderColor: "#D1D5DB",
                    borderTopColor: "#2563EB",
                    borderRadius: 999,
                    marginBottom: 12,
                    alignSelf: "center",
                  }}
                />
                <Text style={{ color: "#111827" }}>OCR 처리 중입니다...</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}