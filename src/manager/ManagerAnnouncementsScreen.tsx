// src/manager/ManagerAnnouncementsScreen.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';

type Category = 'safety'|'notice'|'award'|'maintenance'|'other';

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
  { id:1, title:'안전교육 실시 안내', date:'2025-11-01', author:'안전관리팀',
    isPinned:true, isUrgent:true, category:'safety',
    preview:'11월 5일 오전 9시, 전체 근로자 대상 안전교육을 실시합니다.',
    content:'11월 5일 오전 9시, 전체 근로자 대상 안전교육을 실시합니다...\n(생략)',
    attachments:[{ name:'안전교육_자료.pdf', size:'2.4 MB', url:'#' }, { name:'참석자_명단.xlsx', size:'156 KB', url:'#' }],
  },
  { id:2, title:'현장 출입 시간 변경 공지', date:'2025-10-30', author:'현장관리팀',
    isPinned:true, isUrgent:false, category:'notice',
    preview:'11월 1일부터 현장 출입 시간이 오전 7시 30분으로 변경됩니다.',
    content:'11월 1일부터 현장 출입 시간이 오전 7시 30분으로 변경됩니다...\n(생략)',
  },
  // ...필요시 추가
];

export default function ManagerAnnouncementsScreen() {
  const [selected, setSelected] = useState<Announcement|null>(MOCK[0] ?? null);

  const pinnedCount = useMemo(()=>MOCK.filter(a=>a.isPinned).length,[]);
  const urgentCount = useMemo(()=>MOCK.filter(a=>a.isUrgent).length,[]);
  const totalCount  = MOCK.length;

  const CategoryBadge = ({cat}:{cat:Category}) => {
    const map: Record<Category, {bg:string; fg:string; label:string}> = {
      safety:{bg:'#FEE2E2', fg:'#B91C1C', label:'안전'},
      notice:{bg:'#DBEAFE', fg:'#1D4ED8', label:'공지'},
      award:{bg:'#FEF9C3', fg:'#92400E', label:'포상'},
      maintenance:{bg:'#EDE9FE', fg:'#6D28D9', label:'점검'},
      other:{bg:'#F3F4F6', fg:'#374151', label:'기타'},
    };
    const s = map[cat];
    return <View style={[styles.badge,{backgroundColor:s.bg}]}><Text style={{color:s.fg, fontSize:12}}>{s.label}</Text></View>;
  };

  return (
    <View style={styles.root}>
      {/* Left list */}
      <View style={styles.left}>
        <View style={styles.leftHeader}>
          <Text style={styles.title}>공지사항</Text>
          <Text style={styles.subtitle}>Announcements</Text>

          <View style={styles.statsRow}>
            <View style={[styles.stat, {backgroundColor:'#DBEAFE'}]}>
              <Text style={styles.statNum}>{pinnedCount}</Text>
              <Text style={styles.statLbl}>고정</Text>
            </View>
            <View style={[styles.stat, {backgroundColor:'#FEE2E2'}]}>
              <Text style={styles.statNum}>{urgentCount}</Text>
              <Text style={styles.statLbl}>긴급</Text>
            </View>
            <View style={[styles.stat, {backgroundColor:'#F3F4F6'}]}>
              <Text style={styles.statNum}>{totalCount}</Text>
              <Text style={styles.statLbl}>전체</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={MOCK}
          keyExtractor={it=>String(it.id)}
          ItemSeparatorComponent={()=> <View style={{height:1, backgroundColor:'#F3F4F6'}}/>}
          renderItem={({item})=>{
            const active = selected?.id===item.id;
            return (
              <TouchableOpacity
                onPress={()=>setSelected(item)}
                activeOpacity={0.85}
                style={[styles.row, active && {backgroundColor:'#EFF6FF', borderLeftColor:'#2563EB'}]}
              >
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row', gap:6, marginBottom:4, flexWrap:'wrap'}}>
                    <CategoryBadge cat={item.category}/>
                    {item.isPinned && <View style={[styles.badge,{backgroundColor:'#2563EB'}]}><Text style={{color:'#fff', fontSize:12}}>고정</Text></View>}
                    {item.isUrgent && <View style={[styles.badge,{backgroundColor:'#DC2626'}]}><Text style={{color:'#fff', fontSize:12}}>긴급</Text></View>}
                  </View>
                  <Text style={{color:'#111827', marginBottom:2}} numberOfLines={1}>{item.title}</Text>
                  <Text style={{color:'#6B7280', fontSize:12}} numberOfLines={2}>{item.preview}</Text>
                  <Text style={{color:'#9CA3AF', fontSize:12, marginTop:6}}>{item.date} · {item.author}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{paddingBottom:16}}
        />
      </View>

      {/* Right detail */}
      <View style={styles.right}>
        {selected ? (
          <ScrollView contentContainerStyle={{padding:16}}>
            <View style={styles.card}>
              <View style={{flexDirection:'row', gap:6, marginBottom:8, flexWrap:'wrap'}}>
                <CategoryBadge cat={selected.category}/>
                {selected.isPinned && <View style={[styles.badge,{backgroundColor:'#2563EB'}]}><Text style={{color:'#fff', fontSize:12}}>고정</Text></View>}
                {selected.isUrgent && <View style={[styles.badge,{backgroundColor:'#DC2626'}]}><Text style={{color:'#fff', fontSize:12}}>긴급</Text></View>}
              </View>
              <Text style={styles.detailTitle}>{selected.title}</Text>
              <Text style={{color:'#6B7280', marginBottom:12}}>{selected.author} · {selected.date}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>내용</Text>
                <Text style={{color:'#374151', lineHeight:22, marginTop:6}}>{selected.content}</Text>
              </View>

              {selected.attachments?.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>첨부파일</Text>
                  {selected.attachments.map((f,i)=>(
                    <View key={i} style={styles.fileRow}>
                      <Text style={{color:'#111827'}}>{f.name}</Text>
                      <Text style={{color:'#6B7280', fontSize:12}}>{f.size}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </ScrollView>
        ) : (
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'#9CA3AF'}}>왼쪽에서 공지사항을 선택하세요</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#FFFFFF', flexDirection:'row' },
  left:{ width:420, borderRightWidth:1, borderRightColor:'#E5E7EB' },
  leftHeader:{ padding:16, borderBottomWidth:1, borderBottomColor:'#E5E7EB' },
  title:{ fontSize:18, fontWeight:'700', color:'#111827' },
  subtitle:{ color:'#6B7280', fontSize:12 },
  statsRow:{ flexDirection:'row', gap:8, marginTop:12 },
  stat:{ flex:1, borderRadius:10, paddingVertical:10, alignItems:'center' },
  statNum:{ fontSize:18, fontWeight:'700', color:'#111827' },
  statLbl:{ color:'#374151', fontSize:12, marginTop:2 },

  row:{ padding:12, borderLeftWidth:4, borderLeftColor:'transparent' },

  badge:{ paddingHorizontal:8, paddingVertical:4, borderRadius:999 },

  right:{ flex:1, backgroundColor:'#F9FAFB' },
  card:{ backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:16 },
  detailTitle:{ fontSize:16, fontWeight:'700', color:'#111827', marginBottom:4 },
  section:{ marginTop:16 },
  sectionTitle:{ color:'#111827', fontWeight:'600' },
  fileRow:{ flexDirection:'row', justifyContent:'space-between', paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#F3F4F6' },
});