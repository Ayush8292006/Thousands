import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors, radius } from '../theme';
import { BRAND } from '../config/app';
import { notify } from '../utils/platform';

export default function AccountScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, setUser, orders, wishlist, addresses } = useApp();

  const tiles = [
    { icon: 'cube-outline', label: 'Orders', onPress: () => navigation.navigate('Orders'), badge: orders.length },
    { icon: 'heart-outline', label: 'Wishlist', onPress: () => navigation.navigate('Wishlist'), badge: wishlist.length },
    { icon: 'location-outline', label: 'Addresses', onPress: () => navigation.navigate('Addresses'), badge: addresses.length },
    { icon: 'headset-outline', label: 'Help Center', onPress: () => navigation.navigate('Support') },
  ];

  const rows = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => notify('Coming soon', 'Profile editing will be available once the backend is connected.') },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => notify('Coming soon') },
    { icon: 'language-outline', label: 'Language', value: 'English' },
    { icon: 'globe-outline', label: 'Country / Currency', value: 'India · INR' },
    { icon: 'storefront-outline', label: `Sell on ${BRAND.name}`, onPress: () => navigation.navigate('Support', { seller: true }) },
    { icon: 'document-text-outline', label: 'Terms & Policies', onPress: () => notify('Terms', 'Terms and policies will be added soon.') },
  ];

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 150 }}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.name || 'T')[0]}</Text>
        </View>
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.phone}>+91 {user?.phone}</Text>
        </View>
        <View style={styles.plus}>
          <Ionicons name="diamond-outline" size={12} color={colors.accent} />
          <Text style={styles.plusText}>Member</Text>
        </View>
      </View>

      <View style={styles.tiles}>
        {tiles.map((t) => (
          <Pressable key={t.label} style={styles.tile} onPress={t.onPress}>
            <Ionicons name={t.icon} size={22} color={colors.black} />
            <Text style={styles.tileText}>{t.label}</Text>
            {t.badge ? <Text style={styles.tileBadge}>{t.badge}</Text> : null}
          </Pressable>
        ))}
      </View>

      <View style={styles.list}>
        {rows.map((r, i) => (
          <Pressable key={r.label} style={[styles.row, i === rows.length - 1 && { borderBottomWidth: 0 }]} onPress={r.onPress}>
            <Ionicons name={r.icon} size={20} color={colors.ink} />
            <Text style={styles.rowText}>{r.label}</Text>
            {r.value ? <Text style={styles.rowValue}>{r.value}</Text> : null}
            <Ionicons name="chevron-forward" size={18} color={colors.faint} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logout} onPress={() => setUser(null)}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
      <Text style={styles.ver}>{BRAND.name} · v0.1.0 (prototype)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.headerGradient[1], flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 46, borderBottomWidth: 1, borderBottomColor: colors.headerLine },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.olive, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  avatarText: { fontSize: 24, fontWeight: '800', color: colors.cream },
  name: { color: colors.ink, fontSize: 21, fontWeight: '800' },
  phone: { color: colors.muted, marginTop: 2 },
  plus: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.gold, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  plusText: { color: colors.accent, fontSize: 11, fontWeight: '800', marginLeft: 4 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 12, marginTop: -30, gap: 10 },
  tile: { width: '48%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  tileText: { marginLeft: 10, fontWeight: '700', flex: 1 },
  tileBadge: { fontSize: 12, fontWeight: '800', color: colors.muted },
  list: { backgroundColor: colors.card, marginTop: 14, marginHorizontal: 12, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { flex: 1, marginLeft: 12, fontSize: 14 },
  rowValue: { fontSize: 12, color: colors.muted, marginRight: 6 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, margin: 12, marginTop: 14, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border },
  logoutText: { marginLeft: 8, color: colors.danger, fontWeight: '800' },
  ver: { textAlign: 'center', fontSize: 11, color: colors.faint },
});
