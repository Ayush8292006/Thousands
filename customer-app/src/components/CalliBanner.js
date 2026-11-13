import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calli } from '../config/fonts';
import { colors } from '../theme';

// Front page ka Indian calligraphy greeting card
export default function CalliBanner({ onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && { transform: [{ scale: 0.985 }] }]}>
      <LinearGradient colors={['#FFF9EA', '#F5E9C8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.ornRow}>
          <View style={styles.line} />
          <Text style={styles.orn}>✦</Text>
          <View style={styles.line} />
        </View>
        <Text style={[calli(38, colors.olive), styles.center]}>शुभ ख़रीदारी</Text>
        <Text style={styles.en}>Happy shopping — festive savings on thousands of products</Text>
        <View style={styles.tags}>
          {['त्योहार', 'उपहार', 'सौगात'].map((w, i) => (
            <View key={w} style={styles.tag}>
              <Text style={calli(17, colors.gold)}>{w}</Text>
              <Text style={styles.tagEn}>{['Festive', 'Gifts', 'Specials'][i]}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.ornRow, { marginTop: 14 }]}>
          <View style={styles.line} />
          <Text style={styles.orn}>❖</Text>
          <View style={styles.line} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: 16, marginTop: 20 },
  card: { borderRadius: 24, paddingVertical: 18, paddingHorizontal: 18, borderWidth: 1, borderColor: '#EAD9A8' },
  center: { textAlign: 'center' },
  ornRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  line: { flex: 1, height: 1, backgroundColor: '#E2CC8C' },
  orn: { color: colors.gold, fontSize: 14 },
  en: { fontSize: 13, color: '#6B5E3C', textAlign: 'center', marginTop: 4 },
  tags: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 14 },
  tag: {
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: '#EAD9A8',
  },
  tagEn: { fontSize: 10.5, color: colors.headerMuted, marginTop: 1, fontWeight: '600' },
});
