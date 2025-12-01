// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// App.tsx
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/worker/HomeScreen';
import WorkerMyPageScreen from './src/worker/MyPageScreen';   // 이름 바꿔주자
import ManagerHomeScreen from './src/manager/ManagerHomeScreen';
import HazardReportScreen from './src/worker/HazardReportScreen';
import AttendanceScreen from './src/worker/AttendanceScreen';
import AttendanceHistoryScreen from './src/worker/AttendanceHistoryScreen';
import ManagerCertificatesScreen from './src/manager/ManagerCertificatesScreen';
import ManagerMyPageScreen from './src/manager/MyPageScreen'; // ✅ 이건 관리자용
import WorkerNoticeList from './src/worker/WorkerNoticeList';
import WorkerNoticeDetail from './src/worker/WorkerNoticeDetail';
import ContractWriteScreen from './src/screen/ContractWriteScreen';
import MapManagementScreen from './src/manager/MapManagementScreen';
import WorkerMapScreen from './src/worker/WorkerMapScreen';
import WorkerManagementScreen from "./src/manager/WorkerManagementScreen";
import IdCardCameraScreen from './src/screen/IdCardCameraScreen';

export type RootStackParamList = {
      Login: undefined;
      WorkerHome: undefined;        // 근로자 홈
      WorkerMyPage: undefined;      // 근로자 마이페이지
      ManagerHome: undefined;       // 관리자 홈
      ManagerMyPage: undefined;     // 관리자 마이페이지
      HazardReport: undefined;
      Attendance: undefined;
      AttendanceHistory: undefined;
      ContractWrite: { contractType: string };
      MapManagement: undefined;
      Map: undefined;

    ManagerCertificates: {       // ✅ 추가
    worker: { id: number; name: string; role: string; site: string };

  };
  // 📌 공지사항 화면
      WorkerNoticeList: undefined;
      WorkerNoticeDetail: { noticeId: number };
     WorkerManagement: { ocrData?: any } | undefined;
       IdCardCamera: undefined;   // ← 추가


};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="WorkerHome" component={HomeScreen} />

        {/* ✅ 근로자 / 관리자 마이페이지를 각각 매핑 */}
        <Stack.Screen name="WorkerMyPage" component={WorkerMyPageScreen} />
        <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
        <Stack.Screen name="ManagerMyPage" component={ManagerMyPageScreen} />

        <Stack.Screen name="HazardReport" component={HazardReportScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen
          name="AttendanceHistory"
          component={AttendanceHistoryScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="MapManagement" component={MapManagementScreen} />
        <Stack.Screen name="Map" component={WorkerMapScreen} />
        
        <Stack.Screen name="ManagerCertificates" component={ManagerCertificatesScreen} />
        
        <Stack.Screen name="ContractWrite" component={ContractWriteScreen} />
        <Stack.Screen name="WorkerNoticeList" component={WorkerNoticeList} />
        <Stack.Screen name="WorkerNoticeDetail" component={WorkerNoticeDetail} />

        <Stack.Screen name="IdCardCamera" component={IdCardCameraScreen} />
        <Stack.Screen name="WorkerManagement" component={WorkerManagementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}