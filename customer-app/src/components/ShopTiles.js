import React, { memo } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

// Flipkart-style "arch" category tiles — 2 rows, horizontal scroll.
// Production mein ye list backend (home layout API) se aayegi.
const U = (id) => `https://images.unsplash.com/photo-${id}?w=200&q=70&fm=jpg&fit=crop`;

export const SHOP_TILES = [
  { key: 'all', name: 'All Categories', special: 'all' },
  { key: '8pm', name: '8PM Offer', special: 'offer', link: { tag: 'deal', title: '8PM Offer' } },
  { key: 'saree', name: 'Saree', image: U('1679849922748-f59ba2e10c10'), link: { category: 'fashion', title: 'Saree' } },
  { key: 'western', name: 'Western Wear', image: U('1721182421063-19a6c711b719'), link: { category: 'fashion', title: 'Western Wear' } },
  { key: 'jewellery', name: 'Jewellery', image: U('1611107683227-e9060eccd846'), link: { category: 'accessories', title: 'Jewellery' } },
  { key: 'men', name: 'Men', image: U('1740711152088-88a009e877bb'), link: { category: 'fashion', title: 'Men' } },
  { key: 'kitchen', name: 'Kitchen Utilities', image: U('1584990347193-6bebebfeaeee'), link: { category: 'home', sub: 'Cookware', title: 'Kitchen Utilities' } },
  { key: 'kurtis', name: 'Kurtis & Dresses', image: U('1759840278381-bf7d5e332050'), link: { category: 'fashion', title: 'Kurtis & Dresses' } },
  { key: 'kids', name: 'Kids', image: U('1759851684030-818f50799ce5'), link: { category: 'fashion', title: 'Kids' } },
  { key: 'home', name: 'Home', image: U('1703250152362-abd0f2582771'), link: { category: 'home', title: 'Home' } },
  { key: 'beauty', name: 'Beauty', image: U('1629198688000-71f23e745b6e'), link: { category: 'beauty', title: 'Beauty' } },
  { key: 'food', name: 'Food', image: U('1543158181-1274e5362710'), link: { category: 'grocery', title: 'Food' } },
  { key: 'footwear', name: 'Footwear', image: U('1542291026-7eec264c27ff'), link: { category: 'footwear', title: 'Footwear' } },
  { key: 'mobiles', name: 'Mobiles', image: U('1511707171634-5f897ff02aa9'), link: { category: 'electronics', sub: 'Mobiles', title: 'Mobiles' } },
  { key: 'watches', name: 'Watches', image: U('1609096458733-95b38583ac4e'), link: { category: 'accessories', sub: 'Watches', title: 'Watches' } },
  { key: 'sports', name: 'Sports', image: U('1591291621164-2c6367723315'), link: { category: 'sports', title: 'Sports' } },
];

const ARCH = '#D9E3FF';
const TILE_W = 74;

function Tile({ t, onPress }) {
  let art;
  if (t.special === 'all') {
    art = (
      <View style={styles.arch}>
        <View style={styles.allGrid}>
          {['shirt', 'phone-portrait', 'home', 'sparkles'].map((ic) => (
            <View key={ic} style={styles.allCell}><Ionicons name={ic} size={13} color={colors.accent} /></View>
          ))}
        </View>
      </View>
    );
  } else if (t.special === 'offer') {
    art = (
      <View style={styles.offerRing}>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <View key={i} style={[styles.bulb, { left: 35 + Math.cos(a) * 30, top: 35 + Math.sin(a) * 30 }]} />;
        })}
        <View style={styles.offerInner}>
          <Text style={styles.offerBig}>8PM</Text>
          <Text style={styles.offerSmall}>OFFER</Text>
        </View>
      </View>
    );
  } else {
    art = (
      <View style={styles.arch}>
        <Image source={{ uri: t.image, cache: 'force-cache' }} style={styles.archImg} fadeDuration={0} />
      </View>
    );
  }
  return (
    <Pressable style={styles.tile} onPress={onPress} accessibilityLabel={t.name}>
      {art}
      <Text style={styles.label} numberOfLines={1}>{t.name}</Text>
    </Pressable>
  );
}

function ShopTiles({ navigation }) {
  const open = (t) => {
    if (t.special === 'all') navigation.navigate('Categories');
    else navigation.navigate('ProductList', t.link);
  };
  // 2 rows: tiles ko columns (top, bottom) mein pair karo
  const cols = [];
  for (let i = 0; i < SHOP_TILES.length; i += 2) cols.push(SHOP_TILES.slice(i, i + 2));
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
        {cols.map((col) => (
          <View key={col[0].key} style={{ marginRight: 4 }}>
            {col.map((t) => <Tile key={t.key} t={t} onPress={() => open(t)} />)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.white, paddingTop: 12, paddingBottom: 4, marginTop: 8 },
  tile: { width: TILE_W + 6, alignItems: 'center', marginBottom: 10 },
  arch: {
    width: TILE_W, height: 70, backgroundColor: ARCH,
    borderTopLeftRadius: TILE_W / 2, borderTopRightRadius: TILE_W / 2, borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
    alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden',
  },
  archImg: { width: TILE_W - 12, height: 62, borderTopLeftRadius: (TILE_W - 12) / 2, borderTopRightRadius: (TILE_W - 12) / 2 },
  allGrid: { width: 44, flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 12 },
  allCell: { width: 20, height: 20, borderRadius: 5, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  offerRing: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F2622E', alignItems: 'center', justifyContent: 'center' },
  bulb: { position: 'absolute', width: 6, height: 6, marginLeft: -3, marginTop: -3, borderRadius: 3, backgroundColor: '#FFE27A' },
  offerInner: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF6D6', alignItems: 'center', justifyContent: 'center' },
  offerBig: { fontWeight: '800', fontSize: 14, color: '#C2410C', lineHeight: 16 },
  offerSmall: { fontWeight: '700', fontSize: 8, color: '#C2410C', letterSpacing: 1 },
  label: { fontSize: 11.5, color: colors.ink, marginTop: 6, fontWeight: '600', maxWidth: TILE_W + 4, textAlign: 'center' },
});

export default memo(ShopTiles);
