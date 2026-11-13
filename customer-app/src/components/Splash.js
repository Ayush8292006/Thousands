import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import Glass from './Glass';
import Shine from './Shine';
import { BRAND } from '../config/app';
import { colors } from '../theme';

const native = Platform.OS !== 'web';

// Apple-style liquid glass launch screen:
// soft warm colour blobs drift slowly behind a frosted, translucent glass card
// that holds the logo, name and a 0–100% progress line.
const BLOBS = [
  { src: require('../../assets/blob-gold.png'), size: 440, x: -0.25, y: 0.12, dx: 40, dy: 30, dur: 7000 },
  { src: require('../../assets/blob-terracotta.png'), size: 400, x: 0.45, y: 0.36, dx: -35, dy: 40, dur: 8200 },
  { src: require('../../assets/blob-olive.png'), size: 380, x: -0.15, y: 0.6, dx: 30, dy: -35, dur: 9000 },
  { src: require('../../assets/blob-gold.png'), size: 320, x: 0.5, y: -0.05, dx: -25, dy: 30, dur: 7600 },
];

function Blob({ b, w, h, still }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (still) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: b.dur, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration: b.dur, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, b.dur, still]);
  const tx = v.interpolate({ inputRange: [0, 1], outputRange: [0, b.dx] });
  const ty = v.interpolate({ inputRange: [0, 1], outputRange: [0, b.dy] });
  return (
    <Animated.Image
      source={b.src}
      style={{ position: 'absolute', left: b.x * w, top: b.y * h, width: b.size, height: b.size, transform: [{ translateX: tx }, { translateY: ty }] }}
    />
  );
}

export default function Splash({ ready, minDuration = 3400, reducedMotion = false, onReveal, onFinish }) {
  const { width, height } = useWindowDimensions();
  const w = Math.min(width, 480);
  const card = useRef(new Animated.Value(0)).current;
  const content = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;
  const [pct, setPct] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const id = progress.addListener(({ value }) => setPct(Math.round(value * 100)));
    return () => progress.removeListener(id);
  }, [progress]);

  useEffect(() => {
    const d = (ms) => (reducedMotion ? 0 : ms);
    Animated.sequence([
      Animated.timing(card, { toValue: 1, duration: d(800), easing: Easing.out(Easing.cubic), useNativeDriver: native }),
      Animated.timing(content, { toValue: 1, duration: d(600), easing: Easing.out(Easing.cubic), useNativeDriver: native }),
    ]).start();
    Animated.timing(progress, {
      toValue: 0.9,
      duration: Math.max(600, minDuration - 350),
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => setIntroDone(true));
  }, [card, content, progress, minDuration, reducedMotion]);

  // Close only when the intro has played AND the app is ready
  useEffect(() => {
    if (!(ready && introDone)) return;
    Animated.timing(progress, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => {
      if (onReveal) onReveal();
      Animated.timing(out, { toValue: 0, duration: reducedMotion ? 150 : 560, easing: Easing.inOut(Easing.quad), useNativeDriver: native }).start(onFinish);
    });
  }, [ready, introDone, progress, out, onFinish, onReveal, reducedMotion]);

  const cardScale = card.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.9, 1] });
  const rise = content.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : 12, 0] });
  const lineW = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const outScale = out.interpolate({ inputRange: [0, 1], outputRange: [1.05, 1] });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.fill, { opacity: out, transform: [{ scale: outScale }] }]}
      pointerEvents={ready && introDone ? 'none' : 'auto'}
      accessibilityLabel={`Loading ${BRAND.name}, ${pct} percent`}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {BLOBS.map((b, i) => <Blob key={i} b={b} w={w} h={height} still={reducedMotion} />)}
      </View>

      <Animated.View style={[styles.cardWrap, { opacity: card, transform: [{ scale: cardScale }] }]}>
        <Glass tint="rgba(255, 253, 246, 0.38)" radius={36} style={styles.card}>
          <Animated.View style={{ alignItems: 'center', opacity: content, transform: [{ translateY: rise }] }}>
            <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.name}>{BRAND.name}</Text>
            <Text style={styles.tagline}>{BRAND.tagline}</Text>
          </Animated.View>
          <Shine intensity={0.45} duration={1600} pause={1800} delay={900} />
          <View style={styles.progressBox}>
            <View style={styles.track}>
              <Animated.View style={[styles.line, { width: lineW }]} />
            </View>
            <Text style={styles.pct}>{pct}%</Text>
          </View>
        </Glass>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center', zIndex: 50, overflow: 'hidden' },
  cardWrap: {
    borderRadius: 36,
    shadowColor: '#302719', shadowOpacity: 0.16, shadowRadius: 30, shadowOffset: { width: 0, height: 16 }, elevation: 10,
  },
  card: { width: 270, paddingTop: 46, paddingBottom: 32, paddingHorizontal: 24, alignItems: 'center', borderColor: 'rgba(255,255,255,0.9)', borderWidth: 1.5 },
  logo: { width: 92, height: 98 },
  name: { fontSize: 25, fontWeight: '800', fontStyle: 'italic', color: colors.espresso, marginTop: 20, letterSpacing: 0.3 },
  tagline: { fontSize: 12.5, color: '#5E5340', marginTop: 6 },
  progressBox: { alignItems: 'center', marginTop: 34 },
  track: { width: 160, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)', overflow: 'hidden' },
  line: { height: 4, borderRadius: 2, backgroundColor: colors.olive },
  pct: { marginTop: 10, fontSize: 11, fontWeight: '700', color: colors.olive, letterSpacing: 2 },
});
