// src/manager/ManagerAnnouncementsScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';

type Category = 'safety' | 'notice' | 'award' | 'maintenance' | 'other';

interface Announcement {
  id: number;
  title: string;
  date: string;
  author: string;
  isPinned: boolean;
  isUrgent: boolean;
  category: Category;
  preview: string;
  content: string;
  attachments?: { name: string; size: string; url: string }[];
}

const MOCK: Announcement[] = [
  {
    id: 1,
    title: '안전교육 실시 안내',
    date: '2025-11-01',
    author: '안전관리팀',
    isPinned: true,
    isUrgent: true,
    category: 'safety',
    preview: '11월 5일 오전 9시, 전체 근로자 대상 안전교육을 실시합니다.',
    content: '11월 5일 오전 9시, 전체 근로자 대상 안전교육을 실시합니다...\n(생략)',
    attachments: [
      { name: '안전교육_자료.pdf', size: '2.4 MB', url: '#' },
      { name: '참석자_명단.xlsx', size: '156 KB', url: '#' },
    ],
  },
  {
    id: 2,
    title: '현장 출입 시간 변경 공지',
    date: '2025-10-30',
    author: '현장관리팀',
    isPinned: true,
    isUrgent: false,
    category: 'notice',
    preview: '11월 1일부터 현장 출입 시간이 오전 7시 30분으로 변경됩니다.',
    content: '11월 1일부터 현장 출입 시간이 오전 7시 30분으로 변경됩니다...\n(생략)',
  },
];

const CATEGORY_LABEL: Record<Category, string> = {
  safety: '안전',
  notice: '공지',
  award: '포상',
  maintenance: '점검',
  other: '기타',
};

export default function ManagerAnnouncementsScreen() {
  // 공지 목록 / 선택 / 작성 상태
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK);
  const [selected, setSelected] = useState<Announcement | null>(MOCK[0] ?? null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<Announcement | null>(null);

  // 통계
  const pinnedCount = useMemo(
    () => announcements.filter(a => a.isPinned).length,
    [announcements],
  );
  const urgentCount = useMemo(
    () => announcements.filter(a => a.isUrgent).length,
    [announcements],
  );
  const totalCount = announcements.length;

  // 카테고리 뱃지
  const CategoryBadge = ({ cat }: { cat: Category }) => {
    const map: Record<Category, { bg: string; fg: string; label: string }> = {
      safety: { bg: '#FEE2E2', fg: '#B91C1C', label: '안전' },
      notice: { bg: '#DBEAFE', fg: '#1D4ED8', label: '공지' },
      award: { bg: '#FEF9C3', fg: '#92400E', label: '포상' },
      maintenance: { bg: '#EDE9FE', fg: '#6D28D9', label: '점검' },
      other: { bg: '#F3F4F6', fg: '#374151', label: '기타' },
    };
    const s = map[cat];
    return (
      <View style={[styles.badge, { backgroundColor: s.bg }]}>
        <Text style={{ color: s.fg, fontSize: 12 }}>{s.label}</Text>
      </View>
    );
  };

  // 새 공지 버튼 눌렀을 때
  const handleCreate = () => {
    const baseDate = new Date().toISOString().split('T')[0];
    const newDraft: Announcement = {
      id: announcements.length + 1,
      title: '',
      date: baseDate,
      author: '',
      isPinned: false,
      isUrgent: false,
      category: 'other',
      preview: '',
      content: '',
      attachments: [],
    };
    setDraft(newDraft);
    setIsCreating(true);
    setSelected(null);
  };

  // 작성 저장
  const handleSaveDraft = () => {
    if (!draft) return;
    setAnnouncements(prev => [draft, ...prev]);
    setSelected(draft);
    setDraft(null);
    setIsCreating(false);
  };

  // 작성 취소
  const handleCancelDraft = () => {
    setDraft(null);
    setIsCreating(false);
    if (!selected && announcements[0]) {
      setSelected(announcements[0]);
    }
  };

  return (
    <View style={styles.root}>
      {/* Left list */}
      <View style={styles.left}>
        <View style={styles.leftHeader}>
          <Text style={styles.title}>공지사항</Text>
          <Text style={styles.subtitle}>Announcements</Text>

          {/* 공지 작성 버튼 */}
          <TouchableOpacity
            style={styles.createButton}
            activeOpacity={0.9}
            onPress={handleCreate}
          >
            <Text style={styles.createButtonText}>공지 작성</Text>
          </TouchableOpacity>

          <View style={styles.statsRow}>
            <View style={[styles.stat, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.statNum}>{pinnedCount}</Text>
              <Text style={styles.statLbl}>고정</Text>
            </View>
            <View style={[styles.stat, { backgroundColor: '#FEE2E2' }]}>
              <Text style={styles.statNum}>{urgentCount}</Text>
              <Text style={styles.statLbl}>긴급</Text>
            </View>
            <View style={[styles.stat, { backgroundColor: '#F3F4F6' }]}>
              <Text style={styles.statNum}>{totalCount}</Text>
              <Text style={styles.statLbl}>전체</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={announcements}
          keyExtractor={it => String(it.id)}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: '#F3F4F6' }} />
          )}
          renderItem={({ item }) => {
            const active = selected?.id === item.id;
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelected(item);
                  setIsCreating(false);
                  setDraft(null);
                }}
                activeOpacity={0.85}
                style={[
                  styles.row,
                  active && {
                    backgroundColor: '#EFF6FF',
                    borderLeftColor: '#2563EB',
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 6,
                      marginBottom: 4,
                      flexWrap: 'wrap',
                    }}
                  >
                    <CategoryBadge cat={item.category} />
                    {item.isPinned && (
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: '#2563EB' },
                        ]}
                      >
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                          고정
                        </Text>
                      </View>
                    )}
                    {item.isUrgent && (
                      <View
                        style={[
                          styles.badge,
                          { backgroundColor: '#DC2626' },
                        ]}
                      >
                        <Text style={{ color: '#fff', fontSize: 12 }}>
                          긴급
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={{ color: '#111827', marginBottom: 2 }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{ color: '#6B7280', fontSize: 12 }}
                    numberOfLines={2}
                  >
                    {item.preview}
                  </Text>
                  <Text
                    style={{
                      color: '#9CA3AF',
                      fontSize: 12,
                      marginTop: 6,
                    }}
                  >
                    {item.date} · {item.author}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      {/* Right detail / create */}
      <View style={styles.right}>
        {isCreating && draft ? (
          // ---- 작성 모드 ----
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={styles.card}>
              {/* 상단 제목 + 버튼 */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Text style={styles.detailTitle}>공지사항 작성</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, { marginRight: 8 }]}
                    activeOpacity={0.9}
                    onPress={handleSaveDraft}
                  >
                    <Text style={styles.primaryBtnText}>저장</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.outlineBtn}
                    activeOpacity={0.9}
                    onPress={handleCancelDraft}
                  >
                    <Text style={styles.outlineBtnText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 제목 */}
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.infoLabel}>제목</Text>
                <TextInput
                  style={styles.input}
                  placeholder="공지사항 제목을 입력하세요"
                  value={draft.title}
                  onChangeText={text =>
                    setDraft(prev => (prev ? { ...prev, title: text } : prev))
                  }
                />
              </View>

              {/* 작성자 */}
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.infoLabel}>작성자</Text>
                <TextInput
                  style={styles.input}
                  placeholder="작성자 이름을 입력하세요"
                  value={draft.author}
                  onChangeText={text =>
                    setDraft(prev => (prev ? { ...prev, author: text } : prev))
                  }
                />
              </View>

              {/* 카테고리 */}
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.infoLabel}>카테고리</Text>
                <View style={styles.categoryRow}>
                  {(Object.keys(CATEGORY_LABEL) as Category[]).map(cat => {
                    const active = draft.category === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryChip,
                          active && styles.categoryChipActive,
                        ]}
                        onPress={() =>
                          setDraft(prev =>
                            prev ? { ...prev, category: cat } : prev,
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            active && styles.categoryChipTextActive,
                          ]}
                        >
                          {CATEGORY_LABEL[cat]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 내용 */}
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.infoLabel}>내용</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  multiline
                  placeholder="공지사항 내용을 입력하세요"
                  value={draft.content}
                  onChangeText={text =>
                    setDraft(prev =>
                      prev
                        ? {
                            ...prev,
                            content: text,
                            preview: text.slice(0, 50),
                          }
                        : prev,
                    )
                  }
                />
              </View>

              {/* 스위치 영역 */}
              <View style={{ marginTop: 8 }}>
                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.infoLabel}>고정 여부</Text>
                    <Text style={styles.switchDesc}>
                      공지사항을 상단에 고정합니다
                    </Text>
                  </View>
                  <Switch
                    value={draft.isPinned}
                    onValueChange={v =>
                      setDraft(prev =>
                        prev ? { ...prev, isPinned: v } : prev,
                      )
                    }
                  />
                </View>

                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.infoLabel}>긴급 여부</Text>
                    <Text style={styles.switchDesc}>
                      긴급 공지로 표시합니다
                    </Text>
                  </View>
                  <Switch
                    value={draft.isUrgent}
                    onValueChange={v =>
                      setDraft(prev =>
                        prev ? { ...prev, isUrgent: v } : prev,
                      )
                    }
                  />
                </View>
              </View>

              {/* 첨부파일 영역 (UI만, 실제 업로드는 나중에) */}
              <View style={{ marginTop: 16 }}>
                <Text style={styles.infoLabel}>첨부파일</Text>
                <View style={styles.attachBox}>
                  <Text style={{ fontSize: 13, color: '#6B7280' }}>
                    파일 업로드 영역 (PDF, DOC, XLS, PNG, JPG 등)
                  </Text>
                  <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                    실제 파일 업로드 기능은 추후 연동 예정
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : selected ? (
          // ---- 상세 보기 모드 ----
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  marginBottom: 8,
                  flexWrap: 'wrap',
                }}
              >
                <CategoryBadge cat={selected.category} />
                {selected.isPinned && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: '#2563EB' },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                      고정
                    </Text>
                  </View>
                )}
                {selected.isUrgent && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: '#DC2626' },
                    ]}
                  >
                    <Text style={{ color: '#fff', fontSize: 12 }}>
                      긴급
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.detailTitle}>{selected.title}</Text>
              <Text style={{ color: '#6B7280', marginBottom: 12 }}>
                {selected.author} · {selected.date}
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>내용</Text>
                <Text
                  style={{
                    color: '#374151',
                    lineHeight: 22,
                    marginTop: 6,
                  }}
                >
                  {selected.content}
                </Text>
              </View>

              {selected.attachments?.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>첨부파일</Text>
                  {selected.attachments.map((f, i) => (
                    <View key={i} style={styles.fileRow}>
                      <Text style={{ color: '#111827' }}>{f.name}</Text>
                      <Text
                        style={{ color: '#6B7280', fontSize: 12 }}
                      >
                        {f.size}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </ScrollView>
        ) : (
          // ---- 아무것도 선택 안 됨 ----
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#9CA3AF' }}>
              왼쪽에서 공지사항을 선택하거나 &quot;공지 작성&quot; 버튼을
              눌러 새 공지를 등록하세요
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', flexDirection: 'row' },
  left: { width: 420, borderRightWidth: 1, borderRightColor: '#E5E7EB' },
  leftHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  subtitle: { color: '#6B7280', fontSize: 12 },

  createButton: {
    marginTop: 12,
    marginBottom: 12,
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

  statsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  stat: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statNum: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statLbl: { color: '#374151', fontSize: 12, marginTop: 2 },

  row: { padding: 12, borderLeftWidth: 4, borderLeftColor: 'transparent' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },

  right: { flex: 1, backgroundColor: '#F9FAFB' },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  detailTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  section: { marginTop: 16 },
  sectionTitle: { color: '#111827', fontWeight: '600' },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  // 작성 폼 공통 스타일
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },
  outlineBtn: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  outlineBtnText: { color: '#374151', fontSize: 13, fontWeight: '500' },

  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 4,
    marginBottom: 4,
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
    color: '#FFFFFF',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switchDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  attachBox: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    borderStyle: 'dashed',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
});