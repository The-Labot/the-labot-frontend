import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'MapManagement'>;

const MapManagementScreen: React.FC<Props> = ({ navigation }) => {
  const [siteMapUrl, setSiteMapUrl] = React.useState<string | null>(null);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* ===== Header ===== */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>현장 지도</Text>
        </View>

        {/* ===== 지도 이미지 영역 (화면 80%) ===== */}
        
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

        {/* ===== 버튼 영역 (화면 20%) ===== */}
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionBtnText}>지도 등록</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
            <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>
              지도 수정
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MapManagementScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
  },

  /* ===== Header ===== */
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 6,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  /* ===== Map Area (80%) ===== */
  mapContainer: {
    width: '100%',
    height: 450, // 태블릿 기준 약 75~80%
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },

  /* ===== Button Area (20%) ===== */
  buttonArea: {
    width: '100%',
    gap: 12,
  },

  actionButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  noImageBox: {
  flex: 1,
  backgroundColor: '#E5E7EB',
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
},
noImageText: {
  color: '#6B7280',
  fontSize: 14,
},
});