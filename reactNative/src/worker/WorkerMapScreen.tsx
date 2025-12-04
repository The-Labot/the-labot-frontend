// src/worker/WorkerMapScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getTempAccessToken } from '../api/auth';
import { BASE_URL } from '../api/config';
import ScreenWrapper from '../ScreenWrapper';
import ImageViewer from 'react-native-image-zoom-viewer';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

const WorkerMapScreen: React.FC<Props> = ({ navigation }) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [zoomVisible, setZoomVisible] = useState(false);

  // 지도 조회 API
  const fetchWorkerMap = async () => {
    const token = getTempAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/worker/map`, {
        method: 'GET',
        headers: { Authorization: token },
      });

      const text = await res.text();
      const json = JSON.parse(text);

      if (json.siteMapUrl?.length > 0) {
        const last = json.siteMapUrl[json.siteMapUrl.length - 1];
        setMapUrl(last.fileUrl);
      } else {
        setMapUrl(null);
      }
    } catch (err) {
      console.log("🚨 지도 조회 오류:", err);
    }
  };

  useEffect(() => {
    fetchWorkerMap();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
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
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setZoomVisible(true)} // 🔥 클릭 시 확대 모달 실행
              style={{ flex: 1 }}
            >
              <Image
                source={{ uri: mapUrl }}
                style={styles.mapImage}
                resizeMode="contain" // 기본 화면에서 잘 보이게
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImageText}>등록된 현장 지도가 없습니다</Text>
            </View>
          )}
        </View>

        {/* 🔍 확대 모달 */}
        <Modal visible={zoomVisible} transparent={true}>
          <ImageViewer
            imageUrls={[{ url: mapUrl ?? '' }]}
            enableSwipeDown={true}
            onSwipeDown={() => setZoomVisible(false)}
            onClick={() => setZoomVisible(false)} // 한 번 클릭해도 닫히게
            saveToLocalByLongPress={false}
          />
        </Modal>

      </View>
    </ScreenWrapper>
  );
};

export default WorkerMapScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  backButton: { paddingVertical: 4, paddingRight: 10, paddingLeft: 4 },
  backText: { fontSize: 20, color: '#374151' },

  headerTitleWrapper: { flex: 1 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  mapContainer: { flex: 1 },

  mapImage: {
    width: '100%',
    height: '100%',
  },

  noImageBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noImageText: { color: '#6B7280', fontSize: 15 },
});