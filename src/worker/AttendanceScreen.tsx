// src/worker/AttendanceScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Attendance'>;

type AttendanceStatus = 'not-checked-in' | 'checked-in' | 'checked-out';

const AttendanceScreen: React.FC<Props> = ({ navigation }) => {
  const [status, setStatus] = useState<AttendanceStatus>('not-checked-in');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [checkOutTime, setCheckOutTime] = useState<string>('');

  // 현재 시간 1초마다 업데이트
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setCheckInTime(`${h}:${m}`);
    setStatus('checked-in');
  };

  const handleCheckOut = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    setCheckOutTime(`${h}:${m}`);
    setStatus('checked-out');
  };

  const getStatusText = () => {
    switch (status) {
      case 'not-checked-in':
        return '미출근';
      case 'checked-in':
        return '출근 완료';
      case 'checked-out':
        return '퇴근 완료';
    }
  };

  const statusStyle = (() => {
    switch (status) {
      case 'not-checked-in':
        return { bg: '#E5E7EB', color: '#374151' }; // 회색
      case 'checked-in':
        return { bg: '#BBF7D0', color: '#15803D' }; // 초록
      case 'checked-out':
        return { bg: '#DBEAFE', color: '#1D4ED8' }; // 파랑
    }
  })();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <TouchableOpacity
              style={styles.backButton}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>

            <View>
              <Text style={styles.headerTitle}>출퇴근 등록</Text>
              <Text style={styles.headerSubtitle}>Check-In / Check-Out</Text>
            </View>
          </View>
        </View>

        {/* 메인 내용 */}
        <View style={styles.content}>
          {/* 상태 뱃지 */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: statusStyle.color },
              ]}
            >
              현재 상태: {getStatusText()}
            </Text>
          </View>

          {/* 큰 원형 버튼 */}
          <View style={styles.circleWrapper}>
            {status === 'not-checked-in' && (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.circleButton, styles.circleCheckIn]}
                onPress={handleCheckIn}
              >
                <Text style={styles.circleEmoji}>✔️</Text>
                <Text style={styles.circleTitle}>출근</Text>
                <Text style={styles.circleSubtitle}>Check-In</Text>
              </TouchableOpacity>
            )}

            {status === 'checked-in' && (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.circleButton, styles.circleCheckOut]}
                onPress={handleCheckOut}
              >
                <Text style={styles.circleEmoji}>✖️</Text>
                <Text style={styles.circleTitle}>퇴근</Text>
                <Text style={styles.circleSubtitle}>Check-Out</Text>
              </TouchableOpacity>
            )}

            {status === 'checked-out' && (
              <View style={[styles.circleButton, styles.circleCompleted]}>
                <Text style={styles.circleEmoji}>✔️</Text>
                <Text style={styles.circleTitle}>퇴근 완료</Text>
                <Text style={styles.circleSubtitle}>Completed</Text>
              </View>
            )}
          </View>

          {/* 현재 시간 카드 */}
          <View style={styles.card}>
            <View style={styles.cardLabelRow}>
              <Text style={styles.cardLabelIcon}>🕒</Text>
              <Text style={styles.cardLabelText}>현재 시간</Text>
            </View>
            <Text style={styles.cardTimeText}>{currentTime}</Text>
          </View>

          {/* 출근 / 퇴근 시간 카드 */}
          {(checkInTime || checkOutTime) && (
            <View style={[styles.card, styles.cardLight]}>
              <View style={styles.timeGrid}>
                {checkInTime ? (
                  <View style={styles.timeCol}>
                    <Text style={styles.timeLabelIn}>출근 시간</Text>
                    <Text style={styles.timeValue}>{checkInTime}</Text>
                  </View>
                ) : null}

                {checkOutTime ? (
                  <View style={styles.timeCol}>
                    <Text style={styles.timeLabelOut}>퇴근 시간</Text>
                    <Text style={styles.timeValue}>{checkOutTime}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}
        </View>

        {/* 하단 버튼 영역 */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.bottomButton}
            onPress={() => {
              // TODO: 출퇴근 기록 보기 화면으로 이동
              // navigation.navigate('AttendanceHistory');
            }}
          >
            <Text style={styles.bottomButtonIcon}>📄</Text>
            <Text style={styles.bottomButtonText}>출퇴근 기록 보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  // 헤더
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  headerInner: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 6,
  },
  backText: { fontSize: 20, color: '#374151' },
  headerTitle: {
    fontSize: 17,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },

  // 메인 내용
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // 상태 뱃지
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 24,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // 원형 버튼
  circleWrapper: {
    marginBottom: 24,
  },
  circleButton: {
    width: 260,
    height: 260,
    borderRadius: 130,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  circleCheckIn: {
    backgroundColor: '#2563EB',
  },
  circleCheckOut: {
    backgroundColor: '#EA580C',
  },
  circleCompleted: {
    backgroundColor: '#6B7280',
  },
  circleEmoji: {
    fontSize: 56,
    marginBottom: 10,
    color: '#FFFFFF',
  },
  circleTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  circleSubtitle: {
    fontSize: 13,
    color: '#E5E7EB',
    marginTop: 4,
  },

  // 카드 공통
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardLight: {
    backgroundColor: '#EFF6FF',
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  cardLabelIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#6B7280',
  },
  cardLabelText: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardTimeText: {
    fontSize: 28,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '500',
  },

  // 출근/퇴근 시간
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeCol: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabelIn: {
    fontSize: 13,
    color: '#2563EB',
    marginBottom: 4,
  },
  timeLabelOut: {
    fontSize: 13,
    color: '#EA580C',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    color: '#111827',
  },

  // 하단 버튼
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  bottomButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  bottomButtonText: {
    fontSize: 15,
    color: '#1D4ED8',
    fontWeight: '500',
  },
});

export default AttendanceScreen;