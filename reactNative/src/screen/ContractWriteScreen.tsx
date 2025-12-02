// ContractWriteScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { uploadContractImage } from "../api/ocr";
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

import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

type Props = NativeStackScreenProps<RootStackParamList, "ContractWrite">;
type SkiaPath = ReturnType<typeof Skia.Path.Make>;

export default function ContractWriteScreen({ route, navigation }: Props) {
  const { contractType } = route.params;

  const { width, height } = Dimensions.get("window");
  const canvasHeight = height * 0.75;

  const [pageIndex, setPageIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  const [paths, setPaths] = useState<SkiaPath[][]>([[], []]);
  const [currentPath, setCurrentPath] = useState<SkiaPath | null>(null);

  // Images
  const daily1 = useImage(require("../assets/contract_daily_page1.png"));
  const daily2 = useImage(require("../assets/contract_daily_page2.png"));
  const monthly1 = useImage(require("../assets/contract_monthly_page1.png"));
  const monthly2 = useImage(require("../assets/contract_monthly_page2.png"));

  const pages =
    contractType === "일용직"
      ? [daily1, daily2]
      : [monthly1, monthly2];

  const currentImage = pages[pageIndex];

  // Pen (필기)
  const pen = Skia.Paint();
  pen.setColor(Skia.Color("black"));
  pen.setStyle(PaintStyle.Stroke);
  pen.setStrokeWidth(4);
  pen.setAntiAlias(true);

  // ====== MOVE 이벤트 ======
  const onGestureEvent = (event: any) => {
    if (!isDrawing || !currentPath) return;
    const { x, y } = event.nativeEvent;

    if (!currentPath) {
    const newPath = Skia.Path.Make();
    newPath.moveTo(x, y);
    setCurrentPath(newPath);
    return;
  }
    
    const p = currentPath.copy();
    p.lineTo(x, y);
    setCurrentPath(p);
  };

  // ====== START / END 이벤트 ======
  const onHandlerStateChange = (event: any) => {
    const { x, y, state } = event.nativeEvent;

    if (!isDrawing) return;

    if (state === State.BEGAN) {
      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);
      setCurrentPath(newPath);
    }

    if (state === State.END) {
      if (currentPath) {
        const updated = [...paths];
        updated[pageIndex] = [...updated[pageIndex], currentPath];
        setPaths(updated);
        setCurrentPath(null);
      }
    }
  };

  // Undo
  const undo = () => {
    const updated = [...paths];
    if (updated[pageIndex].length > 0) {
      updated[pageIndex].pop();
      setPaths(updated);
    }
  };

  // 이미지 + 필기 합성 후 Base64 추출
  const savePageImage = (index: number) => {
    const img = pages[index];
    if (!img) return null;

    const surface = Skia.Surface.MakeOffscreen(width, canvasHeight);
    const canvas = surface.getCanvas();

    const src = rect(0, 0, img.width(), img.height());
    const dst = rect(0, 0, width, canvasHeight);

    const paint = Skia.Paint();
    paint.setColor(Skia.Color("black"));
    paint.setStyle(PaintStyle.Stroke);
    paint.setStrokeWidth(4);

    canvas.drawImageRect(img, src, dst, paint);

    paths[index].forEach((p) => canvas.drawPath(p, paint));

    return surface.makeImageSnapshot().encodeToBase64();
  };

  // ⭐⭐⭐ OCR 업로드 버튼 기능 구현 ⭐⭐⭐
  const saveDrawing = async () => {
  try {
    const base64 = savePageImage(pageIndex);

    if (!base64) {
      Alert.alert("에러", "이미지를 불러올 수 없습니다.");
      return;
    }

    console.log("📤 OCR 업로드 시작");

    const res = await uploadContractImage(base64);

    console.log("📥 OCR 응답:", res);

    // 🔥 res.data가 아니라 res 자체가 OCR 객체
    if (!res) {
      Alert.alert("OCR 실패", "서버에서 OCR 데이터를 받지 못했습니다.");
      return;
    }

    Alert.alert("완료", "OCR 결과를 불러왔습니다!");

    // 🔥 그대로 전달
    navigation.navigate("WorkerManagement", { ocrData: res });

  } catch (err) {
    console.log("❌ OCR 업로드 중 오류:", err);
    Alert.alert("오류", "OCR 처리 중 문제가 발생했습니다.");
  }
};

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>{"< 뒤로"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{contractType} 근로계약서</Text>
        </View>

        

        {isDrawing && (
          <TouchableOpacity onPress={undo} style={styles.undoBtn}>
            <Text style={styles.drawToggleText}>되돌리기</Text>
          </TouchableOpacity>
        )}

        {/* ⭐ 저장 = OCR 업로드 */}
        <TouchableOpacity onPress={saveDrawing} style={styles.saveBtn}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <View style={styles.drawContainer}>
            <Canvas style={styles.canvas}>
              {currentImage && (
                <SkiaImage
                  image={currentImage}
                  x={0}
                  y={0}
                  width={width}
                  height={canvasHeight}
                />
              )}

              <Group>
                {paths[pageIndex].map((p, idx) => (
                  <Path key={idx} path={p} paint={pen} />
                ))}
                {currentPath && <Path path={currentPath} paint={pen} />}
              </Group>
            </Canvas>
          </View>
        </PanGestureHandler>

        <View style={styles.pageControl}>
          <TouchableOpacity
            disabled={pageIndex === 0}
            onPress={() => setPageIndex(0)}
            style={[styles.pageBtn, pageIndex === 0 && styles.disableBtn]}
          >
            <Text style={styles.pageBtnText}>1 페이지</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={pageIndex === 1}
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

  undoBtn: {
    padding: 12,
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#F59E0B",
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
    width,
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