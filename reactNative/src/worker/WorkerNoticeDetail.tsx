// 📌 src/worker/WorkerNoticeDetail.tsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { BASE_URL } from '../api/config';
import { getTempAccessToken } from '../api/auth';

export default function WorkerNoticeDetail({ route, navigation }: any) {
  const { noticeId } = route.params;
  const [detail, setDetail] = useState<any>(null);

  const fetchDetail = async () => {
  try {
    const token = getTempAccessToken();
    const res = await fetch(`${BASE_URL}/worker/notices/${noticeId}`, {
      headers: { Authorization: token },
    });

    const text = await res.text();
    console.log("📌 raw:", text);

    const json = JSON.parse(text);
    console.log("📌 JSON:", json);

    setDetail(json);   // 🔥 여기만 변경

  } catch (err) {
    console.log("❌ 상세조회 오류:", err);
  }
};

  useEffect(() => {
    fetchDetail();
  }, []);

  const getTagStyle = (category: string) => {
    switch (category) {
      case '안전':
        return { bg: '#DBEAFE', color: '#1D4ED8' };
      case '일정':
        return { bg: '#FFEDD5', color: '#C2410C' };
      case '현장':
        return { bg: '#E2FBEA', color: '#15803D' };
      case 'SITE':
        return { bg: '#DCFCE7', color: '#16A34A' };
      case 'SAFETY':
        return { bg: '#FEE2E2', color: '#DC2626' };
      case 'GENERAL':
      default:
        return { bg: '#E5E7EB', color: '#374151' };
    }
  };

  if (!detail) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: 20 }}>불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const { bg, color } = getTagStyle(detail.category);

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
<View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={styles.backButtonArea}   // 👈 터치 영역 확대
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 👈 터치 보정
  >
    <Text style={styles.backIcon}>←</Text>
  </TouchableOpacity>

  <Text style={styles.headerTitle}>공지 상세</Text>

  {/* 오른쪽 공간 맞추기용 */}
  <View style={{ width: 32 }} />
</View>

      <ScrollView style={styles.scroll}>
        {/* 카테고리 */}
        <View style={[styles.tag, { backgroundColor: bg }]}>
          <Text style={[styles.tagText, { color }]}>{detail.category}</Text>
        </View>

        {/* 제목 */}
        <Text style={styles.title}>
          {detail.pinned ? '📌 ' : ''}{detail.title}
        </Text>

        {/* 작성 정보 */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>작성자</Text>
          <Text style={styles.infoValue}>{detail.writerName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>작성일</Text>
          <Text style={styles.infoValue}>
            {detail.createdDate?.split('T')[0]}
          </Text>
        </View>

        {/* 긴급 여부 */}
        {detail.urgent && (
          <View style={styles.urgentBox}>
            <Text style={styles.urgentText}>⚠ 긴급 공지</Text>
          </View>
        )}

        {/* 내용 */}
        <Text style={styles.content}>{detail.content}</Text>

        {/* 첨부 파일 */}
{detail.files && detail.files.length > 0 && (
  <>
    <Text style={styles.attachTitle}>첨부파일</Text>

    {detail.files.map((url: string, idx: number) => (
      <TouchableOpacity
        key={idx}
        style={styles.fileBox}
        onPress={() => Linking.openURL(url)}
      >
        <Text style={styles.fileIcon}>📎</Text>
        <Text style={styles.fileName}>파일 {idx + 1}</Text>
      </TouchableOpacity>
    ))}
  </>
)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F7' },

  /* 헤더 */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { fontSize: 26, fontWeight: '300', color: '#111' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600' },

  scroll: { padding: 20 },

  /* 카테고리 태그 */
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tagText: { fontSize: 12, fontWeight: '700' },

  /* 제목 */
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },

  /* 정보 */
  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  infoLabel: {
    width: 70,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    color: '#111',
  },

  /* 긴급 박스 */
  urgentBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 20,
  },
  urgentText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },

  /* 본문 */
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#111',
    marginBottom: 20,
  },

  /* 첨부파일 */
  attachTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  attachLink: {
    color: '#2563EB',
    marginBottom: 8,
    fontSize: 14,
  },
  backButtonArea: {
  padding: 8,
  justifyContent: "center",
  alignItems: "center",
},

backIcon: {
  fontSize: 26,
  fontWeight: '600',
  color: '#111',
},
fileBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFF',
  borderRadius: 10,
  padding: 12,
  marginBottom: 10,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

fileIcon: {
  fontSize: 18,
  marginRight: 10,
},

fileName: {
  fontSize: 14,
  color: '#2563EB',
  fontWeight: '500',
},
});