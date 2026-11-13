import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Shine from './Shine';
import { colors } from '../theme';

// THOUSANDS glossy design system — crisp, controlled reflections (no large white haze)
// level: 'high'   → primary buttons, promo strips, active chips (short reflection + thin streak + gold rim)
//        'medium' → cards, search, interactive surfaces (crisp specular line + luminous inner edge + gold hairline)
//        'subtle' → images / secondary surfaces (crisp specular line only)
const LEVELS = {
  high: { top: 0.3, height: '26%', line: 1, edge: 0.35, rim: 0.55, streak: 0.22 },
  medium: { top: 0.1, height: '14%', line: 1, edge: 0.3, rim: 0.4, streak: 0 },
  subtle: { top: 0, height: 0, line: 0.85, edge: 0, rim: 0, streak: 0 },
};

// Metallic champagne-gold gradient (polished, not flat)
export const METAL_GOLD = ['#F6E7B4', '#E3C673', '#D6B45C', '#B9933B', '#E8CF86'];
export const METAL_GOLD_LOC = [0, 0.28, 0.5, 0.78, 1];
// Glossy royal olive for active states / primary buttons
export const OLIVE_GLOSS = ['#7C6812', '#625000', '#4C3E00'];

// Drop-in reflection layer: put as the FIRST child of any rounded surface
export function GlossOverlay({ level = 'medium', radius = 16, dark = false, sweep = false }) {
  const L = LEVELS[level] || LEVELS.medium;
  const k = dark ? 0.6 : 1;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
      {/* short, controlled top reflection */}
      {L.top ? (
        <LinearGradient
          colors={[`rgba(255,255,255,${L.top * k})`, 'rgba(255,255,255,0)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: L.height }}
        />
      ) : null}
      {/* one thin diagonal light streak (high gloss only) */}
      {L.streak ? (
        <LinearGradient
          colors={['rgba(255,255,255,0)', `rgba(255,255,255,${L.streak * k})`, 'rgba(255,255,255,0)']}
          locations={[0.37, 0.4, 0.43]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {/* luminous inner edge */}
      {L.edge ? (
        <View style={[StyleSheet.absoluteFill, { margin: 1, borderRadius: Math.max(0, radius - 1), borderWidth: 1, borderColor: `rgba(255,255,255,${L.edge * k})` }]} />
      ) : null}
      {/* crisp white specular line along the upper edge */}
      <View style={{ position: 'absolute', top: 1, left: radius * 0.5, right: radius * 0.5, height: 1, backgroundColor: `rgba(255,255,255,${L.line * k})` }} />
      {/* fine champagne-gold reflective hairline at the bottom edge */}
      {L.rim ? (
        <View style={{ position: 'absolute', bottom: 0, left: radius * 0.5, right: radius * 0.5, height: 1, backgroundColor: `rgba(214,180,92,${L.rim})` }} />
      ) : null}
      {sweep ? <Shine intensity={dark ? 0.18 : 0.3} duration={1500} pause={4600} delay={700} /> : null}
    </View>
  );
}

// Ready-made glossy card surface
export function GlossCard({ level = 'medium', radius = 18, style, children, sweep, gold, ...rest }) {
  const shadow = level === 'high' ? styles.shadowHigh : level === 'medium' ? styles.shadowMed : styles.shadowLow;
  return (
    <View {...rest} style={[styles.base, shadow, { borderRadius: radius }, gold && styles.goldBorder, style]}>
      <GlossOverlay level={level} radius={radius} sweep={sweep} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.beige },
  goldBorder: { borderColor: 'rgba(214, 180, 92, 0.7)' },
  shadowLow: { shadowColor: '#302719', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  shadowMed: { shadowColor: '#302719', shadowOpacity: 0.09, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  shadowHigh: { shadowColor: '#625000', shadowOpacity: 0.16, shadowRadius: 22, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
});
