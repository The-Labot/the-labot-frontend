// 📌 src/worker/WorkerNoticeDetail.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";

import { BASE_URL } from "../api/config";
import { getTempAccessToken } from "../api/auth";
import ScreenWrapper from "../ScreenWrapper";

export default function WorkerNoticeDetail({ route, navigation }: any) {
  const { noticeId } = route.params;
  const [detail, setDetail] = useState<any>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const fetchDetail = async () => {
    try {
      const token = getTempAccessToken();
      const res = await fetch(`${BASE_URL}/worker/notices/${noticeId}`, {
        headers: { Authorization: token },
      });

      const text = await res.text();
      const json = JSON.parse(text);

      setDetail(json); // 절대 바꾸면 안됨
    } catch (err) {
      console.log("❌ 상세조회 오류:", err);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const getTagStyle = (category: string) => {
    switch (category) {
      case "SITE":
        return { bg: "#E8FBEF", color: "#16A34A" };
      case "SAFETY":
        return { bg: "#FEE2E2", color: "#DC2626" };
      default:
        return { bg: "#E5E7EB", color: "#374151" };
    }
  };

  if (!detail) {
    return (
      <ScreenWrapper>
        <Text style={{ padding: 20 }}>불러오는 중...</Text>
      </ScreenWrapper>
    );
  }

  const { bg, color } = getTagStyle(detail.category);

  return (
    <ScreenWrapper>
      {/* ===== Header ===== */}
      <View style={styles.header} pointerEvents="box-none">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>공지 상세</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ───────────────────────────────
            Title Card
        ─────────────────────────────── */}
        <View style={styles.card}>
          <View
            style={[styles.tag, { backgroundColor: bg }]}
          >
            <Text style={[styles.tagText, { color }]}>{detail.category}</Text>
          </View>

          <Text style={styles.title}>{detail.title}</Text>
        </View>

        {/* ───────────────────────────────
            Meta Info Card
        ─────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>작성자</Text>
              <Text style={styles.metaValue}>{detail.writerName}</Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>작성일</Text>
              <Text style={styles.metaValue}>
                {detail.createdDate?.split("T")[0]}
              </Text>
            </View>
          </View>
        </View>

        {/* ───────────────────────────────
            Content Card
        ─────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>내용</Text>
          <Text style={styles.contentText}>{detail.content}</Text>
        </View>

        {/* ───────────────────────────────
            Attached Images Card
        ─────────────────────────────── */}
        {detail.files && detail.files.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>첨부 이미지</Text>

            <View style={{ gap: 12 }}>
              {detail.files.map((file: any, idx: number) => {
                const url = file.fileUrl;

                const isImage =
                  url.endsWith(".jpg") ||
                  url.endsWith(".jpeg") ||
                  url.endsWith(".png");

                if (!isImage) return null;

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setImagePreviewUrl(url)}
                  >
                    <Image
                      source={{ uri: url }}
                      style={styles.attachedImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 🔥 이미지 전체 확대 모달 */}
      <Modal
        visible={!!imagePreviewUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setImagePreviewUrl(null)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setImagePreviewUrl(null)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: imagePreviewUrl! }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

/* ------------------------------------------------------
   스타일 — 피그마 스타일 100% 동일하게 구성
------------------------------------------------------ */

const styles = StyleSheet.create({
  /* HEADER */
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackBtn: { padding: 6 },
  backIcon: { fontSize: 24, fontWeight: "600", color: "#111" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: -24,
  },

  scrollContent: {
    padding: 16,
    gap: 16,
  },

  /* CARD UI */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  /* TAG */
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 12,
  },
  tagText: { fontSize: 13, fontWeight: "600" },

  /* TITLE */
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  /* META INFO */
  metaRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 30,
  },
  metaItem: { flexDirection: "row", gap: 6 },
  metaLabel: { color: "#6B7280", fontSize: 14 },
  metaValue: { color: "#111", fontSize: 14, fontWeight: "500" },

  /* CONTENT */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111",
  },
  contentText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },

  /* ATTACHED IMAGES */
  attachedImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },

  /* MODAL */
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  modalCloseText: { fontSize: 32, color: "#fff" },
  modalImage: {
    width: "100%",
    height: "80%",
  },
});