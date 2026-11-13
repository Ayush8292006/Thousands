import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import Glass from './Glass';
import { LinearGradient } from 'expo-linear-gradient';
import { GlossOverlay, OLIVE_GLOSS } from './Gloss';

// Apple-inspired Liquid Glass bottom navigation:
// floating ivory glass pill, champagne-gold border, sliding royal-olive active indicator.
const native = Platform.OS !== 'web';
const ICONS = {
  Home: ['home', 'home-outline'],
  Categories: ['grid', 'grid-outline'],
  Wishlist: ['heart', 'heart-outline'],
  Account: ['person', 'person-outline'],
  Cart: ['cart', 'cart-outline'],
};
const PAD = 6;

function TabItem({ route, focused, onPress, cartCount }) {
  const s = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const bump = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(cartCount);

  useEffect(() => {
    Animated.timing(s, { toValue: focused ? 1 : 0, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
  }, [focused, s]);

  // Cart feedback: badge halka "pop" karta hai jab item add hota hai
  useEffect(() => {
    if (route.name === 'Cart' && cartCount > prevCount.current) {
      bump.setValue(1.35);
      Animated.spring(bump, { toValue: 1, friction: 5, tension: 160, useNativeDriver: native }).start();
    }
    prevCount.current = cartCount;
  }, [cartCount, route.name, bump]);

  const [on, off] = ICONS[route.name] || ['ellipse', 'ellipse-outline'];
  const scale = s.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const lift = s.interpolate({ inputRange: [0, 1], outputRange: [0, -1] });

  return (
    <Pressable onPress={onPress} style={styles.item} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={route.name}>
      <Animated.View style={{ alignItems: 'center', transform: [{ scale }, { translateY: lift }] }}>
        <View>
          <Ionicons name={focused ? on : off} size={21} color={focused ? colors.gold : colors.espresso} />
          {route.name === 'Cart' && cartCount > 0 ? (
            <Animated.View style={[styles.badge, { transform: [{ scale: bump }] }]}>
              <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </Animated.View>
          ) : null}
        </View>
        <Text style={[styles.label, focused && styles.labelOn]} numberOfLines={1}>{route.name}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { cartCount } = useApp();
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(state.index)).current;
  const n = state.routes.length;
  const itemW = w ? (w - PAD * 2) / n : 0;

  useEffect(() => {
    Animated.timing(x, { toValue: state.index, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
  }, [state.index, x]);

  const translateX = itemW ? x.interpolate({ inputRange: [0, n - 1], outputRange: [0, itemW * (n - 1)] }) : 0;

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <Glass tint="rgba(255, 253, 246, 0.5)" radius={32} style={styles.bar} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {itemW ? (
          <Animated.View pointerEvents="none" style={[styles.indicator, { width: itemW, transform: [{ translateX }] }]}>
            <View style={styles.indicatorInner}>
              <LinearGradient colors={OLIVE_GLOSS} style={StyleSheet.absoluteFill} />
              <GlossOverlay level="high" radius={26} dark />
            </View>
          </Animated.View>
        ) : null}
        {state.routes.map((route, i) => (
          <TabItem
            key={route.key}
            route={route}
            focused={state.index === i}
            cartCount={cartCount}
            onPress={() => {
              const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (state.index !== i && !e.defaultPrevented) navigation.navigate(route.name);
            }}
          />
        ))}
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 6 },
  bar: {
    flexDirection: 'row', padding: PAD, borderColor: 'rgba(214, 180, 92, 0.55)',
    shadowColor: '#302719', shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 12,
  },
  indicator: { position: 'absolute', top: PAD, bottom: PAD, left: PAD, paddingHorizontal: 3 },
  indicatorInner: {
    flex: 1, borderRadius: 26, backgroundColor: colors.olive, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(214, 180, 92, 0.6)',
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 7 },
  label: { fontSize: 10.5, color: colors.espresso, marginTop: 2, fontWeight: '600' },
  labelOn: { color: colors.cream, fontWeight: '700' },
  badge: {
    position: 'absolute', top: -6, right: -12, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4,
    backgroundColor: colors.terracotta, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.cream,
  },
  badgeText: { color: colors.cream, fontSize: 10, fontWeight: '700' },
});
