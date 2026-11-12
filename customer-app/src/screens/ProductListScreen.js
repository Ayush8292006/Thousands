import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GridCard from '../components/GridCard';
import { Button, EmptyState } from '../components/ui';
import { colors } from '../theme';
import { getProducts } from '../services/api';
import { discountPct } from '../utils/format';
import { useApp } from '../context/AppContext';
import { useAppWidth } from '../utils/platform';

const SORTS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'priceAsc', label: 'Price — Low to High' },
  { id: 'priceDesc', label: 'Price — High to Low' },
  { id: 'rating', label: 'Customer Rating' },
  { id: 'discount', label: 'Discount' },
];
const PRICE_RANGES = [
  { id: 'all', label: 'Any price', min: 0, max: Infinity },
  { id: 'u500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500-2000', label: '₹500 – ₹2,000', min: 500, max: 2000 },
  { id: '2000-10000', label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
  { id: 'a10000', label: 'Above ₹10,000', min: 10000, max: Infinity },
];

function Pill({ icon, label, active, onPress }) {
  return (
    <Pressable style={[styles.pill, active && styles.pillOn]} onPress={onPress}>
      {icon ? <Ionicons name={icon} size={17} color={active ? colors.accent : colors.ink} /> : null}
      <Text style={[styles.pillText, active && { color: colors.accent }]}>{label}</Text>
    </Pressable>
  );
}

function Option({ label, on, onPress, check }) {
  return (
    <Pressable style={styles.opt} onPress={onPress}>
      <Text style={[styles.optText, on && { fontWeight: '700', color: colors.accent }]}>{label}</Text>
      <Ionicons
        name={check ? (on ? 'checkbox' : 'square-outline') : on ? 'radio-button-on' : 'radio-button-off'}
        size={21}
        color={on ? colors.accent : colors.faint}
      />
    </Pressable>
  );
}

// Flipkart-style results: rounded search header, filter pills, 2-column grid
export default function ProductListScreen({ route, navigation }) {
  const { category, sub, query, brand, tag, maxPrice, sort: initialSort, title } = route.params || {};
  const insets = useSafeAreaInsets();
  const { width } = useAppWidth();
  const { cartCount, wishlist, toggleWishlist } = useApp();
  const [list, setList] = useState([]);
  const [sort, setSort] = useState(initialSort || 'relevance');
  const [sheet, setSheet] = useState(false);
  const [brands, setBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [price, setPrice] = useState('all');
  const [assured, setAssured] = useState(false);
  const [fast, setFast] = useState(false);

  useEffect(() => {
    getProducts({ category, sub, q: query, brand, tag, maxPrice }).then(setList);
  }, [category, sub, query, brand, tag, maxPrice]);

  const allBrands = useMemo(() => [...new Set(list.map((p) => p.brand))], [list]);
  const activeFilters = brands.length + (minRating ? 1 : 0) + (price !== 'all' ? 1 : 0) + (sort !== 'relevance' ? 1 : 0);

  const shown = useMemo(() => {
    const pr = PRICE_RANGES.find((r) => r.id === price);
    let out = list.filter(
      (p) =>
        (!brands.length || brands.includes(p.brand)) &&
        p.rating >= minRating &&
        (!assured || p.assured) &&
        (!fast || p.stock > 10) &&
        p.price >= pr.min && p.price < pr.max,
    );
    const by = {
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      discount: (a, b) => discountPct(b.mrp, b.price) - discountPct(a.mrp, a.price),
    }[sort];
    if (by) out = [...out].sort(by);
    return out;
  }, [list, brands, minRating, price, sort, assured, fast]);

  const openProduct = useCallback((id) => navigation.navigate('ProductDetail', { id }), [navigation]);
  const toggleBrand = (b) => setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  const clearAll = () => { setBrands([]); setMinRating(0); setPrice('all'); setSort('relevance'); setAssured(false); setFast(false); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="light" />
      <View style={[styles.bar, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <Pressable style={styles.search} onPress={() => navigation.navigate('Search')} accessibilityLabel="Search">
          <Ionicons name="search" size={20} color={colors.ink} />
          <Text style={styles.searchText} numberOfLines={1}>{query || title || 'Search for products'}</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Tabs', { screen: 'Cart' })} hitSlop={8} accessibilityLabel="Cart">
          <Ionicons name="cart-outline" size={26} color={colors.white} />
          {cartCount > 0 ? <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View> : null}
        </Pressable>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
          <Pill icon="options-outline" label={activeFilters ? `Sort & Filter (${activeFilters})` : 'Sort & Filter'} active={!!activeFilters} onPress={() => setSheet(true)} />
          <Pill icon="car-outline" label="Get it Fast" active={fast} onPress={() => setFast(!fast)} />
          <Pill icon="shield-checkmark-outline" label="Assured" active={assured} onPress={() => setAssured(!assured)} />
          <Pill icon="star-outline" label="Top Rated" active={minRating >= 4} onPress={() => setMinRating(minRating >= 4 ? 0 : 4)} />
        </ScrollView>
      </View>

      <FlatList
        data={shown}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        renderItem={({ item, index }) => (
          <GridCard product={item} index={index} width={width / 2} liked={wishlist.includes(item.id)} onToggleLike={toggleWishlist} onOpen={openProduct} />
        )}
        ListEmptyComponent={
          <EmptyState icon="search-outline" title="No products found" subtitle="Try changing the filters or searching for something else." />
        }
      />

      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSheet(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <ScrollView style={{ maxHeight: 460 }}>
            <Text style={styles.fHead}>Sort by</Text>
            {SORTS.map((s) => <Option key={s.id} label={s.label} on={sort === s.id} onPress={() => setSort(s.id)} />)}
            <Text style={styles.fHead}>Customer Rating</Text>
            {[0, 4, 4.3].map((r) => <Option key={r} label={r ? `${r}★ & above` : 'All ratings'} on={minRating === r} onPress={() => setMinRating(r)} />)}
            <Text style={styles.fHead}>Price</Text>
            {PRICE_RANGES.map((r) => <Option key={r.id} label={r.label} on={price === r.id} onPress={() => setPrice(r.id)} />)}
            {allBrands.length > 1 ? <Text style={styles.fHead}>Brand</Text> : null}
            {allBrands.length > 1 ? allBrands.map((b) => <Option key={b} check label={b} on={brands.includes(b)} onPress={() => toggleBrand(b)} />) : null}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Button title="Clear all" variant="outline" style={{ flex: 1 }} onPress={clearAll} />
            <Button title={`Show ${shown.length}`} style={{ flex: 1 }} onPress={() => setSheet(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.header, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14 },
  search: {
    flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white,
    borderRadius: 14, borderWidth: 0, paddingHorizontal: 14,
  },
  searchText: { flex: 1, fontSize: 15.5, color: colors.ink },
  badge: {
    position: 'absolute', top: -7, right: -9, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4,
    backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.header,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  pills: { gap: 10, paddingHorizontal: 16, paddingVertical: 14 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, paddingHorizontal: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#D3D7DD', backgroundColor: colors.white,
  },
  pillOn: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  pillText: { fontSize: 14.5, color: colors.ink },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 10 },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#D3D7DD', marginBottom: 8 },
  fHead: { fontSize: 15, fontWeight: '800', color: colors.ink, marginTop: 14, marginBottom: 2 },
  opt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  optText: { fontSize: 14.5, color: colors.ink },
});
