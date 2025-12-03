// src/manager/ManagerAnnouncementsScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import { getTempAccessToken } from "../api/auth";
import { BASE_URL } from "../api/config";
import { launchImageLibrary } from "react-native-image-picker";

import {
  Megaphone,
  Pin,
  Calendar,
  User as UserIcon,
  FileText as FileTextIcon,
  Paperclip,
  AlertCircle,
  X
} from "lucide-react-native";

// 🔥 카테고리 타입
type Category = "safety" | "site" | "general";

// 🔥 공지 타입
interface Announcement {
  id: number;
  title: string;
  date: string;
  author: string;
  pinned: boolean;
  urgent: boolean;
  category: Category;
  preview: string;
  content: string;
  attachments?: string[];
}

export default function ManagerAnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selected, setSelected] = useState<Announcement | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

   // 🔥 이미지 전체보기 모달
const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // 작성/수정 폼
  const [draftTitle, setDraftTitle] = useState("");
  const [draftAuthor, setDraftAuthor] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category>("general");
  const [draftContent, setDraftContent] = useState("");
  const [draftPinned, setDraftPinned] = useState(false);
  const [draftUrgent, setDraftUrgent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // ================================
  // 🔥 카테고리 변환 (API 규격 유지)
  // ================================
  const parseCategory = (raw: string): Category => {
    const c = (raw || "").trim().toUpperCase();

    if (c === "SAFETY") return "safety";
    if (c === "SITE") return "site";
    if (c === "GENERAL") return "general";

    if (c === "안전") return "safety";
    if (c === "현장") return "site";
    if (c === "일반") return "general";

    return "general";
  };

  // ================================
  // 🔥 공지 목록 조회
  // ================================
  const fetchNotices = async () => {
    try {
      const token = getTempAccessToken();
      const res = await fetch(`${BASE_URL}/manager/notices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        Alert.alert("오류", json.message || "공지 목록 조회 실패");
        return;
      }

      const mapped = json.data.map((item: any) => {
        return {
          id: item.id,
          title: item.title,
          preview: item.title.slice(0, 25),
          content: "",
          date: item.createdAt.split("T")[0],
          author: item.writer,
          pinned: Boolean(item.pinned),
          urgent: Boolean(item.urgent),
          category: parseCategory(item.category),
        };
      });

      setAnnouncements(mapped);
    } catch (e) {
      console.log("공지 목록 오류:", e);
      Alert.alert("오류", "공지 목록을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ================================
  // 🔥 공지 상세 조회
  // ================================
 const fetchNoticeDetail = async (id: number) => {
  try {
    const token = getTempAccessToken();
    const res = await fetch(`${BASE_URL}/manager/notices/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const json = await res.json();
    if (!res.ok) {
      Alert.alert("오류", json.message || "상세 조회 실패");
      return;
    }

    const d = json.data;
    console.log("📌 상세조회 raw data:", d);
    // ⭐ 여기! 이 자리에서 확인해야 한다.
    console.log("📌 상세조회 attachments:", d.attachments);

    setSelected({
      id: d.id,
      title: d.title,
      preview: "",
      content: d.content,
      date: d.createdAt.split("T")[0],
      author: d.writer,
      pinned: Boolean(d.pinned),
      urgent: Boolean(d.urgent),
      category: parseCategory(d.category),
      attachments: (d.files || []).map((f: any) =>
        f.fileUrl.startsWith("http")
          ? f.fileUrl
          : `${BASE_URL}${f.fileUrl}`
      ),
    });

  } catch (e) {
    console.log("상세 조회 오류:", e);
    Alert.alert("오류", "상세 조회 실패");
  }
};

  // ================================
  // 🔥 이미지 선택
  // ================================
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (res) => {
      if (!res.didCancel && res.assets?.length) {
        setSelectedImage(res.assets[0]);
      }
    });
  };

  // ================================
  // 🔥 공지 생성
  // ================================
  const handleSubmit = async () => {
    if (!draftTitle.trim() || !draftContent.trim()) {
      Alert.alert("입력 오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const token = getTempAccessToken();
      const form = new FormData();

      form.append("title", draftTitle);
      form.append("content", draftContent);
      form.append("category", draftCategory.toUpperCase());
      form.append("urgent", String(draftUrgent));
      form.append("pinned", String(draftPinned));

      if (selectedImage) {
        form.append("files", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
          name: selectedImage.fileName || "image.jpg",
        } as any);
      }

      const res = await fetch(`${BASE_URL}/manager/notices`, {
        method: "POST",
        headers: { Authorization: token 
              ,"Content-Type": "multipart/form-data",

        },
        body: form,
      });

      const json = await res.json();
      if (!res.ok) {
        Alert.alert("등록 실패", json.message || "오류 발생");
        return;
      }

      const newId = json?.data?.noticeId ?? json?.data?.id;
      // ⭐ ID 없이 등록된 경우 — 목록만 리프레시하고 안전 종료
    if (!newId) {
      console.log("❌ ID 없음 — 이미지 없음 / 서버 응답 축약 가능성", json);
      fetchNotices();
      setIsCreating(false);
      return;
    }

      const newItem: Announcement = {
        id: newId,
        title: draftTitle,
        preview: draftContent.slice(0, 50),
        content: draftContent,
        author: draftAuthor || "관리자",
        date: new Date().toISOString().split("T")[0],
        pinned: draftPinned,
        urgent: draftUrgent,
        category: draftCategory,
      };

      setAnnouncements((prev) => [newItem, ...prev]);
      setSelected(newItem);
      setIsCreating(false);

    } catch (e) {
      console.log("등록 오류:", e);
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    }
  };

  // ================================
  // 🔥 공지 수정
  // ================================
  const handleEditSubmit = async () => {
    if (!selected) return;

    try {
      const token = getTempAccessToken();
      const form = new FormData();

      form.append("title", draftTitle);
      form.append("content", draftContent);
      form.append("category", draftCategory.toUpperCase());
      form.append("urgent", String(draftUrgent));
      form.append("pinned", String(draftPinned));

      if (selectedImage) {
        form.append("files", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
          name: selectedImage.fileName || "update.jpg",
        } as any);
      }

      const res = await fetch(`${BASE_URL}/manager/notices/${selected.id}`, {
        method: "PUT",
        headers: { Authorization: token ,"Content-Type": "multipart/form-data",},
        body: form,
      });

      let json = null;
      try {
        json = await res.json();
      } catch {}

      if (!res.ok) {
        Alert.alert("수정 실패", json?.message || "오류 발생");
        return;
      }

      Alert.alert("성공", "공지사항이 수정되었습니다.");
      setIsEditing(false);
      setIsCreating(false);
      setSelected(null);
      fetchNotices();
      fetchNoticeDetail(selected.id);
    } catch (e) {
      console.log("수정 오류:", e);
      Alert.alert("오류", "네트워크 오류가 발생했습니다.");
    }
  };

  // ================================
  // 🔥 공지 삭제
  // ================================
  const handleDelete = async (id: number) => {
    Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const token = getTempAccessToken();
            const res = await fetch(`${BASE_URL}/manager/notices/${id}`, {
              method: "DELETE",
              headers: { Authorization: token },
            });

            const json = await res.json();
            if (!res.ok) {
              Alert.alert("삭제 실패", json.message || "오류 발생");
              return;
            }

            fetchNotices();
            setSelected(null);
          } catch (e) {
            console.log("삭제 오류:", e);
          }
        },
      },
    ]);
  };

  // ================================
  // 🔥 Part 1 끝 — Part 2에서 UI 전체 구성 제공!
  // ================================
    // ================================
  // 🔥 UI - 카테고리 뱃지
  // ================================
  const renderCategoryBadge = (category: Category) => {
    const map: any = {
      safety: { label: "안전", color: "#EF4444", bg: "#FEE2E2" },
      site: { label: "현장", color: "#2563EB", bg: "#DBEAFE" },
      general: { label: "일반", color: "#6B7280", bg: "#F3F4F6" },
    };

    const info = map[category];
    return (
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 6,
          backgroundColor: info.bg,
        }}
      >
        <Text style={{ color: info.color, fontSize: 11 }}>{info.label}</Text>
      </View>
    );
  };

  // =========================================
  // 🔥 Part 2 UI 시작 — 전체 화면 레이아웃
  // =========================================
  return (
    <View style={styles.container}>
      {/* -----------------------------------
          🔵 왼쪽 패널
        ----------------------------------- */}
      <View style={styles.leftPanel}>
        
        {/* 공지 상단 */}
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>공지사항</Text>
          <Text style={styles.headerSub}>Announcements</Text>

          {/* 공지 작성 버튼 */}
          <TouchableOpacity
            style={styles.writeBtn}
            onPress={() => {
              setIsCreating(true);
              setIsEditing(false);
              setSelected(null);
              setDraftTitle("");
              setDraftContent("");
              setDraftCategory("general");
              setDraftPinned(false);
              setDraftUrgent(false);
            }}
          >
            <Megaphone color="white" size={20} />
            <Text style={styles.writeBtnText}>공지 작성</Text>
          </TouchableOpacity>

          {/* 요약 통계 */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBox, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
              <Pin size={16} color="#2563EB" style={{ marginBottom: 4 }} />
              <Text style={{ color: "#2563EB", fontSize: 20 }}>
                {announcements.filter((a) => a.pinned).length}
              </Text>
              <Text style={{ color: "#1E40AF", fontSize: 11 }}>고정</Text>
            </View>

            <View style={[styles.summaryBox, { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" }]}>
              <AlertCircle size={16} color="#DC2626" style={{ marginBottom: 4 }} />
              <Text style={{ color: "#DC2626", fontSize: 20 }}>
                {announcements.filter((a) => a.urgent).length}
              </Text>
              <Text style={{ color: "#B91C1C", fontSize: 11 }}>긴급</Text>
            </View>

            <View style={[styles.summaryBox, { backgroundColor: "#F3F4F6", borderColor: "#D1D5DB" }]}>
              <Megaphone size={16} color="#4B5563" style={{ marginBottom: 4 }} />
              <Text style={{ color: "#4B5563", fontSize: 20 }}>
                {announcements.length}
              </Text>
              <Text style={{ color: "#374151", fontSize: 11 }}>전체</Text>
            </View>
          </View>
        </View>

        {/* -----------------------------------
            🔵 공지 목록
        ----------------------------------- */}
        <FlatList
          data={announcements}
          keyExtractor={(item, index) =>   item?.id ? item.id.toString() : `tmp-${index}`}
          contentContainerStyle={{ paddingBottom: 50 }}
          renderItem={({ item }) => {
            const isActive = selected?.id === item.id;

            return (
              <TouchableOpacity
                onPress={() => {
                  setSelected(item);
                  fetchNoticeDetail(item.id);
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                style={[
                  styles.listItem,
                  isActive && styles.listItemActive,
                  item.pinned && { backgroundColor: "#F0F7FF" },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  {/* PIN 아이콘 */}
                  {item.pinned && (
                    <Pin size={14} color="#2563EB" style={{ marginTop: 3, marginRight: 6 }} />
                  )}

                  <View style={{ flex: 1 }}>
                    <View style={styles.badgeRow}>
                      {renderCategoryBadge(item.category)}

                      {item.pinned && (
                        <View style={styles.pinBadge}>
                          <Pin size={10} color="white" />
                          <Text style={styles.pinBadgeText}>고정</Text>
                        </View>
                      )}

                      {item.urgent && (
                        <View style={styles.urgentBadge}>
                          <AlertCircle size={10} color="white" />
                          <Text style={styles.urgentBadgeText}>긴급</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.listTitle}>{item.title}</Text>
                    <Text style={styles.listPreview} numberOfLines={2}>
                      {item.preview}
                    </Text>

                    <View style={styles.listMetaRow}>
                      <View style={styles.metaItem}>
                        <Calendar size={12} color="#6B7280" />
                        <Text style={styles.metaText}>{item.date}</Text>
                      </View>

                      <Text style={styles.metaText}>{item.author}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ============================
           오른쪽 패널은 Part 3에서 제공!
         ============================ */}
         <View style={styles.rightPanel}>
        
         {/* 🔵 공지 작성 화면 */}
         {isCreating && (
          <ScrollView contentContainerStyle={styles.rightScroll}>
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>공지사항 작성</Text>

              {/* 제목 */}
              <Text style={styles.inputLabel}>제목</Text>
              <TextInput
                style={styles.input}
                placeholder="공지 제목을 입력하세요"
                value={draftTitle}
                onChangeText={setDraftTitle}
              />

              {/* 작성자 */}
              <Text style={styles.inputLabel}>작성자</Text>
              <TextInput
                style={styles.input}
                placeholder="작성자 이름"
                value={draftAuthor}
                onChangeText={setDraftAuthor}
              />

              {/* 카테고리 */}
              <Text style={styles.inputLabel}>카테고리</Text>

              <View style={styles.categoryRow}>
                {["safety", "site", "general"].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.categoryChip,
                      draftCategory === c && styles.categoryChipActive,
                    ]}
                    onPress={() => setDraftCategory(c as any)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        draftCategory === c && styles.categoryChipTextActive,
                      ]}
                    >
                      {c === "safety" ? "안전" : c === "site" ? "현장" : "일반"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 내용 */}
              <Text style={styles.inputLabel}>내용</Text>
              <View style={styles.textAreaBox}>
                <TextInput
                  style={styles.textArea}
                  multiline
                  value={draftContent}
                  onChangeText={setDraftContent}
                  placeholder="공지 내용을 입력하세요"
                />
              </View>

              {/* 이미지 첨부 */}
              <Text style={styles.inputLabel}>이미지 첨부</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
                <Paperclip size={22} color="#9CA3AF" />
                <Text style={{ color: "#6B7280", marginTop: 6, fontSize: 13 }}>
                  이미지를 선택하세요
                </Text>
              </TouchableOpacity>

              {selectedImage && (
                <View style={styles.uploadPreview}>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImgBtn}
                    onPress={() => setSelectedImage(null)}
                  >
                    <X size={14} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              {/* 스위치 */}
              <View style={styles.switchRow}>
                <Text>상단 고정</Text>
                <Switch value={draftPinned} onValueChange={setDraftPinned} />
              </View>

              <View style={styles.switchRow}>
                <Text>긴급 공지</Text>
                <Switch value={draftUrgent} onValueChange={setDraftUrgent} />
              </View>

              {/* 버튼 */}
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                  <Text style={styles.saveBtnText}>등록</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsCreating(false)}
                >
                  <Text style={styles.cancelBtnText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {/* 🔵 수정 모드 */}
        {isEditing && selected && (
          <ScrollView contentContainerStyle={styles.rightScroll}>
            <View style={styles.detailCard}>
              <Text style={styles.detailTitle}>공지사항 수정</Text>

              {/* 제목 */}
              <Text style={styles.inputLabel}>제목</Text>
              <TextInput
                style={styles.input}
                value={draftTitle}
                onChangeText={setDraftTitle}
              />

              {/* 작성자 */}
              <Text style={styles.inputLabel}>작성자</Text>
              <TextInput
                style={styles.input}
                value={draftAuthor}
                onChangeText={setDraftAuthor}
              />

              {/* 카테고리 */}
              <Text style={styles.inputLabel}>카테고리</Text>
              <View style={styles.categoryRow}>
                {["safety", "site", "general"].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.categoryChip,
                      draftCategory === c && styles.categoryChipActive,
                    ]}
                    onPress={() => setDraftCategory(c as any)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        draftCategory === c && styles.categoryChipTextActive,
                      ]}
                    >
                      {c === "safety" ? "안전" : c === "site" ? "현장" : "일반"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 내용 */}
              <Text style={styles.inputLabel}>내용</Text>
              <View style={styles.textAreaBox}>
                <TextInput
                  style={styles.textArea}
                  multiline
                  value={draftContent}
                  onChangeText={setDraftContent}
                />
              </View>

              {/* 이미지 첨부 */}
              <Text style={styles.inputLabel}>새 이미지 첨부</Text>
              <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
                <Paperclip size={22} color="#9CA3AF" />
                <Text style={{ color: "#6B7280", marginTop: 6 }}>이미지를 선택하세요</Text>
              </TouchableOpacity>

              {selectedImage && (
                <View style={styles.uploadPreview}>
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImgBtn}
                    onPress={() => setSelectedImage(null)}
                  >
                    <X size={14} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.switchRow}>
                <Text>상단 고정</Text>
                <Switch value={draftPinned} onValueChange={setDraftPinned} />
              </View>

              <View style={styles.switchRow}>
                <Text>긴급 공지</Text>
                <Switch value={draftUrgent} onValueChange={setDraftUrgent} />
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleEditSubmit}>
                  <Text style={styles.saveBtnText}>수정 완료</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelBtnText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
              

          </ScrollView>
        )}

        {/* 🔵 상세 보기 */}
        {!selected && !isCreating && !isEditing && (
          <View style={styles.emptyBox}>
            <Megaphone color="#D1D5DB" size={68} />
            <Text style={styles.emptyTitle}>공지사항을 선택하세요</Text>
            <Text style={styles.emptySub}>왼쪽에서 공지를 선택하면 상세내용이 표시됩니다</Text>
          </View>
        )}

        {selected && !isEditing && !isCreating && (
          <ScrollView contentContainerStyle={styles.rightScroll}>
            <View style={styles.detailCard}>
              <View
                style={[
                  styles.detailHeader,
                  selected.urgent
                    ? { backgroundColor: "#FEE2E2" }
                    : selected.pinned
                    ? { backgroundColor: "#FEF9C3" }
                    : {},
                ]}
              >
                <Text style={styles.detailTitle}>{selected.title}</Text>
                <Text style={styles.detailMeta}>
                  {selected.author} · {selected.date}
                </Text>

                <View style={styles.tagRow}>
                  {selected.pinned && (
                    <View style={[styles.tag, { backgroundColor: "#FACC15" }]}>
                      <Pin size={12} color="#1F2937" />
                      <Text style={styles.tagText}>고정</Text>
                    </View>
                  )}
                  {selected.urgent && (
                    <View style={[styles.tag, { backgroundColor: "#FCA5A5" }]}>
                      <AlertCircle size={12} color="#1F2937" />
                      <Text style={styles.tagText}>긴급</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* 내용 */}
              <View style={styles.contentCard}>
                <Text style={styles.sectionHeader}>내용</Text>
                <Text style={styles.sectionText}>{selected.content}</Text>
              </View>

              {/* 첨부파일 */}
              {(selected.attachments?.length ?? 0) > 0 && (
                <View style={styles.contentCard}>
                  <Text style={styles.sectionHeader}>첨부 이미지</Text>
                  {selected.attachments!.map((img, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => {
                        setImagePreviewUrl(img);
                        setImagePreviewVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: img }}
                        style={styles.attachmentImage}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* 버튼 */}
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => {
                    setIsEditing(true);

                    setDraftTitle(selected.title);
                    setDraftAuthor(selected.author);
                    setDraftContent(selected.content);
                    setDraftPinned(selected.pinned);
                    setDraftUrgent(selected.urgent);
                    setDraftCategory(selected.category);
                  }}
                >
                  <Text style={styles.saveBtnText}>수정</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => handleDelete(selected.id)}
                >
                  <Text style={[styles.cancelBtnText, { color: "#DC2626" }]}>
                    삭제
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      {imagePreviewVisible && (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    {/* 닫기 버튼 */}
    <TouchableOpacity
      style={{
        position: "absolute",
        top: 40,
        right: 30,
        padding: 10,
      }}
      onPress={() => setImagePreviewVisible(false)}
    >
      <Text style={{ fontSize: 32, color: "#fff" }}>✕</Text>
    </TouchableOpacity>

    {/* 확대 이미지 */}
    <Image
      source={{ uri: imagePreviewUrl! }}
      style={{
        width: "90%",
        height: "70%",
        borderRadius: 12,
      }}
      resizeMode="contain"
    />
  </View>
)}
    
    </View>

  );
  
}


// =========================================
// 🔥 스타일
// =========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },

  /* 왼쪽 패널 */
  leftPanel: {
    width: 380,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    backgroundColor: "white",
  },

  headerBox: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 20,
    color: "#111827",
    fontWeight: "600",
  },
  headerSub: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },

  writeBtn: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  writeBtnText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryBox: {
    width: "30%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },

  /* 공지 리스트 */
  listItem: {
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "transparent",
  },
  listItemActive: {
    backgroundColor: "#EFF6FF",
    borderLeftColor: "#2563EB",
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },

  pinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pinBadgeText: {
    color: "white",
    fontSize: 10,
    marginLeft: 3,
  },

  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentBadgeText: {
    color: "white",
    fontSize: 10,
    marginLeft: 3,
  },

  listTitle: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
    fontWeight: "500",
  },
  listPreview: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },

  listMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#6B7280",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  rightScroll: {
    padding: 20,
    paddingBottom: 100,
  },

  detailCard: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
  },

  detailHeader: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },

  detailTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  detailMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
  },

  tagRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#1F2937",
  },

  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  sectionText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
  },

  contentCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },

  attachmentImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginTop: 10,
  },

  /* 입력 UI */
  inputLabel: {
    marginTop: 12,
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },

  categoryRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  categoryChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  categoryChipText: {
    fontSize: 12,
    color: "#374151",
  },
  categoryChipTextActive: {
    color: "white",
  },

  textAreaBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    minHeight: 150,
    padding: 10,
  },
  textArea: {
    flex: 1,
    textAlignVertical: "top",
    fontSize: 14,
  },

  uploadBox: {
    marginTop: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    borderStyle: "dashed",
    paddingVertical: 30,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  uploadPreview: {
    marginTop: 10,
    width: 150,
    height: 150,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeImgBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#DC2626",
    padding: 6,
    borderRadius: 18,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  btnRow: {
    flexDirection: "row",
    marginTop: 22,
    gap: 8,
  },

  saveBtn: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: {
    color: "white",
    fontWeight: "600",
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#374151",
    fontWeight: "600",
  },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 17,
    color: "#6B7280",
    marginTop: 10,
  },
  emptySub: {
    marginTop: 6,
    fontSize: 13,
    color: "#9CA3AF",
  },
});