import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

// 📌 Screens
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/worker/HomeScreen';
import WorkerMyPageScreen from './src/worker/MyPageScreen';
import ManagerHomeScreen from './src/manager/ManagerHomeScreen';
import ManagerMyPageScreen from './src/manager/MyPageScreen';

import HazardReportScreen from './src/worker/HazardReportScreen';
import AttendanceScreen from './src/worker/AttendanceScreen';
import AttendanceHistoryScreen from './src/worker/AttendanceHistoryScreen';

import WorkerNoticeList from './src/worker/WorkerNoticeList';
import WorkerNoticeDetail from './src/worker/WorkerNoticeDetail';

import ManagerCertificatesScreen from './src/manager/ManagerCertificatesScreen';
import WorkerManagementScreen from './src/manager/WorkerManagementScreen';
import MapManagementScreen from './src/manager/MapManagementScreen';
import WorkerMapScreen from './src/worker/WorkerMapScreen';

import IdCardCameraScreen from './src/screen/IdCardCameraScreen';
import ContractCameraScreen from './src/screen/ContractCameraScreen';

// ----------------------------------------------------
// ⭐ Navigation 타입 정의
// ----------------------------------------------------
export type RootStackParamList = {
  Login: undefined;

  // 근로자
  WorkerHome: undefined;
  WorkerMyPage: undefined;
  HazardReport: undefined;
  Attendance: undefined;
  AttendanceHistory: undefined;
  Map: undefined;

  // 관리자
  ManagerHome: undefined;
  ManagerMyPage: undefined;
  ManagerCertificates: {
    worker: { id: number; name: string; role: string; site: string };
  };
  MapManagement: undefined;
  WorkerManagement: { ocrData?: any; idCardData?: any } | undefined;

  // OCR
  IdCardCamera: undefined;
  ContractCamera: undefined;

  // 공지사항
  WorkerNoticeList: undefined;
  WorkerNoticeDetail: { noticeId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ----------------------------------------------------
// ⭐ App Component (안전 버전)
// ----------------------------------------------------
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        translucent={false}
        backgroundColor="#ffffff"
        barStyle="dark-content"
        hidden={false}        // 🔥 강제로 시계 켜기
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* 공통 */}
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* 근로자 */}
          <Stack.Screen name="WorkerHome" component={HomeScreen} />
          <Stack.Screen name="WorkerMyPage" component={WorkerMyPageScreen} />
          <Stack.Screen name="HazardReport" component={HazardReportScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="AttendanceHistory" component={AttendanceHistoryScreen} />
          <Stack.Screen name="Map" component={WorkerMapScreen} />

          {/* 관리자 */}
          <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
          <Stack.Screen name="ManagerMyPage" component={ManagerMyPageScreen} />
          <Stack.Screen name="ManagerCertificates" component={ManagerCertificatesScreen} />
          <Stack.Screen name="WorkerManagement" component={WorkerManagementScreen} />
          <Stack.Screen name="MapManagement" component={MapManagementScreen} />

          {/* 공지사항 */}
          <Stack.Screen name="WorkerNoticeList" component={WorkerNoticeList} />
          <Stack.Screen name="WorkerNoticeDetail" component={WorkerNoticeDetail} />

          {/* OCR */}
          <Stack.Screen name="IdCardCamera" component={IdCardCameraScreen} />
          <Stack.Screen name="ContractCamera" component={ContractCameraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}