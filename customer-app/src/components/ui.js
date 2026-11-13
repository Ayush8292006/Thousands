import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, font, fonts } from '../theme';
import Shine from './Shine';

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, style }) {
  const isPrimary = variant === 'primary';
  const isGold = variant === 'gold';
  const bg = isPrimary ? colors.olive : isGold ? colors.accent : colors.white;
  const fg = isPrimary || isGold ? colors.cream : colors.espresso;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
        variant === 'outline' && { borderWidth: 1.5, borderColor: colors.olive },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={fg} style={{ marginRight: 8 }} /> : null}
          <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
          {(isPrimary || isGold) && !disabled ? <Shine intensity={0.22} pause={4200} /> : null}
        </>
      )}
    </Pressable>
  );
}

export function RatingChip({ value, small }) {
  return (
    <View style={[styles.rating, small && { paddingHorizontal: 5, paddingVertical: 1 }]}>
      <Text style={[styles.ratingText, small && { fontSize: 10 }]}>{value.toFixed(1)}</Text>
      <Ionicons name="star" size={small ? 9 : 11} color={colors.white} style={{ marginLeft: 2 }} />
    </View>
  );
}

export function SectionHeader({ title, action, onAction, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <Text style={font.h2}>{title}</Text>
        {subtitle ? <Text style={[font.small, { marginTop: 2 }]}>{subtitle}</Text> : null}
      </View>
      {action ? (
        <Pressable onPress={onAction} style={styles.sectionAction}>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Divider({ style }) {
  return <View style={[{ height: 1, backgroundColor: colors.border }, style]} />;
}

export function EmptyState({ icon, title, subtitle, actionTitle, onAction }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={44} color={colors.black} />
      </View>
      <Text style={[font.h2, { marginTop: 18, textAlign: 'center' }]}>{title}</Text>
      {subtitle ? <Text style={[font.small, { marginTop: 6, textAlign: 'center' }]}>{subtitle}</Text> : null}
      {actionTitle ? <Button title={actionTitle} onPress={onAction} style={{ marginTop: 22, paddingHorizontal: 32 }} /> : null}
    </View>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Row({ children, style }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  btn: { overflow: 'hidden',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  btnText: { fontWeight: '700', fontSize: 15, },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  ratingText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionAction: {
    width: 30, height: 30, borderRadius: 12, backgroundColor: colors.black,
    alignItems: 'center', justifyContent: 'center',
  },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: colors.soft,
    alignItems: 'center', justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginRight: 8,
  },
  chipActive: { backgroundColor: colors.black, borderColor: colors.black },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
});
