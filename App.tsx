// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/worker/HomeScreen';
import MyPageScreen from './src/worker/MyPageScreen';
import ManagerHomeScreen from './src/manager/ManagerHomeScreen';

export type RootStackParamList = {
  Login: undefined;
  WorkerHome: undefined;   // 근로자 홈
  MyPage: undefined;
  ManagerHome: undefined;  // 관리자 홈
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
        <Stack.Screen name="MyPage" component={MyPageScreen} />
        <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}