import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, SegmentTabs, Pill } from '../components/kit';
import ProductImage from '../components/ProductImage';
import { EmptyState } from '../components/ui';
import Sheet from '../components/Sheet';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { formatPrice, discountPct } from '../utils/format';
import { noOutline } from '../utils/platform';

const isLow = (p) => p.stock > 0 && p.stock <= 5;

export default function ProductsScreen({ navigation, route }) {
  const { products, toggleProduct, updateStock } = useSeller();
  const [tab, setTab] = useState(route.params?.tab || 'all');
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (route.params?.tab) setTab(route.params.tab);
  }, [route.params?.tab]);

  const filters = {
    all: () => true,
    active: (p) => p.status === 'active',
    low: (p) => p.status === 'active' && isLow(p),
    out: (p) => p.stock === 0,
    inactive: (p) => p.status === 'inactive',
    draft: (p) => p.status === 'draft',
  };
  const tabs = [
    ['all', 'All'], ['active', 'Active'], ['low', 'Low stock'], ['out', 'Out of stock'], ['inactive', 'Inactive'], ['draft', 'Drafts'],
  ].map(([id, label]) => ({ id, label, count: products.filter(filters[id]).length }));

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return products.filter(filters[tab]).filter((p) => !s || p.title.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
  }, [products, tab, q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title="My listings" subtitle={`${products.length} products`} />
      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search by name or SKU" placeholderTextColor={colors.faint} style={[styles.searchInput, noOutline]} />
        </View>
      </View>
      <View>
        <FlatList horizontal data={[0]} keyExtractor={() => 'tabs'} showsHorizontalScrollIndicator={false} renderItem={() => (
          <View style={{ flexDirection: 'row' }}>
            <SegmentTabs tabs={tabs} value={tab} onChange={setTab} />
          </View>
        )} />
      </View>

      <FlatList
        data={list}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100, flexGrow: 1 }}
        ListEmptyComponent={<EmptyState icon="pricetags-outline" title="No products here" subtitle="Try another filter or add a new product." />}
        renderItem={({ item: p }) => {
          const off = discountPct(p.mrp, p.price);
          return (
            <Pressable style={styles.card} onPress={() => navigation.navigate('ProductForm', { id: p.id })}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: 76 }}><ProductImage product={p} size={76} rounded={10} /></View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.title} numberOfLines={2}>{p.title}</Text>
                  <Text style={styles.sku}>SKU: {p.sku}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(p.price)}</Text>
                    {off ? <Text style={styles.mrp}>{formatPrice(p.mrp)}</Text> : null}
                    {off ? <Text style={styles.off}>{off}% off</Text> : null}
                  </View>
                </View>
              </View>
              <View style={styles.footer}>
                <View style={styles.stockBox}>
                  <Pressable onPress={() => updateStock(p.id, p.stock - 1)} hitSlop={6} style={styles.stepBtn}><Ionicons name="remove" size={16} color={colors.black} /></Pressable>
                  <Text style={[styles.stock, p.stock === 0 && { color: colors.sale }, isLow(p) && { color: '#E67E00' }]}>{p.stock} in stock</Text>
                  <Pressable onPress={() => updateStock(p.id, p.stock + 1)} hitSlop={6} style={styles.stepBtn}><Ionicons name="add" size={16} color={colors.black} /></Pressable>
                </View>
                {p.status === 'draft' ? (
                  <Pill label="Draft" color={colors.muted} bg={colors.mist} />
                ) : (
                  <View style={styles.switchRow}>
                    <Text style={[styles.switchLabel, p.status === 'active' && { color: colors.success }]}>{p.status === 'active' ? 'Live' : 'Paused'}</Text>
                    <Switch value={p.status === 'active'} onValueChange={() => toggleProduct(p.id)} trackColor={{ true: colors.success }} thumbColor={colors.white} />
                  </View>
                )}
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statText}><Ionicons name="eye-outline" size={12} /> {p.views.toLocaleString('en-IN')} views</Text>
                <Text style={styles.statText}><Ionicons name="bag-check-outline" size={12} /> {p.sold.toLocaleString('en-IN')} sold</Text>
              </View>
            </Pressable>
          );
        }}
      />

      <Pressable style={styles.fab} onPress={() => setAddOpen(true)} accessibilityLabel="Add product">
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>Add listing</Text>
      </Pressable>

      <Sheet visible={addOpen} onClose={() => setAddOpen(false)} title="Add a listing">
        {[
          ['search', 'Sell an existing product', 'Already on Thousands? Just set your price and stock', 'Catalog', '#E8F0FF', '#2B50E0'],
          ['create', 'Create a new listing', 'Add photos, details and price yourself', 'ProductForm', '#E9F8EF', '#0F9D58'],
          ['cloud-upload', 'Bulk upload with Excel', 'List hundreds of products at once', 'BulkUpload', '#FFF4E0', '#E67E00'],
        ].map(([ic, t, s, go, bg, fg]) => (
          <Pressable key={t} style={styles.opt} onPress={() => { setAddOpen(false); navigation.navigate(go); }}>
            <View style={[styles.optIcon, { backgroundColor: bg }]}><Ionicons name={ic} size={22} color={fg} /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.optT}>{t}</Text>
              <Text style={styles.optS}>{s}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.faint} />
          </Pressable>
        ))}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: { backgroundColor: colors.white, padding: 12, paddingBottom: 0 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: 4, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.black },
  card: { backgroundColor: colors.white, borderRadius: 4, padding: 12, marginBottom: 10 },
  title: { fontSize: 14, fontWeight: '600', color: colors.black, lineHeight: 19 },
  sku: { fontSize: 11, color: colors.muted, marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6, gap: 6 },
  price: { fontWeight: '700', fontSize: 16, color: colors.black },
  mrp: { fontSize: 12, color: colors.faint, textDecorationLine: 'line-through' },
  off: { fontSize: 12, color: colors.success, fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  stockBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: 8 },
  stepBtn: { width: 32, height: 30, alignItems: 'center', justifyContent: 'center' },
  stock: { fontSize: 12, fontWeight: '700', color: colors.ink, minWidth: 74, textAlign: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  switchLabel: { fontSize: 12, fontWeight: '700', color: colors.muted },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  statText: { fontSize: 11, color: colors.muted },
  opt: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  optIcon: { width: 46, height: 46, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  optT: { fontSize: 14, fontWeight: '700', color: colors.black },
  optS: { fontSize: 12, color: colors.muted, marginTop: 2 },
  fab: { position: 'absolute', right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 18, height: 50, gap: 6 },
  fabText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
