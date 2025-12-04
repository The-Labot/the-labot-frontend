import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar
        translucent={false}
        backgroundColor="#fff"
        barStyle="dark-content"
        hidden={false}
      />
      {children}
    </SafeAreaView>
  );
}