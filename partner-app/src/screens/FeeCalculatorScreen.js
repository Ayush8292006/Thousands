import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TopBar, Panel, Field, MoneyRow } from '../components/kit';
import { Chip } from '../components/ui';
import { colors, fonts } from '../theme';
import { categories } from '../data/seed';
import { settlement, COMMISSION } from '../config/commission';
import { formatMoney } from '../utils/format';
import { region } from '../config/tax';

export default function FeeCalculatorScreen() {
  const [price, setPrice] = useState('2999');
  const [qty, setQty] = useState('1');
  const [cat, setCat] = useState('electronics');
  const p = Number(price) || 0;
  const q = Math.max(1, Number(qty) || 1);
  const st = p ? settlement(p, q, cat) : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Fee calculator" subtitle="Know your earnings before you list" />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
        <Panel>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Field style={{ flex: 2 }} label="Selling price" prefix={region.symbol} value={price} onChangeText={(v) => setPrice(v.replace(/\D/g, '').slice(0, 7))} keyboardType="number-pad" />
            <Field style={{ flex: 1 }} label="Quantity" value={qty} onChangeText={(v) => setQty(v.replace(/\D/g, '').slice(0, 3))} keyboardType="number-pad" />
          </View>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {categories.map((c) => <Chip key={c.id} label={`${c.name} · ${COMMISSION.categoryRates[c.id]}%`} active={cat === c.id} onPress={() => setCat(c.id)} />)}
          </View>
        </Panel>

        {st ? (
          <Panel title="Breakdown">
            <MoneyRow label="Sale value" value={formatMoney(st.sale)} />
            <MoneyRow label={`Commission (${st.rate}%)`} value={'− ' + formatMoney(st.commission)} negative />
            <MoneyRow label="Fixed fee" value={'− ' + formatMoney(st.fixed)} negative />
            <MoneyRow label={`Collection fee (${COMMISSION.collectionFeePct}%)`} value={'− ' + formatMoney(st.collection)} negative />
            <MoneyRow label="Shipping fee" value={'− ' + formatMoney(st.shipping)} negative />
            <MoneyRow label={`GST on fees (${COMMISSION.gstOnFeesPct}%)`} value={'− ' + formatMoney(st.gst)} negative />
            <View style={styles.divider} />
            <MoneyRow label="Total fees" value={formatMoney(st.totalFees)} />
            <View style={styles.result}>
              <Text style={styles.resultLabel}>You get</Text>
              <Text style={styles.resultValue}>{formatMoney(st.net)}</Text>
              <Text style={styles.resultPct}>{Math.round(st.netPct)}% of sale value</Text>
            </View>
          </Panel>
        ) : null}

        <Panel title="Fixed fee slabs">
          {COMMISSION.fixedFeeSlabs.map((s, i) => (
            <MoneyRow
              key={i}
              label={s.upto === Infinity ? `Above ${formatMoney(COMMISSION.fixedFeeSlabs[i - 1].upto)}` : `Up to ${formatMoney(s.upto)}`}
              value={`${formatMoney(s.fee)} / unit`}
              muted
            />
          ))}
          <Text style={styles.note}>Rates are for the prototype and will be finalised by Thousands.</Text>
        </Panel>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  result: { backgroundColor: colors.successSoft, borderRadius: 4, padding: 14, marginTop: 10, alignItems: 'center' },
  resultLabel: { fontSize: 12, color: colors.success, fontWeight: '700' },
  resultValue: { fontWeight: '700', fontSize: 28, color: colors.success, marginTop: 2 },
  resultPct: { fontSize: 12, color: colors.ink, marginTop: 2 },
  note: { fontSize: 11, color: colors.faint, marginTop: 8 },
});
