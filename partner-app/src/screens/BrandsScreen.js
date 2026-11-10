import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, Panel, Field, Pill } from '../components/kit';
import Sheet from '../components/Sheet';
import { Button, Chip } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { categories } from '../data/seed';
import { formatDate } from '../utils/format';

const ST = {
  approved: { label: 'Approved', color: colors.success, bg: colors.successSoft, icon: 'checkmark-circle' },
  pending: { label: 'In review', color: '#B45309', bg: '#FFF4E0', icon: 'time' },
  rejected: { label: 'Rejected', color: colors.sale, bg: '#FDECF1', icon: 'close-circle' },
};

export default function BrandsScreen() {
  const { brands, requestBrand } = useSeller();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: '', category: 'electronics', owner: false, letter: false, invoice: false });
  const [err, setErr] = useState('');

  const submit = () => {
    if (f.name.trim().length < 2) return setErr('Enter the brand name');
    if (!f.owner && !f.letter) return setErr('Upload a trademark certificate or an authorisation letter');
    if (!f.invoice) return setErr('Upload a purchase invoice from the brand or its distributor');
    requestBrand({ name: f.name.trim(), category: f.category });
    setF({ name: '', category: 'electronics', owner: false, letter: false, invoice: false });
    setErr('');
    setOpen(false);
  };

  const Doc = ({ k, title }) => (
    <Pressable style={[styles.doc, f[k] && styles.docOn]} onPress={() => setF({ ...f, [k]: !f[k] })}>
      <Ionicons name={f[k] ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={f[k] ? colors.success : colors.accent} />
      <Text style={styles.docText}>{title}</Text>
      <Text style={[styles.docAct, f[k] && { color: colors.success }]}>{f[k] ? 'Uploaded' : 'Upload'}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Brand approval" subtitle="Needed to sell branded products" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.info}>
          <Ionicons name="information-circle" size={18} color={colors.accent} />
          <Text style={styles.infoText}>To sell a brand you don't own, upload an authorisation letter and a purchase invoice. Approval takes 2–3 business days.</Text>
        </View>
        <Panel title="Your brands">
          {brands.map((b, i) => {
            const st = ST[b.status];
            return (
              <View key={b.id} style={[styles.row, i === brands.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.logo}><Text style={styles.logoText}>{b.name[0]}</Text></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.name}>{b.name}</Text>
                  <Text style={styles.meta}>{categories.find((c) => c.id === b.category)?.name} · {formatDate(b.date)}</Text>
                  {b.note ? <Text style={styles.note}>{b.note}</Text> : null}
                </View>
                <Pill label={st.label} color={st.color} bg={st.bg} />
              </View>
            );
          })}
        </Panel>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setOpen(true)}>
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={styles.fabText}>Request brand</Text>
      </Pressable>

      <Sheet visible={open} onClose={() => setOpen(false)} title="Request brand approval" footer={<Button title="Submit request" onPress={submit} />}>
        <Field label="Brand name" value={f.name} onChangeText={(v) => setF({ ...f, name: v })} placeholder="e.g. Boom" />
        <Text style={styles.label}>Category</Text>
        <View style={styles.chips}>
          {categories.map((c) => <Chip key={c.id} label={c.name} active={f.category === c.id} onPress={() => setF({ ...f, category: c.id })} />)}
        </View>
        <Text style={[styles.label, { marginTop: 14 }]}>Documents</Text>
        <Doc k="owner" title="Trademark certificate (if you own it)" />
        <Doc k="letter" title="Brand authorisation letter" />
        <Doc k="invoice" title="Purchase invoice" />
        {err ? <Text style={{ color: colors.sale, fontSize: 12, fontWeight: '600', marginTop: 6 }}>{err}</Text> : null}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  info: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.accentSoft, margin: 12, marginBottom: 0, borderRadius: 4, padding: 10 },
  infoText: { flex: 1, marginLeft: 8, fontSize: 12, color: colors.ink, lineHeight: 17 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  logo: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F1EBFF', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontWeight: '700', fontSize: 18, color: '#7C3AED' },
  name: { fontSize: 14, fontWeight: '700', color: colors.black },
  meta: { fontSize: 11, color: colors.muted, marginTop: 2 },
  note: { fontSize: 11, color: colors.sale, marginTop: 3 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  doc: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', borderRadius: 4, padding: 12, marginBottom: 8 },
  docOn: { borderStyle: 'solid', borderColor: colors.success, backgroundColor: colors.successSoft },
  docText: { flex: 1, marginLeft: 10, fontSize: 13, color: colors.ink },
  docAct: { fontSize: 12, fontWeight: '700', color: colors.accent },
  fab: { position: 'absolute', right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 18, height: 50, gap: 6 },
  fabText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
