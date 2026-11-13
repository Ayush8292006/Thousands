import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Sharp, Apple-style optical liquid glass (NOT frosted):
// - clear translucent surface, very light backdrop blur on web (3–4px, see App.js [data-glass])
// - crisp white upper-edge highlight + a luminous inner edge (double border)
// - one sharp diagonal light streak, short top reflection (no milky haze)
// - fine champagne-gold reflective bottom edge, controlled outer shadow
// - phones (no backdrop blur) get a slightly stronger tint so text stays readable
const isWeb = Platform.OS === 'web';
const TINTS = {
  light: 'rgba(255, 255, 255, 0.5)',
  cream: 'rgba(255, 253, 246, 0.6)',
  dark: 'rgba(30, 26, 14, 0.45)',
};

function withFallback(c, blur) {
  if (isWeb || blur === 'clear') return c;
  const m = /rgba\(([^)]+)\)/.exec(c || '');
  if (!m) return c;
  const p = m[1].split(',').map((x) => x.trim());
  const a = Math.max(parseFloat(p[3] ?? '1'), 0.74);
  return `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${a})`;
}

export default function Glass({ style, children, tint = 'light', radius = 24, highlight = true, blur = 'soft', ...rest }) {
  const bg = withFallback(TINTS[tint] || tint, blur);
  const inner = Math.max(0, radius - 1);
  return (
    <View {...rest} dataSet={isWeb ? { glass: blur } : undefined} style={[styles.base, { backgroundColor: bg, borderRadius: radius }, style]}>
      {highlight ? (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
          {/* short, crisp top reflection (fades out fast — no haze) */}
          <LinearGradient
            colors={['rgba(255,255,255,0.26)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0)']}
            locations={[0, 0.6, 1]}
            style={styles.topReflection}
          />
          {/* one sharp diagonal light streak */}
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.24)', 'rgba(255,255,255,0)']}
            locations={[0.37, 0.4, 0.43]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* fine champagne-gold reflection along the bottom edge */}
          <LinearGradient colors={['rgba(214,180,92,0)', 'rgba(214,180,92,0.16)']} style={styles.goldEdge} />
          {/* luminous inner edge — gives the glass a defined, polished rim */}
          <View style={[StyleSheet.absoluteFill, styles.innerEdge, { borderRadius: inner }]} />
          {/* crisp white specular line on the upper edge */}
          <View style={[styles.specular, { left: radius * 0.4, right: radius * 0.4 }]} />
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
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomColor: 'rgba(214, 180, 92, 0.65)',
    shadowColor: '#302719',
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  topReflection: { position: 'absolute', top: 0, left: 0, right: 0, height: '22%' },
  goldEdge: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 10 },
  innerEdge: { margin: 1, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.45)' },
  specular: { position: 'absolute', top: 1, height: 1, backgroundColor: '#FFFFFF' },
});
