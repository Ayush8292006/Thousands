import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../components/Flat';
import { TopBar, Panel, Field, Pill } from '../components/kit';
import Sheet from '../components/Sheet';
import { Button } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';

const empty = { name: '', line1: '', city: '', state: '', pincode: '' };

export default function WarehousesScreen() {
  const { warehouses, addWarehouse, setPrimaryWarehouse, updateWarehouse, fulfilment, setFulfilment } = useSeller();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(empty);
  const [err, setErr] = useState('');

  const save = () => {
    if (!f.name.trim() || !f.line1.trim() || !f.city.trim() || !f.state.trim()) return setErr('Fill in all fields');
    if (!/^\d{6}$/.test(f.pincode)) return setErr('Enter a valid 6-digit pincode');
    addWarehouse(f);
    setF(empty);
    setErr('');
    setOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Warehouses" subtitle={`${warehouses.length} pickup locations`} />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <LinearGradient colors={['#0E7490', '#2B50E0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.fbf}>
          <View style={{ flex: 1 }}>
            <Text style={styles.fbfTitle}>Thousands Fulfilment</Text>
            <Text style={styles.fbfSub}>Store stock in our warehouses. We pack, ship and handle returns. Get the Assured badge and faster delivery.</Text>
          </View>
          <Switch value={fulfilment} onValueChange={setFulfilment} trackColor={{ true: colors.yellow, false: 'rgba(255,255,255,0.35)' }} thumbColor={colors.white} />
        </LinearGradient>
        {fulfilment ? <Text style={styles.fbfOn}>Request sent. Our team will call you to plan your first stock transfer.</Text> : null}

        {warehouses.map((w) => (
          <Panel key={w.id} style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.icon}><Ionicons name="business" size={20} color={colors.accent} /></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name}>{w.name}</Text>
                <Text style={styles.addr}>{w.line1}, {w.city}, {w.state} {w.pincode}</Text>
              </View>
            </View>
            <View style={styles.foot}>
              {w.primary ? <Pill label="Primary pickup" color={colors.success} bg={colors.successSoft} /> : (
                <Pressable onPress={() => setPrimaryWarehouse(w.id)}><Text style={styles.link}>Make primary</Text></Pressable>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.small}>{w.active ? 'Pickups on' : 'Paused'}</Text>
                <Switch value={w.active} onValueChange={(v) => updateWarehouse(w.id, { active: v })} disabled={w.primary} trackColor={{ true: colors.success }} thumbColor={colors.white} />
              </View>
            </View>
          </Panel>
        ))}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setOpen(true)}>
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>Add warehouse</Text>
      </Pressable>

      <Sheet visible={open} onClose={() => setOpen(false)} title="Add a pickup location" footer={<Button title="Save warehouse" onPress={save} />}>
        <Field label="Name" value={f.name} onChangeText={(v) => setF({ ...f, name: v })} placeholder="e.g. Gurugram store" />
        <Field label="Address" value={f.line1} onChangeText={(v) => setF({ ...f, line1: v })} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field style={{ flex: 1 }} label="City" value={f.city} onChangeText={(v) => setF({ ...f, city: v })} />
          <Field style={{ flex: 1 }} label="Pincode" value={f.pincode} onChangeText={(v) => setF({ ...f, pincode: v.replace(/\D/g, '').slice(0, 6) })} keyboardType="number-pad" />
        </View>
        <Field label="State" value={f.state} onChangeText={(v) => setF({ ...f, state: v })} hint="A new state may need an additional GST registration" />
        {err ? <Text style={{ color: colors.sale, fontSize: 12, fontWeight: '600' }}>{err}</Text> : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  fbf: { flexDirection: 'row', alignItems: 'center', margin: 12, marginBottom: 0, borderRadius: 4, padding: 16 },
  fbfTitle: { fontWeight: '700', color: colors.white, fontSize: 17 },
  fbfSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4, lineHeight: 17, paddingRight: 8 },
  fbfOn: { fontSize: 12, color: colors.success, fontWeight: '600', marginHorizontal: 16, marginTop: 8 },
  icon: { width: 40, height: 40, borderRadius: 4, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: colors.black },
  addr: { fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 17 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
  link: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  small: { fontSize: 12, color: colors.muted },
  fab: { position: 'absolute', right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 18, height: 50, gap: 6 },
  fabText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
