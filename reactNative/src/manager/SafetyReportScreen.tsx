import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, ScrollView, FlatList
} from 'react-native';

type Status = 'urgent' | 'pending' | 'resolved' | 'cancelled';

interface SafetyReport {
  id: number;
  title: string;
  reporter: string;
  location: string;
  status: Status;
  time: string;           // “5분 전” 같은 표시용
  description: string;
  reportDate: string;     // YYYY-MM-DD
  reportTime: string;     // HH:mm
  category: string;       // 분류
  severity: string;       // 위험도
  resolvedBy?: string;
  resolvedDate?: string;
  resolvedNote?: string;
}

const MOCK: SafetyReport[] = [
  {
    id:1, title:'낙하물 위험', reporter:'김철수', location:'2층 작업장',
    status:'urgent', time:'5분 전',
    description:'작업 중 자재 낙하 위험 발견. 2층 작업장 천장 부근에 고정되지 않은 자재가 있어 낙하 위험이 있습니다. 즉시 조치가 필요합니다.',
    reportDate:'2025-11-09', reportTime:'14:35', category:'낙하물', severity:'높음'
  },
  {
    id:2, title:'안전난간 훼손', reporter:'이영희', location:'A동 현장',
    status:'pending', time:'1시간 전',
    description:'안전난간 일부 파손 확인. A동 3층 외벽 작업 구역의 안전난간이 파손되어 추락 위험이 있습니다.',
    reportDate:'2025-11-09', reportTime:'13:20', category:'시설물', severity:'높음'
  },
  {
    id:3, title:'전기 배선 노출', reporter:'박민수', location:'B동 현장',
    status:'resolved', time:'2시간 전',
    description:'전기 배선 노출 상태 발견 및 조치 완료. B동 지하 1층에서 전기 배선이 노출된 상태로 발견되어 즉시 조치하였습니다.',
    reportDate:'2025-11-09', reportTime:'12:15', category:'전기', severity:'중간',
    resolvedBy:'안전관리자 최동욱', resolvedDate:'2025-11-09', resolvedNote:'전기 배선 재정비 완료. 안전 점검 완료.'
  },
  {
    id:4, title:'미끄러짐 위험', reporter:'정수진', location:'지하 1층',
    status:'urgent', time:'3시간 전',
    description:'바닥 물 고임으로 미끄러짐 위험. 지하 1층 통로에 물이 고여있어 미끄러질 위험이 있습니다.',
    reportDate:'2025-11-09', reportTime:'11:30', category:'환경', severity:'높음'
  },
  {
    id:5, title:'화재 안전 점검', reporter:'최동욱', location:'3층 작업장',
    status:'resolved', time:'5시간 전',
    description:'소화기 위치 변경 필요. 3층 작업장의 소화기가 작업 동선에 방해가 되어 위치 변경이 필요합니다.',
    reportDate:'2025-11-09', reportTime:'09:45', category:'화재', severity:'낮음',
    resolvedBy:'안전관리자 최동욱', resolvedDate:'2025-11-09', resolvedNote:'소화기 위치 변경 완료. 접근성 개선.'
  },
];

export default function SafetyReportScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [selected, setSelected] = useState<SafetyReport | null>(MOCK[0] ?? null);

  const urgentCount   = useMemo(()=> MOCK.filter(r=>r.status==='urgent').length, []);
  const pendingCount  = useMemo(()=> MOCK.filter(r=>r.status==='pending').length, []);
  const resolvedCount = useMemo(()=> MOCK.filter(r=>r.status==='resolved').length, []);
  const totalCount    = MOCK.length;

  const StatusBadge = ({ s }: { s: Status }) => {
    let bg='#F3F4F6', fg='#374151', txt='취소';
    if (s==='urgent')  { bg='#FEE2E2'; fg='#B91C1C'; txt='긴급'; }
    if (s==='pending') { bg='#FEF9C3'; fg='#92400E'; txt='대기중'; }
    if (s==='resolved'){ bg='#DCFCE7'; fg='#166534'; txt='완료'; }
    return (
      <View style={[styles.badge,{backgroundColor:bg}]}>
        <Text style={{color:fg, fontSize:12}}>{txt}</Text>
      </View>
    );
  };

  const LeftItem = ({ item }: { item: SafetyReport }) => {
    const sel = selected?.id === item.id;
    const leftBg =
      item.status==='urgent'  ? '#FEE2E2' :
      item.status==='pending' ? '#FEF3C7' :
      item.status==='resolved'? '#DCFCE7' : '#E5E7EB';

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={()=> setSelected(item)}
        style={[styles.leftItem, sel && { backgroundColor:'#EFF6FF', borderLeftColor:'#2563EB' }]}
      >
        <View style={[styles.leftIcon, { backgroundColor:leftBg }]} />
        <View style={{ flex:1 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
            <Text style={{ color:'#111827' }}>{item.title}</Text>
            <StatusBadge s={item.status} />
          </View>
          <Text style={{ color:'#6B7280', fontSize:12, marginTop:2 }}>
            {item.reporter} • {item.location}
          </Text>
          <Text style={{ color:'#9CA3AF', fontSize:12, marginTop:2 }}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {/* 좌측 목록 */}
      <View style={[styles.leftPane, { width: isWide ? 420 : 360 }]}>
        <View style={styles.leftHeader}>
          <Text style={styles.h1}>안전 신고 현황</Text>
          <Text style={styles.h2}>Safety Report Status</Text>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard,{backgroundColor:'#FEE2E2', borderColor:'#FECACA'}]}>
              <Text style={[styles.summaryNum,{color:'#B91C1C'}]}>{urgentCount}</Text>
              <Text style={[styles.summaryLbl,{color:'#991B1B'}]}>긴급</Text>
            </View>
            <View style={[styles.summaryCard,{backgroundColor:'#FEF3C7', borderColor:'#FDE68A'}]}>
              <Text style={[styles.summaryNum,{color:'#92400E'}]}>{pendingCount}</Text>
              <Text style={[styles.summaryLbl,{color:'#92400E'}]}>대기중</Text>
            </View>
            <View style={[styles.summaryCard,{backgroundColor:'#DCFCE7', borderColor:'#A7F3D0'}]}>
              <Text style={[styles.summaryNum,{color:'#166534'}]}>{resolvedCount}</Text>
              <Text style={[styles.summaryLbl,{color:'#166534'}]}>완료</Text>
            </View>
            <View style={[styles.summaryCard,{backgroundColor:'#DBEAFE', borderColor:'#BFDBFE'}]}>
              <Text style={[styles.summaryNum,{color:'#1D4ED8'}]}>{totalCount}</Text>
              <Text style={[styles.summaryLbl,{color:'#1D4ED8'}]}>총 신고</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={MOCK}
          keyExtractor={it=>String(it.id)}
          renderItem={LeftItem}
          ItemSeparatorComponent={()=> <View style={{height:1, backgroundColor:'#F3F4F6'}}/>}
          contentContainerStyle={{ paddingBottom:16 }}
        />
      </View>

      {/* 우측 상세 */}
      <View style={styles.rightPane}>
        {!selected ? (
          <View style={styles.empty}>
            <Text style={{ color:'#9CA3AF' }}>신고를 선택하세요</Text>
            <Text style={{ color:'#9CA3AF', fontSize:12, marginTop:4 }}>
              왼쪽 목록에서 신고를 선택하면 상세 정보가 표시됩니다
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex:1 }} contentContainerStyle={{ padding:16 }}>
            {/* 상태 헤더 */}
            <View style={[
              styles.card,
              selected.status==='urgent'  ? { backgroundColor:'#FEF2F2' } :
              selected.status==='pending' ? { backgroundColor:'#FFFBEB' } :
              selected.status==='resolved'? { backgroundColor:'#ECFDF5' } : { backgroundColor:'#F3F4F6' }
            ]}>
              <Text style={styles.title}>{selected.title}</Text>
              <Text style={styles.sub}>
                {selected.category} • {selected.severity} 위험도
              </Text>
              <View style={{ marginTop:8 }}>
                <StatusBadge s={selected.status} />
              </View>
            </View>

            {/* 신고 정보 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>신고 정보</Text>
              <View style={{ height:8 }} />
              <Row label="신고자" value={selected.reporter} />
              <Row label="위치"  value={selected.location} />
              <Row label="신고 일시" value={`${selected.reportDate} ${selected.reportTime}`} />
            </View>

            {/* 상세 내용 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>상세 내용</Text>
              <Text style={{ color:'#374151', marginTop:8, lineHeight:20 }}>{selected.description}</Text>
            </View>

            {/* 조치 완료 섹션 */}
            {selected.status==='resolved' && (
              <View style={[styles.card,{ backgroundColor:'#ECFDF5', borderColor:'#A7F3D0' }]}>
                <Text style={[styles.cardTitle,{ color:'#065F46' }]}>조치 완료</Text>
                <View style={{ height:8 }} />
                <Row label="조치자" value={selected.resolvedBy ?? '-'} />
                <Row label="조치 일시" value={selected.resolvedDate ?? '-'} />
                {selected.resolvedNote ? (
                  <View style={{ marginTop:12 }}>
                    <Text style={{ color:'#065F46', fontSize:12, marginBottom:4 }}>조치 내용</Text>
                    <Text style={{ color:'#065F46' }}>{selected.resolvedNote}</Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* 액션 버튼(예시) */}
            {(selected.status==='urgent' || selected.status==='pending') && (
              <TouchableOpacity style={styles.primaryBtn} onPress={()=>{ /* TODO: 조치 플로우 연결 */ }}>
                <Text style={styles.primaryBtnText}>
                  {selected.status==='urgent' ? '긴급 조치 시작' : '조치 시작'}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

function Row({ label, value }:{ label:string; value?:string }) {
  return (
    <View style={{ marginVertical:4 }}>
      <Text style={{ color:'#6B7280', fontSize:12, marginBottom:2 }}>{label}</Text>
      <Text style={{ color:'#111827' }}>{value ?? '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#F3F4F6', flexDirection:'row' },

  leftPane:{ backgroundColor:'#FFFFFF', borderRightWidth:1, borderRightColor:'#E5E7EB' },
  leftHeader:{ padding:16, borderBottomWidth:1, borderBottomColor:'#E5E7EB' },
  h1:{ color:'#111827', fontSize:16, fontWeight:'700' },
  h2:{ color:'#6B7280', fontSize:12, marginTop:2 },

  summaryRow:{ flexDirection:'row', gap:8, marginTop:12 },
  summaryCard:{ flex:1, borderWidth:1, borderRadius:10, paddingVertical:10, alignItems:'center' },
  summaryNum:{ fontSize:18, fontWeight:'700' },
  summaryLbl:{ fontSize:12, marginTop:2 },

  leftItem:{ flexDirection:'row', paddingHorizontal:12, paddingVertical:14, borderLeftWidth:4, borderLeftColor:'transparent' },
  leftIcon:{ width:32, height:32, borderRadius:8, marginRight:10 },

  rightPane:{ flex:1 },
  empty:{ flex:1, alignItems:'center', justifyContent:'center' },

  card:{ backgroundColor:'#FFFFFF', borderWidth:1, borderColor:'#E5E7EB', borderRadius:12, padding:16, marginBottom:12 },
  title:{ color:'#111827', fontSize:16, fontWeight:'700' },
  sub:{ color:'#6B7280', marginTop:2 },

  cardTitle:{ color:'#111827', fontWeight:'600' },

  badge:{ paddingHorizontal:8, paddingVertical:4, borderRadius:10, alignSelf:'flex-start' },

  primaryBtn:{ backgroundColor:'#2563EB', borderRadius:10, paddingVertical:14, alignItems:'center', marginTop:8 },
  primaryBtnText:{ color:'#FFFFFF', fontWeight:'600' },
});