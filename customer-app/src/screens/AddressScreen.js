import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Button, Chip } from '../components/ui';
import { colors, radius } from '../theme';

const empty = { name: '', phone: '', pincode: '', state: '', city: '', house: '', area: '', type: 'Home' };

export default function AddressScreen({ navigation, route }) {
  const selectMode = route.params?.selectMode;
  const { addresses, selectedAddress, setSelectedAddressId, addAddress } = useApp();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState('');
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    const required = ['name', 'phone', 'pincode', 'state', 'city', 'house', 'area'];
    if (required.some((k) => !form[k].trim())) return setErr('Please fill in all fields');
    if (!/^\d{10}$/.test(form.phone)) return setErr('Enter a valid 10-digit phone number');
    if (!/^\d{6}$/.test(form.pincode)) return setErr('Enter a valid 6-digit pincode');
    addAddress(form);
    setForm(empty);
    setAdding(false);
    setErr('');
    if (selectMode) navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {!adding ? (
          <Pressable style={styles.addBtn} onPress={() => setAdding(true)}>
            <Ionicons name="add" size={20} color={colors.black} />
            <Text style={styles.addText}>Add a new address</Text>
          </Pressable>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New address</Text>
            <Field label="Full name" value={form.name} onChangeText={set('name')} />
            <Field label="Phone number" value={form.phone} onChangeText={(t) => set('phone')(t.replace(/\D/g, '').slice(0, 10))} keyboardType="phone-pad" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field style={{ flex: 1 }} label="Pincode" value={form.pincode} onChangeText={(t) => set('pincode')(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" />
              <Field style={{ flex: 1 }} label="City" value={form.city} onChangeText={set('city')} />
            </View>
            <Field label="State" value={form.state} onChangeText={set('state')} />
            <Field label="House no., Building name" value={form.house} onChangeText={set('house')} />
            <Field label="Road name, Area, Colony" value={form.area} onChangeText={set('area')} />
            <Text style={styles.label}>Address type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 14 }}>
              {['Home', 'Work'].map((t) => <Chip key={t} label={t} active={form.type === t} onPress={() => set('type')(t)} />)}
            </View>
            {err ? <Text style={styles.err}>{err}</Text> : null}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => { setAdding(false); setErr(''); }} />
              <Button title="Save address" style={{ flex: 1.4 }} onPress={save} />
            </View>
          </View>
        )}

        <Text style={styles.count}>{addresses.length} saved address{addresses.length > 1 ? 'es' : ''}</Text>
        {addresses.map((a) => {
          const on = selectedAddress?.id === a.id;
          return (
            <Pressable
              key={a.id}
              style={[styles.card, on && { borderColor: colors.black }]}
              onPress={() => {
                setSelectedAddressId(a.id);
                if (selectMode) navigation.goBack();
              }}
            >
              <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.black} style={{ marginTop: 2 }} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '800', fontSize: 14 }}>{a.name}</Text>
                  <View style={styles.tag}><Text style={styles.tagText}>{a.type}</Text></View>
                </View>
                <Text style={styles.line}>{a.house}, {a.area}</Text>
                <Text style={styles.line}>{a.city}, {a.state} — {a.pincode}</Text>
                <Text style={[styles.line, { color: colors.ink }]}>{a.phone}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, style, ...rest }) {
  return (
    <View style={[{ marginBottom: 12 }, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.faint} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: 16 },
  addText: { marginLeft: 8, fontWeight: '700', fontSize: 14 },
  form: { backgroundColor: colors.white, padding: 16 },
  formTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 6, fontWeight: '600' },
  input: { height: 46, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, fontSize: 14, color: colors.black },
  err: { color: colors.danger, fontSize: 12, marginBottom: 10 },
  count: { fontSize: 12, fontWeight: '800', color: colors.muted, letterSpacing: 0.6, padding: 16, paddingBottom: 8 },
  card: {
    flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: 12, marginBottom: 10, padding: 14,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: 'transparent',
  },
  tag: { backgroundColor: colors.soft, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  tagText: { fontSize: 9, fontWeight: '800', color: colors.muted },
  line: { fontSize: 13, color: colors.muted, marginTop: 3 },
});
