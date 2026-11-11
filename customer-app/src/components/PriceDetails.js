import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Divider } from './ui';
import { colors, font } from '../theme';
import { formatPrice, formatMoney } from '../utils/format';
import { region } from '../config/tax';

export default function PriceDetails({ totals, showTax = true, style }) {
  return (
    <Card style={style}>
      <Text style={[font.h3, { marginBottom: 12, fontSize: 17, color: colors.black }]}>
        Price details
      </Text>
      <Line label={`Price (${totals.count} item${totals.count > 1 ? 's' : ''})`} value={formatPrice(totals.mrpTotal)} />
      <Line label="Discount" value={'− ' + formatPrice(totals.discount)} green />
      <Line
        label="Delivery Charges"
        value={totals.deliveryFee === 0 ? 'FREE' : formatPrice(totals.deliveryFee)}
        green={totals.deliveryFee === 0}
      />
      <Divider style={{ marginVertical: 12 }} />
      <Line label="Total Amount" value={formatPrice(totals.grandTotal)} bold />
      {showTax && totals.taxTotal > 0 ? (
        <View style={styles.taxBox}>
          <Text style={styles.taxHead}>
            {region.priceInclusive ? `Includes ${region.taxName}` : `${region.taxName} added`} · {formatMoney(totals.taxTotal)}
          </Text>
          {totals.taxBreakup.map((t) => (
            <View key={t.label} style={styles.taxRow}>
              <Text style={styles.taxLabel}>{t.label}</Text>
              <Text style={styles.taxLabel}>{formatMoney(t.amount)}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {totals.discount > 0 ? (
        <View style={styles.save}>
          <Text style={styles.saveText}>You will save {formatPrice(totals.discount)} on this order</Text>
        </View>
      ) : null}
    </Card>
  );
}

function Line({ label, value, green, bold }) {
  return (
    <View style={styles.line}>
      <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.label, green && { color: colors.success }, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: colors.ink },
  bold: { fontWeight: '800', fontSize: 16, color: colors.black },
  taxBox: { backgroundColor: colors.bg, borderRadius: 0, padding: 10, marginTop: 4 },
  taxHead: { fontSize: 12, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  taxRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  taxLabel: { fontSize: 12, color: colors.muted },
  save: { backgroundColor: colors.successSoft, borderRadius: 0, padding: 10, marginTop: 12 },
  saveText: { color: colors.success, fontWeight: '700', fontSize: 13 },
});
