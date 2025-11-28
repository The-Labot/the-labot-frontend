import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getTempAccessToken } from '../api/auth';
import { BASE_URL } from '../api/config';

type Props = NativeStackScreenProps<RootStackParamList, 'MapManagement'>;

const MapManagementScreen: React.FC<Props> = ({ navigation }) => {
  const [siteMapUrl, setSiteMapUrl] = React.useState<string | null>(null);

  // === 지도 조회 ===
const fetchSiteMap = async () => {
  console.log("📌 [지도조회] fetchSiteMap() 호출됨");
  const token = getTempAccessToken();
  if (!token) return;

  try {
    const res = await fetch(`${BASE_URL}/manager/map`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const text = await res.text();
    console.log("📌 [지도조회] 서버 응답(raw):", text);
    const json = JSON.parse(text);
    console.log("📌 [지도조회] 파싱된 JSON:", json);
    if (json.siteMapUrl && json.siteMapUrl.length > 0) {
      const lastFile = json.siteMapUrl[json.siteMapUrl.length - 1];
      const fullUrl = `${BASE_URL}${lastFile.fileUrl}`;
      setSiteMapUrl(fullUrl);
    } else {
      setSiteMapUrl(null);
    }
  } catch (error) {
    console.log("🚨 지도 조회 실패:", error);
  }
};
  // === 지도 등록 ===
  const handleSelectMap = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 1 },
      async (response) => {
        if (response.didCancel) return;
        if (!response.assets || response.assets.length === 0) return;

        const image = response.assets[0];

        if (!image.uri) {
          Alert.alert('오류', '이미지를 불러올 수 없습니다.');
          return;
        }

        await uploadMap(image);
      }
    );
  };

  // === 서버 업로드 ===
  const uploadMap = async (image: any) => {
    const token = getTempAccessToken();
    if (!token) {
      Alert.alert('인증 오류', '로그인이 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('files', {
      uri: image.uri,
      name: image.fileName || 'map.jpg',
      type: image.type || 'image/jpeg',
    }as any);

    try {
      const res = await fetch(`${BASE_URL}/manager/map`, {
        method: 'POST',
        headers: {
          Authorization: token, // Bearer 포함됨
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const json = await res.json();

      if (res.ok) {
        Alert.alert('성공', '지도 등록 성공!');
        fetchSiteMap();
        // 서버에서 지도 URL을 내려주는 경우 반영
        if (json.mapUrl) setSiteMapUrl(json.mapUrl);
      } else {
        Alert.alert('오류', json.message || '지도 등록 실패');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('오류', '업로드 중 문제가 발생했습니다.');
    }
  };

  React.useEffect(() => {
  fetchSiteMap();
}, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>현장 지도</Text>
        </View>

        {/* 지도 이미지 영역 */}
        <View style={styles.mapContainer}>
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
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSelectMap}>
            <Text style={styles.actionBtnText}>지도 등록</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
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
    height: 450,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapImage: { width: '100%', height: '100%' },

  buttonArea: { width: '100%', gap: 12 },
  actionButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  noImageBox: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: { color: '#6B7280', fontSize: 14 },
});