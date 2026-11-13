import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Shine from './Shine';
import { colors } from '../theme';

// THOUSANDS glossy design system
// level: 'high'  → promo banners, primary buttons (strong reflection + gold rim + light sweep)
//        'medium'→ navigation, interactive cards
//        'subtle'→ secondary surfaces / backgrounds
const LEVELS = {
  high: { top: 0.42, line: 1, rim: 0.28, height: '36%', streak: 0.3 },
  medium: { top: 0.28, line: 0.9, rim: 0.14, height: '32%', streak: 0 },
  subtle: { top: 0.16, line: 0.7, rim: 0, height: '28%', streak: 0 },
};

// Metallic champagne-gold gradient (polished, not flat)
export const METAL_GOLD = ['#F6E7B4', '#E3C673', '#D6B45C', '#B9933B', '#E8CF86'];
export const METAL_GOLD_LOC = [0, 0.28, 0.5, 0.78, 1];
// Glossy royal olive for active states / primary buttons
export const OLIVE_GLOSS = ['#7C6812', '#625000', '#4C3E00'];

// Drop-in reflection layer: put as the FIRST child of any rounded surface
export function GlossOverlay({ level = 'medium', radius = 16, dark = false, sweep = false }) {
  const L = LEVELS[level] || LEVELS.medium;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
      {/* soft white light reflection from the top */}
      <LinearGradient
        colors={[`rgba(255,255,255,${dark ? L.top * 0.6 : L.top})`, `rgba(255,255,255,${dark ? 0.03 : 0.05})`, 'rgba(255,255,255,0)']}
        locations={[0, 0.6, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: L.height }}
      />
      {/* polished top edge (inner highlight) */}
      <View style={{ position: 'absolute', top: 0, left: radius * 0.6, right: radius * 0.6, height: 1, backgroundColor: `rgba(255,255,255,${L.line})` }} />
      {/* sharp diagonal light streak (high gloss only) */}
      {L.streak ? (
        <LinearGradient
          colors={['rgba(255,255,255,0)', `rgba(255,255,255,${dark ? L.streak * 0.6 : L.streak})`, 'rgba(255,255,255,0)']}
          locations={[0.36, 0.4, 0.44]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {/* subtle metallic gold reflection at the bottom edge */}
      {L.rim ? (
        <LinearGradient
          colors={['rgba(214,180,92,0)', `rgba(214,180,92,${L.rim})`]}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '18%' }}
        />
      ) : null}
      {sweep ? <Shine intensity={dark ? 0.22 : 0.4} duration={1500} pause={4600} delay={700} /> : null}
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
