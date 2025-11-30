import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

import {
  Canvas,
  Path,
  Skia,
  PaintStyle,
  Group,
  Image as SkiaImage,
  useImage,
  rect,
} from "@shopify/react-native-skia";

import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<RootStackParamList, "ContractWrite">;

export default function ContractWriteScreen({ route, navigation }: Props) {
  const { contractType } = route.params;

  const [pageIndex, setPageIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const { width, height } = Dimensions.get("window");

  // Path (사용자 필기)
  const [path, setPath] = useState(Skia.Path.Make());

  // Skia 이미지 로딩
  const daily1 = useImage(require("../assets/contract_daily_page1.png"));
  const daily2 = useImage(require("../assets/contract_daily_page2.png"));
  const monthly1 = useImage(require("../assets/contract_monthly_page1.png"));
  const monthly2 = useImage(require("../assets/contract_monthly_page2.png"));

  const pages = contractType === "일용직"
    ? [daily1, daily2]
    : [monthly1, monthly2];

  const currentImage = pages[pageIndex];

  // 펜 설정
  const paint = Skia.Paint();
  paint.setColor(Skia.Color("black"));
  paint.setStyle(PaintStyle.Stroke);
  paint.setStrokeWidth(4);
  paint.setAntiAlias(true);

  // === 터치 처리 (GestureHandler 사용) ===
 const onGestureEvent = (event: any) => {
  if (!isDrawing) return;

  const { x, y } = event.nativeEvent;
  const p = path.copy();

  // 처음 터치
  if (path.isEmpty()) {
    p.moveTo(x, y);
  } else {
    p.lineTo(x, y);
  }

  setPath(p);
};

  // === 저장 ===
  const saveDrawing = () => {
    if (!currentImage) return;

    const surface = Skia.Surface.MakeOffscreen(width, height * 0.75);
    const canvas = surface.getCanvas();

    // 배경 이미지
    const src = rect(0, 0, currentImage.width(), currentImage.height());
    const dst = rect(0, 0, width, height * 0.75);

    canvas.drawImageRect(currentImage, src, dst, paint);

    // 필기 Path
    canvas.drawPath(path, paint);

    // base64
    const snapshot = surface.makeImageSnapshot();
    const base64 = snapshot.encodeToBase64();

    Alert.alert("저장 완료", "OCR 전송용 이미지가 준비되었습니다.");
    console.log("OCR Base64 Preview:", base64.substring(0, 70));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>{"< 뒤로"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{contractType} 근로계약서</Text>
        </View>

        {/* 필기 버튼 */}
        <TouchableOpacity
          onPress={() => setIsDrawing(!isDrawing)}
          style={[
            styles.drawToggleBtn,
            { backgroundColor: isDrawing ? "#16A34A" : "#2563EB" },
          ]}
        >
          <Text style={styles.drawToggleText}>
            {isDrawing ? "필기 종료" : "필기 하기"}
          </Text>
        </TouchableOpacity>

        {/* 저장 버튼 */}
        {isDrawing && (
          <TouchableOpacity onPress={saveDrawing} style={styles.saveBtn}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        )}

        {/* Canvas + Gesture */}
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <View style={styles.drawContainer}>
            <Canvas style={styles.canvas}>
              {/* 배경: 계약서 이미지 */}
              {currentImage && (
                <SkiaImage
                  image={currentImage}
                  x={0}
                  y={0}
                  width={width}
                  height={height * 0.75}
                />
              )}

              {/* 사용자 필기 Path */}
              <Group>
                <Path path={path} paint={paint} />
              </Group>
            </Canvas>
          </View>
        </PanGestureHandler>

        {/* 페이지 이동 */}
        <View style={styles.pageControl}>
          <TouchableOpacity
            disabled={pageIndex === 0 || isDrawing}
            onPress={() => setPageIndex(0)}
            style={[styles.pageBtn, pageIndex === 0 && styles.disableBtn]}
          >
            <Text style={styles.pageBtnText}>1 페이지</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={pageIndex === 1 || isDrawing}
            onPress={() => setPageIndex(1)}
            style={[styles.pageBtn, pageIndex === 1 && styles.disableBtn]}
          >
            <Text style={styles.pageBtnText}>2 페이지</Text>
          </TouchableOpacity>
        </View>

      </View>
    </GestureHandlerRootView>
  );
}

const { width, height } = Dimensions.get("window");

// 스타일은 동일, 생략 가능

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },

  back: { fontSize: 16, color: "#2563EB", marginRight: 12 },
  title: { fontSize: 18, fontWeight: "600" },

  drawToggleBtn: {
    padding: 12,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
  },

  drawToggleText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },

  saveBtn: {
    padding: 12,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#0D9488",
  },

  saveText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },

  drawContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  canvas: {
    width: width,
    height: height * 0.75,
    backgroundColor: "white",
  },

  pageControl: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  pageBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    marginHorizontal: 10,
  },

  pageBtnText: { color: "white", fontWeight: "600" },

  disableBtn: {
    backgroundColor: "#94A3B8",
  },
});