// src/worker/WorkerMapScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getTempAccessToken } from '../api/auth';
import { BASE_URL } from '../api/config';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

const WorkerMapScreen: React.FC<Props> = ({ navigation }) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  // ============================
  // 📌 1. 근로자 지도 조회
  // ============================
  const fetchWorkerMap = async () => {
    console.log("📌 [근로자 지도조회] fetchWorkerMap 호출됨");

    const token = getTempAccessToken();
    if (!token) {
      console.log("🚨 토큰 없음");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/worker/map`, {
        method: 'GET',
        headers: { Authorization: token },
      });

      const text = await res.text();
      console.log("📌 [근로자 지도조회] 서버 응답(raw):", text);

      const json = JSON.parse(text);
      console.log("📌 [근로자 지도조회] 파싱된 JSON:", json);

      if (json.siteMapUrl?.length > 0) {
        const last = json.siteMapUrl[json.siteMapUrl.length - 1];
        const fullUrl = `${BASE_URL}${last.fileUrl}`;

        console.log("📌 [근로자 지도조회] 최종 이미지 URL:", fullUrl);

        setMapUrl(fullUrl);
      } else {
        console.log("📌 [근로자 지도조회] 지도 없음");
        setMapUrl(null);
      }

    } catch (err) {
      console.log("🚨 [근로자 지도조회] 오류:", err);
    }
  };

  useEffect(() => {
    fetchWorkerMap();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleWrapper}>
            <Text style={styles.headerTitle}>현장 위치</Text>
            <Text style={styles.headerSubtitle}>Site Location</Text>
          </View>
        </View>

        {/* 지도 영역 */}
        <View style={styles.mapContainer}>
          {mapUrl ? (
            <Image source={{ uri: mapUrl }} style={styles.mapImage} resizeMode="cover" />
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImageText}>등록된 현장 지도가 없습니다</Text>
            </View>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
};

export default WorkerMapScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  // 헤더
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 10,
    paddingLeft: 4,
  },
  backText: {
    fontSize: 20,
    color: '#374151',
  },
  headerTitleWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  // 지도 영역
  mapContainer: {
    flex: 1, // 화면 90% 이상
    backgroundColor: '#F3F4F6',
  },
  mapImage: {
    flex: 1,
    width: '100%',
  },

  noImageBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#6B7280',
    fontSize: 15,
  },
});