import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, Easing, Platform, StyleSheet } from 'react-native';

// Halka golden glitter — screen ke upar wale hisse mein twinkle karta hai.
// pointerEvents="none" hai, isliye taps neeche ke content tak jaate hain.
const GOLD = ['#E8C24A', '#D4A928', '#F0D47A', '#C9A227'];
const COUNT = 16; // halka — zyada nahi

// Fixed seed taaki har render pe positions same rahein
function rand(i, k) {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Sparkle({ left, top, size, color, delay, duration }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(v, { toValue: 0, duration, easing: Easing.inOut(Easing.quad), useNativeDriver: Platform.OS !== 'web' }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, delay, duration]);

  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });
  const opacity = v.interpolate({ inputRange: [0, 1], outputRange: [0, 0.65] });
  return (
    <Animated.View style={{ position: 'absolute', left, top, width: size, height: size, opacity, transform: [{ scale }, { rotate: '45deg' }] }}>
      {/* 4-point star: do patli bars cross mein */}
      <View style={[styles.bar, { width: size, height: Math.max(1, size / 4), top: size / 2 - size / 8, backgroundColor: color }]} />
      <View style={[styles.bar, { height: size, width: Math.max(1, size / 4), left: size / 2 - size / 8, backgroundColor: color }]} />
    </Animated.View>
  );
}

export default function GlitterOverlay({ height = 200 }) {
  const dots = useMemo(
    () =>
      Array.from({ length: COUNT }).map((_, i) => {
        const yR = rand(i, 2);
        return {
          key: i,
          left: `${Math.round(rand(i, 1) * 96)}%`,
          top: Math.round(yR * yR * height), // upar zyada, neeche kam
          size: 3 + Math.round(rand(i, 3) * 4),
          color: GOLD[i % GOLD.length],
          delay: Math.round(rand(i, 4) * 2400),
          duration: 1200 + Math.round(rand(i, 5) * 1200),
        };
      }),
    [height],
  );
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      {dots.map(({ key, ...d }) => <Sparkle key={key} {...d} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', borderRadius: 2, opacity: 0.9 },
});
