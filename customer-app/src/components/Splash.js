import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BRAND } from '../config/app';
import { colors } from '../theme';

const native = Platform.OS !== 'web';
const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, "Times New Roman", serif' });

// THOUSANDS branded loading experience — Royal Indian luxury
// Stage 1: gold mandala blooms + slowly rotates, logo medallion reveals
// Stage 2: wordmark letters appear one by one, gold progress line + 0–100% counter
// Stage 3: smooth hand-off to the homepage (App.js reveals the page)
export default function Splash({ ready, minDuration = 3400, reducedMotion = false, onReveal, onFinish }) {
  const word = BRAND.name.toUpperCase().split('');
  const bloom = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const medal = useRef(new Animated.Value(0)).current;
  const letters = useRef(word.map(() => new Animated.Value(0))).current;
  const tag = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;
  const [pct, setPct] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const id = progress.addListener(({ value }) => setPct(Math.round(value * 100)));
    return () => progress.removeListener(id);
  }, [progress]);

  useEffect(() => {
    const T = (v, d, delay = 0, e = Easing.out(Easing.cubic)) =>
      Animated.timing(v, { toValue: 1, duration: reducedMotion ? 0 : d, delay: reducedMotion ? 0 : delay, easing: e, useNativeDriver: native });
    Animated.parallel([
      T(bloom, 1200),
      T(medal, 800, 250),
      Animated.stagger(reducedMotion ? 0 : 70, letters.map((l) => T(l, 420, 900))),
      T(tag, 600, 1700),
    ]).start();
    if (!reducedMotion) {
      Animated.loop(Animated.timing(spin, { toValue: 1, duration: 28000, easing: Easing.linear, useNativeDriver: native })).start();
    }
    Animated.timing(progress, {
      toValue: 0.9,
      duration: Math.max(600, minDuration - 350),
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => setIntroDone(true));
  }, [bloom, medal, letters, tag, spin, progress, minDuration, reducedMotion]);

  // Close only when the intro has played AND the app is ready
  useEffect(() => {
    if (!(ready && introDone)) return;
    Animated.timing(progress, { toValue: 1, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => {
      if (onReveal) onReveal();
      Animated.timing(out, { toValue: 0, duration: reducedMotion ? 150 : 560, easing: Easing.inOut(Easing.quad), useNativeDriver: native }).start(onFinish);
    });
  }, [ready, introDone, progress, out, onFinish, onReveal, reducedMotion]);

  const bloomScale = bloom.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.8, 1] });
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const medalScale = medal.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.6, 1] });
  const tagRise = tag.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : 8, 0] });
  const lineW = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const outScale = out.interpolate({ inputRange: [0, 1], outputRange: [1.05, 1] });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { zIndex: 50, opacity: out, transform: [{ scale: outScale }] }]}
      pointerEvents={ready && introDone ? 'none' : 'auto'}
      accessibilityLabel={`Loading ${BRAND.name}, ${pct} percent`}
    >
      <LinearGradient colors={['#F2E8D2', colors.ivory, '#F2E8D2']} style={styles.fill}>
        <View style={styles.center}>
          <Animated.Image
            source={require('../../assets/mandala.png')}
            style={[styles.mandala, { opacity: bloom, transform: [{ scale: bloomScale }, { rotate }] }]}
            resizeMode="contain"
          />
          <Animated.View style={[styles.medal, { opacity: medal, transform: [{ scale: medalScale }] }]}>
            <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
          </Animated.View>
        </View>

        <View style={styles.wordRow}>
          {word.map((ch, i) => {
            const rise = letters[i].interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : 10, 0] });
            return (
              <Animated.Text key={`${ch}${i}`} style={[styles.letter, { opacity: letters[i], transform: [{ translateY: rise }] }]}>
                {ch}
              </Animated.Text>
            );
          })}
        </View>
        <Animated.Text style={[styles.tagline, { opacity: tag, transform: [{ translateY: tagRise }] }]}>{BRAND.tagline}</Animated.Text>

        <View style={styles.bottom}>
          <View style={styles.track}>
            <Animated.View style={[styles.line, { width: lineW }]} />
          </View>
          <Text style={styles.pct}>{pct}%</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { width: 330, height: 330, alignItems: 'center', justifyContent: 'center', marginTop: -40 },
  mandala: { position: 'absolute', width: 330, height: 330 },
  medal: {
    width: 116, height: 116, borderRadius: 58, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cream, borderWidth: 1.5, borderColor: 'rgba(214, 180, 92, 0.85)',
    shadowColor: '#625000', shadowOpacity: 0.16, shadowRadius: 22, shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  logo: { width: 60, height: 64 },
  wordRow: { flexDirection: 'row', marginTop: 26 },
  letter: { fontFamily: SERIF, fontSize: 24, fontWeight: '700', color: colors.espresso, marginHorizontal: 5 },
  tagline: { fontFamily: SERIF, fontStyle: 'italic', fontSize: 13.5, color: colors.muted, marginTop: 10 },
  bottom: { position: 'absolute', bottom: 70, alignItems: 'center' },
  track: { width: 150, height: 2, borderRadius: 1, backgroundColor: 'rgba(98, 80, 0, 0.12)', overflow: 'hidden' },
  line: { height: 2, borderRadius: 1, backgroundColor: colors.gold },
  pct: { marginTop: 10, fontSize: 11, fontWeight: '700', color: colors.olive, letterSpacing: 2 },
});
