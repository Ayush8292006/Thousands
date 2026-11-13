import React, { useCallback, useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import Splash from './src/components/Splash';
import { loadBrandFonts } from './src/config/fonts';
import { colors } from './src/theme';

// Web: focus outline hatao + liquid-glass surfaces par asli background blur
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const st = document.createElement('style');
  st.textContent = [
    'input, textarea, input:focus, textarea:focus, input:focus-visible, textarea:focus-visible { outline: none !important; outline-width: 0 !important; box-shadow: none !important; border-color: transparent !important; }',
    '[data-glass="1"] { -webkit-backdrop-filter: blur(22px) saturate(180%); backdrop-filter: blur(22px) saturate(180%); }',
  ].join('\n');
  document.head.appendChild(st);
}

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.page, primary: colors.accent, card: colors.white, text: colors.black },
};

const MIN_SPLASH = 1100; // brand moment — itna hi, zyada wait nahi
const MAX_WAIT = 2500; // font slow ho to bhi app khul jaye

export default function App() {
  const [fontsDone, setFontsDone] = useState(false);
  const [minDone, setMinDone] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    loadBrandFonts().finally(() => setFontsDone(true));
    const a = setTimeout(() => setFontsDone(true), MAX_WAIT);
    const b = setTimeout(() => setMinDone(true), MIN_SPLASH);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  const hideSplash = useCallback(() => setShowSplash(false), []);

  const app = (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );

  // App splash ke neeche mount hota hai, taaki fade-out ke baad turant ready ho
  const body = (
    <View style={{ flex: 1 }}>
      {fontsDone ? app : null}
      {showSplash ? <Splash done={fontsDone && minDone} onFinish={hideSplash} /> : null}
    </View>
  );

  // Web (Vercel): phone-width frame
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, backgroundColor: '#EFE8D8', alignItems: 'center' }}>
        <View
          style={{
            flex: 1, width: '100%', maxWidth: 480, overflow: 'hidden', backgroundColor: colors.page,
            shadowColor: '#3B2F00', shadowOpacity: 0.12, shadowRadius: 40, shadowOffset: { width: 0, height: 0 },
          }}
        >
          {body}
        </View>
      </View>
    );
  }
  return body;
}
