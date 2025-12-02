// src/screen/IdCardCameraScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { launchCamera } from "react-native-image-picker";
import { uploadIdCardImage } from "../api/ocr";
import { useNavigation } from "@react-navigation/native";

export default function IdCardCameraScreen() {
  const [photo, setPhoto] = useState<any>(null);
  const navigation = useNavigation<any>();

  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: "photo",
      includeBase64: true,   // ← base64는 받아두지만 전송에 사용하지 않음
      cameraType: "back",
      quality: 0.8,
    });

    if (result.didCancel) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert("에러", "사진 촬영 실패");
      return;
    }

    console.log("📸 촬영된 이미지:", asset);
    setPhoto(asset);
  };

  const handleOCR = async () => {
    if (!photo?.uri) return;

    try {
      console.log("🔥 OCR 요청 시작");
      const res = await uploadIdCardImage(photo);

      Alert.alert("완료", "OCR이 완료되었습니다!");

      navigation.navigate("WorkerManagement", {
        idCardData: res,
      });

    } catch (err: any) {
      console.log("❌ 신분증 OCR 오류:", err);
      Alert.alert("에러", "OCR 처리 중 문제 발생\n" + err?.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {photo ? (
        <>
          <Image
            source={{ uri: photo.uri }}
            style={{
              width: "100%",
              height: 400,
              borderRadius: 10,
              marginBottom: 20,
            }}
          />

          <TouchableOpacity
            onPress={handleOCR}
            style={{
              padding: 16,
              backgroundColor: "#2563EB",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>OCR 보내기</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={openCamera}>
          <Text>카메라 열기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}