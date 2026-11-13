import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet, Platform, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { GlossOverlay, OLIVE_GLOSS } from './Gloss';

// Category chip: active = royal olive background + cream text, animated colour change + press feedback
export default function CategoryChip({ icon, label, active, onPress }) {
  const a = useRef(new Animated.Value(active ? 1 : 0)).current;
  const press = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: active ? 1 : 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  }, [active, a]);
  const bg = a.interpolate({ inputRange: [0, 1], outputRange: [colors.cream, colors.olive] });
  const border = a.interpolate({ inputRange: [0, 1], outputRange: [colors.beige, colors.olive] });
  const to = (v) => Animated.spring(press, { toValue: v, friction: 6, tension: 240, useNativeDriver: false }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => to(0.95)}
      onPressOut={() => to(1)}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      {...(Platform.OS === 'web' ? { onHoverIn: () => to(1.03), onHoverOut: () => to(1) } : null)}
    >
      <Animated.View style={[styles.chip, { backgroundColor: bg, borderColor: border, transform: [{ scale: press }] }]}>
        {active ? <LinearGradient colors={OLIVE_GLOSS} style={StyleSheet.absoluteFill} /> : null}
        <GlossOverlay level={active ? 'high' : 'subtle'} radius={18} dark={active} />
        <Ionicons name={icon} size={15} color={active ? colors.gold : colors.muted} />
        <Text style={[styles.text, active && styles.textOn]} numberOfLines={1}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 7, height: 36, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#302719', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  text: { fontSize: 12.5, color: colors.espresso, fontWeight: '600' },
  textOn: { color: colors.cream, fontWeight: '700' },
});
