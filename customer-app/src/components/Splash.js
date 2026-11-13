import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { calli } from '../config/fonts';
import { BRAND } from '../config/app';
import { colors } from '../theme';

const native = Platform.OS !== 'web';

// THOUSANDS branded loading experience
// Stage 1: logo reveal (scale + fade) with champagne-gold glow
// Stage 2: gold progress line + 0–100% counter (synced with real app readiness)
// Stage 3: smooth fade/scale hand-off to the homepage (App.js handles the page reveal)
export default function Splash({ ready, minDuration = 3400, reducedMotion = false, onReveal, onFinish }) {
  const logo = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const text = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;
  const [pct, setPct] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  // Percentage counter follows the progress line
  useEffect(() => {
    const id = progress.addListener(({ value }) => setPct(Math.round(value * 100)));
    return () => progress.removeListener(id);
  }, [progress]);

  // Stage 1 + 2: reveal, then fill to 90% across the minimum intro time
  useEffect(() => {
    const revealMs = reducedMotion ? 0 : 900;
    Animated.parallel([
      Animated.timing(logo, { toValue: 1, duration: revealMs, easing: Easing.out(Easing.cubic), useNativeDriver: native }),
      Animated.timing(glow, { toValue: 1, duration: reducedMotion ? 0 : 1400, easing: Easing.out(Easing.quad), useNativeDriver: native }),
      Animated.sequence([
        Animated.delay(reducedMotion ? 0 : 450),
        Animated.timing(text, { toValue: 1, duration: reducedMotion ? 0 : 600, easing: Easing.out(Easing.cubic), useNativeDriver: native }),
      ]),
    ]).start();
    Animated.timing(progress, {
      toValue: 0.9,
      duration: Math.max(600, minDuration - 350),
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => setIntroDone(true));
  }, [logo, glow, text, progress, minDuration, reducedMotion]);

  // Finish only when BOTH the intro has played and the app is actually ready
  useEffect(() => {
    if (!(ready && introDone)) return;
    Animated.timing(progress, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => {
      if (onReveal) onReveal();
      Animated.timing(out, { toValue: 0, duration: reducedMotion ? 150 : 520, easing: Easing.inOut(Easing.quad), useNativeDriver: native }).start(onFinish);
    });
  }, [ready, introDone, progress, out, onFinish, onReveal, reducedMotion]);

  const scale = logo.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.82, 1] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const rise = text.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : 12, 0] });
  const lineW = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const outScale = out.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1] });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.fill, { opacity: out, transform: [{ scale: outScale }] }]}
      pointerEvents={ready && introDone ? 'none' : 'auto'}
      accessibilityLabel={`Loading ${BRAND.name}, ${pct} percent`}
    >
      {/* champagne-gold light behind the logo */}
      <Animated.View style={[styles.glow, { opacity: glow, transform: [{ scale: glowScale }] }]} />
      <Animated.View style={[styles.glowInner, { opacity: glow }]} />

      <Animated.View style={[styles.logoRing, { opacity: logo, transform: [{ scale }] }]}>
        <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View style={{ alignItems: 'center', opacity: text, transform: [{ translateY: rise }] }}>
        <Text style={[calli(30, colors.olive), { marginTop: 22 }]}>{BRAND.name}</Text>
        <Text style={styles.tagline}>{BRAND.tagline}</Text>
      </Animated.View>

      <View style={styles.bottom}>
        <View style={styles.track}>
          <Animated.View style={[styles.line, { width: lineW }]} />
        </View>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  glow: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(214, 180, 92, 0.16)' },
  glowInner: { position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(214, 180, 92, 0.18)' },
  logoRing: {
    width: 118, height: 118, borderRadius: 59, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cream, borderWidth: 1.5, borderColor: 'rgba(214, 180, 92, 0.7)',
    shadowColor: '#625000', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 10,
  },
  logo: { width: 64, height: 68 },
  tagline: { fontSize: 13, color: colors.muted, marginTop: 4, letterSpacing: 0.3 },
  bottom: { position: 'absolute', bottom: 84, alignItems: 'center' },
  track: { width: 168, height: 2, borderRadius: 1, backgroundColor: 'rgba(98, 80, 0, 0.12)', overflow: 'hidden' },
  line: { height: 2, borderRadius: 1, backgroundColor: colors.gold },
  pct: { marginTop: 10, fontSize: 12, fontWeight: '700', color: colors.olive, letterSpacing: 1.5 },
});
