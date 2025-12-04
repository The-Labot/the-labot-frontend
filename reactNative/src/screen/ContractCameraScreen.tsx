// src/screen/ContractCameraScreen.tsx
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
import { uploadContractImage } from "../api/ocr";
import { useNavigation } from "@react-navigation/native";

// Lucide Icons (RN)
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Send,
} from "lucide-react-native";

export default function ContractCameraScreen() {
  const navigation = useNavigation<any>();

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
        console.log("📸 촬영된 이미지:", asset);
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

      const res = await uploadContractImage({
        uri: photo.uri,
        fileName: photo.fileName || "contract.jpg",
        type: photo.type || "image/jpeg",
      });

      setLoading(false);

      // 📌 OCR 성공 → OCR 데이터 + 사진 전달
      navigation.navigate("WorkerManagement", {
        ocrData: res,
        contractImage: photo,
      });
    } catch (err) {
      setLoading(false);
      console.log("❌ OCR 오류:", err);

      Alert.alert(
        "OCR 실패",
        "텍스트 인식은 실패했지만 사진은 정상적으로 저장됩니다."
      );

      // 📌 OCR 실패 → 사진만 전달
    navigation.navigate("ManagerHome", {
    activeTab: "worker-management",
    contractImage: photo,
  });
    }
  };

  // ------------------------
  // 🔵 OCR 안 하고 사진만 사용
  // ------------------------
  const usePhotoOnly = () => {
  if (!photo) return;
  navigation.navigate("ManagerHome", {
    activeTab: "worker-management",
    contractImage: photo,
  });
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
            style={{
              marginTop: 16,
              color: "#111827",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            계약서 촬영 가이드
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
              backgroundColor: "#ECFDF5",
              borderWidth: 1,
              borderColor: "#D1FAE5",
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
                  backgroundColor: "#ECFDF5",
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Camera size={40} color="#10B981" />
              </View>

              <Text style={{ color: "#6B7280" }}>
                문서 전체가 보이도록 촬영해주세요
              </Text>
            </View>
          </View>

          {/* Do / Don't */}
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
                <CheckCircle2 color="#059669" size={24} />
                <Text style={{ fontSize: 16, fontWeight: "600" }}>이렇게 촬영해주세요</Text>
              </View>
              <View style={{ marginTop: 16 }}>
                {[
                  "계약서를 평평하게 펼쳐서 촬영해주세요",
                  "문서 전체가 화면에 들어오도록 촬영해주세요",
                  "텍스트가 선명하게 읽히도록 촬영해주세요",
                  "여러 페이지는 순서대로 촬영해주세요",
                ].map((t, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <Text style={{ color: "#374151" }}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Don't */}
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
                <AlertCircle color="#DC2626" size={24} />
                <Text style={{ fontSize: 16, fontWeight: "600" }}>주의사항</Text>
              </View>

              <View style={{ marginTop: 16 }}>
                {[
                  "접힌 부분이 없도록 주의해주세요",
                  "다른 문서와 겹치지 않도록",
                  "손가락이 문서에 닿지 않도록",
                  "너무 가깝거나 멀리서 촬영하지 마세요",
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
                backgroundColor: "#10B981",
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
          style={{
            marginTop: 16,
            color: "#111827",
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          계약서 촬영
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

            {/* OCR 없이 이동시키면 에러나니까 비활성화 */}
            <TouchableOpacity
              disabled
              style={{
                marginTop: 32,
                backgroundColor: "#9CA3AF",
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
            {/* 이미지 미리보기 */}
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

            {/* 버튼 3개 */}
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

                {/* 사진만 사용하기 */}
                <TouchableOpacity
                  onPress={usePhotoOnly}
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
                  <Text style={{ color: "#fff" }}>사진만 사용하기</Text>
                </TouchableOpacity>

                {/* OCR 보내기 */}
                <TouchableOpacity
                  onPress={sendToOCR}
                  style={{
                    flex: 1,
                    backgroundColor: "#10B981",
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
              /* 로딩 */
              <View
                style={{
                  backgroundColor: "#ECFDF5",
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#D1FAE5",
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
                    borderTopColor: "#10B981",
                    borderRadius: 999,
                    marginBottom: 12,
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