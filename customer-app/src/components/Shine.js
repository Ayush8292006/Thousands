import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, Platform, StyleSheet } from 'react-native';

// Glossy sheen: ek patli roshni ki line kabhi-kabhi surface ke upar se guzarti hai
// (jaise polished metal / glass par). Content ko rokti nahi, taps neeche jaate hain.
const native = Platform.OS !== 'web';

function Shine({ duration = 1000, pause = 3800, delay = 0, intensity = 0.28 }) {
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!w) return undefined;
    x.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(x, { toValue: 1, duration, easing: Easing.inOut(Easing.cubic), useNativeDriver: native }),
        Animated.delay(pause),
        Animated.timing(x, { toValue: 0, duration: 0, useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [w, x, duration, pause, delay]);

  const band = Math.max(24, w * 0.18);
  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-band * 2, w + band] });

  return (
    <View pointerEvents="none" style={styles.fill} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w ? (
        <Animated.View style={[styles.band, { width: band, transform: [{ translateX }, { skewX: '-20deg' }] }]}>
          <View style={[styles.soft, { opacity: intensity * 0.45 }]} />
          <View style={[styles.core, { opacity: intensity, left: band * 0.35, width: band * 0.3 }]} />
        </Animated.View>
      ) : null}
    </View>
  );
}

export default memo(Shine);

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  band: { position: 'absolute', top: -20, bottom: -20, left: 0 },
  soft: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF' },
  core: { position: 'absolute', top: 0, bottom: 0, backgroundColor: '#FFFFFF' },
});
