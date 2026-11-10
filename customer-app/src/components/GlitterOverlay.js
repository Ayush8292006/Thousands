import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

// Halka gold "dust" — screen ke upar wale hisse mein.
// Static hai: koi animation / twinkle nahi, kuch load nahi hota, taps neeche tak jaate hain.
const GOLD = ['#C9A227', '#D4AF37', '#B8921E', '#E0BE55'];
const COUNT = 70;
const BAND = 150; // upar ke itne px mein

// Fixed seed: har baar same pattern
function rand(i, k) {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const DOTS = Array.from({ length: COUNT }).map((_, i) => {
  const y = rand(i, 2);
  const top = Math.round(y * y * BAND); // upar ghana, neeche kam
  const size = rand(i, 3) > 0.85 ? 2.5 : 1.5;
  return {
    key: i,
    left: `${(rand(i, 1) * 99).toFixed(2)}%`,
    top,
    size,
    color: GOLD[i % GOLD.length],
    opacity: (0.55 - (top / BAND) * 0.4) * (0.6 + rand(i, 4) * 0.4),
  };
});

function GlitterOverlay() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      {DOTS.map((d) => (
        <View
          key={d.key}
          style={{ position: 'absolute', left: d.left, top: d.top, width: d.size, height: d.size, borderRadius: d.size / 2, backgroundColor: d.color, opacity: d.opacity }}
        />
      ))}
    </View>
  );
}

export default memo(GlitterOverlay);

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, height: BAND, overflow: 'hidden' },
});
