import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, Field, MoneyRow } from '../components/kit';
import Sheet from '../components/Sheet';
import { Button } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { settlement } from '../config/commission';
import { formatPrice, formatMoney } from '../utils/format';
import { noOutline, notify } from '../utils/platform';

export default function CatalogScreen({ navigation }) {
  const { masterCatalog, sellFromCatalog, products } = useSeller();
  const [q, setQ] = useState('');
  const [pick, setPick] = useState(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [err, setErr] = useState('');

  const listed = new Set(products.map((p) => p.catalogId).filter(Boolean));
  const s = q.trim().toLowerCase();
  const results = masterCatalog.filter((c) => !s || c.title.toLowerCase().includes(s) || c.brand.toLowerCase().includes(s));
  const p = Number(price) || 0;
  const st = pick && p ? settlement(p, 1, pick.category) : null;

  const open = (c) => {
    setPick(c);
    setPrice(String(c.lowestPrice));
    setStock('10');
    setErr('');
  };
  const confirm = () => {
    if (!p) return setErr('Enter your selling price');
    if (p > pick.mrp) return setErr('Price cannot be more than MRP');
    if (!Number(stock)) return setErr('Enter stock');
    sellFromCatalog(pick, { price: p, stock: Number(stock) });
    setPick(null);
    notify('Listing is live', `${pick.title} is now listed in your store.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Sell an existing product" subtitle="Skip photos and details — just set price & stock" />
      <View style={styles.searchWrap}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput value={q} onChangeText={setQ} autoFocus placeholder="Search by product name, brand or model" placeholderTextColor={colors.faint} style={[styles.input, noOutline]} />
        </View>
      </View>
      <FlatList
        data={results}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 12 }}
        ListFooterComponent={
          <Pressable style={styles.newBox} onPress={() => navigation.navigate('ProductForm')}>
            <Ionicons name="add-circle-outline" size={22} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.title}>Can't find your product?</Text>
              <Text style={styles.meta}>Create a new listing with your own photos and details</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.faint} />
          </Pressable>
        }
        renderItem={({ item: c }) => {
          const already = listed.has(c.id);
          return (
            <View style={styles.card}>
              <Image source={{ uri: c.image }} style={styles.img} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.brand}>{c.brand}</Text>
                <Text style={styles.title} numberOfLines={2}>{c.title}</Text>
                <Text style={styles.meta}>MRP {formatPrice(c.mrp)} · Lowest {formatPrice(c.lowestPrice)} · {c.sellers} sellers</Text>
                <Pressable style={[styles.btn, already && styles.btnDone]} disabled={already} onPress={() => open(c)}>
                  <Text style={[styles.btnText, already && { color: colors.success }]}>{already ? 'Already selling' : 'Sell this'}</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />

      <Sheet visible={!!pick} onClose={() => setPick(null)} title="Set your price" footer={<Button title="Start selling" onPress={confirm} />}>
        {pick ? (
          <>
            <Text style={styles.title}>{pick.title}</Text>
            <Text style={[styles.meta, { marginBottom: 14 }]}>Lowest price right now: {formatPrice(pick.lowestPrice)}. Match it to win the Buy Box.</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field style={{ flex: 1 }} label="Your price" prefix="₹" value={price} onChangeText={(v) => setPrice(v.replace(/\D/g, '').slice(0, 7))} keyboardType="number-pad" />
              <Field style={{ flex: 1 }} label="Stock" value={stock} onChangeText={(v) => setStock(v.replace(/\D/g, '').slice(0, 5))} keyboardType="number-pad" />
            </View>
            {st ? (
              <View style={styles.earn}>
                <MoneyRow label="Total fees" value={'− ' + formatMoney(st.totalFees)} negative />
                <MoneyRow label="You get per unit" value={formatMoney(st.net)} bold />
              </View>
            ) : null}
            {err ? <Text style={{ color: colors.sale, fontSize: 12, fontWeight: '600', marginTop: 8 }}>{err}</Text> : null}
          </>
        ) : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrap: { backgroundColor: colors.white, padding: 12 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: 4, paddingHorizontal: 12, height: 46 },
  input: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.black },
  card: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 4, padding: 12, marginBottom: 10 },
  img: { width: 84, height: 84, borderRadius: 4, backgroundColor: colors.mist },
  brand: { fontSize: 11, fontWeight: '700', color: colors.accent },
  title: { fontSize: 13, fontWeight: '600', color: colors.black, marginTop: 2, lineHeight: 18 },
  meta: { fontSize: 11, color: colors.muted, marginTop: 3 },
  btn: { alignSelf: 'flex-start', backgroundColor: colors.accent, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 6, marginTop: 8 },
  btnDone: { backgroundColor: colors.successSoft },
  btnText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  newBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 4, padding: 14, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  earn: { backgroundColor: colors.successSoft, borderRadius: 4, padding: 10 },
});
