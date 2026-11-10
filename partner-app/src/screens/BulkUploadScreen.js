import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, Panel } from '../components/kit';
import { Button, Chip } from '../components/ui';
import { colors, fonts } from '../theme';
import { categories } from '../data/seed';
import { notify } from '../utils/platform';

const STEPS = [
  ['download-outline', 'Download the template', 'Excel sheet with the right columns for your category'],
  ['create-outline', 'Fill in your products', 'Title, brand, MRP, price, stock, SKU and image links'],
  ['cloud-upload-outline', 'Upload the sheet', 'We check every row and show errors before listing'],
];

export default function BulkUploadScreen() {
  const [cat, setCat] = useState('electronics');
  const [state, setState] = useState('idle'); // idle | checking | done

  const upload = () => {
    setState('checking');
    setTimeout(() => setState('done'), 1400);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Bulk upload" subtitle="List hundreds of products at once" />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Panel title="How it works">
          {STEPS.map(([ic, t, s], i) => (
            <View key={t} style={styles.step}>
              <View style={styles.num}><Text style={styles.numText}>{i + 1}</Text></View>
              <Ionicons name={ic} size={20} color={colors.accent} style={{ marginHorizontal: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.t}>{t}</Text>
                <Text style={styles.s}>{s}</Text>
              </View>
            </View>
          ))}
        </Panel>

        <Panel title="1. Choose category">
          <View style={styles.chips}>
            {categories.map((c) => <Chip key={c.id} label={c.name} active={cat === c.id} onPress={() => setCat(c.id)} />)}
          </View>
          <Button title="Download Excel template" variant="outline" icon="download-outline" style={{ marginTop: 14 }} onPress={() => notify('Template', `The ${categories.find((c) => c.id === cat).name} template will download as an .xlsx file.`)} />
        </Panel>

        <Panel title="2. Upload filled sheet">
          <Pressable style={styles.drop} onPress={upload}>
            <Ionicons name="document-attach-outline" size={34} color={colors.accent} />
            <Text style={styles.dropT}>Tap to choose your .xlsx file</Text>
            <Text style={styles.s}>Up to 1,000 rows per file</Text>
          </Pressable>
          {state === 'checking' ? <Text style={styles.checking}>Checking 48 rows…</Text> : null}
          {state === 'done' ? (
            <View style={styles.result}>
              <View style={styles.resRow}><Ionicons name="checkmark-circle" size={18} color={colors.success} /><Text style={styles.resText}>45 products ready to list</Text></View>
              <View style={styles.resRow}><Ionicons name="alert-circle" size={18} color={colors.sale} /><Text style={styles.resText}>3 rows have errors (missing MRP, invalid image link)</Text></View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                <Button title="Download error file" variant="outline" style={{ flex: 1, height: 42 }} onPress={() => notify('Error file', 'Fix the highlighted rows and upload again.')} />
                <Button title="List 45 products" style={{ flex: 1, height: 42 }} onPress={() => { setState('idle'); notify('Submitted', '45 products will go live after a quick quality check.'); }} />
              </View>
            </View>
          ) : null}
          <Text style={styles.demo}>Demo flow: the backend will parse the sheet and create the listings.</Text>
        </Panel>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  num: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  numText: { color: colors.white, fontSize: 12, fontWeight: '800' },
  t: { fontSize: 14, fontWeight: '700', color: colors.black },
  s: { fontSize: 12, color: colors.muted, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  drop: { alignItems: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.accent, borderRadius: 14, padding: 22, backgroundColor: colors.accentSoft },
  dropT: { fontFamily: fonts.display, fontSize: 14, color: colors.black, marginTop: 8 },
  checking: { fontSize: 13, color: colors.accent, fontWeight: '600', marginTop: 12, textAlign: 'center' },
  result: { backgroundColor: colors.mist, borderRadius: 10, padding: 12, marginTop: 12 },
  resRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  resText: { marginLeft: 8, fontSize: 13, color: colors.ink, flex: 1 },
  demo: { fontSize: 11, color: colors.faint, marginTop: 10 },
});
