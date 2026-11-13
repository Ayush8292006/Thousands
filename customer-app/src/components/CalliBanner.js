import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calli } from '../config/fonts';
import { colors } from '../theme';
import { GlossOverlay } from './Gloss';
import Shine from './Shine';

// Front page calligraphy greeting card (Indian hand-painted lettering style)
const TAGS = ['Festive', 'Gifts', 'Specials'];

export default function CalliBanner({ onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && { transform: [{ scale: 0.985 }] }]}>
      <LinearGradient colors={[colors.cream, colors.beige]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.ornRow}>
          <View style={styles.line} />
          <Text style={styles.orn}>✦</Text>
          <View style={styles.line} />
        </View>
        <Text style={[calli(28, colors.olive), styles.center]}>Happy Shopping</Text>
        <Text style={styles.en}>Festive savings on thousands of products</Text>
        <View style={styles.tags}>
          {TAGS.map((w) => (
            <View key={w} style={styles.tag}>
              <Text style={calli(13, colors.olive)}>{w}</Text>
            </View>
          ))}
        </View>
        <GlossOverlay level="high" radius={20} />
        <Shine intensity={0.45} duration={1600} pause={4000} delay={400} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 14, borderRadius: 20, shadowColor: '#625000', shadowOpacity: 0.14, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  card: { overflow: 'hidden', borderRadius: 20, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.beige },
  center: { textAlign: 'center' },
  ornRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  line: { flex: 1, height: 1, backgroundColor: colors.gold },
  orn: { color: colors.gold, fontSize: 12 },
  en: { fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 2 },
  tags: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 10 },
  tag: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)', borderWidth: 1, borderColor: colors.beige,
  },
});
