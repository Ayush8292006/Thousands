import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar, Panel, MoneyRow, StatusBadge } from '../components/kit';
import ProductImage from '../components/ProductImage';
import { Button } from '../components/ui';
import { colors } from '../theme';
import { useSeller, ORDER_FLOW, ORDER_STATUS, NEXT_ACTION } from '../context/SellerContext';
import { formatMoney, formatDate } from '../utils/format';
import { confirmAction, notify } from '../utils/platform';
import { getTaxRate, calcLineTax, splitTax, region } from '../config/tax';

export default function OrderDetailScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { orders, productById, advanceOrder, cancelOrder, orderSettlement, kyc } = useSeller();
  const o = orders.find((x) => x.id === route.params.id);
  if (!o) return null;
  const p = productById(o.productId);
  const st = orderSettlement(o);
  const rate = getTaxRate(p.category);
  const tax = calcLineTax(st.sale, rate);
  const taxParts = splitTax(tax.tax, rate, kyc.address.state, o.state);
  const stepIdx = ORDER_FLOW.indexOf(o.status);
  const canAct = NEXT_ACTION[o.status];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title={`Order #${o.id}`} subtitle={`Placed ${formatDate(o.placedAt)}`} />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Panel>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 70 }}><ProductImage product={p} size={70} rounded={10} /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title}>{p.title}</Text>
              <Text style={styles.meta}>SKU {p.sku}{o.variant ? ` · ${o.variant}` : ''} · Qty {o.qty}</Text>
              <View style={{ marginTop: 6 }}><StatusBadge status={o.status} /></View>
            </View>
          </View>
        </Panel>

        {stepIdx >= 0 ? (
          <Panel title="Fulfilment">
            <View style={styles.track}>
              {ORDER_FLOW.map((s, i) => (
                <React.Fragment key={s}>
                  <View style={{ alignItems: 'center', width: 52 }}>
                    <View style={[styles.dot, i <= stepIdx && { backgroundColor: colors.success }]}>
                      {i <= stepIdx ? <Ionicons name="checkmark" size={11} color={colors.white} /> : null}
                    </View>
                    <Text style={[styles.dotLabel, i === stepIdx && { color: colors.black, fontWeight: '700' }]} numberOfLines={2}>{ORDER_STATUS[s].label}</Text>
                  </View>
                  {i < ORDER_FLOW.length - 1 ? <View style={[styles.trackLine, i < stepIdx && { backgroundColor: colors.success }]} /> : null}
                </React.Fragment>
              ))}
            </View>
            {o.status === 'ready' || o.status === 'shipped' ? (
              <View style={styles.awb}>
                <Ionicons name="barcode-outline" size={18} color={colors.ink} />
                <Text style={styles.awbText}>AWB 7845 1290 {o.id.slice(-4)} · Ekart Logistics</Text>
              </View>
            ) : null}
          </Panel>
        ) : null}

        <Panel title="Ship to">
          <Text style={styles.addrName}>{o.buyer}</Text>
          <Text style={styles.meta}>{o.city}, {o.state} {o.pincode}</Text>
          <Text style={[styles.meta, { marginTop: 6 }]}>Full address and phone are shown on the shipping label to protect buyer privacy.</Text>
          <View style={styles.payRow}>
            <Ionicons name={o.payment === 'COD' ? 'cash-outline' : 'card-outline'} size={16} color={colors.accent} />
            <Text style={styles.payText}>{o.payment === 'COD' ? 'Cash on delivery — courier collects payment' : 'Prepaid — buyer has already paid'}</Text>
          </View>
        </Panel>

        <Panel title="Your settlement">
          <MoneyRow label={`Sale price (${o.qty} × ${formatMoney(p.price)})`} value={formatMoney(st.sale)} />
          <MoneyRow label={`Commission (${st.rate}%)`} value={'− ' + formatMoney(st.commission)} negative />
          <MoneyRow label="Fixed fee" value={'− ' + formatMoney(st.fixed)} negative />
          <MoneyRow label="Collection fee" value={'− ' + formatMoney(st.collection)} negative />
          <MoneyRow label="Shipping fee" value={'− ' + formatMoney(st.shipping)} negative />
          <MoneyRow label="GST on fees (18%)" value={'− ' + formatMoney(st.gst)} negative />
          <View style={styles.divider} />
          <MoneyRow label={o.status === 'delivered' ? 'Settled to wallet' : 'Expected payout'} value={formatMoney(st.net)} bold />
          <Text style={styles.small}>
            {o.status === 'delivered' ? 'Included in your next weekly payout.' : 'Paid within 7 days after delivery. Cancelled or returned orders are not settled.'}
          </Text>
        </Panel>

        <Panel title="Invoice tax (to buyer)">
          <MoneyRow label="Taxable value" value={formatMoney(tax.taxable)} muted />
          {taxParts.map((t) => <MoneyRow key={t.label} label={`${t.label} @${t.rate}%`} value={formatMoney(t.amount)} muted />)}
          <Text style={styles.small}>{taxParts.length > 1 ? 'Same-state sale: CGST + SGST' : `Inter-state sale: IGST`} · Invoice issued in your name ({region.taxIdLabel} {kyc.tax.taxId})</Text>
        </Panel>

        {o.status === 'ready' ? (
          <View style={{ paddingHorizontal: 12, marginTop: 12 }}>
            <Button title="Download shipping label" variant="outline" icon="download-outline" onPress={() => notify('Shipping label', 'The label PDF will be generated by the backend and courier partner.')} />
          </View>
        ) : null}
      </ScrollView>

      {canAct ? (
        <View style={[styles.bottom, { paddingBottom: insets.bottom + 10 }]}>
          {o.status === 'new' ? (
            <Button title="Reject" variant="outline" style={{ flex: 1 }} onPress={() => confirmAction('Reject order?', 'Frequent rejections can lower your seller rating.', 'Reject', () => cancelOrder(o.id))} />
          ) : null}
          <Button title={NEXT_ACTION[o.status]} style={{ flex: 2 }} onPress={() => advanceOrder(o.id)} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 14, fontWeight: '700', color: colors.black, lineHeight: 19 },
  meta: { fontSize: 12, color: colors.muted, marginTop: 3, lineHeight: 17 },
  track: { flexDirection: 'row', alignItems: 'flex-start' },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  dotLabel: { fontSize: 9, color: colors.muted, marginTop: 4, textAlign: 'center' },
  trackLine: { flex: 1, height: 2, backgroundColor: colors.border, marginTop: 10 },
  awb: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: 8, padding: 10, marginTop: 12 },
  awbText: { marginLeft: 8, fontSize: 12, color: colors.ink, fontWeight: '600' },
  addrName: { fontSize: 14, fontWeight: '700', color: colors.black },
  payRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: 8, padding: 10, marginTop: 10 },
  payText: { marginLeft: 8, fontSize: 12, color: colors.ink, flex: 1 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 6 },
  small: { fontSize: 11, color: colors.muted, marginTop: 6, lineHeight: 16 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, backgroundColor: colors.white, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
});
