// src/manager/DailyReportScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Alert,
  useWindowDimensions,
} from 'react-native';

type Material = {
  name: string;
  quantity: string;
  unit: string;
};

type Equipment = {
  name: string;
  quantity: number;
  hours: string;
};

type DailyReportStatus = 'submitted' | 'draft';

interface DailyReport {
  id: number;
  siteName: string;
  author: string;
  date: string;
  workType: string;
  todayWork: string;
  tomorrowPlan: string;
  workerCount: number;
  materials: Material[];
  equipment: Equipment[];
  notes: string;
  status: DailyReportStatus;
}

const initialReports: DailyReport[] = [
  {
    id: 1,
    siteName: 'A동 건설 현장',
    author: '김현장',
    date: '2025-11-01',
    workType: '철근 콘크리트 공사',
    todayWork:
      '3층 철근 배근 작업 완료\n- 기둥 철근 배근 100% 완료\n- 보 철근 배근 95% 완료\n- 슬라브 철근 배근 진행중 (70%)\n\n콘크리트 타설 준비\n- 거푸집 검사 완료\n- 철근 피복두께 확인 완료\n- 타설 계획 수립',
    tomorrowPlan:
      '3층 슬라브 철근 배근 완료 예정\n콘크리트 타설 실시 (3층 전체)\n양생 준비 및 거푸집 자재 확보\n4층 작업 준비 (자재 반입)',
    workerCount: 48,
    materials: [
      { name: '철근 (D19)', quantity: '2.5', unit: '톤' },
      { name: '철근 (D13)', quantity: '1.8', unit: '톤' },
      { name: '콘크리트 (25-24-12)', quantity: '45', unit: 'm³' },
      { name: '거푸집 합판', quantity: '120', unit: '매' },
    ],
    equipment: [
      { name: '타워크레인 (25톤)', quantity: 2, hours: '8시간' },
      { name: '콘크리트 펌프카', quantity: 1, hours: '4시간' },
      { name: '용접기', quantity: 3, hours: '8시간' },
    ],
    notes: '날씨 양호, 안전사고 없음. 철근 자재 추가 발주 필요 (내일 타설분)',
    status: 'submitted',
  },
  {
    id: 2,
    siteName: 'B동 건설 현장',
    author: '이관리',
    date: '2025-11-01',
    workType: '전기 설비 공사',
    todayWork:
      '지하 1층 전기실 배관 작업\n- 간선 배관 설치 완료\n- 분전반 설치 위치 마킹\n- 케이블 트레이 설치 (80%)\n\n1층 전등 배선 작업\n- 천장 매입 배선 완료\n- 스위치 박스 설치',
    tomorrowPlan:
      '지하 1층 케이블 트레이 마무리\n분전반 설치 작업\n1층 전등 설치 및 결선 작업\n비상조명 설치 준비',
    workerCount: 45,
    materials: [
      { name: 'PVC 전선관 (32mm)', quantity: '250', unit: 'm' },
      { name: '케이블 트레이 (300mm)', quantity: '80', unit: 'm' },
      { name: 'CV케이블 (35sq)', quantity: '120', unit: 'm' },
      { name: '분전반 (6회로)', quantity: '8', unit: '대' },
    ],
    equipment: [
      { name: '고소작업대 (12m)', quantity: 2, hours: '8시간' },
      { name: '전동드릴', quantity: 5, hours: '8시간' },
      { name: '케이블 커터', quantity: 3, hours: '6시간' },
    ],
    notes: '안전점검 완료. 케이블 트레이 자재 추가 필요 (50m)',
    status: 'submitted',
  },
  {
    id: 3,
    siteName: 'C동 건설 현장',
    author: '박현장',
    date: '2025-11-01',
    workType: '마감 공사',
    todayWork:
      '2층 석고보드 설치 작업\n- 벽체 석고보드 설치 완료\n- 천장 석고보드 설치 (60%)\n- 조인트 처리 준비\n\n타일 붙이기 작업\n- 화장실 벽 타일 시공 완료\n- 바닥 타일 밑작업',
    tomorrowPlan:
      '2층 천장 석고보드 마무리\n조인트 처리 및 퍼티 작업\n화장실 바닥 타일 시공\n3층 마감 자재 반입',
    workerCount: 42,
    materials: [
      { name: '석고보드 (12T)', quantity: '180', unit: '매' },
      { name: '경량천장틀', quantity: '320', unit: 'm' },
      { name: '벽 타일 (300x600)', quantity: '45', unit: '박스' },
      { name: '바닥 타일 (600x600)', quantity: '28', unit: '박스' },
    ],
    equipment: [
      { name: '리프트', quantity: 1, hours: '8시간' },
      { name: '타일커터', quantity: 2, hours: '7시간' },
      { name: '믹서기', quantity: 1, hours: '5시간' },
    ],
    notes: '석고보드 양생 중. 특이사항 없음.',
    status: 'submitted',
  },
];

const DailyReportScreen: React.FC = () => {
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedReport, setEditedReport] = useState<DailyReport | null>(null);

  const { width } = useWindowDimensions();
  const isTablet = width >= 900;

  const submittedCount = dailyReports.filter(r => r.status === 'submitted').length;
  const totalWorkers = dailyReports.reduce((sum, r) => sum + r.workerCount, 0);

  const startCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedReport(null);
    setEditedReport({
      id: dailyReports.length + 1,
      siteName: '',
      author: '',
      date: new Date().toISOString().slice(0, 10),
      workType: '',
      todayWork: '',
      tomorrowPlan: '',
      workerCount: 0,
      materials: [],
      equipment: [],
      notes: '',
      status: 'draft',
    });
  };

  const saveCreate = () => {
    if (!editedReport) return;
    const newReport: DailyReport = { ...editedReport, status: 'submitted' };
    setDailyReports(prev => [...prev, newReport]);
    setSelectedReport(newReport);
    setIsCreating(false);
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setEditedReport(null);
  };

  const startEdit = () => {
    if (!selectedReport) return;
    setIsEditing(true);
    setIsCreating(false);
    setEditedReport({ ...selectedReport });
  };

  const saveEdit = () => {
    if (!editedReport) return;
    setDailyReports(prev =>
      prev.map(r => (r.id === editedReport.id ? editedReport : r)),
    );
    setSelectedReport(editedReport);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedReport(null);
  };

  const deleteReport = () => {
    if (!selectedReport) return;
    Alert.alert(
      '삭제 확인',
      `"${selectedReport.siteName}" 작업 일보를 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            setDailyReports(prev => prev.filter(r => r.id !== selectedReport.id));
            setSelectedReport(null);
            setIsEditing(false);
          },
        },
      ],
    );
  };

  // --- 자재 / 장비 편집 helpers ---
  const addMaterial = () => {
    if (!editedReport) return;
    setEditedReport({
      ...editedReport,
      materials: [
        ...editedReport.materials,
        { name: '', quantity: '', unit: '' },
      ],
    });
  };

  const updateMaterial = (
    index: number,
    field: keyof Material,
    value: string,
  ) => {
    if (!editedReport) return;
    const copy = [...editedReport.materials];
    copy[index] = { ...copy[index], [field]: value };
    setEditedReport({ ...editedReport, materials: copy });
  };

  const removeMaterial = (index: number) => {
    if (!editedReport) return;
    const copy = [...editedReport.materials];
    copy.splice(index, 1);
    setEditedReport({ ...editedReport, materials: copy });
  };

  const addEquipment = () => {
    if (!editedReport) return;
    setEditedReport({
      ...editedReport,
      equipment: [
        ...editedReport.equipment,
        { name: '', quantity: 0, hours: '' },
      ],
    });
  };

  const updateEquipment = (
    index: number,
    field: keyof Equipment,
    value: string,
  ) => {
    if (!editedReport) return;
    const copy = [...editedReport.equipment];
    if (field === 'quantity') {
      copy[index].quantity = parseInt(value, 10) || 0;
    } else {
      copy[index] = { ...copy[index], [field]: value } as Equipment;
    }
    setEditedReport({ ...editedReport, equipment: copy });
  };

  const removeEquipment = (index: number) => {
    if (!editedReport) return;
    const copy = [...editedReport.equipment];
    copy.splice(index, 1);
    setEditedReport({ ...editedReport, equipment: copy });
  };

  // ---------------- render helpers ----------------

  const renderHeaderStats = () => (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
        <Text style={styles.statEmoji}>📄</Text>
        <Text style={[styles.statNumber, { color: '#2563EB' }]}>{submittedCount}</Text>
        <Text style={[styles.statLabel, { color: '#1D4ED8' }]}>제출완료</Text>
      </View>

      <View style={[styles.statCard, { backgroundColor: '#F5F3FF', borderColor: '#EDE9FE' }]}>
        <Text style={styles.statEmoji}>👥</Text>
        <Text style={[styles.statNumber, { color: '#7C3AED' }]}>{totalWorkers}</Text>
        <Text style={[styles.statLabel, { color: '#6D28D9' }]}>투입인원</Text>
      </View>
    </View>
  );

  const renderReportItem = ({ item }: { item: DailyReport }) => {
    const isSelected = selectedReport?.id === item.id;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          setSelectedReport(item);
          setIsEditing(false);
          setIsCreating(false);
        }}
        style={[
          styles.reportItem,
          isSelected && styles.reportItemSelected,
        ]}
      >
        <View style={styles.reportItemHeaderRow}>
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeGreenText}>제출완료</Text>
          </View>
          <Text style={styles.chevron}>{isSelected ? '›' : '›'}</Text>
        </View>
        <Text style={styles.reportSite}>{item.siteName}</Text>
        <Text style={styles.reportWorkType}>{item.workType}</Text>
        <View style={{ marginTop: 4 }}>
          <Text style={styles.reportMeta}>📅 {item.date}</Text>
          <Text style={styles.reportMeta}>👥 투입: {item.workerCount}명</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyRight = () => (
    <View style={styles.emptyRightWrapper}>
      <Text style={styles.emptyIcon}>📄</Text>
      <Text style={styles.emptyTitle}>작업 일보를 선택하세요</Text>
      <Text style={styles.emptyDesc}>
        왼쪽 목록에서 작업 일보를 선택하면 상세 정보가 표시됩니다
      </Text>
    </View>
  );

  // ---------------- JSX ----------------

  return (
    <View style={styles.container}>
      {/* LEFT PANEL */}
      <View
        style={[
          styles.leftPanel,
          { width: isTablet ? 380 : 340 },
        ]}
      >
        {/* header */}
        <View style={styles.leftHeader}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.leftTitle}>작업 일보</Text>
            <Text style={styles.leftSubtitle}>Daily Work Report</Text>
          </View>

          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              onPress={startCreate}
              activeOpacity={0.9}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>＋ 새 보고서</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.iconButton}
            >
              <Text style={{ fontSize: 18 }}>⬇️</Text>
            </TouchableOpacity>
          </View>

          {renderHeaderStats()}
        </View>

        {/* list */}
        <FlatList
          data={dailyReports}
          keyExtractor={item => item.id.toString()}
          renderItem={renderReportItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* RIGHT PANEL */}
      <View style={styles.rightPanel}>
        {isCreating && editedReport ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.rightScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>작업 일보 작성</Text>
                <View style={styles.cardHeaderButtons}>
                  <TouchableOpacity
                    onPress={saveCreate}
                    style={styles.primaryButtonSmall}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.primaryButtonSmallText}>저장</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelCreate}
                    style={styles.outlineButtonSmall}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.outlineButtonSmallText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 폼 내용 */}
              {renderForm(editedReport, setEditedReport, {
                addMaterial,
                updateMaterial,
                removeMaterial,
                addEquipment,
                updateEquipment,
                removeEquipment,
              })}
            </View>
          </ScrollView>
        ) : selectedReport ? (
          isEditing && editedReport ? (
            // EDIT MODE
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.rightScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>작업 일보 수정</Text>
                  <View style={styles.cardHeaderButtons}>
                    <TouchableOpacity
                      onPress={saveEdit}
                      style={styles.primaryButtonSmall}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.primaryButtonSmallText}>저장</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={cancelEdit}
                      style={styles.outlineButtonSmall}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.outlineButtonSmallText}>취소</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {renderForm(editedReport, setEditedReport, {
                  addMaterial,
                  updateMaterial,
                  removeMaterial,
                  addEquipment,
                  updateEquipment,
                  removeEquipment,
                })}
              </View>
            </ScrollView>
          ) : (
            // VIEW MODE
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.rightScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 헤더 카드 */}
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.badgeGreen}>
                      <Text style={styles.badgeGreenText}>제출완료</Text>
                    </View>
                    <Text style={[styles.detailTitle, { marginTop: 8 }]}>
                      {selectedReport.siteName}
                    </Text>
                    <Text style={styles.detailSubtitle}>
                      {selectedReport.workType}
                    </Text>

                    <View style={styles.detailMetaGrid}>
                      <Text style={styles.detailMeta}>📅 {selectedReport.date}</Text>
                      <Text style={styles.detailMeta}>
                        👥 투입 인원: {selectedReport.workerCount}명
                      </Text>
                      <Text style={styles.detailMeta}>
                        📄 작성자: {selectedReport.author}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardHeaderButtons}>
                    <TouchableOpacity
                      onPress={startEdit}
                      style={styles.outlineButtonSmall}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.outlineButtonSmallText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={deleteReport}
                      style={styles.deleteButtonSmall}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.deleteButtonSmallText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 금일 작업 */}
              <View style={styles.card}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionIcon}>💼</Text>
                  <Text style={styles.sectionTitle}>금일 작업사항</Text>
                </View>
                <Text style={styles.sectionBody} selectable>
                  {selectedReport.todayWork}
                </Text>
              </View>

              {/* 명일 예정 */}
              <View style={styles.card}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionIcon}>📋</Text>
                  <Text style={styles.sectionTitle}>명일 예정 사항</Text>
                </View>
                <Text style={styles.sectionBody} selectable>
                  {selectedReport.tomorrowPlan}
                </Text>
              </View>

              {/* 자재 / 장비 */}
              <View style={styles.row2}>
                <View style={[styles.card, styles.cardFlex1]}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionIcon}>📦</Text>
                    <Text style={styles.sectionTitle}>자재 투입 현황</Text>
                  </View>
                  {selectedReport.materials.map((m, idx) => (
                    <View key={idx} style={styles.materialRow}>
                      <Text style={styles.materialName}>{m.name}</Text>
                      <Text style={styles.materialQty}>
                        {m.quantity} {m.unit}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.card, styles.cardFlex1]}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionIcon}>🚚</Text>
                    <Text style={styles.sectionTitle}>장비 투입 현황</Text>
                  </View>
                  {selectedReport.equipment.map((e, idx) => (
                    <View key={idx} style={styles.equipBox}>
                      <View style={styles.equipHeaderRow}>
                        <Text style={styles.materialName}>{e.name}</Text>
                        <Text style={styles.materialQty}>{e.quantity}대</Text>
                      </View>
                      <Text style={styles.equipHours}>
                        가동시간: {e.hours}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 특이사항 */}
              {selectedReport.notes ? (
                <View style={styles.card}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionIcon}>⚠️</Text>
                    <Text style={styles.sectionTitle}>특이사항</Text>
                  </View>
                  <Text style={styles.sectionBody} selectable>
                    {selectedReport.notes}
                  </Text>
                </View>
              ) : null}
            </ScrollView>
          )
        ) : (
          renderEmptyRight()
        )}
      </View>
    </View>
  );
};

// ------------------ 공통 폼 렌더러 ------------------

type FormHelpers = {
  addMaterial: () => void;
  updateMaterial: (i: number, f: keyof Material, v: string) => void;
  removeMaterial: (i: number) => void;
  addEquipment: () => void;
  updateEquipment: (i: number, f: keyof Equipment, v: string) => void;
  removeEquipment: (i: number) => void;
};

const renderForm = (
  edited: DailyReport,
  setEdited: React.Dispatch<React.SetStateAction<DailyReport | null>>,
  helpers: FormHelpers,
) => {
  const setField = (field: keyof DailyReport, value: any) => {
    setEdited(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <View style={{ gap: 16 }}>
      {/* 기본 정보 1 */}
      <View style={styles.row2}>
        <View style={styles.fieldFlex1}>
          <Text style={styles.label}>현장명</Text>
          <TextInput
            style={styles.input}
            value={edited.siteName}
            onChangeText={text => setField('siteName', text)}
            placeholder="현장명을 입력하세요"
          />
        </View>
        <View style={styles.fieldFlex1}>
          <Text style={styles.label}>작성자</Text>
          <TextInput
            style={styles.input}
            value={edited.author}
            onChangeText={text => setField('author', text)}
            placeholder="작성자명을 입력하세요"
          />
        </View>
      </View>

      <View style={styles.row2}>
        <View style={styles.fieldFlex1}>
          <Text style={styles.label}>작업일자</Text>
          <TextInput
            style={styles.input}
            value={edited.date}
            onChangeText={text => setField('date', text)}
            placeholder="2025-11-01"
          />
        </View>
        <View style={styles.fieldFlex1}>
          <Text style={styles.label}>투입 인원</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={String(edited.workerCount || '')}
            onChangeText={text =>
              setField('workerCount', parseInt(text, 10) || 0)
            }
            placeholder="0"
          />
        </View>
      </View>

      {/* 공종명 */}
      <View>
        <Text style={styles.label}>공종명</Text>
        <TextInput
          style={styles.input}
          value={edited.workType}
          onChangeText={text => setField('workType', text)}
          placeholder="공종명을 입력하세요"
        />
      </View>

      {/* 금일 작업 */}
      <View>
        <Text style={styles.label}>금일 작업사항</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={edited.todayWork}
          onChangeText={text => setField('todayWork', text)}
          placeholder="금일 수행한 작업 내용을 입력하세요"
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* 명일 예정 */}
      <View>
        <Text style={styles.label}>명일 예정 사항</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={edited.tomorrowPlan}
          onChangeText={text => setField('tomorrowPlan', text)}
          placeholder="명일 예정된 작업 내용을 입력하세요"
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* 자재 */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>자재 투입 현황</Text>
          <TouchableOpacity
            onPress={helpers.addMaterial}
            style={styles.outlineButtonSmall}
          >
            <Text style={styles.outlineButtonSmallText}>＋ 자재 추가</Text>
          </TouchableOpacity>
        </View>

        {edited.materials.map((m, idx) => (
          <View key={idx} style={styles.materialEditRow}>
            <TextInput
              style={[styles.input, styles.flex1]}
              value={m.name}
              onChangeText={text =>
                helpers.updateMaterial(idx, 'name', text)
              }
              placeholder="자재명"
            />
            <TextInput
              style={[styles.input, styles.w80]}
              value={m.quantity}
              onChangeText={text =>
                helpers.updateMaterial(idx, 'quantity', text)
              }
              placeholder="수량"
            />
            <TextInput
              style={[styles.input, styles.w70]}
              value={m.unit}
              onChangeText={text => helpers.updateMaterial(idx, 'unit', text)}
              placeholder="단위"
            />
            <TouchableOpacity
              onPress={() => helpers.removeMaterial(idx)}
              style={styles.iconButtonSmall}
            >
              <Text style={{ color: '#DC2626' }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 장비 */}
      <View>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>장비 투입 현황</Text>
          <TouchableOpacity
            onPress={helpers.addEquipment}
            style={styles.outlineButtonSmall}
          >
            <Text style={styles.outlineButtonSmallText}>＋ 장비 추가</Text>
          </TouchableOpacity>
        </View>

        {edited.equipment.map((e, idx) => (
          <View key={idx} style={styles.materialEditRow}>
            <TextInput
              style={[styles.input, styles.flex1]}
              value={e.name}
              onChangeText={text =>
                helpers.updateEquipment(idx, 'name', text)
              }
              placeholder="장비명"
            />
            <TextInput
              style={[styles.input, styles.w70]}
              keyboardType="number-pad"
              value={String(e.quantity || '')}
              onChangeText={text =>
                helpers.updateEquipment(idx, 'quantity', text)
              }
              placeholder="대수"
            />
            <TextInput
              style={[styles.input, styles.w80]}
              value={e.hours}
              onChangeText={text =>
                helpers.updateEquipment(idx, 'hours', text)
              }
              placeholder="시간"
            />
            <TouchableOpacity
              onPress={() => helpers.removeEquipment(idx)}
              style={styles.iconButtonSmall}
            >
              <Text style={{ color: '#DC2626' }}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 특이사항 */}
      <View>
        <Text style={styles.label}>특이사항</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={edited.notes}
          onChangeText={text => setField('notes', text)}
          placeholder="특이사항을 입력하세요"
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

// ------------------ 스타일 ------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  leftPanel: {
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  leftHeader: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  leftSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  headerButtonsRow: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  iconButton: {
    width: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statEmoji: { fontSize: 16, marginBottom: 4 },
  statNumber: { fontSize: 18, fontWeight: '600' },
  statLabel: { fontSize: 11 },

  reportItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  reportItemSelected: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#2563EB',
  },
  reportItemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeGreen: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
  },
  badgeGreenText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '500',
  },
  chevron: { fontSize: 16, color: '#9CA3AF' },
  reportSite: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 2,
  },
  reportWorkType: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 11,
    color: '#6B7280',
  },

  rightPanel: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  rightScrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },

  emptyRightWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: { fontSize: 40, color: '#D1D5DB', marginBottom: 8 },
  emptyTitle: { fontSize: 16, color: '#4B5563', marginBottom: 4 },
  emptyDesc: { fontSize: 13, color: '#9CA3AF' },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardHeaderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonSmall: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  primaryButtonSmallText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  outlineButtonSmall: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  outlineButtonSmallText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButtonSmall: {
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  deleteButtonSmallText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },

  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
    detailSubtitle: {
    fontSize: 12,
    color: '#6B7280',   // gray-500
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#6B7280',
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    width: 20,
    height: 20,
    tintColor: '#9CA3AF',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  materialName: {
    fontSize: 14,
    color: '#111827',
  },
  materialQty: {
    fontSize: 14,
    color: '#6B7280',
  },
  equipmentBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  equipmentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  equipmentName: {
    fontSize: 14,
    color: '#111827',
  },
  equipmentCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  equipmentHours: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  notesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
    // ===== 상세 헤더용 스타일 =====
  detailMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  detailMeta: {
    fontSize: 12,
    color: '#4B5563',
    marginRight: 8,
  },

  // ===== 섹션 공통 스타일 (제목/본문) =====
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },

  // ===== 폼 공통 레이아웃 =====
  row2: {
    flexDirection: 'row',
    gap: 12,
  },
  cardFlex1: {
    flex: 1,
  },
  fieldFlex1: {
    flex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  multiline: {
    minHeight: 100,
  },

  flex1: {
    flex: 1,
  },
  w70: {
    width: 70,
  },
  w80: {
    width: 80,
  },

  materialEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconButtonSmall: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===== 장비 카드 alias (JSX에서 쓰는 이름 맞추기) =====
  equipBox: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  equipHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  equipHours: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  label: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
    fontWeight: '500',
  },

});
export default DailyReportScreen;