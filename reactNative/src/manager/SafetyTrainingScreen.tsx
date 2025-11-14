// src/manager/SafetyTrainingScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';

type TrainingStatus = 'scheduled' | 'completed' | 'cancelled';

interface TrainingLog {
  id: number;
  title: string;
  date: string;
  time: string;
  course: string;
  subject: string;
  content: string;
  instructor: string;
  location: string;
  participants: number;
  capacity: number;
  status: TrainingStatus;
  notes: string;
}

const SafetyTrainingScreen: React.FC = () => {
  const [trainingLogs, setTrainingLogs] = useState<TrainingLog[]>([
    {
      id: 1,
      title: '고소작업 안전교육',
      date: '2025-11-05',
      time: '09:00',
      course: '안전보건교육',
      subject: '추락재해 예방',
      content:
        '고소작업 시 안전수칙 및 안전장비 착용 방법, 추락 방지 설비 점검 요령에 대한 교육을 실시합니다.\n\n주요 내용:\n1. 안전대 및 안전모 착용법\n2. 작업발판 설치 기준\n3. 추락방지망 설치 방법\n4. 비상시 대응 절차\n\n실습 항목:\n- 안전장비 착용 실습\n- 작업발판 점검 실습',
      instructor: '김철수 (안전관리팀 과장)',
      location: '본관 1층 대회의실',
      participants: 24,
      capacity: 30,
      status: 'scheduled',
      notes:
        '실습용 안전장비 30세트 준비 필요. 교육 후 수료증 발급 예정.',
    },
    {
      id: 2,
      title: '화재 예방 및 대응',
      date: '2025-11-03',
      time: '14:00',
      course: '소방안전교육',
      subject: '화재예방 및 초기진압',
      content:
        '현장 내 화재 예방 및 발생 시 초기 대응 방법에 대한 교육을 실시합니다.\n\n주요 내용:\n1. 화재 발생 원인 및 예방법\n2. 소화기 사용법\n3. 대피 경로 및 절차\n4. 비상연락체계\n\n실습 항목:\n- 소화기 실습\n- 비상대피 훈련',
      instructor: '이영희 (소방안전팀 과장)',
      location: '야외 실습장',
      participants: 18,
      capacity: 25,
      status: 'scheduled',
      notes:
        '소화기 10대 준비. 우천 시 교육장 변경 가능 (2층 교육장)',
    },
    {
      id: 3,
      title: '전기 안전 기초',
      date: '2025-10-28',
      time: '10:00',
      course: '전기안전교육',
      subject: '감전재해 예방',
      content:
        '전기 작업 시 감전 사고 예방을 위한 기본 안전 수칙 교육을 실시했습니다.\n\n주요 내용:\n1. 전기의 위험성\n2. 절연장갑 및 절연화 착용\n3. 활선작업 금지 원칙\n4. 정전작업 절차\n\n실습 항목:\n- 절연장갑 착용 실습\n- 검전기 사용법',
      instructor: '박민수 (전기안전팀 과장)',
      location: '본관 1층 대회의실',
      participants: 30,
      capacity: 30,
      status: 'completed',
      notes:
        '전원 근로자 참석 완료. 교육 만족도 평균 4.8/5.0. 수료증 발급 완료.',
    },
    {
      id: 4,
      title: '중장비 안전 교육',
      date: '2025-10-25',
      time: '13:00',
      course: '장비안전교육',
      subject: '중장비 안전운행',
      content:
        '현장 내 중장비 안전 운행 및 작업 시 안전 수칙에 대한 교육을 실시했습니다.\n\n주요 내용:\n1. 중장비 작업 전 점검사항\n2. 유도자 배치 및 신호 체계\n3. 작업 반경 내 출입 통제\n4. 장비 정비 및 관리\n\n실습 항목:\n- 중장비 점검 실습\n- 신호수 교육',
      instructor: '최영수 (설비관리팀 과장)',
      location: '야외 실습장',
      participants: 15,
      capacity: 20,
      status: 'completed',
      notes:
        '중장비 운전자 15명 전원 참석. 실습 중 안전사고 없음. 다음 보수교육은 3개월 후 실시 예정.',
    },
    {
      id: 5,
      title: '밀폐공간 작업 안전',
      date: '2025-10-20',
      time: '09:00',
      course: '특수작업교육',
      subject: '밀폐공간 질식재해 예방',
      content:
        '밀폐공간 작업 시 질식 및 중독 사고 예방을 위한 안전 교육을 실시했습니다.\n\n주요 내용:\n1. 밀폐공간 정의 및 위험성\n2. 작업 전 산소농도 측정\n3. 환기 설비 운영\n4. 안전감시자 배치\n\n실습 항목:\n- 산소농도측정기 사용법\n- 송기마스크 착용 실습',
      instructor: '정대호 (안전관리팀 대리)',
      location: '본관 2층 교육장',
      participants: 12,
      capacity: 15,
      status: 'completed',
      notes: '밀폐공간 작업 예정자 전원 이수. 측정기 및 보호구 지급 완료.',
    },
  ]);

  const [selectedLog, setSelectedLog] = useState<TrainingLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedLog, setEditedLog] = useState<TrainingLog | null>(null);

  const scheduledCount = trainingLogs.filter(
    log => log.status === 'scheduled',
  ).length;
  const completedCount = trainingLogs.filter(
    log => log.status === 'completed',
  ).length;

  const onPressCreate = () => {
    const base: TrainingLog = {
      id: trainingLogs.length + 1,
      title: '',
      date: new Date().toISOString().slice(0, 10),
      time: '09:00',
      course: '',
      subject: '',
      content: '',
      instructor: '',
      location: '',
      participants: 0,
      capacity: 30,
      status: 'scheduled',
      notes: '',
    };
    setEditedLog(base);
    setIsCreating(true);
    setIsEditing(false);
    setSelectedLog(null);
  };

  const saveCreate = () => {
    if (!editedLog) return;
    setTrainingLogs(prev => [...prev, editedLog]);
    setSelectedLog(editedLog);
    setIsCreating(false);
  };

  const saveEdit = () => {
    if (!editedLog) return;
    setTrainingLogs(prev =>
      prev.map(log => (log.id === editedLog.id ? editedLog : log)),
    );
    setSelectedLog(editedLog);
    setIsEditing(false);
  };

  const cancelForm = () => {
    setEditedLog(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const renderStatusBadge = (status: TrainingStatus) => {
    let bg = '#DBEAFE';
    let text = '#1D4ED8';
    let label = '예정';

    if (status === 'completed') {
      bg = '#DCFCE7';
      text = '#15803D';
      label = '완료';
    } else if (status === 'cancelled') {
      bg = '#E5E7EB';
      text = '#374151';
      label = '취소';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
      </View>
    );
  };

  const renderListItem = ({ item }: { item: TrainingLog }) => {
    const isSelected = selectedLog?.id === item.id;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedLog(item);
          setIsEditing(false);
          setIsCreating(false);
        }}
        style={[
          styles.listItem,
          isSelected && styles.listItemActive,
        ]}
        activeOpacity={0.85}
      >
        <View style={{ marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
            {renderStatusBadge(item.status)}
            <View style={styles.chip}>
              <Text style={styles.chipText}>{item.course}</Text>
            </View>
          </View>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text style={styles.listSubject}>{item.subject}</Text>
        </View>
        <View style={{ gap: 2 }}>
          <Text style={styles.listMetaText}>
            📅 {item.date} {item.time}
          </Text>
          <Text style={styles.listMetaText}>
            👥 {item.participants}/{item.capacity}명
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderViewMode = () => {
    if (!selectedLog) {
      return (
        <View style={styles.emptyRight}>
          <Text style={{ fontSize: 18, color: '#9CA3AF', marginBottom: 4 }}>
            🎓 교육 일지를 선택하세요
          </Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF' }}>
            왼쪽 목록에서 교육 일지를 선택하면 상세 정보가 표시됩니다.
          </Text>
        </View>
      );
    }

    const log = selectedLog;

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 카드 */}
        <View
          style={[
            styles.card,
            log.status === 'scheduled' && { backgroundColor: '#EFF6FF' },
            log.status === 'completed' && { backgroundColor: '#ECFDF3' },
          ]}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                {renderStatusBadge(log.status)}
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{log.course}</Text>
                </View>
              </View>
              <Text style={styles.title}>{log.title}</Text>
              <Text style={styles.subject}>{log.subject}</Text>

              <View style={styles.infoGrid}>
                <Text style={styles.infoText}>
                  📅 {log.date} {log.time}
                </Text>
                <Text style={styles.infoText}>
                  👥 {log.participants} / {log.capacity}명
                </Text>
                <Text style={styles.infoText}>👤 {log.instructor}</Text>
                <Text style={styles.infoText}>📍 {log.location}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => {
                setEditedLog({ ...log });
                setIsEditing(true);
              }}
            >
              <Text style={styles.outlineBtnText}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 교육 내용 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>교육 내용</Text>
          <Text style={styles.cardBodyText}>{log.content}</Text>
        </View>

        {/* 특이사항 */}
        {log.notes ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>특이사항</Text>
            <Text style={styles.cardBodyText}>{log.notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    );
  };

  const renderForm = (mode: 'create' | 'edit') => {
    if (!editedLog) return null;

    const updateField = <K extends keyof TrainingLog>(key: K, value: TrainingLog[K]) => {
      setEditedLog(prev => (prev ? { ...prev, [key]: value } : prev));
    };

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTitle}>
              {mode === 'create' ? '교육 등록' : '교육 일지 수정'}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={mode === 'create' ? saveCreate : saveEdit}
              >
                <Text style={styles.primaryBtnText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={cancelForm}
              >
                <Text style={styles.outlineBtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 폼 내용 */}
          <View style={{ gap: 16 }}>
            {/* 교육명 */}
            <View>
              <Text style={styles.label}>교육명</Text>
              <TextInput
                style={styles.input}
                value={editedLog.title}
                onChangeText={text => updateField('title', text)}
                placeholder="교육명을 입력하세요"
              />
            </View>

            {/* 날짜 / 시간 */}
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>시행날짜 (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.date}
                  onChangeText={text => updateField('date', text)}
                  placeholder="2025-11-05"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>시행시간 (HH:MM)</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.time}
                  onChangeText={text => updateField('time', text)}
                  placeholder="09:00"
                />
              </View>
            </View>

            {/* 과정 / 과목 */}
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>과정</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.course}
                  onChangeText={text => updateField('course', text)}
                  placeholder="예: 안전보건교육"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>과목</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.subject}
                  onChangeText={text => updateField('subject', text)}
                  placeholder="예: 추락재해 예방"
                />
              </View>
            </View>

            {/* 인원 */}
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>참여 인원</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(editedLog.participants)}
                  onChangeText={text =>
                    updateField(
                      'participants',
                      Number(text.replace(/[^0-9]/g, '')) || 0,
                    )
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>정원</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(editedLog.capacity)}
                  onChangeText={text =>
                    updateField(
                      'capacity',
                      Number(text.replace(/[^0-9]/g, '')) || 0,
                    )
                  }
                />
              </View>
            </View>

            {/* 강사 / 장소 */}
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>강사명</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.instructor}
                  onChangeText={text => updateField('instructor', text)}
                  placeholder="강사명 (소속)"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>장소</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.location}
                  onChangeText={text => updateField('location', text)}
                  placeholder="교육 장소"
                />
              </View>
            </View>

            {/* 상태(간단 셀렉트) */}
            <View>
              <Text style={styles.label}>상태 (예정/완료/취소)</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['scheduled', 'completed', 'cancelled'] as TrainingStatus[]).map(
                  value => {
                    const selected = editedLog.status === value;
                    const label =
                      value === 'scheduled'
                        ? '예정'
                        : value === 'completed'
                        ? '완료'
                        : '취소';
                    return (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.chipToggle,
                          selected && styles.chipToggleActive,
                        ]}
                        onPress={() => updateField('status', value)}
                      >
                        <Text
                          style={[
                            styles.chipToggleText,
                            selected && styles.chipToggleTextActive,
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
            </View>

            {/* 내용 */}
            <View>
              <Text style={styles.label}>내용</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={editedLog.content}
                onChangeText={text => updateField('content', text)}
                placeholder="교육 내용을 입력하세요"
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* 특이사항 */}
            <View>
              <Text style={styles.label}>특이사항</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={editedLog.notes}
                onChangeText={text => updateField('notes', text)}
                placeholder="특이사항을 입력하세요"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const scheduledLabel = `예정 ${scheduledCount}건`;
  const completedLabel = `완료 ${completedCount}건`;

  return (
    <View style={styles.root}>
      {/* 왼쪽 패널 */}
      <View style={styles.leftPanel}>
        {/* 헤더 */}
        <View style={styles.leftHeader}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.leftTitle}>안전 교육 일지</Text>
            <Text style={styles.leftSub}>Safety Training Log</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onPressCreate}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryBtnText}>교육 등록</Text>
          </TouchableOpacity>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryBox, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.summaryNumber}>{scheduledCount}</Text>
              <Text style={styles.summaryLabel}>{scheduledLabel}</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: '#ECFDF3' }]}>
              <Text style={styles.summaryNumber}>{completedCount}</Text>
              <Text style={styles.summaryLabel}>{completedLabel}</Text>
            </View>
          </View>
        </View>

        {/* 목록 */}
        <FlatList
          data={trainingLogs}
          keyExtractor={item => String(item.id)}
          renderItem={renderListItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>

      {/* 오른쪽 디테일 */}
      <View style={styles.rightPanel}>
        {isCreating
          ? renderForm('create')
          : isEditing
          ? renderForm('edit')
          : renderViewMode()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  /* 왼쪽 패널 */
  leftPanel: {
    width: 380,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#E5E7EB',
  },
  leftHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  leftTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  leftSub: { fontSize: 12, color: '#6B7280' },
  primaryBtn: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontWeight: '600' },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryNumber: { fontSize: 18, fontWeight: '700', color: '#111827' },
  summaryLabel: { fontSize: 11, color: '#4B5563', marginTop: 2 },

  listItem: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  listItemActive: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#2563EB',
  },
  listTitle: { fontSize: 13, fontWeight: '600', color: '#111827' },
  listSubject: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  listMetaText: { fontSize: 11, color: '#9CA3AF' },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, fontWeight: '500' },
  chip: {
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: { fontSize: 11, color: '#4B5563' },

  /* 오른쪽 패널 */
  rightPanel: { flex: 1, backgroundColor: '#F3F4F6' },
  emptyRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 2 },
  subject: { fontSize: 13, color: '#4B5563', marginBottom: 12 },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoText: { fontSize: 13, color: '#4B5563' },

  outlineBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  outlineBtnText: { fontSize: 13, color: '#374151' },

  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 8 },
  cardBodyText: { fontSize: 13, color: '#4B5563', lineHeight: 20 },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardHeaderTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },

  label: { fontSize: 12, color: '#4B5563', marginBottom: 4 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
  },
  multiline: { height: 120 },

  row2: {
    flexDirection: 'row',
    gap: 12,
  },

  chipToggle: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipToggleActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipToggleText: { fontSize: 12, color: '#4B5563' },
  chipToggleTextActive: { color: '#FFFFFF', fontWeight: '600' },
});

export default SafetyTrainingScreen;