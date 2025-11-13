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
import MapScreen from './src/worker/MapScreen';
import ManagerCertificatesScreen from './src/manager/ManagerCertificatesScreen';
import ManagerMyPageScreen from './src/manager/MyPageScreen'; // ✅ 이건 관리자용

export type RootStackParamList = {
      Login: undefined;
      WorkerHome: undefined;        // 근로자 홈
      WorkerMyPage: undefined;      // 근로자 마이페이지
      ManagerHome: undefined;       // 관리자 홈
      ManagerMyPage: undefined;     // 관리자 마이페이지
      HazardReport: undefined;
      Attendance: undefined;
      Map: undefined;

    ManagerCertificates: {       // ✅ 추가
    worker: { id: number; name: string; role: string; site: string };
  };
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
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="ManagerCertificates" component={ManagerCertificatesScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}