import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius , fonts, TAB_BAR_SPACE } from '../theme';
import { getCategories, getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function CategoriesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [cats, setCats] = useState([]);
  const [active, setActive] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getCategories().then((c) => {
      setCats(c);
      setActive(c[0]);
    });
  }, []);

  useEffect(() => {
    if (active) getProducts({ category: active.id }).then(setItems);
  }, [active]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>All Categories</Text>
        <Pressable onPress={() => navigation.navigate('Search')} hitSlop={8}>
          <Ionicons name="search" size={22} color={colors.black} />
        </Pressable>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ScrollView style={styles.side} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}>
          {cats.map((c) => {
            const on = active?.id === c.id;
            return (
              <Pressable key={c.id} onPress={() => setActive(c)} style={[styles.sideItem, on && styles.sideOn]}>
                {on ? <View style={styles.bar} /> : null}
                <View style={[styles.sideRing, on && { borderColor: colors.accent }]}>
                  <Image source={{ uri: c.image }} style={styles.sideImg} />
                </View>
                <Text style={[styles.sideText, on && { color: colors.black, fontWeight: '800' }]} numberOfLines={2}>{c.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 12, paddingBottom: TAB_BAR_SPACE + 20 }}>
          {active ? (
            <>
              <Pressable onPress={() => navigation.navigate('ProductList', { category: active.id, title: active.name })}>
                <ImageBackground source={{ uri: active.image }} style={styles.banner} imageStyle={{ borderRadius: radius.lg }}>
                  <View style={styles.bannerShade} />
                  <Text style={styles.bannerTitle}>{active.name}</Text>
                  <View style={styles.bannerBtn}>
                    <Text style={styles.bannerBtnText}>View all</Text>
                    <Ionicons name="arrow-forward" size={12} color={colors.black} />
                  </View>
                </ImageBackground>
              </Pressable>

              <Text style={styles.secTitle}>Shop by type</Text>
              <View style={styles.chips}>
                {active.subs.map((s) => (
                  <Pressable
                    key={s}
                    style={styles.chip}
                    onPress={() => navigation.navigate('ProductList', { category: active.id, sub: s, title: s })}
                  >
                    <Text style={styles.chipText}>{s}</Text>
                    <Ionicons name="chevron-forward" size={12} color={colors.muted} />
                  </Pressable>
                ))}
              </View>

              <Text style={styles.secTitle}>Popular in {active.name}</Text>
              <View style={styles.grid}>
                {items.map((p) => (
                  <View key={p.id} style={styles.gridItem}>
                    <ProductCard product={p} imageSize={100} />
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { color: colors.black, fontFamily: fonts.display, fontSize: 20 },
  side: { width: 88, maxWidth: 88, backgroundColor: colors.mist },
  sideItem: { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  sideOn: { backgroundColor: colors.white },
  bar: { position: 'absolute', left: 0, top: 10, bottom: 10, width: 3, backgroundColor: colors.accent, borderRadius: 2 },
  sideRing: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: 'transparent', padding: 2 },
  sideImg: { width: '100%', height: '100%', borderRadius: 24, backgroundColor: colors.soft },
  sideText: { fontSize: 10, marginTop: 5, color: colors.muted, textAlign: 'center', fontWeight: '600' },
  banner: { height: 90, justifyContent: 'flex-end', padding: 14 },
  bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: radius.lg },
  bannerKicker: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.6 },
  bannerTitle: { color: colors.white, fontSize: 22, fontFamily: fonts.display },
  bannerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 },
  bannerBtnText: { fontSize: 11, fontWeight: '800' },
  secTitle: { fontSize: 17, fontFamily: fonts.display, color: colors.black, marginTop: 20, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: colors.white },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  gridItem: { width: '50%', padding: 5 },
});
