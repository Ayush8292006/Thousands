import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from './Flat';
import { fonts, lightBlueTheme } from '../theme';
import { BRAND } from '../config/app';
import { useApp } from '../context/AppContext';

export default function HomeHeader() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const focused = useIsFocused();
  const { selectedAddress, cartCount } = useApp();

  return (
    <LinearGradient
      colors={['#FFFFFF', lightBlueTheme.softBg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.wrap, { paddingTop: insets.top + 8 }]}
    >
      {focused ? <StatusBar style="dark" /> : null}

      {/* Brand & Action Bar */}
      <View style={styles.top}>
        {/* Premium Dark Logo Container */}
        <View style={styles.logoBadge}>
          <Image
            source={require('../../assets/brand-logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Clean Typography Brand Identity */}
        <View style={styles.brandInfo}>
          <Text style={styles.brandTitle}>{BRAND.name.toUpperCase()}</Text>
          <View style={styles.tagBadge}>
            <View style={styles.tagDot} />
            <Text style={styles.tagText}>Online Shopping</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        {/* Action Icons */}
        <Pressable
          hitSlop={8}
          onPress={() => nav.navigate('Tabs', { screen: 'Wishlist' })}
          style={styles.iconBtn}
          accessibilityLabel="Wishlist"
        >
          <Ionicons name="heart-outline" size={22} color={lightBlueTheme.text} />
        </Pressable>

        <Pressable
          hitSlop={8}
          onPress={() => nav.navigate('Support')}
          style={styles.iconBtn}
          accessibilityLabel="Support"
        >
          <Ionicons name="notifications-outline" size={22} color={lightBlueTheme.text} />
        </Pressable>

        <Pressable
          hitSlop={8}
          onPress={() => nav.navigate('Tabs', { screen: 'Cart' })}
          style={styles.iconBtn}
          accessibilityLabel="Cart"
        >
          <Ionicons name="bag-handle-outline" size={23} color={lightBlueTheme.text} />
          {cartCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {/* Elegant Search Bar */}
      <Pressable onPress={() => nav.navigate('Search')} style={styles.search} accessibilityRole="search">
        <Ionicons name="search" size={18} color={lightBlueTheme.accent} />
        <Text style={styles.searchText} numberOfLines={1}>Search for products, brands and more</Text>
        <Ionicons name="mic-outline" size={19} color={lightBlueTheme.accent} />
        <View style={styles.sep} />
        <Ionicons name="camera-outline" size={19} color={lightBlueTheme.accent} />
      </Pressable>

      {/* Address / Delivery Strip */}
      {selectedAddress ? (
        <Pressable style={styles.addr} onPress={() => nav.navigate('Addresses', { selectMode: true })}>
          <View style={styles.addrIconWrap}>
            <Ionicons name="location" size={13} color={lightBlueTheme.accent} />
          </View>
          <Text style={styles.addrText} numberOfLines={1}>
            Deliver to <Text style={styles.addrBold}>{selectedAddress.name.split(' ')[0]} - {selectedAddress.city} {selectedAddress.pincode}</Text>
          </Text>
          <Ionicons name="chevron-down" size={13} color={lightBlueTheme.textMuted} />
        </Pressable>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightBlueTheme.border,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 4,
    backgroundColor: lightBlueTheme.darkLogoBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(169, 207, 245, 0.45)',





  },
  logo: {
    width: 36,
    height: 36,
  },
  brandInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    color: lightBlueTheme.text,
    letterSpacing: 0.3,
    fontWeight: '800',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    backgroundColor: lightBlueTheme.secondary,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: lightBlueTheme.accent,
    marginRight: 4,
  },
  tagText: {
    color: lightBlueTheme.accentDark,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconBtn: {
    marginLeft: 14,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: lightBlueTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  search: {
    marginTop: 10,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: lightBlueTheme.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,





  },
  searchText: {
    flex: 1,
    marginLeft: 9,
    color: lightBlueTheme.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  sep: {
    width: 1,
    height: 18,
    backgroundColor: lightBlueTheme.border,
    marginHorizontal: 8,
  },
  addr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
    alignSelf: 'flex-start',
  },
  addrIconWrap: {
    marginRight: 5,
  },
  addrText: {
    color: lightBlueTheme.textMuted,
    fontSize: 11,
    marginRight: 6,
  },
  addrBold: {
    fontWeight: '700',
    color: lightBlueTheme.text,
  },
});
