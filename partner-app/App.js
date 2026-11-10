import React, { useEffect, useState } from 'react';
import { View, Image, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SellerProvider } from './src/context/SellerContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme';
import GlitterOverlay from './src/components/GlitterOverlay';

// Web: browser ka default focus outline hatao
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const st = document.createElement('style');
  st.textContent = 'input, textarea, input:focus, textarea:focus, input:focus-visible, textarea:focus-visible { outline: none !important; outline-width: 0 !important; box-shadow: none !important; }';
  document.head.appendChild(st);
}

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.accent, card: colors.white, text: colors.black },
};

export default function App() {
  const [loaded, error] = useFonts({ PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold });
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!loaded && !error && !timedOut) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('./assets/logo-white.png')} style={{ width: 70, height: 80 }} resizeMode="contain" />
      </View>
    );
  }

  const app = (
    <SafeAreaProvider>
      <SellerProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </SellerProvider>
      <GlitterOverlay />
    </SafeAreaProvider>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#F3E5BF', alignItems: 'center' }}>
        <View style={{ flex: 1, width: '100%', maxWidth: 480, overflow: 'hidden', backgroundColor: colors.bg }}>{app}</View>
      </View>
    );
  }
  return app;
}
