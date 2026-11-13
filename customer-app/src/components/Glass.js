import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Apple-style "liquid glass": translucent surface + bright edge + upar se glossy highlight.
// Web (Vercel) par asli background blur (backdrop-filter) bhi lagta hai — App.js ki CSS dekho.
const TINTS = {
  light: 'rgba(255, 255, 255, 0.58)',
  cream: 'rgba(252, 246, 226, 0.72)',
  dark: 'rgba(30, 26, 14, 0.55)',
};

export default function Glass({ style, children, tint = 'light', radius = 24, highlight = true, ...rest }) {
  return (
    <View
      {...rest}
      dataSet={Platform.OS === 'web' ? { glass: '1' } : undefined}
      style={[styles.base, { backgroundColor: TINTS[tint] || tint, borderRadius: radius }, style]}
    >
      {highlight ? (
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.18)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.12)']}
          locations={[0, 0.42, 0.75, 1]}
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        />
      ) : null}
      {highlight ? <View pointerEvents="none" style={[styles.specular, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  specular: { position: 'absolute', top: 0, left: 8, right: 8, height: 1.5, backgroundColor: 'rgba(255,255,255,0.95)' },
  base: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#3B2F00',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
