import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import { Button, Chip, EmptyState } from '../components/ui';
import { colors, font } from '../theme';
import { getProducts } from '../services/api';
import { discountPct } from '../utils/format';

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

export default function ProductListScreen({ route }) {
  const { category, sub, query, brand, tag, maxPrice, sort: initialSort } = route.params || {};
  const insets = useSafeAreaInsets();
  const [list, setList] = useState([]);
  const [sort, setSort] = useState(initialSort || 'relevance');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [brands, setBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [price, setPrice] = useState('all');

  useEffect(() => {
    getProducts({ category, sub, q: query, brand, tag, maxPrice }).then(setList);
  }, [category, sub, query, brand, tag, maxPrice]);

  const allBrands = useMemo(() => [...new Set(list.map((p) => p.brand))], [list]);
  const activeFilters = brands.length + (minRating ? 1 : 0) + (price !== 'all' ? 1 : 0);

  const shown = useMemo(() => {
    const pr = PRICE_RANGES.find((r) => r.id === price);
    let out = list.filter(
      (p) =>
        (!brands.length || brands.includes(p.brand)) &&
        p.rating >= minRating &&
        p.price >= pr.min && p.price < pr.max
    );
    const by = {
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      discount: (a, b) => discountPct(b.mrp, b.price) - discountPct(a.mrp, a.price),
    }[sort];
    if (by) out = [...out].sort(by);
    return out;
  }, [list, brands, minRating, price, sort]);

  const toggleBrand = (b) => setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.toolbar}>
        <Pressable style={styles.tool} onPress={() => setSortOpen(true)}>
          <Ionicons name="swap-vertical" size={16} color={colors.black} />
          <Text style={styles.toolText}>Sort</Text>
        </Pressable>
        <View style={styles.sep} />
        <Pressable style={styles.tool} onPress={() => setFilterOpen(true)}>
          <Ionicons name="options-outline" size={16} color={colors.black} />
          <Text style={styles.toolText}>Filter{activeFilters ? ` (${activeFilters})` : ''}</Text>
        </Pressable>
      </View>
      <Text style={styles.count}>{shown.length} products</Text>

      <FlatList
        data={shown}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 10, paddingHorizontal: 12 }}
        contentContainerStyle={{ gap: 10, paddingBottom: 24, flexGrow: 1 }}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <EmptyState icon="search-outline" title="No products found" subtitle="Try changing the filters or searching for something else." />
        }
      />

      {/* Sort sheet */}
      <Modal visible={sortOpen} transparent animationType="slide" onRequestClose={() => setSortOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setSortOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <Text style={[font.h3, { marginBottom: 8, color: colors.muted }]}>SORT BY</Text>
          {SORTS.map((s) => (
            <Pressable key={s.id} style={styles.opt} onPress={() => { setSort(s.id); setSortOpen(false); }}>
              <Text style={[styles.optText, sort === s.id && { fontWeight: '800' }]}>{s.label}</Text>
              <Ionicons name={sort === s.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.black} />
            </Pressable>
          ))}
        </View>
      </Modal>

      {/* Filter sheet */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setFilterOpen(false)} />
        <View style={[styles.sheet, { maxHeight: '80%', paddingBottom: insets.bottom + 16 }]}>
          <ScrollView>
            <Text style={styles.fHead}>Brand</Text>
            <View style={styles.wrap}>
              {allBrands.map((b) => (
                <Chip key={b} label={b} active={brands.includes(b)} onPress={() => toggleBrand(b)} />
              ))}
            </View>
            <Text style={styles.fHead}>Customer Rating</Text>
            <View style={styles.wrap}>
              {[0, 4, 4.3].map((r) => (
                <Chip key={r} label={r ? `${r}★ & above` : 'All'} active={minRating === r} onPress={() => setMinRating(r)} />
              ))}
            </View>
            <Text style={styles.fHead}>Price</Text>
            <View style={styles.wrap}>
              {PRICE_RANGES.map((r) => (
                <Chip key={r.id} label={r.label} active={price === r.id} onPress={() => setPrice(r.id)} />
              ))}
            </View>
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <Button
              title="Clear"
              variant="outline"
              style={{ flex: 1 }}
              onPress={() => { setBrands([]); setMinRating(0); setPrice('all'); }}
            />
            <Button title={`Show ${shown.length}`} style={{ flex: 1 }} onPress={() => setFilterOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: 'row', backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  tool: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  toolText: { marginLeft: 6, fontWeight: '700', fontSize: 14 },
  sep: { width: 1, backgroundColor: colors.border, marginVertical: 8 },
  count: { fontSize: 12, color: colors.muted, paddingHorizontal: 14, paddingVertical: 10 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  opt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  optText: { fontSize: 15, color: colors.ink },
  fHead: { fontSize: 14, fontWeight: '800', marginTop: 10, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
});
