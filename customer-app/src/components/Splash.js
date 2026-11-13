import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BRAND } from '../config/app';
import { colors } from '../theme';

const native = Platform.OS !== 'web';

// THOUSANDS launch screen — clean, big-brand style
// 1) logo tile zooms in  2) a gold shine sweeps across it  3) name + progress  4) smooth hand-off to home
export default function Splash({ ready, minDuration = 3400, reducedMotion = false, onReveal, onFinish }) {
  const tile = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const name = useRef(new Animated.Value(0)).current;
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
      Animated.timing(tile, { toValue: 1, duration: d(750), easing: Easing.out(Easing.back(1.2)), useNativeDriver: native }),
      Animated.parallel([
        Animated.timing(shine, { toValue: 1, duration: d(1100), easing: Easing.inOut(Easing.cubic), useNativeDriver: native }),
        Animated.timing(name, { toValue: 1, duration: d(600), delay: d(150), easing: Easing.out(Easing.cubic), useNativeDriver: native }),
      ]),
    ]).start();
    Animated.timing(progress, {
      toValue: 0.9,
      duration: Math.max(600, minDuration - 350),
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => setIntroDone(true));
  }, [tile, shine, name, progress, minDuration, reducedMotion]);

  // Close only when the intro has played AND the app is ready
  useEffect(() => {
    if (!(ready && introDone)) return;
    Animated.timing(progress, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => {
      if (onReveal) onReveal();
      Animated.timing(out, { toValue: 0, duration: reducedMotion ? 150 : 520, easing: Easing.inOut(Easing.quad), useNativeDriver: native }).start(onFinish);
    });
  }, [ready, introDone, progress, out, onFinish, onReveal, reducedMotion]);

  const tileScale = tile.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.6, 1] });
  const shineX = shine.interpolate({ inputRange: [0, 1], outputRange: [-160, 200] });
  const nameRise = name.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 0 : 10, 0] });
  const lineW = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const outScale = out.interpolate({ inputRange: [0, 1], outputRange: [1.06, 1] });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.fill, { opacity: out, transform: [{ scale: outScale }] }]}
      pointerEvents={ready && introDone ? 'none' : 'auto'}
      accessibilityLabel={`Loading ${BRAND.name}, ${pct} percent`}
    >
      <Animated.View style={[styles.tileShadow, { opacity: tile, transform: [{ scale: tileScale }] }]}>
        <LinearGradient colors={['#FFFDF6', '#FBF3DC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tile}>
          <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
          {/* gold shine sweep */}
          <Animated.View pointerEvents="none" style={[styles.shine, { transform: [{ translateX: shineX }, { rotate: '20deg' }] }]}>
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,248,220,0.85)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.Text style={[styles.name, { opacity: name, transform: [{ translateY: nameRise }] }]}>{BRAND.name}</Animated.Text>

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
  tileShadow: {
    borderRadius: 40,
    shadowColor: '#625000', shadowOpacity: 0.18, shadowRadius: 30, shadowOffset: { width: 0, height: 14 }, elevation: 12,
    marginTop: -30,
  },
  tile: {
    width: 148, height: 148, borderRadius: 40, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(214, 180, 92, 0.75)',
  },
  logo: { width: 84, height: 90 },
  shine: { position: 'absolute', top: -60, bottom: -60, width: 70, left: 0 },
  name: { fontSize: 26, fontWeight: '800', fontStyle: 'italic', color: colors.olive, marginTop: 26, letterSpacing: 0.4 },
  bottom: { position: 'absolute', bottom: 72, alignItems: 'center' },
  track: { width: 140, height: 3, borderRadius: 2, backgroundColor: 'rgba(98, 80, 0, 0.12)', overflow: 'hidden' },
  line: { height: 3, borderRadius: 2, backgroundColor: colors.gold },
  pct: { marginTop: 10, fontSize: 11, fontWeight: '700', color: colors.olive, letterSpacing: 2 },
});
