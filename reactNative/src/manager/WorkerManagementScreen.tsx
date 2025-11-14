// src/manager/WorkerManagementScreen.tsx
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  useWindowDimensions, ScrollView, Modal, Alert
} from 'react-native';


type WorkerStatus = 'working' | 'resting' | 'late';

interface AttendanceRecord {
  date: string;
  checkInTime: string;
  checkInPeriod: '오전' | '오후' | '-';
  checkOutTime: string;
  checkOutPeriod: '오전' | '오후' | '-';
  status: '정상' | '정상 출근' | '지각' | '조퇴' | '결근';
  objection?: { hasObjection: boolean; message: string };
}

interface Worker {
  id: number;
  name: string;
  initial: string;
  role: string;
  status: WorkerStatus;
  site: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  phone?: string;
  attendanceRecords: AttendanceRecord[];
}

export default function WorkerManagementScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [workers, setWorkers] = useState<Worker[]>(/* === 더미데이터: 전달받은 값 그대로 === */[
    { 
      id: 1, name: '김철수', initial: '김', role: '배관공', status: 'working', site: '세종 A현장',
      address: '서울시 강남구 테헤란로 123', birthDate: '1990. 05. 15.', gender: '남성',
      nationality: '대한민국', phone: '010-1234-5678',
      attendanceRecords: [
        { date:'2025-11-01', checkInTime:'08:00', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-31', checkInTime:'08:15', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'지각',
          objection:{ hasObjection:true, message:'실제로는 8시에 도착했습니다. 단말기 오류로 인해 늦게 찍혔습니다' } },
        { date:'2025-10-30', checkInTime:'08:05', checkInPeriod:'오전', checkOutTime:'06:10', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-28', checkInTime:'07:58', checkInPeriod:'오전', checkOutTime:'06:05', checkOutPeriod:'오후', status:'정상' },
      ]
    },
    { 
      id: 2, name: '이영희', initial: '이', role: '목공', status: 'working', site: '세종 A현장',
      address: '서울시 강남구 테헤란로 123', birthDate: '1990. 05. 15.', gender: '여성',
      nationality: '대한민국', phone: '010-2345-6789',
      attendanceRecords: [
        { date:'2025-11-01', checkInTime:'07:55', checkInPeriod:'오전', checkOutTime:'05:58', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-31', checkInTime:'08:00', checkInPeriod:'오전', checkOutTime:'05:30', checkOutPeriod:'오후', status:'조퇴' },
        { date:'2025-10-30', checkInTime:'08:02', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-28', checkInTime:'07:50', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
      ]
    },
    { 
      id: 3, name: '박민수', initial: '박', role: '전기공', status: 'late', site: '서울 B현장',
      address: '서울시 강남구 테헤란로 123', birthDate: '1990. 05. 15.', gender: '남성',
      nationality: '대한민국', phone: '010-3456-7890',
      attendanceRecords: [
        { date:'2025-11-01', checkInTime:'08:25', checkInPeriod:'오전', checkOutTime:'06:15', checkOutPeriod:'오후', status:'지각' },
        { date:'2025-10-31', checkInTime:'08:20', checkInPeriod:'오전', checkOutTime:'06:05', checkOutPeriod:'오후', status:'지각' },
        { date:'2025-10-30', checkInTime:'08:00', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-28', checkInTime:'-', checkInPeriod:'-', checkOutTime:'-', checkOutPeriod:'-', status:'결근' },
      ]
    },
    { 
      id: 4, name: '정수진', initial: '정', role: '배관공', status: 'resting', site: '서울 B현장',
      address: '서울시 강남구 테헤란로 123', birthDate: '1990. 05. 15.', gender: '여성',
      nationality: '대한민국', phone: '010-4567-8901',
      attendanceRecords: [
        { date:'2025-11-01', checkInTime:'08:03', checkInPeriod:'오전', checkOutTime:'05:55', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-31', checkInTime:'07:58', checkInPeriod:'오전', checkOutTime:'06:02', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-30', checkInTime:'08:00', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-28', checkInTime:'08:01', checkInPeriod:'오전', checkOutTime:'06:03', checkOutPeriod:'오후', status:'정상' },
      ]
    },
    { 
      id: 5, name: '최동욱', initial: '최', role: '용접공', status: 'working', site: '서울 C현장',
      address: '서울시 강남구 테헤란로 123', birthDate: '1990. 05. 15.', gender: '남성',
      nationality: '대한민국', phone: '010-5678-9012',
      attendanceRecords: [
        { date:'2025-11-01', checkInTime:'08:10', checkInPeriod:'오전', checkOutTime:'06:20', checkOutPeriod:'오후', status:'지각' },
        { date:'2025-10-31', checkInTime:'08:00', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-30', checkInTime:'07:55', checkInPeriod:'오전', checkOutTime:'06:10', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-28', checkInTime:'08:05', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
      ]
    },
    { 
      id: 6, name: '강민지', initial: '강', role: '도장공', status: 'working', site: '서울 C현장',
      address: '서울시 강남구 테헤란로 123', birthDate: '1990. 05. 15.', gender: '여성',
      nationality: '대한민국', phone: '010-6789-0123',
      attendanceRecords: [
        { date:'2025-11-01', checkInTime:'07:52', checkInPeriod:'오전', checkOutTime:'05:58', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-31', checkInTime:'08:00', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
        { date:'2025-10-30', checkInTime:'08:30', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'지각',
          objection:{ hasObjection:true, message:'버스가 연착되어 늦었습니다. 정류장 CCTV로 확인 가능합니다' } },
        { date:'2025-10-28', checkInTime:'08:00', checkInPeriod:'오전', checkOutTime:'06:00', checkOutPeriod:'오후', status:'정상' },
      ]
    },
  ]);

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [search, setSearch] = useState('');
  const [showPayroll, setShowPayroll] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showRegister, setShowRegister] = useState(false);  // ★ 근로자 등록 패널 표시 여부
  // Objection modal state
  const [objectionOpen, setObjectionOpen] = useState(false);
  const [objDate, setObjDate] = useState('2025-10-31');
  const [objInPeriod, setObjInPeriod] = useState<'오전'|'오후'>('오전');
  const [objInTime, setObjInTime] = useState('08:15');
  const [objOutPeriod, setObjOutPeriod] = useState<'오전'|'오후'>('오후');
  const [objOutTime, setObjOutTime] = useState('06:00');
  const [objStatus, setObjStatus] = useState<'정상 출근'|'지각'|'조퇴'|'결근'>('지각');

  useEffect(() => {
    if (!selectedWorker && workers.length > 0) setSelectedWorker(workers[0]);
  }, [workers, selectedWorker]);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return workers;
    return workers.filter(w =>
      w.name.includes(q) || w.role.includes(q)
    );
  }, [workers, search]);

  const hasObjection = (w: Worker) => w.attendanceRecords.some(r => r.objection?.hasObjection);

  const statusBadge = (s: WorkerStatus) => {
    switch (s) {
      case 'working': return { label:'근무중', bg:'#E6F4EA', fg:'#1E7D32' };
      case 'resting': return { label:'대기중', bg:'#F3F4F6', fg:'#374151' };
      case 'late':    return { label:'퇴근미처리', bg:'#FEF3E7', fg:'#9A3412' };
    }
  };

  const statCounts = useMemo(() => ({
    total: workers.length,
    working: workers.filter(w => w.status==='working').length,
    resting: workers.filter(w => w.status==='resting').length,
    objections: workers.filter(hasObjection).length,
  }), [workers]);

  const openObjection = (rec: AttendanceRecord) => {
    if (!selectedWorker) return;
    setObjDate(rec.date);
    setObjInPeriod(rec.checkInPeriod==='오전'?'오전':'오후');
    setObjInTime(rec.checkInTime);
    setObjOutPeriod(rec.checkOutPeriod==='오전'?'오전':'오후');
    setObjOutTime(rec.checkOutTime);
    setObjStatus(rec.status as any);
    setObjectionOpen(true);
  };

  const processObjection = () => {
    if (!selectedWorker) return;
    const updated = workers.map(w => {
      if (w.id !== selectedWorker.id) return w;
      const recs = w.attendanceRecords.map(r => {
        if (r.date !== objDate) return r;
        return {
          ...r,
          checkInPeriod: objInPeriod,
          checkInTime: objInTime,
          checkOutPeriod: objOutPeriod,
          checkOutTime: objOutTime,
          status: objStatus,
          objection: undefined,
        };
      });
      return { ...w, attendanceRecords: recs };
    });
    setWorkers(updated);
    const nw = updated.find(w => w.id === selectedWorker.id)!;
    setSelectedWorker(nw);
    setObjectionOpen(false);
  };

  const LeftItem = ({ item }: { item: Worker }) => {
    const sel = selectedWorker?.id === item.id;
    const b = statusBadge(item.status);
    return (
      <TouchableOpacity
        onPress={() => { setSelectedWorker(item); setShowPayroll(false); setShowCertificates(false); setShowRegister(false); }}
        style={[styles.listItem, sel && styles.listItemSelected]}
        activeOpacity={0.8}
      >
        <View style={[styles.avatar, { backgroundColor:'#E0ECFF' }]}>
          <Text style={{ color:'#2563EB', fontWeight:'700' }}>{item.initial}</Text>
        </View>
        <View style={{ flex:1 }}>
          <View style={{ flexDirection:'row', alignItems:'center' }}>
            <Text style={styles.listName}>{item.name}</Text>
            <View style={[styles.badge, { backgroundColor:b.bg }]}>
              <Text style={{ color:b.fg, fontSize:11 }}>{b.label}</Text>
            </View>
            {hasObjection(item) && <Text style={{ marginLeft:6, color:'#DC2626', fontSize:12 }}>이의제기 대기</Text>}
          </View>
          <Text style={{ color:'#6B7280', fontSize:12 }}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {/* Left panel */}
      <View style={[styles.left, { width: isTablet ? 360 : Math.min(360, width) }]}>
        <View style={styles.leftHeader}>
          <View style={{ marginBottom:16 }}>
            <Text style={styles.title}>근로자 관리</Text>
            <Text style={styles.subtitle}>Worker Management</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => {
            // ★ 근로자 등록 화면 열기
            setShowRegister(true);
            setShowPayroll(false);
            setShowCertificates(false);
            setSelectedWorker(null);
          }}
>
            <Text style={styles.primaryBtnText}>+ 근로자 추가</Text>
          </TouchableOpacity>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="이름, 직종 검색..."
            style={styles.search}
          />

          <View style={styles.statsRow}>
            <View style={styles.statBox}><Text style={styles.statLbl}>전체</Text><Text style={[styles.statVal,{color:'#2563EB'}]}>{statCounts.total}</Text></View>
            <View style={styles.statBox}><Text style={styles.statLbl}>근무중</Text><Text style={[styles.statVal,{color:'#16A34A'}]}>{statCounts.working}</Text></View>
            <View style={styles.statBox}><Text style={styles.statLbl}>대기중</Text><Text style={[styles.statVal,{color:'#374151'}]}>{statCounts.resting}</Text></View>
            <View style={styles.statBox}><Text style={styles.statLbl}>이의제기</Text><Text style={[styles.statVal,{color:'#DC2626'}]}>{statCounts.objections}</Text></View>
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(it)=>String(it.id)}
          renderItem={LeftItem}
          contentContainerStyle={{ paddingBottom:24 }}
        />
      </View>

      {/* Right panel */}
      {/* Right panel */}
<View style={styles.right}>
  {/* 1) 근로자 등록 패널 */}
  {showRegister ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24, alignItems: 'center' }}
    >
      <View style={[styles.card, { padding: 20 }]}>
        <Text style={styles.sectionTitle}>근로자 등록</Text>
        <Text style={styles.subtitleSmall}>Register Worker</Text>

        <View style={{ height: 16 }} />

        {/* 서류 첨부 영역 */}
        <View style={[styles.card, { width: "100%" }]}>
          <Text style={styles.sectionTitle}>서류 첨부</Text>
          <Text style={styles.mutedSmall}>Document Attachments</Text>

          <View style={{ height: 12 }} />

          <TouchableOpacity
            style={[styles.docBtn]}
            onPress={() => Alert.alert('계약서 생성 화면')}
          >
            <Text style={{ color: '#111827' }}>계약서 생성</Text>
            <Text style={{ color: '#9CA3AF' }}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docBtn]}
            onPress={() => Alert.alert('신분증 촬영 (카메라 실행)')}
          >
            <Text style={{ color: '#111827' }}>신분증 촬영</Text>
            <Text style={{ color: '#9CA3AF' }}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        {/* 계약 정보 */}
        <View style={[styles.card, { width: "100%" }]}>
          <Text style={styles.sectionTitle}>계약 정보</Text>
          <Text style={styles.subtitleSmall}>Contract Details</Text>

          <View style={{ height: 12 }} />

          <Field label="근무 시간" value="예: 08:00 ~ 18:00" />
          <Field label="휴게 시간" value="예: 12:00 ~ 13:00" />
          <Field label="계약 시작일" value="날짜 선택" />
          <Field label="계약 종료일" value="날짜 선택" />
          <Field label="일급" value="일급을 입력하세요" />
          <Field label="업무 내용" value="업무를 입력하세요" />
        </View>

        {/* 개인 정보 */}
        <View style={[styles.card, { width: "100%" }]}>
          <Text style={styles.sectionTitle}>개인 정보</Text>
          <Text style={styles.subtitleSmall}>Personal Information</Text>
          <View style={{ height: 12 }} />

          <Field label="이름" value="이름 입력" />
          <Field label="생년월일" value="날짜 선택" />
          <Field label="성별" value="남성 / 여성" />
          <Field label="연락처" value="010-0000-0000" />
          <Field label="주소" value="주소 입력" />
        </View>

        {/* 하단 버튼 */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: "100%" }}>
          <TouchableOpacity
            style={[styles.outlineBtn, { marginRight: 8 }]}
            onPress={() => setShowRegister(false)}
          >
            <Text>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtnSmall}
            onPress={() => {
              Alert.alert('등록 완료');
              setShowRegister(false);
            }}
          >
            <Text style={styles.primaryBtnText}>등록</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  ) : 

  /* 2) 근로자 선택 X */
  !selectedWorker ? (
    <View style={styles.empty}>
      <Text style={{ color:'#9CA3AF', fontSize:16 }}>근로자를 선택하세요</Text>
      <Text style={{ color:'#9CA3AF', marginTop:4, fontSize:12 }}>
        왼쪽 목록에서 근로자를 선택하면 상세 정보가 표시됩니다
      </Text>
    </View>
  ) :

  /* 3) 급여 명세서 모드 */
  showPayroll ? (
    <View style={styles.placeholder}>
      <Text>급여 명세서 보기 (향후 연결)</Text>
    </View>
  ) :

  /* 4) 자격증 보기 모드 */
  showCertificates ? (
    <View style={styles.placeholder}>
      <Text>자격증 보기 (향후 연결)</Text>
    </View>
  ) :

  /* 5) 기본 근로자 상세 정보 화면 */
  (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24, alignItems: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      {/* 기본 프로필 */}
      <View style={[styles.card, { padding:20 }]}>
        <View style={{ flexDirection:'row', alignItems:'center' }}>
          <View style={[styles.bigAvatar, { backgroundColor:'#E0ECFF' }]}>
            <Text style={{ color:'#2563EB', fontWeight:'700', fontSize:24 }}>
              {selectedWorker.initial}
            </Text>
          </View>
          <View style={{ marginLeft:16 }}>
            <Text style={styles.name}>{selectedWorker.name}</Text>
            <Text style={styles.muted}>{selectedWorker.role} • {selectedWorker.site}</Text>
            <Text style={styles.muted}>{selectedWorker.phone ?? '010-1234-5678'}</Text>
          </View>
        </View>
      </View>

      {/* 개인정보 */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>개인정보</Text>
        <View style={{ height:8 }} />
        <Field label="주소" value={selectedWorker.address} />
        <Field label="생년월일" value={selectedWorker.birthDate} />
        <EditableField
          label="직종"
          value={selectedWorker.role}
          onSave={(v)=> {
            setWorkers(ws => ws.map(w => w.id === selectedWorker?.id ? { ...w, role: v } : w));
            setSelectedWorker(prev => (prev ? { ...prev, role: v } : prev));
          }}
        />
        <EditableField
          label="현장명"
          value={selectedWorker.site}
          onSave={(v)=> {
            setWorkers(ws => ws.map(w => w.id === selectedWorker?.id ? { ...w, site: v } : w));
            setSelectedWorker(prev => (prev ? { ...prev, site: v } : prev));
          }}
        />
      </View>

      {/* 기타 정보 */}
      <View style={styles.card}>
        <Field label="성별" value={selectedWorker.gender} />
        <Field label="국적" value={selectedWorker.nationality} />
        <Field label="전화번호" value={selectedWorker.phone} />
      </View>

      {/* 문서 버튼 */}
      <View style={{ width:'100%', maxWidth:880 }}>
        <DocButton title="근로 계약서 보기" subtitle="View Work Contract" onPress={()=>Alert.alert('계약서 보기')} />
        <DocButton title="급여 명세서 보기" subtitle="View Payroll Statement" tone="yellow" onPress={()=>setShowPayroll(true)} />
        <DocButton
          title="자격증 보기"
          subtitle="View Certificate"
          tone="green"
          onPress={() =>
            navigation.navigate('ManagerCertificates', {
              worker: {
                id: selectedWorker.id,
                name: selectedWorker.name,
                role: selectedWorker.role,
                site: selectedWorker.site,
              },
            })
          }
        />
      </View>

      {/* 출퇴근 기록 */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>출퇴근 기록</Text>
            <Text style={styles.subtitleSmall}>Attendance History</Text>
          </View>
          <TouchableOpacity style={styles.outlineBtn} onPress={()=>Alert.alert('다운로드')}>
            <Text style={{ color:'#374151' }}>다운로드</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableHeader}>
          <TableTh text="날짜" />
          <TableTh text="출근" />
          <TableTh text="퇴근" />
          <TableTh text="상태" />
          <TableTh text="이의제기" />
        </View>

        {selectedWorker.attendanceRecords.map(rec => (
          <TouchableOpacity
            key={rec.date}
            onPress={()=>openObjection(rec)}
            activeOpacity={0.8}
            style={[styles.tableRow, rec.objection?.hasObjection && { backgroundColor:'#FFF7ED' }]}
          >
            <TableTd text={rec.date} />
            <TableTd text={`${rec.checkInTime} (${rec.checkInPeriod})`} color="#16A34A" />
            <TableTd text={`${rec.checkOutTime} (${rec.checkOutPeriod})`} color="#DC2626" />
            <View style={[styles.td, { flex:1.2 }]}>
              <StatusPill status={rec.status} />
            </View>
            <View style={[styles.td, { flex:2 }]}>
              {rec.objection?.hasObjection ? (
                <View>
                  <Text style={{ fontSize:12, color:'#9A3412' }}>이의제기</Text>
                  <Text style={{ fontSize:12, color:'#6B7280' }}>{rec.objection.message}</Text>
                </View>
              ) : <Text style={{ color:'#6B7280' }}>-</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )}
</View>
      {/* 이의제기 모달 */}
      <Modal visible={objectionOpen} transparent animationType="fade" onRequestClose={()=>setObjectionOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>이의제기 처리</Text>
            {selectedWorker && (
              <>
                <Text style={{ marginTop:8, color:'#374151' }}>
                  {selectedWorker.name} · {selectedWorker.role} · {selectedWorker.site}
                </Text>

                <View style={{ height:12 }} />
                <Field label="날짜" value={objDate} />

                <View style={{ height:12 }} />
                <Text style={styles.label}>수정할 출근 시간</Text>
                <View style={styles.row2}>
                  <Toggle2 values={['오전','오후']} value={objInPeriod} onChange={(v)=>setObjInPeriod(v as any)} />
                  <TextInput value={objInTime} onChangeText={setObjInTime} style={styles.timeInput} />
                </View>

                <View style={{ height:12 }} />
                <Text style={styles.label}>수정할 퇴근 시간</Text>
                <View style={styles.row2}>
                  <Toggle2 values={['오전','오후']} value={objOutPeriod} onChange={(v)=>setObjOutPeriod(v as any)} />
                  <TextInput value={objOutTime} onChangeText={setObjOutTime} style={styles.timeInput} />
                </View>

                <View style={{ height:12 }} />
                <Text style={styles.label}>출퇴근 상태</Text>
                <Toggle2
                  values={['정상 출근','지각','조퇴','결근']}
                  value={objStatus}
                  onChange={(v)=>setObjStatus(v as any)}
                  wide
                />

                <View style={{ height:16 }} />
                <View style={{ flexDirection:'row', justifyContent:'flex-end' }}>
                  <TouchableOpacity style={styles.outlineBtn} onPress={()=>setObjectionOpen(false)}>
                    <Text>취소</Text>
                  </TouchableOpacity>
                  <View style={{ width:8 }} />
                  <TouchableOpacity style={styles.primaryBtnSmall} onPress={processObjection}>
                    <Text style={styles.primaryBtnText}>처리 완료</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- 재사용 소품 ---------- */
function Field({ label, value }:{label:string; value?:string}) {
  return (
    <View style={{ marginVertical:6 }}>
      <Text style={{ color:'#6B7280', fontSize:12, marginBottom:4 }}>{label}</Text>
      <Text style={{ color:'#111827', fontSize:14 }}>{value ?? '-'}</Text>
    </View>
  );
}

function EditableField({ label, value, onSave }:{label:string; value?:string; onSave:(v:string)=>void}) {
  const [edit, setEdit] = useState(false);
  const [temp, setTemp] = useState(value ?? '');
  return (
    <View style={{ marginVertical:6 }}>
      <Text style={{ color:'#6B7280', fontSize:12, marginBottom:4 }}>{label}</Text>
      {edit ? (
        <View style={{ flexDirection:'row', alignItems:'center' }}>
          <TextInput value={temp} onChangeText={setTemp} style={[styles.input, { flex:1 }]} autoFocus />
          <TouchableOpacity onPress={()=>{ onSave(temp.trim()); setEdit(false); }} style={[styles.primaryBtnSmall,{ marginLeft:8 }]}>
            <Text style={styles.primaryBtnText}>저장</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{ setTemp(value ?? ''); setEdit(false); }} style={[styles.outlineBtn,{ marginLeft:8 }]}>
            <Text>취소</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
          <Text style={{ color:'#111827', fontSize:14 }}>{value ?? '-'}</Text>
          <TouchableOpacity onPress={()=>setEdit(true)}><Text style={{ color:'#2563EB' }}>편집</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function DocButton({ title, subtitle, onPress, tone }:{
  title:string; subtitle:string; onPress:()=>void; tone?:'yellow'|'green';
}) {
  const bg = tone==='yellow' ? '#FEF9C3' : tone==='green' ? '#DCFCE7' : '#FFFFFF';
  const bd = tone ? '#E5E7EB' : '#E5E7EB';
  return (
    <TouchableOpacity onPress={onPress} style={[styles.docBtn,{ backgroundColor:bg, borderColor:bd }]}>
      <View>
        <Text style={{ color:'#111827' }}>{title}</Text>
        <Text style={{ color:'#6B7280', fontSize:12 }}>{subtitle}</Text>
      </View>
      <Text style={{ color:'#9CA3AF' }}>{'>'}</Text>
    </TouchableOpacity>
  );
}

function StatusPill({ status }:{ status: AttendanceRecord['status'] }) {
  let bg='#F3F4F6', fg='#374151';
  if (status==='정상' || status==='정상 출근') { bg='#DCFCE7'; fg='#166534'; }
  else if (status==='지각') { bg='#FFEFD5'; fg='#9A3412'; }
  else if (status==='조퇴') { bg='#FEF3C7'; fg='#92400E'; }
  else if (status==='결근') { bg='#FEE2E2'; fg='#991B1B'; }
  return (
    <View style={{ backgroundColor:bg, paddingHorizontal:8, paddingVertical:4, borderRadius:12 }}>
      <Text style={{ color:fg, fontSize:12 }}>{status}</Text>
    </View>
  );
}

function TableTh({ text }:{text:string}) {
  return <View style={[styles.th]}><Text style={{ color:'#6B7280', fontSize:12 }}>{text}</Text></View>;
}
function TableTd({ text, color }:{text:string; color?:string}) {
  return <View style={[styles.td]}><Text style={{ color: color ?? '#111827', fontSize:13 }}>{text}</Text></View>;
}

function Toggle2({ values, value, onChange, wide }:{
  values: string[];
  value: string;
  onChange: (v:string)=>void;
  wide?: boolean;
}) {
  return (
    <View style={[styles.toggle, wide && { flexWrap:'wrap' }]}>
      {values.map(v => {
        const sel = v===value;
        return (
          <TouchableOpacity key={v} onPress={()=>onChange(v)} style={[styles.toggleItem, sel && styles.toggleItemSel]}>
            <Text style={{ color: sel ? '#FFFFFF' : '#374151' }}>{v}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ---------- 스타일 ---------- */
const styles = StyleSheet.create({

name: {
  fontSize: 18,
  fontWeight: '700',
  color: '#111827',
},
muted: {
  color: '#6B7280',
  fontSize: 12,
  marginTop: 2,
},
mutedSmall: {
  color: '#9CA3AF',
  fontSize: 11,
},
  root: { flex:1, backgroundColor:'#FFFFFF', flexDirection:'row' },
  left: { borderRightWidth:1, borderRightColor:'#E5E7EB', backgroundColor:'#FFFFFF' },
  leftHeader: { padding:16, borderBottomWidth:1, borderBottomColor:'#E5E7EB' },
  title: { fontSize:18, color:'#111827', fontWeight:'600' },
  subtitle: { color:'#6B7280', fontSize:12 },
  primaryBtn: { backgroundColor:'#2563EB', paddingVertical:12, borderRadius:10, alignItems:'center', marginBottom:12 },
  primaryBtnSmall: { backgroundColor:'#2563EB', paddingVertical:8, paddingHorizontal:14, borderRadius:8, alignItems:'center' },
  primaryBtnText: { color:'#FFFFFF', fontWeight:'600' },
  search: { backgroundColor:'#F9FAFB', borderWidth:1, borderColor:'#E5E7EB', borderRadius:10, paddingHorizontal:12, height:40, marginBottom:12 },
  statsRow: { flexDirection:'row', justifyContent:'space-between', gap:8 },
  statBox: { flex:1, alignItems:'center', paddingVertical:8 },
  statLbl: { color:'#6B7280', fontSize:11, marginBottom:4 },
  statVal: { fontSize:20, fontWeight:'700' },

  mr8: { marginRight: 8 },
  mb8: { marginBottom: 8 },
  
  listItem: { flexDirection:'row', paddingVertical:12, paddingHorizontal:16, borderLeftWidth:4, borderLeftColor:'transparent' },
  listItemSelected: { backgroundColor:'#EEF2FF', borderLeftColor:'#2563EB' },
  listName: { color:'#111827', fontSize:14, marginRight:6 },
  badge: { marginLeft:6, paddingHorizontal:8, paddingVertical:2, borderRadius:10 },

  avatar: { width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center', marginRight:12 },
  bigAvatar: { width:72, height:72, borderRadius:36, alignItems:'center', justifyContent:'center' },

  right: { flex:1, backgroundColor:'#F9FAFB' },
  empty: { flex:1, alignItems:'center', justifyContent:'center' },
  placeholder: { flex:1, alignItems:'center', justifyContent:'center' },

  card: { width:'100%', maxWidth:880, backgroundColor:'#FFFFFF', padding:16, borderRadius:12, borderWidth:1, borderColor:'#E5E7EB', marginBottom:16 },
  sectionTitle: { fontSize:16, color:'#111827', fontWeight:'600' },
  subtitleSmall: { color:'#6B7280', fontSize:12 },

  input: { backgroundColor:'#F9FAFB', borderWidth:1, borderColor:'#E5E7EB', borderRadius:10, paddingHorizontal:12, height:40 },

  docBtn: { width:'100%', maxWidth:880, borderWidth:1, borderRadius:12, padding:16, marginBottom:8, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },

  cardHeaderRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  outlineBtn: { borderWidth:1, borderColor:'#D1D5DB', borderRadius:10, paddingVertical:8, paddingHorizontal:12, backgroundColor:'#FFFFFF' },

  tableHeader: { flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#E5E7EB', paddingVertical:8, marginTop:8 },
  th: { flex:1, paddingHorizontal:8 },
  td: { flex:1, paddingHorizontal:8, paddingVertical:10 },
  tableRow: { flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#F3F4F6' },

  modalBackdrop: { flex:1, backgroundColor:'rgba(0,0,0,0.35)', alignItems:'center', justifyContent:'center', padding:16 },
  modalCard: { width:'100%', maxWidth:560, backgroundColor:'#FFFFFF', borderRadius:12, padding:16 },
  modalTitle: { fontSize:18, fontWeight:'600', color:'#111827' },
  label: { color:'#374151', marginBottom:6 },
  row2: { flexDirection:'row', gap:8 },
  timeInput: { flex:1, backgroundColor:'#F3F4F6', borderWidth:1, borderColor:'#E5E7EB', borderRadius:10, paddingHorizontal:12, height:40 },
  toggle: { flexDirection:'row', backgroundColor:'#F3F4F6', padding:4, borderRadius:10 },
  toggleItem: { paddingVertical:8, paddingHorizontal:12, borderRadius:8, marginRight:6, marginBottom:6 },
  toggleItemSel: { backgroundColor:'#2563EB' },
});