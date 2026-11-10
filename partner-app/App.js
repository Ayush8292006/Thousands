import React from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { SellerProvider } from './src/context/SellerContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';

// Web: browser ka default focus outline saare inputs se hatao
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const st = document.createElement('style');
  st.textContent = 'input, textarea, input:focus, textarea:focus, input:focus-visible, textarea:focus-visible { outline: none !important; outline-width: 0 !important; box-shadow: none !important; border-color: transparent !important; }';
  document.head.appendChild(st);
}

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.accent, card: colors.white, text: colors.black },
};

// Sharp theme: system font, koi font-loading / splash wait nahi — app turant khulta hai.
export default function App() {
  const app = (
    <SafeAreaProvider>
      <SellerProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </SellerProvider>
    </SafeAreaProvider>
  );

  // Web (Vercel): phone-width frame
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#E6E7EB', alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: 480, overflow: 'hidden', backgroundColor: colors.white }}>{app}</View>
      </View>
    );
  }
  return app;
}
