import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { ArrowLeft, X } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getTempAccessToken } from '../api/auth';
import { BASE_URL } from '../api/config';

import ImageViewer from 'react-native-image-zoom-viewer';
import ScreenWrapper from '../ScreenWrapper';

type Props = NativeStackScreenProps<RootStackParamList, 'MapManagement'>;

const MapManagementScreen: React.FC<Props> = ({ navigation }) => {
  const [siteMapUrl, setSiteMapUrl] = useState<string | null>(null);

  // 🔵 확대 모달 상태
  const [zoomVisible, setZoomVisible] = useState(false);

  // === 지도 조회 ===
  const fetchSiteMap = async () => {
    const token = getTempAccessToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/manager/map`, {
        method: 'GET',
        headers: { Authorization: token },
      });

      const text = await res.text();
      const json = JSON.parse(text);

      if (json.siteMapUrl?.length > 0) {
        setSiteMapUrl(json.siteMapUrl[json.siteMapUrl.length - 1].fileUrl);
      } else {
        setSiteMapUrl(null);
      }
    } catch (error) {
      console.log("🚨 지도 조회 실패:", error);
    }
  };

  // === 지도 업로드 ===
  const handleSelectMap = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      async (response) => {
        if (response.didCancel) return;
        if (!response.assets || response.assets.length === 0) return;

        await uploadMap(response.assets[0]);
      }
    );
  };

  const uploadMap = async (image: any) => {
    const token = getTempAccessToken();
    if (!token) return;

    const formData = new FormData();
    formData.append('files', {
      uri: image.uri,
      name: image.fileName || 'map.jpg',
      type: image.type || 'image/jpeg',
    } as any);

    try {
      const res = await fetch(`${BASE_URL}/manager/map`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        Alert.alert('성공', '지도 등록 성공!');
        fetchSiteMap();
      } else {
        Alert.alert('오류', json.message || '지도 등록 실패');
      }
    } catch (error) {
      Alert.alert('오류', '업로드 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchSiteMap();
  }, []);

  return (
    <ScreenWrapper>

      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>현장 지도</Text>
        </View>

        {/* 지도 이미지 영역 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => siteMapUrl && setZoomVisible(true)}
          style={styles.mapContainer}
        >
          {siteMapUrl ? (
            <Image
              source={{ uri: siteMapUrl }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImageText}>등록된 현장 지도가 없습니다</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 버튼 영역 */}
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSelectMap}>
            <Text style={styles.actionBtnText}>지도 등록</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ======================= */}
      {/* 확대 모달 */}
      {/* ======================= */}
      <Modal visible={zoomVisible} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          {/* 닫기 버튼 */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setZoomVisible(false)}
          >
            <X size={28} color="white" />
          </TouchableOpacity>

          {/* 이미지 확대 뷰어 */}
          <ImageViewer
            imageUrls={[{ url: siteMapUrl ?? '' }]}
            enableSwipeDown
            onSwipeDown={() => setZoomVisible(false)}
            saveToLocalByLongPress={false}
            backgroundColor="black"
          />
        </View>
      </Modal>

    </ScreenWrapper>

  );
};

export default MapManagementScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flexGrow: 1, padding: 20, gap: 20 },

  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: { padding: 6, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },

  mapContainer: {
    width: '100%',
    height: 600,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapImage: { width: '100%', height: '100%' },

  noImageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: { color: '#6B7280', fontSize: 14 },

  buttonArea: { width: '100%', gap: 12 },
  actionButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 999,
    padding: 8,
  },
});