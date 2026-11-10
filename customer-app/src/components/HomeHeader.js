import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts } from '../theme';
import { BRAND } from '../config/app';
import { useApp } from '../context/AppContext';

// Double-stroke search: logo ki parallel lines ka echo
export function DoubleStrokeSearch({ onPress, placeholder = 'Search products, brands, categories' }) {
  return (
    <Pressable onPress={onPress} style={styles.outer} accessibilityRole="search">
      <View style={styles.inner}>
        <Ionicons name="search" size={19} color={colors.muted} />
        <Text style={styles.searchText} numberOfLines={1}>{placeholder}</Text>
        <Ionicons name="mic-outline" size={20} color={colors.muted} />
      </View>
    </Pressable>
  );
}

export default function HomeHeader() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const { selectedAddress, user } = useApp();
  const first = (user?.name || '').split(' ')[0];

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 6 }]}>
      <View style={styles.top}>
        <Image source={require('../../assets/logo-black.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>{BRAND.name.toLowerCase()}</Text>
        <View style={{ flex: 1 }} />
        <Pressable hitSlop={8} onPress={() => nav.navigate('Orders')} style={styles.iconBtn} accessibilityLabel="My orders">
          <Ionicons name="cube-outline" size={22} color={colors.black} />
        </Pressable>
        <Pressable hitSlop={8} onPress={() => nav.navigate('Support')} style={styles.iconBtn} accessibilityLabel="Help">
          <Ionicons name="chatbubble-ellipses-outline" size={21} color={colors.black} />
        </Pressable>
      </View>

      <DoubleStrokeSearch onPress={() => nav.navigate('Search')} />

      {selectedAddress ? (
        <Pressable style={styles.addr} onPress={() => nav.navigate('Addresses', { selectMode: true })}>
          <Ionicons name="location" size={14} color={colors.accent} />
          <Text style={styles.addrText} numberOfLines={1}>
            {first ? `${first}, deliver to ` : 'Deliver to '}
            <Text style={{ color: colors.black, fontWeight: '700' }}>{selectedAddress.city} {selectedAddress.pincode}</Text>
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.black} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  top: { flexDirection: 'row', alignItems: 'center', height: 44 },
  logo: { width: 24, height: 27 },
  brand: { fontFamily: fonts.display, fontSize: 20, color: colors.black, marginLeft: 8, letterSpacing: -0.3 },
  iconBtn: { marginLeft: 18 },
  outer: { marginTop: 6, borderRadius: 12, backgroundColor: colors.mist },
  inner: {
    height: 46, borderRadius: 12, backgroundColor: colors.mist,
    flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 10,
  },
  searchText: { flex: 1, marginLeft: 10, color: colors.muted, fontSize: 14 },
  mic: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  addr: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  addrText: { color: colors.muted, fontSize: 13, marginHorizontal: 6, flexShrink: 1 },
});
