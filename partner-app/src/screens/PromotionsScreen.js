import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TopBar, Panel, Field, Pill, SegmentTabs } from '../components/kit';
import Sheet from '../components/Sheet';
import { Button, Chip } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { upcomingEvents } from '../data/hub';
import { formatPrice, formatDate, addDays } from '../utils/format';
import { notify } from '../utils/platform';

const ST = {
  live: { label: 'Live', color: colors.success, bg: colors.successSoft },
  scheduled: { label: 'Scheduled', color: colors.accent, bg: colors.accentSoft },
  ended: { label: 'Ended', color: colors.muted, bg: colors.mist },
  paused: { label: 'Paused', color: '#B45309', bg: '#FFF4E0' },
};

export default function PromotionsScreen() {
  const { promotions, addPromotion, updatePromotion, products, productById } = useSeller();
  const [tab, setTab] = useState('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', discount: '10', days: '3', products: [] });
  const [err, setErr] = useState('');

  const list = promotions.filter((p) => tab === 'all' || p.status === tab);
  const active = products.filter((p) => p.status === 'active');

  const create = () => {
    const d = Number(form.discount);
    if (form.name.trim().length < 3) return setErr('Give the offer a name');
    if (!d || d < 5 || d > 80) return setErr('Discount must be between 5% and 80%');
    if (!form.products.length) return setErr('Select at least one product');
    addPromotion({ name: form.name, type: 'Seller offer', discount: d, products: form.products, start: new Date().toISOString(), end: addDays(Number(form.days) || 3).toISOString(), status: 'live' });
    setOpen(false);
    setForm({ name: '', discount: '10', days: '3', products: [] });
    setErr('');
  };
  const toggleProd = (id) => setForm((f) => ({ ...f, products: f.products.includes(id) ? f.products.filter((x) => x !== id) : [...f.products, id] }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Promotions" subtitle="Offers and sale events" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sec}>Upcoming sale events</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}>
          {upcomingEvents.map((e) => (
            <ImageBackground key={e.id} source={{ uri: e.image }} style={styles.event} imageStyle={{ borderRadius: 14 }}>
              <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} style={styles.eventShade}>
                <Text style={styles.eventName}>{e.name}</Text>
                <Text style={styles.eventSub}>{e.dates} · min. {e.minDiscount}% off</Text>
                <Pressable style={styles.eventBtn} onPress={() => notify('Registered', `Your eligible products will be considered for ${e.name}.`)}>
                  <Text style={styles.eventBtnText}>Participate</Text>
                </Pressable>
              </LinearGradient>
            </ImageBackground>
          ))}
        </ScrollView>

        <SegmentTabs
          tabs={['all', 'live', 'scheduled', 'ended'].map((id) => ({ id, label: id === 'all' ? 'All' : ST[id].label, count: promotions.filter((p) => id === 'all' || p.status === id).length }))}
          value={tab}
          onChange={setTab}
        />

        {list.map((p) => (
          <Panel key={p.id} style={{ marginTop: 0, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.offIcon}><Text style={styles.offText}>{p.discount}%</Text></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.meta}>{p.type} · {formatDate(p.start)} – {formatDate(p.end)}</Text>
              </View>
              <Pill label={ST[p.status].label} color={ST[p.status].color} bg={ST[p.status].bg} />
            </View>
            <Text style={styles.prods} numberOfLines={1}>{p.products.map((id) => productById(id)?.title).filter(Boolean).join(', ')}</Text>
            <View style={styles.stats}>
              <Text style={styles.stat}><Text style={styles.statB}>{p.orders}</Text> orders</Text>
              <Text style={styles.stat}><Text style={styles.statB}>{formatPrice(p.revenue)}</Text> revenue</Text>
              {p.status === 'live' ? (
                <Pressable onPress={() => updatePromotion(p.id, { status: 'paused' })}><Text style={styles.link}>Pause</Text></Pressable>
              ) : p.status === 'paused' ? (
                <Pressable onPress={() => updatePromotion(p.id, { status: 'live' })}><Text style={styles.link}>Resume</Text></Pressable>
              ) : null}
            </View>
          </Panel>
        ))}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setOpen(true)}>
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>Create offer</Text>
      </Pressable>

      <Sheet visible={open} onClose={() => setOpen(false)} title="Create an offer" footer={<Button title="Start offer" onPress={create} />}>
        <Field label="Offer name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} placeholder="e.g. Weekend audio fest" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field style={{ flex: 1 }} label="Discount %" value={form.discount} onChangeText={(v) => setForm({ ...form, discount: v.replace(/\D/g, '').slice(0, 2) })} keyboardType="number-pad" />
          <Field style={{ flex: 1 }} label="Runs for (days)" value={form.days} onChangeText={(v) => setForm({ ...form, days: v.replace(/\D/g, '').slice(0, 2) })} keyboardType="number-pad" />
        </View>
        <Text style={styles.label}>Products</Text>
        <View style={styles.chips}>
          {active.map((p) => <Chip key={p.id} label={p.title.split(' ').slice(0, 3).join(' ')} active={form.products.includes(p.id)} onPress={() => toggleProd(p.id)} />)}
        </View>
        {err ? <Text style={styles.err}>{err}</Text> : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  sec: { fontFamily: fonts.display, fontSize: 15, color: colors.black, padding: 12, paddingBottom: 10 },
  event: { width: 250, height: 140 },
  eventShade: { flex: 1, borderRadius: 14, justifyContent: 'flex-end', padding: 12 },
  eventName: { fontFamily: fonts.display, color: colors.white, fontSize: 16 },
  eventSub: { color: colors.yellow, fontSize: 11, fontWeight: '700', marginTop: 2 },
  eventBtn: { alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5, marginTop: 8 },
  eventBtnText: { fontSize: 11, fontFamily: fonts.display, color: colors.accent },
  offIcon: { width: 46, height: 46, borderRadius: 12, backgroundColor: '#FFF4E0', alignItems: 'center', justifyContent: 'center' },
  offText: { fontFamily: fonts.display, fontSize: 14, color: '#E67E00' },
  name: { fontSize: 14, fontWeight: '700', color: colors.black },
  meta: { fontSize: 11, color: colors.muted, marginTop: 2 },
  prods: { fontSize: 12, color: colors.ink, marginTop: 10 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  stat: { fontSize: 12, color: colors.muted },
  statB: { fontWeight: '800', color: colors.black },
  link: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  err: { color: colors.sale, fontSize: 12, fontWeight: '600', marginTop: 10 },
  fab: { position: 'absolute', right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 999, paddingHorizontal: 18, height: 50, gap: 6 },
  fabText: { color: colors.white, fontFamily: fonts.display, fontSize: 14 },
});
