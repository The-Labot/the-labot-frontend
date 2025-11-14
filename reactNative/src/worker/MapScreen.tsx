// src/worker/MapScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

const campusMap = require('../../SejongMap.png');

const MapScreen: React.FC<Props> = ({ navigation }) => {
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

        {/* 지도 이미지: 헤더 아래 영역 전체 차지 */}
        <View style={styles.mapContainer}>
          <Image
            source={campusMap}
            style={styles.mapImage}
            resizeMode="cover" // 전체 이미지 보이게, 여백 조금 생겨도 됨
          />
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

  // 이미지 영역
  mapContainer: {
    flex: 1,              // 헤더 아래 남은 화면 전체
    backgroundColor: '#F3F4F6',
  },
  mapImage: {
    flex: 1,              // 컨테이너를 가득 채움
    width: '100%'
  },
});

export default MapScreen;