import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui';
import { colors } from '../theme';
import { formatMoney, formatDate } from '../utils/format';
import { region } from '../config/tax';
import { BRAND, SUPPORT } from '../config/app';
import { shareText } from '../utils/platform';

// Invoice layout generic hai: tax ka naam, Tax ID label aur split (CGST/SGST/IGST
// ya VAT) sab config/tax.js se aata hai. Real PDF backend / expo-print se banega.
export default function InvoiceScreen({ route }) {
  const { orders } = useApp();
  const o = orders.find((x) => x.id === route.params.id);
  if (!o) return null;

  // seller-wise group (marketplace: har seller ka alag invoice)
  const bySeller = o.items.reduce((acc, i) => {
    (acc[i.product.sellerId] = acc[i.product.sellerId] || []).push(i);
    return acc;
  }, {});

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 12, paddingBottom: 30 }}>
      {Object.entries(bySeller).map(([sid, items], idx) => {
        const seller = items[0].product;
        const taxable = items.reduce((s, i) => s + i.taxable, 0);
        const total = items.reduce((s, i) => s + i.amount, 0);
        const parts = {};
        items.forEach((i) => i.parts.forEach((p) => {
          const k = `${p.label} @${p.rate}%`;
          parts[k] = (parts[k] || 0) + p.amount;
        }));
        return (
          <View key={sid} style={styles.paper}>
            <View style={styles.top}>
              <View style={styles.logoBox}>
                <Image source={require('../../assets/logo-white.png')} style={{ width: 22, height: 24 }} resizeMode="contain" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.brand}>{BRAND.name.toUpperCase()}</Text>
                <Text style={styles.small}>Marketplace facilitator</Text>
              </View>
              <Text style={styles.docTitle}>TAX INVOICE</Text>
            </View>

            <View style={styles.metaRow}>
              <Meta k="Invoice No." v={`${o.invoiceNo}-${idx + 1}`} />
              <Meta k="Order ID" v={o.id} />
              <Meta k="Date" v={formatDate(o.placedAt)} />
            </View>

            <View style={styles.parties}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.label}>SOLD BY</Text>
                <Text style={styles.bold}>{seller.sellerName}</Text>
                <Text style={styles.small}>{seller.sellerState}, {region.country}</Text>
                <Text style={styles.small}>{region.taxIdLabel}: 07ABCDE1234F1Z{idx + 1}</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 8 }}>
                <Text style={styles.label}>BILL / SHIP TO</Text>
                <Text style={styles.bold}>{o.address.name}</Text>
                <Text style={styles.small}>{o.address.house}, {o.address.area}</Text>
                <Text style={styles.small}>{o.address.city}, {o.address.state} {o.address.pincode}</Text>
              </View>
            </View>

            <View style={styles.thead}>
              <Text style={[styles.th, { flex: 2.4 }]}>Item</Text>
              <Text style={[styles.th, styles.r, { flex: 0.6 }]}>Qty</Text>
              <Text style={[styles.th, styles.r, { flex: 1.3 }]}>Taxable</Text>
              <Text style={[styles.th, styles.r, { flex: 1.1 }]}>{region.taxName}</Text>
              <Text style={[styles.th, styles.r, { flex: 1.3 }]}>Total</Text>
            </View>
            {items.map((i) => (
              <View key={i.key} style={styles.tr}>
                <View style={{ flex: 2.4 }}>
                  <Text style={styles.td} numberOfLines={2}>{i.product.title}</Text>
                  <Text style={styles.tiny}>{region.taxName} {i.rate}%{i.variant ? ` · ${i.variant}` : ''}</Text>
                </View>
                <Text style={[styles.td, styles.r, { flex: 0.6 }]}>{i.qty}</Text>
                <Text style={[styles.td, styles.r, { flex: 1.3 }]}>{formatMoney(i.taxable)}</Text>
                <Text style={[styles.td, styles.r, { flex: 1.1 }]}>{formatMoney(i.tax)}</Text>
                <Text style={[styles.td, styles.r, { flex: 1.3, fontWeight: '700' }]}>{formatMoney(i.amount)}</Text>
              </View>
            ))}

            <View style={styles.sum}>
              <SumRow k="Taxable value" v={formatMoney(taxable)} />
              {Object.entries(parts).map(([k, v]) => <SumRow key={k} k={k} v={formatMoney(v)} />)}
              <View style={styles.grand}>
                <Text style={styles.grandText}>Grand Total</Text>
                <Text style={styles.grandText}>{formatMoney(total)}</Text>
              </View>
            </View>

            <Text style={styles.foot}>
              This is a computer-generated invoice and does not require a signature. Questions? {SUPPORT.customerEmail}, {SUPPORT.phoneDisplay}
            </Text>
          </View>
        );
      })}
      {o.totals.deliveryFee ? (
        <Text style={[styles.small, { textAlign: 'center', marginBottom: 10 }]}>
          Delivery charge {formatMoney(o.totals.deliveryFee)} is billed separately.
        </Text>
      ) : null}
      <Button
        title="Share / Download PDF"
        icon="download-outline"
        onPress={() => shareText(`Thousands invoice ${o.invoiceNo} for order ${o.id}`)}
      />
    </ScrollView>
  );
}

function Meta({ k, v }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{k}</Text>
      <Text style={[styles.bold, { fontSize: 12 }]}>{v}</Text>
    </View>
  );
}
function SumRow({ k, v }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
      <Text style={styles.small}>{k}</Text>
      <Text style={[styles.small, { color: colors.ink }]}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  top: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: colors.black, paddingBottom: 12 },
  logoBox: { width: 38, height: 38, borderRadius: 8, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  brand: { fontWeight: '900', letterSpacing: 3, fontSize: 15 },
  docTitle: { fontWeight: '900', fontSize: 13, letterSpacing: 1 },
  metaRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  parties: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 9, fontWeight: '800', color: colors.muted, letterSpacing: 0.8, marginBottom: 3 },
  bold: { fontWeight: '700', fontSize: 13, color: colors.black },
  small: { fontSize: 11, color: colors.muted, lineHeight: 16 },
  tiny: { fontSize: 9, color: colors.faint, marginTop: 2 },
  thead: { flexDirection: 'row', backgroundColor: colors.black, paddingVertical: 7, paddingHorizontal: 6, marginTop: 12, borderRadius: 12 },
  th: { color: colors.white, fontSize: 10, fontWeight: '800' },
  r: { textAlign: 'right' },
  tr: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'flex-start' },
  td: { fontSize: 11, color: colors.ink },
  sum: { marginTop: 10, marginLeft: '35%' },
  grand: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 2, borderTopColor: colors.black, marginTop: 6, paddingTop: 6 },
  grandText: { fontWeight: '900', fontSize: 14 },
  foot: { fontSize: 9, color: colors.faint, marginTop: 14, textAlign: 'center' },
});
