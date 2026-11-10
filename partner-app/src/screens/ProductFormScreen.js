import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar, Field, Panel, MoneyRow } from '../components/kit';
import { Button, Chip } from '../components/ui';
import { colors } from '../theme';
import { useSeller } from '../context/SellerContext';
import { categories, sampleImages } from '../data/seed';
import { settlement } from '../config/commission';
import { formatMoney, discountPct } from '../utils/format';
import { confirmAction } from '../utils/platform';
import { region, getTaxRate } from '../config/tax';

export default function ProductFormScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { productById, saveProduct, deleteProduct, kyc } = useSeller();
  const existing = route.params?.id ? productById(route.params.id) : null;
  const [f, setF] = useState(() =>
    existing
      ? { ...existing, mrp: String(existing.mrp), price: String(existing.price), stock: String(existing.stock) }
      : { title: '', brand: '', category: kyc.business.category || 'electronics', sku: '', mrp: '', price: '', stock: '', variants: '', description: '', images: [], status: 'active' }
  );
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => {
    setF((x) => ({ ...x, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const num = (k) => (v) => set(k)(v.replace(/\D/g, '').slice(0, 7));

  const price = Number(f.price) || 0;
  const mrp = Number(f.mrp) || 0;
  const fee = useMemo(() => (price ? settlement(price, 1, f.category) : null), [price, f.category]);

  const addPhoto = () => {
    const next = sampleImages.find((u) => !f.images.includes(u));
    if (next && f.images.length < 6) set('images')([...f.images, next]);
  };

  const validate = (publish) => {
    const e = {};
    if (f.title.trim().length < 10) e.title = 'Title should be at least 10 characters';
    if (!f.brand.trim()) e.brand = 'Enter the brand name';
    if (!mrp) e.mrp = 'Enter MRP';
    if (!price) e.price = 'Enter selling price';
    if (price && mrp && price > mrp) e.price = 'Selling price cannot be more than MRP';
    if (f.stock === '') e.stock = 'Enter stock quantity';
    if (publish && !f.images.length) e.images = 'Add at least one photo to publish';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = (publish) => {
    if (!validate(publish)) return;
    saveProduct({
      ...f,
      sku: f.sku.trim() || `UT-${f.brand.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      mrp, price, stock: Number(f.stock),
      status: publish ? (f.status === 'draft' ? 'active' : f.status) : 'draft',
    });
    navigation.goBack();
  };

  const remove = () =>
    confirmAction('Delete product?', 'This listing will be removed permanently.', 'Delete', () => {
      deleteProduct(existing.id);
      navigation.goBack();
    });

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar back title={existing ? 'Edit product' : 'Add a product'} subtitle={existing ? existing.sku : 'Fill in the details buyers will see'} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <Panel title="Photos" action={`${f.images.length}/6`}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {f.images.map((u, i) => (
              <View key={u}>
                <Image source={{ uri: u }} style={styles.photo} />
                {i === 0 ? <View style={styles.cover}><Text style={styles.coverText}>Cover</Text></View> : null}
                <Pressable style={styles.remove} hitSlop={6} onPress={() => set('images')(f.images.filter((x) => x !== u))}>
                  <Ionicons name="close" size={14} color={colors.white} />
                </Pressable>
              </View>
            ))}
            {f.images.length < 6 ? (
              <Pressable style={styles.addPhoto} onPress={addPhoto}>
                <Ionicons name="camera-outline" size={24} color={colors.accent} />
                <Text style={styles.addPhotoText}>Add photo</Text>
              </Pressable>
            ) : null}
          </ScrollView>
          {errors.images ? <Text style={styles.err}>{errors.images}</Text> : <Text style={styles.hint}>Use a white background. The first photo is the cover image.</Text>}
        </Panel>

        <Panel title="Basic details">
          <Field label="Product title" value={f.title} onChangeText={set('title')} placeholder="e.g. PulseMax ANC Wireless Headphones" error={errors.title} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field style={{ flex: 1 }} label="Brand" value={f.brand} onChangeText={set('brand')} error={errors.brand} />
            <Field style={{ flex: 1 }} label="SKU (optional)" value={f.sku} onChangeText={(v) => set('sku')(v.toUpperCase())} placeholder="Auto" />
          </View>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {categories.map((c) => <Chip key={c.id} label={c.name} active={f.category === c.id} onPress={() => set('category')(c.id)} />)}
          </View>
          <Field label="Variants (optional)" value={f.variants} onChangeText={set('variants')} placeholder="e.g. Black, White or S, M, L" hint="Separate with commas" />
          <Field label="Description" value={f.description} onChangeText={set('description')} placeholder="Key features, what's in the box, warranty" multiline inputStyle={{ minHeight: 80, textAlignVertical: 'top' }} />
        </Panel>

        <Panel title="Price & stock">
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field style={{ flex: 1 }} label="MRP" prefix={region.symbol} value={f.mrp} onChangeText={num('mrp')} keyboardType="number-pad" error={errors.mrp} />
            <Field style={{ flex: 1 }} label="Selling price" prefix={region.symbol} value={f.price} onChangeText={num('price')} keyboardType="number-pad" error={errors.price} hint={price && mrp && price <= mrp ? `${discountPct(mrp, price)}% off for buyers` : undefined} />
          </View>
          <Field label="Stock quantity" value={f.stock} onChangeText={num('stock')} keyboardType="number-pad" error={errors.stock} />
          <Text style={styles.hint}>Price is inclusive of {region.taxName} ({getTaxRate(f.category)}% for this category).</Text>
        </Panel>

        {fee ? (
          <Panel title="What you'll earn per unit">
            <MoneyRow label="Selling price" value={formatMoney(fee.sale)} />
            <MoneyRow label={`Commission (${fee.rate}%)`} value={'− ' + formatMoney(fee.commission)} negative />
            <MoneyRow label="Fixed fee" value={'− ' + formatMoney(fee.fixed)} negative />
            <MoneyRow label="Collection fee" value={'− ' + formatMoney(fee.collection)} negative />
            <MoneyRow label="Shipping fee" value={'− ' + formatMoney(fee.shipping)} negative />
            <MoneyRow label={`GST on fees (18%)`} value={'− ' + formatMoney(fee.gst)} negative />
            <View style={styles.divider} />
            <MoneyRow label="You get" value={formatMoney(fee.net)} bold />
            <Text style={[styles.hint, { color: fee.netPct > 70 ? colors.success : '#E67E00' }]}>
              That's {Math.round(fee.netPct)}% of the selling price. Paid within 7 days of delivery.
            </Text>
          </Panel>
        ) : null}

        {existing ? (
          <Pressable onPress={remove} style={styles.delete}>
            <Ionicons name="trash-outline" size={16} color={colors.sale} />
            <Text style={styles.deleteText}>Delete this product</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 10 }]}>
        <Button title="Save draft" variant="outline" style={{ flex: 1 }} onPress={() => save(false)} />
        <Button title={existing && existing.status !== 'draft' ? 'Save changes' : 'Publish'} style={{ flex: 1.4 }} onPress={() => save(true)} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  photo: { width: 96, height: 96, borderRadius: 4, backgroundColor: colors.mist },
  cover: { position: 'absolute', left: 6, bottom: 6, backgroundColor: colors.black, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  coverText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  remove: { position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  addPhoto: { width: 96, height: 96, borderRadius: 4, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  addPhotoText: { fontSize: 11, color: colors.accent, fontWeight: '700', marginTop: 4 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8, marginBottom: 14 },
  hint: { fontSize: 11, color: colors.muted, marginTop: 8 },
  err: { fontSize: 11, color: colors.sale, marginTop: 8, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  delete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
  deleteText: { color: colors.sale, fontWeight: '700' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, backgroundColor: colors.white, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
});
