import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../theme';
import { BRAND } from '../config/app';
import { useApp } from '../context/AppContext';

export default function HomeHeader() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const focused = useIsFocused();
  const { selectedAddress, cartCount } = useApp();

  return (
    <LinearGradient colors={[colors.accentDark, colors.accent]} style={[styles.wrap, { paddingTop: insets.top + 6 }]}>
      {focused ? <StatusBar style="light" /> : null}
      <View style={styles.top}>
        <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.brand}>{BRAND.name}</Text>
          <View style={styles.plusRow}>
            <Text style={styles.plus}>Explore</Text>
            <Text style={styles.plusGold}> Plus</Text>
            <Ionicons name="add-circle" size={11} color={colors.yellow} style={{ marginLeft: 2 }} />
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <Pressable hitSlop={8} onPress={() => nav.navigate('Support')} style={styles.iconBtn} accessibilityLabel="Help">
          <Ionicons name="notifications-outline" size={22} color={colors.white} />
        </Pressable>
        <Pressable hitSlop={8} onPress={() => nav.navigate('Tabs', { screen: 'Cart' })} style={styles.iconBtn} accessibilityLabel="Cart">
          <Ionicons name="cart-outline" size={24} color={colors.white} />
          {cartCount > 0 ? <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View> : null}
        </Pressable>
      </View>

      <Pressable onPress={() => nav.navigate('Search')} style={styles.search} accessibilityRole="search">
        <Ionicons name="search" size={19} color={colors.accent} />
        <Text style={styles.searchText} numberOfLines={1}>Search for products, brands and more</Text>
        <Ionicons name="mic-outline" size={20} color={colors.muted} />
        <View style={styles.sep} />
        <Ionicons name="camera-outline" size={20} color={colors.muted} />
      </Pressable>

      {selectedAddress ? (
        <Pressable style={styles.addr} onPress={() => nav.navigate('Addresses', { selectMode: true })}>
          <Ionicons name="location-outline" size={15} color={colors.white} />
          <Text style={styles.addrText} numberOfLines={1}>
            Deliver to <Text style={{ fontWeight: '700' }}>{selectedAddress.name.split(' ')[0]} - {selectedAddress.city} {selectedAddress.pincode}</Text>
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.white} />
        </Pressable>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 14, paddingBottom: 10 },
  top: { flexDirection: 'row', alignItems: 'center', height: 44 },
  logo: { width: 24, height: 28 },
  brand: { fontFamily: fonts.display, fontSize: 19, color: colors.white, fontStyle: 'italic', letterSpacing: -0.2 },
  plusRow: { flexDirection: 'row', alignItems: 'center', marginTop: -2 },
  plus: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontStyle: 'italic' },
  plusGold: { color: colors.yellow, fontSize: 10, fontWeight: '700', fontStyle: 'italic' },
  iconBtn: { marginLeft: 18 },
  badge: { position: 'absolute', top: -5, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { fontSize: 9, fontWeight: '800', color: colors.black },
  search: {
    marginTop: 8, height: 44, borderRadius: 8, backgroundColor: colors.white,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
  },
  searchText: { flex: 1, marginLeft: 10, color: colors.muted, fontSize: 14 },
  sep: { width: 1, height: 20, backgroundColor: colors.border, marginHorizontal: 10 },
  addr: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  addrText: { color: colors.white, fontSize: 12, marginHorizontal: 6, flexShrink: 1 },
});
