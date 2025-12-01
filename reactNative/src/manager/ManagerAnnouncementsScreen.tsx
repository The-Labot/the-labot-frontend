import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { getTempAccessToken } from '../api/auth';
import { BASE_URL } from '../api/config';
import { launchImageLibrary } from 'react-native-image-picker';

// 🔥 카테고리 타입
type Category = 'safety' | 'site' | 'general';

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

  // 작성/수정 폼
  const [draftTitle, setDraftTitle] = useState('');
  const [draftAuthor, setDraftAuthor] = useState('');
  const [draftCategory, setDraftCategory] = useState<Category>('general');
  const [draftContent, setDraftContent] = useState('');
  const [draftPinned, setDraftPinned] = useState(false);
  const [draftUrgent, setDraftUrgent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // ================================
  // 📌 목록 조회
  // ================================
  // 카테고리 변환 함수
    const parseCategory = (raw: string): Category => {
      const c = (raw || '').trim().toUpperCase();

      if (c === 'SAFETY') return 'safety';
      if (c === 'SITE') return 'site';
      if (c === 'GENERAL') return 'general';

      if (c === '안전') return 'safety';
      if (c === '현장') return 'site';
      if (c === '일반') return 'general';

      return 'general';
    };
  const fetchNotices = async () => {
    try {
      const token = getTempAccessToken();
      const res = await fetch(`${BASE_URL}/manager/notices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        Alert.alert('오류', json.message || '공지 목록 조회 실패');
        return;
      }

      const mapped = json.data.map((item: any) => {
        console.log("📌 서버에서 내려온 category = ", item.category); // ← 추가
        const rawCategory = (item.category || '').trim();
        return {
          id: item.id,
          title: item.title,
          preview: item.title.slice(0, 25),
          content: '',
          date: item.createdAt.split('T')[0],
          author: item.writer,
          pinned: Boolean(item.pinned),
          urgent: Boolean(item.urgent),
          category: parseCategory(item.category),
    }});

      setAnnouncements(mapped);
    } catch (e) {
      console.log('공지 목록 오류:', e);
      Alert.alert('오류', '공지 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ================================
  // 📌 상세 조회
  // ================================
  const fetchNoticeDetail = async (id: number) => {
    try {
      const token = getTempAccessToken();
      const res = await fetch(`${BASE_URL}/manager/notices/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const json = await res.json();
      if (!res.ok) {
        Alert.alert('오류', json.message || '상세 조회 실패');
        return;
      }

      const d = json.data;
      const rawCategory = (d.category || '').trim();

      setSelected({
        id: d.id,
        title: d.title,
        preview: '',
        content: d.content,
        date: d.createdAt.split('T')[0],
        author: d.writer,
        pinned: Boolean(d.pinned),
        urgent: Boolean(d.urgent),
        category: parseCategory(d.category),
        attachments: d.attachments || [],
      });
    } catch (e) {
      console.log('상세 조회 오류:', e);
      Alert.alert('오류', '상세 조회에 실패했습니다.');
    }
  };

  // ================================
  // 📌 이미지 선택
  // ================================
  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (!res.didCancel && res.assets?.length) {
        setSelectedImage(res.assets[0]);
      }
    });
  };

  // ================================
  // 📌 등록
  // ================================
  const handleSubmit = async () => {
    if (!draftTitle.trim() || !draftContent.trim()) {
      Alert.alert('입력 오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const token = getTempAccessToken();
      const form = new FormData();

      form.append('title', draftTitle);
      form.append('content', draftContent);
      form.append('category', draftCategory.toUpperCase());
      form.append('urgent', String(draftUrgent));
      form.append('pinned', String(draftPinned));

      if (selectedImage) {
        form.append('files', {
          uri: selectedImage.uri,
          type: selectedImage.type || 'image/jpeg',
          name: selectedImage.fileName || 'image.jpg',
        } as any);
      }

      const res = await fetch(`${BASE_URL}/manager/notices`, {
        method: 'POST',
        headers: { Authorization: token },
        body: form,
      });

      const json = await res.json();
      if (!res.ok) {
        Alert.alert('등록 실패', json.message || '오류 발생');
        return;
      }

      const newId = json?.data?.noticeId ?? json?.data?.id;

      if (!newId) {
        await fetchNotices();
        setIsCreating(false);
        return;
      }

      const newItem: Announcement = {
        id: newId,
        title: draftTitle,
        preview: draftContent.slice(0, 50),
        content: draftContent,
        author: draftAuthor || '관리자',
        date: new Date().toISOString().split('T')[0],
        pinned: draftPinned,
        urgent: draftUrgent,
        category: draftCategory,
      };

      setAnnouncements(prev => [newItem, ...prev]);
      setSelected(newItem);
      setIsCreating(false);

      Alert.alert('성공', '공지사항이 등록되었습니다.');
    } catch (e) {
      console.log('등록 오류:', e);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };
    // ================================
  // 📌 수정 API
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
      headers: { Authorization: token },
      body: form,
    });

    // 🔥 JSON 없는 응답도 처리할 수 있도록 수정된 부분
    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      console.log("⚠ JSON 없음(문제 없음) =>", err);
    }

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
  // 📌 삭제 API
  // ================================
  const handleDelete = async (id: number) => {
    Alert.alert('삭제 확인', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = getTempAccessToken();
            const res = await fetch(`${BASE_URL}/manager/notices/${id}`, {
              method: 'DELETE',
              headers: { Authorization: token },
            });

            const json = await res.json();
            if (!res.ok) {
              Alert.alert('삭제 실패', json.message || '오류 발생');
              return;
            }

            Alert.alert('삭제 완료', '공지사항이 삭제되었습니다.');
            fetchNotices();
            setSelected(null);
          } catch (e) {
            console.log('삭제 오류:', e);
          }
        },
      },
    ]);
  };

  // ================================
  // 📌 UI 렌더링
  // ================================
  return (
    <View style={styles.root}>

      {/* LEFT */}
     <View style={styles.left}>
  <View style={styles.leftHeader}>
    <Text style={styles.title}>공지사항</Text>
    <Text style={styles.subtitle}>Announcements</Text>

    {/* 공지작성 버튼 */}
    <TouchableOpacity
      onPress={() => {
        setIsCreating(true);
        setIsEditing(false);
        setSelected(null);
        setDraftTitle('');
        setDraftAuthor('');
        setDraftContent('');
        setDraftPinned(false);
        setDraftUrgent(false);
        setSelectedImage(null);
      }}
      style={styles.createButton}
    >
      <Text style={styles.createButtonText}>공지 작성</Text>
    </TouchableOpacity>

    {/* 카테고리 통계 */}
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
      <View style={[styles.countBox, { backgroundColor: '#FEE2E2' }]}>
        <Text style={styles.countNum}>
          {announcements.filter(a => a.category === 'safety').length}
        </Text>
        <Text style={styles.countLabel}>안전</Text>
      </View>

      <View style={[styles.countBox, { backgroundColor: '#DBEAFE' }]}>
        <Text style={styles.countNum}>
          {announcements.filter(a => a.category === 'site').length}
        </Text>
        <Text style={styles.countLabel}>현장</Text>
      </View>

      <View style={[styles.countBox, { backgroundColor: '#E5E7EB' }]}>
        <Text style={styles.countNum}>
          {announcements.filter(a => a.category === 'general').length}
        </Text>
        <Text style={styles.countLabel}>일반</Text>
      </View>
    </View>
  </View>

      {/* 리스트 */}
      <FlatList
        data={announcements}
        keyExtractor={it => String(it.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setIsCreating(false);
              setIsEditing(false);
              fetchNoticeDetail(item.id);
            }}
            style={styles.listItem}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {item.pinned && (
                <View style={[styles.stateDot, { backgroundColor: '#16A34A' }]} />
              )}
              {item.urgent && (
                <View style={[styles.stateDot, { backgroundColor: '#DC2626' }]} />
              )}
              <Text style={styles.listTitle}>{item.title}</Text>
            </View>

            <Text style={styles.listPreview}>{item.preview}</Text>

            <View style={styles.listBottomRow}>
              <Text style={styles.listMeta}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>

      {/* RIGHT */}
      <View style={styles.right}>

        {/* 작성 모드 */}
        {isCreating ? (
          <ScrollView style={styles.card}>
            <Text style={styles.detailTitle}>공지사항 작성</Text>

            {/* 제목 */}
            <Text style={styles.infoLabel}>제목</Text>
            <TextInput
              style={styles.input}
              value={draftTitle}
              onChangeText={setDraftTitle}
              placeholder="공지 제목 입력"
            />

            {/* 작성자 */}
            <Text style={styles.infoLabel}>작성자</Text>
            <TextInput
              style={styles.input}
              value={draftAuthor}
              onChangeText={setDraftAuthor}
              placeholder="작성자 이름"
            />

            {/* 카테고리 */}
            <Text style={styles.infoLabel}>카테고리</Text>
            <View style={styles.categoryRow}>
              <TouchableOpacity
                onPress={() => setDraftCategory('safety')}
                style={[
                  styles.categoryChip,
                  draftCategory === 'safety' && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    draftCategory === 'safety' && styles.categoryChipTextActive,
                  ]}
                >
                  안전
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDraftCategory('site')}
                style={[
                  styles.categoryChip,
                  draftCategory === 'site' && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    draftCategory === 'site' && styles.categoryChipTextActive,
                  ]}
                >
                  현장
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDraftCategory('general')}
                style={[
                  styles.categoryChip,
                  draftCategory === 'general' && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    draftCategory === 'general' && styles.categoryChipTextActive,
                  ]}
                >
                  일반
                </Text>
              </TouchableOpacity>
            </View>

            {/* 내용 */}
            <Text style={styles.infoLabel}>내용</Text>
            <View style={styles.contentBlock}>
              <TextInput
                style={styles.textArea}
                value={draftContent}
                onChangeText={setDraftContent}
                multiline
                placeholder="공지 내용을 입력하세요"
              />
            </View>

            {/* 이미지 */}
            <Text style={[styles.infoLabel, { marginTop: 16 }]}>이미지 첨부</Text>
            <TouchableOpacity style={styles.imageUploadBox} onPress={handlePickImage}>
              <Text style={{ color: '#6B7280', fontSize: 13 }}>이미지를 선택하세요</Text>
            </TouchableOpacity>

            {selectedImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  onPress={() => setSelectedImage(null)}
                  style={styles.removeImageBtn}
                >
                  <Text style={{ color: '#fff', fontSize: 12 }}>삭제</Text>
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
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>등록</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outlineBtn, { marginLeft: 8 }]}
                onPress={() => setIsCreating(false)}
              >
                <Text style={styles.outlineBtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : isEditing ? (
          /* =============================
             📌 수정 모드 UI
             ============================= */
          <ScrollView style={styles.card}>
            <Text style={styles.detailTitle}>공지사항 수정</Text>

            {/* 제목 */}
            <Text style={styles.infoLabel}>제목</Text>
            <TextInput
              style={styles.input}
              value={draftTitle}
              onChangeText={setDraftTitle}
            />

            {/* 작성자 */}
            <Text style={styles.infoLabel}>작성자</Text>
            <TextInput
              style={styles.input}
              value={draftAuthor}
              onChangeText={setDraftAuthor}
            />

            {/* 카테고리 */}
            <Text style={styles.infoLabel}>카테고리</Text>
            <View style={styles.categoryRow}>
              <TouchableOpacity
                onPress={() => setDraftCategory('safety')}
                style={[
                  styles.categoryChip,
                  draftCategory === 'safety' && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    draftCategory === 'safety' && styles.categoryChipTextActive,
                  ]}
                >
                  안전
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDraftCategory('site')}
                style={[
                  styles.categoryChip,
                  draftCategory === 'site' && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    draftCategory === 'site' && styles.categoryChipTextActive,
                  ]}
                >
                  현장
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDraftCategory('general')}
                style={[
                  styles.categoryChip,
                  draftCategory === 'general' && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    draftCategory === 'general' && styles.categoryChipTextActive,
                  ]}
                >
                  일반
                </Text>
              </TouchableOpacity>
            </View>

            {/* 내용 */}
            <Text style={styles.infoLabel}>내용</Text>
            <View style={styles.contentBlock}>
              <TextInput
                style={styles.textArea}
                value={draftContent}
                onChangeText={setDraftContent}
                multiline
              />
            </View>

            {/* 이미지 */}
            <Text style={[styles.infoLabel, { marginTop: 16 }]}>새 이미지 첨부</Text>
            <TouchableOpacity style={styles.imageUploadBox} onPress={handlePickImage}>
              <Text style={{ color: '#6B7280', fontSize: 13 }}>이미지를 선택하세요</Text>
            </TouchableOpacity>

            {selectedImage && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  onPress={() => setSelectedImage(null)}
                  style={styles.removeImageBtn}
                >
                  <Text style={{ color: '#fff', fontSize: 12 }}>삭제</Text>
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

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleEditSubmit}>
                <Text style={styles.primaryBtnText}>수정 완료</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outlineBtn, { marginLeft: 8 }]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.outlineBtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : selected ? (
          /* =============================
             📌 상세 보기
             ============================= */
          <ScrollView style={styles.detailCard}>
            <View
              style={{
                backgroundColor: selected.urgent
                  ? '#FEE2E2'
                  : selected.pinned
                  ? '#FEF9C3'
                  : '#FFFFFF',
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                marginBottom: 16,
              }}
            >
              <Text style={styles.detailTitle}>{selected.title}</Text>
              <Text style={styles.detailMeta}>
                {selected.author} · {selected.date}
              </Text>

              <View style={styles.tagRow}>
                {selected.pinned && (
                  <View style={[styles.tag, { backgroundColor: '#FDE68A' }]}>
                    <Text style={styles.tagText}>상단 고정</Text>
                  </View>
                )}
                {selected.urgent && (
                  <View style={[styles.tag, { backgroundColor: '#FCA5A5' }]}>
                    <Text style={styles.tagText}>긴급</Text>
                  </View>
                )}
              </View>
            </View>

            {/* 내용 */}
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text style={styles.sectionLabel}>내용</Text>
              <Text style={styles.sectionText}>{selected.content}</Text>
            </View>

            {/* 첨부 이미지 */}
            {selected.attachments?.length > 0 ? (
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <Text style={styles.sectionLabel}>첨부 이미지</Text>
                {selected.attachments.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={{
                      width: '100%',
                      height: 220,
                      borderRadius: 10,
                      marginBottom: 12,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <Text style={styles.sectionLabel}>첨부 이미지</Text>
                <Text style={{ color: '#9CA3AF' }}>등록된 이미지가 없습니다.</Text>
              </View>
            )}

            {/* 수정/삭제 버튼 */}
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  if (!selected) return;
                  // 수정 모드 진입 시 draft 초기화
                  setDraftTitle(selected.title);
                  setDraftAuthor(selected.author);
                  setDraftContent(selected.content);
                  setDraftPinned(selected.pinned);
                  setDraftUrgent(selected.urgent);
                  setDraftCategory(selected.category);
                  setSelectedImage(null);

                  setIsEditing(true);
                }}
              >
                <Text style={styles.primaryBtnText}>수정하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.outlineBtn, { marginLeft: 8 }]}
                onPress={() => handleDelete(selected.id)}
              >
                <Text style={styles.outlineBtnText}>삭제하기</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>왼쪽에서 공지를 선택하거나 작성하세요.</Text>
          </View>
        )}
      </View>
    </View>
  );
}
/* ======================================================
   📌 STYLES (기존 그대로)
====================================================== */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  left: {
    width: 420,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  leftHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  createButton: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  countBox: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  countNum: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  countLabel: {
    fontSize: 12,
    color: '#374151',
    marginTop: 2,
  },
  listItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stateDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  listPreview: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  listBottomRow: {
    marginTop: 6,
  },
  listMeta: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  right: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  detailMeta: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionLabel: {
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6,
    color: '#111827',
  },
  sectionText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
  infoLabel: {
    marginTop: 10,
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
    fontSize: 14,
  },
  contentBlock: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    padding: 8,
  },
  textArea: {
    minHeight: 140,
    fontSize: 14,
    padding: 10,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#374151',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  switchRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageUploadBox: {
    marginTop: 6,
    height: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    marginTop: 10,
    width: 150,
    height: 150,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  outlineBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: '#374151',
    fontWeight: '600',
  },
});