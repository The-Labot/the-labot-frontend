// ======================================================
//  Part 1 / 3  (imports ~ renderViewMode)
//  그대로 복붙하면 됨
// ======================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  getEducationList,
  createEducationLog,
  getEducationDetail,
  updateEducationLog,
  deleteEducationLog
} from '../api/education';

// ==========================
// 데이터 구조
// ==========================
interface EducationLog {
  id: number;
  educationTitle: string;
  educationDate: string;
  educationTime: string;
  educationPlace: string;
  educationType: string;
  instructor: string;
  content: string;
  status: string;

  siteName?: string;
  writerName?: string;
  createdDate?: string;

  result?: string;
  specialNote?: string;

  participants?: { workerId: number; name: string }[];
  participantIds?: number[];

  materials?: {
    id?: number;
    url?: string;
    originalFileName?: string;
    uri?: string;
    name?: string;
    type?: string;
  }[];

  photos?: {
    id?: number;
    url?: string;
    originalFileName?: string;
    uri?: string;
    name?: string;
    type?: string;
  }[];

  signatures?: {
    id?: number;
    url?: string;
    originalFileName?: string;
    uri?: string;
    name?: string;
    type?: string;
  }[];
}

const SafetyTrainingScreen: React.FC = () => {
  const [educationList, setEducationList] = useState<EducationLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<EducationLog | null>(null);
  const [editedLog, setEditedLog] = useState<EducationLog | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 이미지 미리보기 모달
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // ==========================
  // 교육 등록 버튼
  // ==========================
  const onPressCreate = () => {
    const base: EducationLog = {
      id: Date.now(),
      educationTitle: "",
      educationDate: new Date().toISOString().slice(0, 10),
      educationTime: "",
      educationPlace: "",
      educationType: "REGULAR",
      instructor: "",
      content: "",
      status: "PLANNED",
      participantIds: [],
      materials: [],
      photos: [],
      signatures: [],
    };

    setEditedLog(base);
    setIsCreating(true);
    setIsEditing(false);
    setSelectedLog(null);
  };

  const loadEducationList = async () => {
    try {
      const res = await getEducationList();
      console.log("📘 교육 목록 조회:", res);
      setEducationList(res.data ?? []);
    } catch (e) {
      console.log("교육 목록 조회 실패:", e);
    }
  };

  useEffect(() => {
    loadEducationList();
  }, []);

  // ==========================
  // API ― 교육 등록
  // ==========================
  const saveCreate = async () => {
    if (!editedLog) return;
    try {
      const formData = new FormData();

      formData.append("educationTitle", editedLog.educationTitle);
      formData.append("educationDate", editedLog.educationDate);
      formData.append("educationTime", editedLog.educationTime);
      formData.append("educationPlace", editedLog.educationPlace);
      formData.append("educationType", editedLog.educationType);
      formData.append("instructor", editedLog.instructor);
      formData.append("content", editedLog.content);
      formData.append("status", editedLog.status);

      if (editedLog.result) formData.append("result", editedLog.result);
      if (editedLog.specialNote) formData.append("specialNote", editedLog.specialNote);

      editedLog.participantIds?.forEach(id =>
        formData.append("participantIds", String(id))
      );

      editedLog.materials?.forEach((f: any, idx) =>
        formData.append("materials", {
          uri: f.uri,
          name: f.name ?? `material_${idx}.pdf`,
          type: f.type ?? "application/pdf",
        } as any)
      );

      editedLog.photos?.forEach((p: any, idx) =>
        formData.append("photos", {
          uri: p.uri,
          name: p.name ?? `photo_${idx}.jpg`,
          type: p.type ?? "image/jpeg",
        } as any)
      );

      editedLog.signatures?.forEach((s: any, idx) =>
        formData.append("signatures", {
          uri: s.uri,
          name: s.name ?? `sign_${idx}.jpg`,
          type: s.type ?? "image/jpeg",
        } as any)
      );

      console.log("==== FormData Preview ====");
      (formData as any)._parts.forEach((p: any) => {
        console.log("KEY:", p[0], "VALUE:", p[1]);
      });

      const resp = await createEducationLog(formData);
      console.log("등록 응답:", resp);

      setEducationList(prev => [...prev, editedLog]);
      setSelectedLog(editedLog);
      setIsCreating(false);

    } catch (e) {
      console.log("교육 등록 실패:", e);
    }
  };

  // ==========================
  // API ― 수정 저장
  // ==========================
  const saveEdit = async () => {
    if (!editedLog) return;

    try {
      const formData = new FormData();

      formData.append("educationTitle", editedLog.educationTitle);
      formData.append("educationDate", editedLog.educationDate);
      formData.append("educationTime", editedLog.educationTime);
      formData.append("educationPlace", editedLog.educationPlace);
      formData.append("educationType", editedLog.educationType);
      formData.append("instructor", editedLog.instructor);
      formData.append("content", editedLog.content);
      formData.append("status", editedLog.status);

      if (editedLog.result) formData.append("result", editedLog.result);
      if (editedLog.specialNote) formData.append("specialNote", editedLog.specialNote);

      editedLog.participantIds?.forEach(id =>
        formData.append("participantIds", String(id))
      );

      editedLog.materials?.forEach(f =>
        formData.append("materials", {
          uri: f.uri,
          name: f.name,
          type: f.type,
        } as any)
      );

      editedLog.photos?.forEach(p =>
        formData.append("photos", {
          uri: p.uri,
          name: p.name,
          type: p.type,
        } as any)
      );

      editedLog.signatures?.forEach(s =>
        formData.append("signatures", {
          uri: s.uri,
          name: s.name,
          type: s.type,
        } as any)
      );

      const resp = await updateEducationLog(editedLog.id, formData);
      console.log("교육 수정 응답:", resp);

      setEducationList(prev =>
        prev.map(item => (item.id === editedLog.id ? editedLog : item))
      );

      setSelectedLog(editedLog);
      setIsEditing(false);

    } catch (e) {
      console.log("교육 수정 실패:", e);
    }
  };

  const cancelForm = () => {
    setEditedLog(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  // ==========================
  // 상세 보기 화면 (하단바 버튼으로 변경됨)
  // ==========================
  const renderViewMode = () => {
    if (!selectedLog) {
      return (
        <View style={styles.emptyRight}>
          <Text style={{ fontSize: 18, color: '#9CA3AF' }}>
            🎓 교육 일지를 선택하세요
          </Text>
        </View>
      );
    }

    const log = selectedLog;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24 }}
        >

          {/* 기본 정보 카드 */}
          <View style={styles.card}>
            <Text style={styles.title}>{log.educationTitle}</Text>
            <Text style={styles.subject}>{log.educationType}</Text>

            <Text style={styles.infoText}>📅 {log.educationDate} {log.educationTime}</Text>
            <Text style={styles.infoText}>👤 강사: {log.instructor}</Text>
            <Text style={styles.infoText}>📍 장소: {log.educationPlace}</Text>
            <Text style={styles.infoText}>🏗️ 현장: {log.siteName}</Text>
            <Text style={styles.infoText}>✍ 작성자: {log.writerName}</Text>
            <Text style={styles.infoText}>🕒 작성일: {log.createdDate}</Text>
          </View>

          {/* 교육 내용 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>교육 내용</Text>
            <Text style={styles.cardBodyText}>{log.content}</Text>
          </View>

          {/* 교육 결과 */}
          {log.result ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>교육 결과</Text>
              <Text style={styles.cardBodyText}>{log.result}</Text>
            </View>
          ) : null}

          {/* 특이사항 */}
          {log.specialNote ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>특이사항</Text>
              <Text style={styles.cardBodyText}>{log.specialNote}</Text>
            </View>
          ) : null}

          {/* 참여 근로자 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              참여 근로자 ({log.participants?.length ?? 0})
            </Text>

            {log.participants?.map(p => (
              <Text key={p.workerId} style={styles.cardBodyText}>
                👷 {p.name} (ID: {p.workerId})
              </Text>
            ))}
          </View>

          {/* 자료 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>교육 자료</Text>

            {log.materials?.length === 0 && (
              <Text style={styles.cardBodyText}>자료 없음</Text>
            )}

            {log.materials?.map((m, idx) => (
              <View key={`material-${idx}`} style={{ marginTop: 8 }}>
                <Text style={styles.cardBodyText}>📄 {m.originalFileName}</Text>

                {m.url && (
                  <TouchableOpacity
                    onPress={() => {
                      setImagePreviewUrl(m.url!);
                      setImagePreviewVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: m.url }}
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: 10,
                        marginTop: 6,
                        backgroundColor: "#E5E7EB",
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* 사진 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>교육 사진</Text>

            {log.photos?.length === 0 && (
              <Text style={styles.cardBodyText}>사진 없음</Text>
            )}

            {log.photos?.map((p, idx) => (
              <View key={`photo-${idx}`} style={{ marginTop: 8 }}>
                <Text style={styles.cardBodyText}>🖼 {p.originalFileName}</Text>

                {p.url && (
                  <TouchableOpacity
                    onPress={() => {
                      setImagePreviewUrl(p.url!);
                      setImagePreviewVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: p.url }}
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: 10,
                        marginTop: 6,
                        backgroundColor: "#E5E7EB",
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* 서명 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>서명</Text>

            {log.signatures?.length === 0 && (
              <Text style={styles.cardBodyText}>서명 없음</Text>
            )}

            {log.signatures?.map((s, idx) => (
              <View key={`sign-${idx}`} style={{ marginTop: 8 }}>
                <Text style={styles.cardBodyText}>✒️ {s.originalFileName}</Text>

                {s.url && (
                  <TouchableOpacity
                    onPress={() => {
                      setImagePreviewUrl(s.url!);
                      setImagePreviewVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: s.url }}
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: 10,
                        marginTop: 6,
                        backgroundColor: "#E5E7EB",
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 🔥 하단바: 수정 / 삭제 버튼 */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              setEditedLog({ ...selectedLog });
              setIsEditing(true);
            }}
          >
            <Text style={styles.saveBtnText}>수정</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={async () => {
              try {
                await deleteEducationLog(selectedLog.id);
                setEducationList(prev =>
                  prev.filter(e => e.id !== selectedLog.id)
                );
                setSelectedLog(null);
              } catch (e) {
                console.log("삭제 실패:", e);
              }
            }}
          >
            <Text style={[styles.cancelBtnText, { color: "#EF4444" }]}>
              삭제
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ================================================
  //  ⬆ 여기까지 Part 1
  // ================================================
  // ======================================================
//  Part 2 / 3 (renderForm ~ 메인 UI 전체)
//  그대로 복붙하면 됨
// ======================================================

  // ==========================
  // 입력 폼
  // ==========================
  const renderForm = (mode: 'create' | 'edit') => {
    if (!editedLog) return null;

    const update = <K extends keyof EducationLog>(key: K, value: EducationLog[K]) => {
      setEditedLog(prev => (prev ? { ...prev, [key]: value } : prev));
    };

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>
                {mode === 'create' ? '교육 등록' : '교육 일지 수정'}
              </Text>
            </View>

            {/* 제목 */}
            <Text style={styles.label}>교육 제목</Text>
            <TextInput
              style={styles.input}
              value={editedLog.educationTitle}
              onChangeText={t => update("educationTitle", t)}
            />

            {/* 날짜 / 시간 */}
            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>교육 날짜</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.educationDate}
                  onChangeText={t => update("educationDate", t)}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>교육 시간</Text>
                <TextInput
                  style={styles.input}
                  value={editedLog.educationTime}
                  onChangeText={t => update("educationTime", t)}
                />
              </View>
            </View>

            {/* 장소 */}
            <Text style={styles.label}>교육 장소</Text>
            <TextInput
              style={styles.input}
              value={editedLog.educationPlace}
              onChangeText={t => update("educationPlace", t)}
            />

            {/* 타입 */}
            <Text style={styles.label}>교육 타입</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {["REGULAR", "SPECIAL", "NEW_WORKER", "MACHINE", "OTHER"].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chipToggle,
                    editedLog.educationType === type && styles.chipToggleActive
                  ]}
                  onPress={() => update("educationType", type)}
                >
                  <Text
                    style={[
                      styles.chipToggleText,
                      editedLog.educationType === type && styles.chipToggleTextActive
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 강사 */}
            <Text style={styles.label}>강사명</Text>
            <TextInput
              style={styles.input}
              value={editedLog.instructor}
              onChangeText={t => update("instructor", t)}
            />

            {/* 내용 */}
            <Text style={styles.label}>교육 내용</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              value={editedLog.content}
              onChangeText={t => update("content", t)}
            />

            {/* 상태 */}
            <Text style={styles.label}>교육 상태</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {["PLANNED", "COMPLETED"].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.chipToggle,
                    editedLog.status === s && styles.chipToggleActive
                  ]}
                  onPress={() => update("status", s)}
                >
                  <Text
                    style={[
                      styles.chipToggleText,
                      editedLog.status === s && styles.chipToggleTextActive
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 교육 결과 */}
            <Text style={styles.label}>교육 결과</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              value={editedLog.result ?? ""}
              onChangeText={t => update("result", t)}
            />

            {/* 특이사항 */}
            <Text style={styles.label}>특이사항</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              multiline
              value={editedLog.specialNote ?? ""}
              onChangeText={t => update("specialNote", t)}
            />

            {/* 참여자 */}
            <Text style={styles.label}>참여 근로자 ID (쉼표 구분)</Text>
            <TextInput
              style={styles.input}
              value={editedLog.participantIds?.join(", ") ?? ""}
              onChangeText={t =>
                update(
                  "participantIds",
                  t.split(",")
                    .map(v => Number(v.trim()))
                    .filter(n => !isNaN(n))
                )
              }
            />

            {/* ----------------------------- */}
            {/* 📁 교육자료 materials */}
            {/* ----------------------------- */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>교육자료 (사진 JPG/PNG)</Text>

              <TouchableOpacity
                style={styles.fileBtn}
                onPress={async () => {
                  try {
                    const res = await launchImageLibrary({
                      mediaType: 'photo',
                      selectionLimit: 0,
                    });

                    if (res.didCancel) return;

                    const newFiles =
                      res.assets?.map(a => ({
                        uri: a.uri!,
                        name: a.fileName ?? 'material.jpg',
                        type: a.type ?? 'image/jpeg',
                      })) ?? [];

                    update("materials", [...editedLog.materials!, ...newFiles]);
                  } catch (e) {
                    console.log("자료 선택 오류:", e);
                  }
                }}
              >
                <Text style={styles.fileBtnText}>+ 자료 사진 추가</Text>
              </TouchableOpacity>

              {editedLog.materials?.map((m, idx) => (
                <Text key={`material-${idx}`} style={styles.fileName}>
                  📄 {m.name ?? m.originalFileName}
                </Text>
              ))}
            </View>

            {/* ----------------------------- */}
            {/* 🖼️ 교육 사진 photos */}
            {/* ----------------------------- */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>교육 사진 (JPG/PNG)</Text>

              <TouchableOpacity
                style={styles.fileBtn}
                onPress={async () => {
                  try {
                    const res = await launchImageLibrary({
                      mediaType: 'photo',
                      selectionLimit: 0,
                    });

                    if (res.didCancel) return;

                    const newFiles =
                      res.assets?.map(a => ({
                        uri: a.uri!,
                        name: a.fileName ?? 'photo.jpg',
                        type: a.type ?? 'image/jpeg',
                      })) ?? [];

                    update("photos", [...editedLog.photos!, ...newFiles]);
                  } catch (e) {
                    console.log("사진 선택 오류:", e);
                  }
                }}
              >
                <Text style={styles.fileBtnText}>+ 사진 선택</Text>
              </TouchableOpacity>

              {editedLog.photos?.map((f, idx) => (
                <Text key={`photo-${idx}`} style={styles.fileName}>
                  🖼️ {f.name}
                </Text>
              ))}
            </View>

            {/* ----------------------------- */}
            {/* ✒️ 서명 signatures */}
            {/* ----------------------------- */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>서명 이미지 (JPG/PNG)</Text>

              <TouchableOpacity
                style={styles.fileBtn}
                onPress={async () => {
                  try {
                    const res = await launchImageLibrary({
                      mediaType: 'photo',
                      selectionLimit: 0,
                    });

                    if (res.didCancel) return;

                    const newFiles =
                      res.assets?.map(a => ({
                        uri: a.uri!,
                        name: a.fileName ?? 'signature.jpg',
                        type: a.type ?? 'image/jpeg',
                      })) ?? [];

                    update("signatures", [...editedLog.signatures!, ...newFiles]);
                  } catch (e) {
                    console.log("서명 선택 오류:", e);
                  }
                }}
              >
                <Text style={styles.fileBtnText}>+ 서명 이미지 추가</Text>
              </TouchableOpacity>

              {editedLog.signatures?.map((s, idx) => (
                <Text key={`sign-${idx}`} style={styles.fileName}>
                  ✒️ {s.name ?? s.originalFileName}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 🔥 폼 하단 버튼 */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={mode === 'create' ? saveCreate : saveEdit}
          >
            <Text style={styles.saveBtnText}>저장</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={cancelForm}
          >
            <Text style={styles.cancelBtnText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ==========================
  // 메인 UI
  // ==========================
  return (
    <View style={styles.root}>

      {/* 왼쪽 패널 */}
      <View style={styles.leftPanel}>
        <View style={styles.leftHeader}>
          <Text style={styles.leftTitle}>안전 교육 일지</Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={onPressCreate}>
            <Text style={styles.primaryBtnText}>교육 등록</Text>
          </TouchableOpacity>

          {/* 상태 요약 */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBox, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.summaryNumber}>
                {educationList.filter(e => e.status === "PLANNED").length}
              </Text>
              <Text style={styles.summaryLabel}>예정</Text>
            </View>

            <View style={[styles.summaryBox, { backgroundColor: '#ECFDF3' }]}>
              <Text style={styles.summaryNumber}>
                {educationList.filter(e => e.status === "COMPLETED").length}
              </Text>
              <Text style={styles.summaryLabel}>완료</Text>
            </View>
          </View>
        </View>

        {/* 리스트 */}
        <FlatList
          data={educationList}
          keyExtractor={(item, index) => `edu-${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={async () => {
                setIsCreating(false);
                setIsEditing(false);

                try {
                  const resp = await getEducationDetail(item.id);
                  if (resp?.data) setSelectedLog(resp.data);
                } catch (e) {
                  console.log("상세조회 실패:", e);
                }
              }}
              style={[
                styles.listItem,
                selectedLog?.id === item.id && styles.listItemActive,
              ]}
            >
              {/* 상태 뱃지 */}
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <View
                  style={{
                    backgroundColor:
                      item.status === "COMPLETED" ? "#DCFCE7" : "#DBEAFE",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color:
                        item.status === "COMPLETED" ? "#15803D" : "#1D4ED8",
                    }}
                  >
                    {item.status === "COMPLETED" ? "완료" : "예정"}
                  </Text>
                </View>
              </View>

              <Text style={styles.listTitle}>{item.educationTitle}</Text>
              <Text style={styles.listSmall}>{item.educationDate}</Text>
              <Text style={styles.listSmall}>{item.educationPlace}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>

      {/* 오른쪽 패널 */}
      <View style={styles.rightPanel}>
        {isCreating
          ? renderForm("create")
          : isEditing
          ? renderForm("edit")
          : renderViewMode()}
      </View>

      {/* 이미지 전체보기 모달 */}
      <Modal visible={imagePreviewVisible} transparent>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          
          {/* 닫기 버튼 */}
          <TouchableOpacity
            onPress={() => setImagePreviewVisible(false)}
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 10,
              padding: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 30 }}>✕</Text>
          </TouchableOpacity>

          {/* Image Zoom Viewer */}
          <ImageViewer
            imageUrls={[{ url: imagePreviewUrl! }]}
            enableSwipeDown
            onSwipeDown={() => setImagePreviewVisible(false)}
            backgroundColor="black"
            saveToLocalByLongPress={false}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SafetyTrainingScreen;
// ======================================================
//  Part 3 / 3  (Styles 전체)
//  여기까지 붙이면 SafetyTrainingScreen.tsx 완성
// ======================================================

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

  primaryBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2563EB',
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    marginTop: 10
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

  /* 리스트 */
  listItem: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  listItemActive: {
    backgroundColor: '#EFF6FF',
    borderLeftColor: '#2563EB',
  },
  listTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  listSmall: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  /* 오른쪽 패널 */
  rightPanel: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  emptyRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 카드 */
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

  title: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  subject: { fontSize: 13, color: '#4B5563', marginBottom: 12 },
  infoText: { fontSize: 13, color: '#4B5563', marginBottom: 4 },

  outlineBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
    justifyContent: "center",
    marginLeft: 8,
  },
  outlineBtnText: { fontSize: 13, color: '#374151' },

  cardTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 8 },
  cardBodyText: { fontSize: 13, color: '#4B5563', lineHeight: 20 },

  /* 입력 폼 */
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardHeaderTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },

  label: { fontSize: 12, color: '#4B5563', marginBottom: 4, marginTop: 12 },

  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
  },
  multiline: {
    height: 120,
    paddingTop: 10,
  },

  row2: {
    flexDirection: 'row',
    gap: 12,
  },

  /* 토글 칩 */
  chipToggle: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  chipToggleActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipToggleText: { fontSize: 12, color: '#4B5563' },
  chipToggleTextActive: { color: '#FFFFFF', fontWeight: '600' },

  /* 파일 버튼 */
  fileBtn: {
    marginTop: 8,
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  fileBtnText: {
    fontSize: 13,
    color: '#374151',
  },
  fileName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  /* 상세보기 아래 버튼 (수정/삭제) */
  detailsButtonBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  modifyBtn: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: "#EF4444",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modifyBtnText: { color: "#374151", fontWeight: "500" },
  deleteBtnText: { color: "#EF4444", fontWeight: "500" },

  /* 폼 하단 버튼 */
  bottomBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  saveBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  cancelBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
});