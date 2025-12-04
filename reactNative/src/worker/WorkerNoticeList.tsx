// 📌 src/worker/WorkerNoticeList.tsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { BASE_URL } from '../api/config';
import { getTempAccessToken } from '../api/auth';
import ScreenWrapper from "../ScreenWrapper";

export default function WorkerNoticeList({ navigation }: any) {
  const [notices, setNotices] = useState<any[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  const fetchNotices = async () => {
    try {
      const token = getTempAccessToken();
      const res = await fetch(`${BASE_URL}/worker/notices`, {
              method: 'GET',
        headers: { Authorization: token },
      });

      const json = await res.json();
      console.log("공지사항 API 응답:", json);

      const sorted = json.sort((a: any, b: any) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setNotices(sorted);
    } catch (err) {
      console.log('전체 공지 fetch 오류:', err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const getTagStyle = (category: string) => {
    switch (category) {
      case 'GENERAL':
        return { bg: '#E5E7EB', color: '#374151' };
      case 'SAFETY':
        return { bg: '#FFE4E6', color: '#B91C1C' };
      case 'SITE':
        return { bg: '#D1FAE5', color: '#065F46' };
      default:
        return { bg: '#F3F4F6', color: '#374151' };
    }
  };

  // 🔥 카테고리 숫자 계산
  const countByType = {
    GENERAL: notices.filter(n => n.category === 'GENERAL').length,
    SAFETY: notices.filter(n => n.category === 'SAFETY').length,
    SITE: notices.filter(n => n.category === 'SITE').length,
  };

  const filteredNotices = filter
    ? notices.filter(item => item.category === filter)
    : notices;

  return (
    <ScreenWrapper>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>전체 공지사항</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* 🔥 카테고리 요약 카드 3개 */}
      <View style={styles.summaryContainer}>
        {/* GENERAL */}
        <TouchableOpacity
          style={[styles.summaryCard, { backgroundColor: '#E5E7EB' }]}
          onPress={() => setFilter(filter === 'GENERAL' ? null : 'GENERAL')}
        >
          <Text style={[styles.summaryText, { color: '#374151' }]}>GENERAL</Text>
          <Text style={styles.summaryCount}>{countByType.GENERAL}</Text>
        </TouchableOpacity>

        {/* SAFETY */}
        <TouchableOpacity
          style={[styles.summaryCard, { backgroundColor: '#FFE4E6' }]}
          onPress={() => setFilter(filter === 'SAFETY' ? null : 'SAFETY')}
        >
          <Text style={[styles.summaryText, { color: '#B91C1C' }]}>SAFETY</Text>
          <Text style={styles.summaryCount}>{countByType.SAFETY}</Text>
        </TouchableOpacity>

        {/* SITE */}
        <TouchableOpacity
          style={[styles.summaryCard, { backgroundColor: '#D1FAE5' }]}
          onPress={() => setFilter(filter === 'SITE' ? null : 'SITE')}
        >
          <Text style={[styles.summaryText, { color: '#065F46' }]}>SITE</Text>
          <Text style={styles.summaryCount}>{countByType.SITE}</Text>
        </TouchableOpacity>
      </View>

      {/* 목록 */}
      <ScrollView style={styles.scroll}>
        {filteredNotices.map((item: any) => {
          const { bg, color } = getTagStyle(item.category);

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('WorkerNoticeDetail', { noticeId: item.id })
              }
            >
              <View style={styles.row}>
                <View style={[styles.tag, { backgroundColor: bg }]}>
                  <Text style={[styles.tagText, { color }]}>{item.category}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>
                    {item.pinned ? '📌 ' : ''}
                    {item.urgent ? '🚨 ' : ''}
                    {item.title}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: { fontSize: 26, fontWeight: '500', color: '#111' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600' },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  summaryCard: {
    width: '31%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryText: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  summaryCount: { fontSize: 16, fontWeight: '800', color: '#111' },

  scroll: { paddingHorizontal: 18, marginTop: 10 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  tagText: { fontSize: 10, fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '600', marginBottom: 3, color: '#111' },
  date: { fontSize: 11, color: '#6B7280' },
});