import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../components/Flat';
import { TopBar, Panel, Field } from '../components/kit';
import Sheet from '../components/Sheet';
import { Button, Chip } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { formatPrice } from '../utils/format';

export default function AdsScreen() {
  const { campaigns, addCampaign, updateCampaign, products, productById } = useSeller();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', budget: '300', cpc: '3', productIds: [] });
  const [err, setErr] = useState('');

  const tot = campaigns.reduce((a, c) => ({ spend: a.spend + c.spend, revenue: a.revenue + c.revenue, clicks: a.clicks + c.clicks, orders: a.orders + c.orders }), { spend: 0, revenue: 0, clicks: 0, orders: 0 });
  const roas = tot.spend ? (tot.revenue / tot.spend).toFixed(1) : '0';

  const create = () => {
    if (form.name.trim().length < 3) return setErr('Give the campaign a name');
    if (Number(form.budget) < 100) return setErr('Minimum daily budget is ₹100');
    if (!form.productIds.length) return setErr('Select at least one product to promote');
    addCampaign({ name: form.name, productIds: form.productIds, dailyBudget: Number(form.budget), cpc: Number(form.cpc) || 3, status: 'active' });
    setOpen(false);
    setForm({ name: '', budget: '300', cpc: '3', productIds: [] });
    setErr('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Thousands Ads" subtitle="Get your products seen first" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient colors={['#6A3DE8', '#2B50E0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Text style={styles.heroLabel}>Return on ad spend (30 days)</Text>
          <Text style={styles.heroValue}>{roas}x</Text>
          <View style={styles.heroRow}>
            {[['Spend', formatPrice(tot.spend)], ['Revenue', formatPrice(tot.revenue)], ['Clicks', tot.clicks.toLocaleString('en-IN')], ['Orders', String(tot.orders)]].map(([k, v]) => (
              <View key={k} style={{ flex: 1 }}>
                <Text style={styles.heroK}>{k}</Text>
                <Text style={styles.heroV}>{v}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {campaigns.map((c) => {
          const ctr = c.views ? ((c.clicks / c.views) * 100).toFixed(1) : '0.0';
          return (
            <Panel key={c.id} style={{ marginTop: 0, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.adIcon}><Ionicons name="megaphone" size={20} color="#7C3AED" /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.name}>{c.name}</Text>
                  <Text style={styles.meta}>{c.productIds.map((id) => productById(id)?.brand).join(', ')} · ₹{c.dailyBudget}/day · ₹{c.cpc} per click</Text>
                </View>
                <Switch value={c.status === 'active'} onValueChange={(v) => updateCampaign(c.id, { status: v ? 'active' : 'paused' })} trackColor={{ true: colors.success }} thumbColor={colors.white} />
              </View>
              <View style={styles.metrics}>
                {[['Views', c.views.toLocaleString('en-IN')], ['CTR', ctr + '%'], ['Orders', c.orders], ['Spend', formatPrice(c.spend)]].map(([k, v]) => (
                  <View key={k} style={styles.metric}>
                    <Text style={styles.mV}>{v}</Text>
                    <Text style={styles.mK}>{k}</Text>
                  </View>
                ))}
              </View>
            </Panel>
          );
        })}
        <Text style={styles.note}>You pay only when a buyer clicks your ad. Ad spend is deducted from your payouts.</Text>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setOpen(true)}>
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>New campaign</Text>
      </Pressable>

      <Sheet visible={open} onClose={() => setOpen(false)} title="New ad campaign" footer={<Button title="Launch campaign" onPress={create} />}>
        <Field label="Campaign name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Laptop — search top slot" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field style={{ flex: 1 }} label="Daily budget" prefix="₹" value={form.budget} onChangeText={(v) => setForm({ ...form, budget: v.replace(/\D/g, '').slice(0, 5) })} keyboardType="number-pad" />
          <Field style={{ flex: 1 }} label="Max cost per click" prefix="₹" value={form.cpc} onChangeText={(v) => setForm({ ...form, cpc: v.replace(/\D/g, '').slice(0, 3) })} keyboardType="number-pad" hint="Suggested ₹3–5" />
        </View>
        <Text style={styles.label}>Products to promote</Text>
        <View style={styles.chips}>
          {products.filter((p) => p.status === 'active').map((p) => (
            <Chip key={p.id} label={p.title.split(' ').slice(0, 3).join(' ')} active={form.productIds.includes(p.id)} onPress={() => setForm((f) => ({ ...f, productIds: f.productIds.includes(p.id) ? f.productIds.filter((x) => x !== p.id) : [...f.productIds, p.id] }))} />
          ))}
        </View>
        {err ? <Text style={styles.err}>{err}</Text> : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { margin: 12, borderRadius: 4, padding: 18 },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  heroValue: { fontWeight: '700', color: colors.white, fontSize: 32 },
  heroRow: { flexDirection: 'row', marginTop: 12, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 4, padding: 10 },
  heroK: { color: 'rgba(255,255,255,0.75)', fontSize: 10 },
  heroV: { color: colors.white, fontWeight: '700', fontSize: 13, marginTop: 2 },
  adIcon: { width: 40, height: 40, borderRadius: 4, backgroundColor: '#F1EBFF', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: colors.black },
  meta: { fontSize: 11, color: colors.muted, marginTop: 2 },
  metrics: { flexDirection: 'row', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  metric: { flex: 1, alignItems: 'center' },
  mV: { fontWeight: '700', fontSize: 14, color: colors.black },
  mK: { fontSize: 11, color: colors.muted, marginTop: 2 },
  note: { fontSize: 11, color: colors.muted, textAlign: 'center', paddingHorizontal: 24, marginTop: 4 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  err: { color: colors.sale, fontSize: 12, fontWeight: '600', marginTop: 10 },
  fab: { position: 'absolute', right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 18, height: 50, gap: 6 },
  fabText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
