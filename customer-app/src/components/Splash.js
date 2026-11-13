import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BRAND } from '../config/app';
import { colors } from '../theme';

const native = Platform.OS !== 'web';

// Minimal, premium startup screen:
// warm ivory + very subtle champagne-gold wash, the THOUSANDS logo fades in with a gentle scale,
// a thin golden loading line, and a small "Loading your experience..." note. Then a soft fade-out.
export default function Splash({ ready, minDuration = 2400, reducedMotion = false, onReveal, onFinish }) {
  const logo = useRef(new Animated.Value(0)).current;
  const line = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(false);
  const [introDone, setIntroDone] = React.useState(false);

  useEffect(() => {
    Animated.timing(logo, { toValue: 1, duration: reducedMotion ? 0 : 900, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
    Animated.timing(line, {
      toValue: 0.9,
      duration: Math.max(500, minDuration - 300),
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(() => setIntroDone(true));
  }, [logo, line, minDuration, reducedMotion]);

  useEffect(() => {
    if (!(ready && introDone) || doneRef.current) return;
    doneRef.current = true;
    Animated.timing(line, { toValue: 1, duration: 250, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => {
      if (onReveal) onReveal();
      Animated.timing(out, { toValue: 0, duration: reducedMotion ? 120 : 450, easing: Easing.inOut(Easing.quad), useNativeDriver: native }).start(onFinish);
    });
  }, [ready, introDone, line, out, onReveal, onFinish, reducedMotion]);

  const scale = logo.interpolate({ inputRange: [0, 1], outputRange: [reducedMotion ? 1 : 0.94, 1] });
  const width = line.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { zIndex: 50, opacity: out }]}
      pointerEvents={ready && introDone ? 'none' : 'auto'}
      accessibilityLabel={`Loading ${BRAND.name}`}
    >
      <LinearGradient colors={['#FBF7EE', colors.ivory, '#F3E9D2']} locations={[0, 0.55, 1]} style={styles.fill}>
        <Animated.Image
          source={require('../../assets/logo-white.png')}
          style={[styles.logo, { opacity: logo, transform: [{ scale }] }]}
          resizeMode="contain"
          accessibilityLabel={BRAND.name}
        />
        <Animated.View style={{ alignItems: 'center', opacity: logo }}>
          <View style={styles.track}>
            <Animated.View style={[styles.bar, { width }]} />
          </View>
          <Animated.Text style={styles.note}>Loading your experience...</Animated.Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 96, height: 102, marginTop: -40 },
  track: { width: 120, height: 2, borderRadius: 1, backgroundColor: 'rgba(98, 80, 0, 0.12)', overflow: 'hidden', marginTop: 34 },
  bar: { height: 2, borderRadius: 1, backgroundColor: colors.gold },
  note: { marginTop: 14, fontSize: 12, color: colors.olive, letterSpacing: 0.4 },
});
