import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';

// Floating, rounded bottom bar (Flipkart new app jaisa)
const ICONS = {
  Home: ['home', 'home-outline'],
  Categories: ['grid', 'grid-outline'],
  Wishlist: ['heart', 'heart-outline'],
  Account: ['person', 'person-outline'],
  Cart: ['cart', 'cart-outline'],
};

export default function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { cartCount } = useApp();
  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const onPress = () => {
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };
          const [on, off] = ICONS[route.name] || ['ellipse', 'ellipse-outline'];
          return (
            <Pressable key={route.key} onPress={onPress} style={styles.item} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={route.name}>
              <View style={[styles.inner, focused && styles.innerOn]}>
                <View>
                  <Ionicons name={focused ? on : off} size={23} color={focused ? colors.accent : colors.ink} />
                  {route.name === 'Cart' && cartCount > 0 ? (
                    <View style={styles.badge}><Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text></View>
                  ) : null}
                </View>
                <Text style={[styles.label, focused && styles.labelOn]} numberOfLines={1}>{route.name}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.page, paddingHorizontal: 12, paddingTop: 6 },
  bar: {
    flexDirection: 'row', backgroundColor: colors.white, borderRadius: 34, borderWidth: 1, borderColor: '#EDE4CC',
    padding: 5, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 2 }, elevation: 6,
  },
  item: { flex: 1 },
  inner: { alignItems: 'center', justifyContent: 'center', paddingVertical: 7, borderRadius: 28 },
  innerOn: { backgroundColor: colors.accentSoft },
  label: { fontSize: 11.5, color: colors.ink, marginTop: 2 },
  labelOn: { color: colors.accent, fontWeight: '700' },
  badge: {
    position: 'absolute', top: -6, right: -12, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4,
    backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.white,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
});
