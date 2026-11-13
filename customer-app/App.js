import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Platform, Animated, Easing, AccessibilityInfo } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import Splash from './src/components/Splash';
import { loadBrandFonts } from './src/config/fonts';
import { colors } from './src/theme';

const isWeb = Platform.OS === 'web';

// Web: focus outline hatao + liquid-glass surfaces par asli background blur
if (isWeb && typeof document !== 'undefined') {
  const st = document.createElement('style');
  st.textContent = [
    'input, textarea, input:focus, textarea:focus, input:focus-visible, textarea:focus-visible { outline: none !important; outline-width: 0 !important; box-shadow: none !important; border-color: transparent !important; }',
    // Real liquid glass: translucent surface + backdrop blur + inner highlight + soft layered shadow
    '[data-glass="1"] { -webkit-backdrop-filter: blur(25px) saturate(180%); backdrop-filter: blur(25px) saturate(180%); box-shadow: 0 20px 60px rgba(48, 39, 25, 0.16), inset 0 1px 2px rgba(255, 255, 255, 0.85) !important; }',
    // Popup / dropdown dimming layer: separate, light blur so the page stays recognisable
    '[data-glassdim="1"] { -webkit-backdrop-filter: blur(3px); backdrop-filter: blur(3px); }',
    // Graceful fallback when backdrop-filter is not supported: stronger tint keeps text readable
    '@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { [data-glass="1"] { background-color: rgba(255, 253, 246, 0.9) !important; } }',
    'html, body { background: #F8F3E7; overflow-x: hidden; }',
  ].join('\n');
  document.head.appendChild(st);
}

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.page, primary: colors.olive, card: colors.cream, text: colors.espresso, border: colors.border },
};

// Intro timing
// - First visit (and every cold start on phone): branded intro, ~2.4 s minimum
// - Refresh within the same browser session: short intro (no full replay)
// - Reduced motion: short, no scale/slide motion
// - Never closes before the app is actually ready; never infinite (fonts give up after MAX_WAIT)
const FULL_INTRO = 2400;
const SHORT_INTRO = 900;
const MAX_WAIT = 6000;
const SESSION_KEY = 'thousands_intro_seen';

function introSeenThisSession() {
  if (!isWeb) return false;
  try { return window.sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
}

export default function App() {
  const [fontsDone, setFontsDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [minDuration] = useState(() => (introSeenThisSession() ? SHORT_INTRO : FULL_INTRO));
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadBrandFonts().finally(() => setFontsDone(true));
    const t = setTimeout(() => setFontsDone(true), MAX_WAIT);
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => setReducedMotion(!!v)).catch(() => {});
    return () => clearTimeout(t);
  }, []);

  // Homepage reveal: soft fade + slight scale-up, starts as the loader hands off
  const onReveal = useCallback(() => {
    Animated.timing(reveal, { toValue: 1, duration: reducedMotion ? 150 : 620, easing: Easing.out(Easing.cubic), useNativeDriver: !isWeb }).start();
  }, [reveal, reducedMotion]);

  const onFinish = useCallback(() => {
    setShowSplash(false);
    if (isWeb) {
      try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* storage unavailable */ }
    }
  }, []);

  const appScale = reveal.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.975, 1] });

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

  const body = (
    <View style={{ flex: 1, backgroundColor: colors.ivory }}>
      {fontsDone ? (
        <Animated.View style={{ flex: 1, opacity: showSplash ? reveal : 1, transform: [{ scale: showSplash ? appScale : 1 }] }}>{app}</Animated.View>
      ) : null}
      {showSplash ? (
        <Splash ready={fontsDone} minDuration={reducedMotion ? SHORT_INTRO : minDuration} reducedMotion={reducedMotion} onReveal={onReveal} onFinish={onFinish} />
      ) : null}
    </View>
  );

  // Web (Vercel): mobile-first frame, centred on tablets / desktop
  if (isWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: '#EFE6D2', alignItems: 'center' }}>
        <View
          style={{
            flex: 1, width: '100%', maxWidth: 480, overflow: 'hidden', backgroundColor: colors.ivory,
            shadowColor: '#302719', shadowOpacity: 0.14, shadowRadius: 40, shadowOffset: { width: 0, height: 0 },
          }}
        >
          {body}
        </View>
      </View>
    );
  }
  return body;
}
