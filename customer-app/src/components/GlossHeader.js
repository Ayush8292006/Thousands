import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Shine from './Shine';
import { colors } from '../theme';

// Glossy champagne header: warm gradient + upar halki glass jaisi highlight + dheemi shine
export default function GlossHeader({ style, children, shine = true }) {
  return (
    <LinearGradient colors={colors.headerGradient} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={style}>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(255,255,255,0.75)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gloss}
      />
      {shine ? <Shine intensity={0.35} duration={1600} pause={5200} delay={800} /> : null}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
});
