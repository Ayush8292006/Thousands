import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, ORDER_STEPS } from '../context/AppContext';
import ProductImage from '../components/ProductImage';
import PriceDetails from '../components/PriceDetails';
import { Button } from '../components/ui';
import { colors } from '../theme';
import { formatDate, formatPrice, addDays } from '../utils/format';
import { confirmAction } from '../utils/platform';

export default function OrderDetailScreen({ route, navigation }) {
  const { orders, cancelOrder } = useApp();
  const o = orders.find((x) => x.id === route.params.id);
  if (!o) return null;
  const canCancel = !o.cancelled && o.stepIndex < 2;

  const onCancel = () =>
    confirmAction('Cancel order?', 'Are you sure you want to cancel this order?', 'Yes, cancel', () => cancelOrder(o.id));

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.block}>
        <Text style={styles.meta}>Order ID · {o.id}</Text>
        <Text style={styles.meta}>Placed on {formatDate(o.placedAt)} · Paid via {o.payment}</Text>
      </View>

      {o.items.map((i) => (
        <Pressable key={i.key} style={styles.item} onPress={() => navigation.navigate('ProductDetail', { id: i.product.id })}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 14 }} numberOfLines={2}>{i.product.title}</Text>
            <Text style={styles.meta}>{i.variant ? `${i.variant} · ` : ''}Qty {i.qty} · Seller: {i.product.sellerName}</Text>
            <Text style={{ fontWeight: '900', fontSize: 16, marginTop: 6 }}>{formatPrice(i.amount)}</Text>
          </View>
          <View style={{ width: 70 }}><ProductImage product={i.product} size={70} rounded={10} /></View>
        </Pressable>
      ))}

      {/* Tracking */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Order tracking</Text>
        {o.cancelled ? (
          <View style={styles.cancelBox}>
            <Ionicons name="close-circle" size={18} color={colors.danger} />
            <Text style={{ marginLeft: 8, color: colors.danger, fontWeight: '700' }}>This order was cancelled. Your refund will arrive in 5–7 days.</Text>
          </View>
        ) : (
          ORDER_STEPS.map((s, idx) => {
            const done = idx <= o.stepIndex;
            const last = idx === ORDER_STEPS.length - 1;
            return (
              <View key={s} style={{ flexDirection: 'row' }}>
                <View style={{ alignItems: 'center', width: 22 }}>
                  <View style={[styles.tDot, done && styles.tDotOn]}>
                    {done ? <Ionicons name="checkmark" size={11} color={colors.white} /> : null}
                  </View>
                  {!last ? <View style={[styles.tLine, idx < o.stepIndex && { backgroundColor: colors.success }]} /> : null}
                </View>
                <View style={{ marginLeft: 12, paddingBottom: last ? 0 : 18 }}>
                  <Text style={[styles.tText, done && { color: colors.black, fontWeight: '800' }]}>{s}</Text>
                  {done ? (
                    <Text style={styles.meta}>{formatDate(addDays(Math.min(idx, 4), new Date(o.placedAt)))}</Text>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Shipping address</Text>
        <Text style={{ fontWeight: '700' }}>{o.address.name}</Text>
        <Text style={styles.meta}>{o.address.house}, {o.address.area}, {o.address.city}, {o.address.state} — {o.address.pincode}</Text>
        <Text style={styles.meta}>{o.address.phone}</Text>
      </View>

      <PriceDetails totals={o.totals} style={{ marginTop: 10, borderRadius: 0 }} />

      <View style={{ padding: 16, gap: 10 }}>
        <Button title="Download Invoice" icon="document-text-outline" onPress={() => navigation.navigate('Invoice', { id: o.id })} />
        {canCancel ? <Button title="Cancel order" variant="outline" onPress={onCancel} /> : null}
        <Button title="Need help with this order?" variant="outline" icon="headset-outline" onPress={() => navigation.navigate('Support')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: colors.white, padding: 16, marginTop: 10 },
  blockTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12 },
  meta: { fontSize: 12, color: colors.muted, marginTop: 3, lineHeight: 17 },
  item: { flexDirection: 'row', backgroundColor: colors.white, padding: 16, marginTop: 1 },
  tDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  tDotOn: { backgroundColor: colors.success, borderColor: colors.success },
  tLine: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  tText: { fontSize: 14, color: colors.faint },
  cancelBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDECEC', padding: 12, borderRadius: 8 },
});
