import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calli } from '../config/fonts';
import { colors } from '../theme';

const native = Platform.OS !== 'web';

// Branded loading screen: logo + calligraphy + gold progress line, phir smooth fade-out
export default function Splash({ done, onFinish }) {
  const logo = useRef(new Animated.Value(0)).current;
  const text = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logo, { toValue: 1, friction: 6, tension: 70, useNativeDriver: native }),
      Animated.timing(text, { toValue: 1, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: native }),
    ]).start();
    Animated.timing(bar, { toValue: 0.85, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [logo, text, bar]);

  useEffect(() => {
    if (!done) return;
    Animated.timing(bar, { toValue: 1, duration: 180, useNativeDriver: false }).start(() => {
      Animated.timing(out, { toValue: 0, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: native }).start(onFinish);
    });
  }, [done, bar, out, onFinish]);

  const scale = logo.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });
  const rise = text.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const width = bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: out, zIndex: 50 }]} pointerEvents={done ? 'none' : 'auto'}>
      <LinearGradient colors={colors.headerGradient} style={styles.fill}>
        <Animated.View style={[styles.logoRing, { opacity: logo, transform: [{ scale }] }]}>
          <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
        </Animated.View>
        <Animated.View style={{ alignItems: 'center', opacity: text, transform: [{ translateY: rise }] }}>
          <Text style={[calli(34, colors.olive), { marginTop: 18 }]}>हज़ारों पसंद</Text>
          <Text style={styles.brand}>THOUSANDS</Text>
        </Animated.View>
        <View style={styles.track}>
          <Animated.View style={[styles.progress, { width }]} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoRing: {
    width: 108, height: 108, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  logo: { width: 62, height: 66 },
  brand: { fontSize: 13, fontWeight: '800', letterSpacing: 6, color: colors.gold, marginTop: 6 },
  track: { position: 'absolute', bottom: 90, width: 140, height: 3, borderRadius: 2, backgroundColor: 'rgba(90,75,2,0.12)', overflow: 'hidden' },
  progress: { height: 3, borderRadius: 2, backgroundColor: colors.gold },
});
