import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// REAL Apple-style liquid glass
// - genuinely translucent rgba surface (the content behind stays visible)
// - web: backdrop-filter blur(25px) saturate(180%) + inset highlight (see App.js CSS for [data-glass])
// - reflections: soft white top reflection, a faint diagonal light streak, polished top edge,
//   delicate champagne-gold reflective bottom edge
// - phones without backdrop blur get a slightly stronger tint so text stays readable (graceful fallback)
const isWeb = Platform.OS === 'web';
const TINTS = {
  light: 'rgba(255, 255, 255, 0.42)',
  cream: 'rgba(255, 253, 246, 0.48)',
  dark: 'rgba(30, 26, 14, 0.45)',
};

function withFallback(c) {
  if (isWeb) return c;
  const m = /rgba\(([^)]+)\)/.exec(c || '');
  if (!m) return c;
  const p = m[1].split(',').map((x) => x.trim());
  const a = Math.max(parseFloat(p[3] ?? '1'), 0.72);
  return `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${a})`;
}

export default function Glass({ style, children, tint = 'light', radius = 24, highlight = true, ...rest }) {
  const bg = withFallback(TINTS[tint] || tint);
  return (
    <View {...rest} dataSet={isWeb ? { glass: '1' } : undefined} style={[styles.base, { backgroundColor: bg, borderRadius: radius }, style]}>
      {highlight ? (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
          {/* soft white reflection on the upper portion */}
          <LinearGradient
            colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
            locations={[0, 0.5, 1]}
            style={styles.topReflection}
          />
          {/* subtle diagonal light passing over the glass */}
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
            locations={[0.32, 0.44, 0.56]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* delicate golden reflective edge at the bottom */}
          <LinearGradient colors={['rgba(214,180,92,0)', 'rgba(214,180,92,0.22)']} style={styles.goldEdge} />
          {/* polished top edge */}
          <View style={[styles.specular, { left: radius * 0.5, right: radius * 0.5 }]} />
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    borderBottomColor: 'rgba(214, 180, 92, 0.45)',
    shadowColor: '#302719',
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    elevation: 10,
  },
  topReflection: { position: 'absolute', top: 0, left: 0, right: 0, height: '45%' },
  goldEdge: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 18 },
  specular: { position: 'absolute', top: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.95)' },
});
