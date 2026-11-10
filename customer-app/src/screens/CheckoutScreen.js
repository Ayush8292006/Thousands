import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import PriceDetails from '../components/PriceDetails';
import ProductImage from '../components/ProductImage';
import { Button, EmptyState } from '../components/ui';
import { colors, radius } from '../theme';
import { formatPrice } from '../utils/format';

const METHODS = [
  { id: 'UPI', icon: 'phone-portrait-outline', title: 'UPI', sub: 'GPay, PhonePe, Paytm & more · 10% off' },
  { id: 'Card', icon: 'card-outline', title: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
  { id: 'NetBanking', icon: 'business-outline', title: 'Net Banking', sub: 'All major banks' },
  { id: 'COD', icon: 'cash-outline', title: 'Cash on Delivery', sub: 'Pay when your order arrives' },
];

export default function CheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cart, totals, selectedAddress, placeOrder } = useApp();
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  if (!cart.length) {
    return <EmptyState icon="cart-outline" title="Your cart is empty" actionTitle="Go back" onAction={() => navigation.goBack()} />;
  }

  const pay = async () => {
    setLoading(true);
    // TODO: Razorpay / payment gateway yahan integrate hoga (COD ke alawa)
    const order = await placeOrder(method);
    setLoading(false);
    navigation.replace('OrderSuccess', { orderId: order.id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.steps}>
        {['Address', 'Summary', 'Payment'].map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.step}>
              <View style={[styles.stepDot, i < 2 && { backgroundColor: colors.black }]}>
                {i < 2 ? <Ionicons name="checkmark" size={12} color={colors.white} /> : <Text style={styles.stepNum}>3</Text>}
              </View>
              <Text style={styles.stepText}>{s}</Text>
            </View>
            {i < 2 ? <View style={[styles.stepLine, { backgroundColor: colors.black }]} /> : null}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.block}>
          <View style={styles.blockHead}>
            <Text style={styles.blockTitle}>Deliver to</Text>
            <Pressable onPress={() => navigation.navigate('Addresses', { selectMode: true })}>
              <Text style={styles.link}>Change</Text>
            </Pressable>
          </View>
          <Text style={{ fontWeight: '800' }}>{selectedAddress.name} <Text style={styles.tag}> {selectedAddress.type} </Text></Text>
          <Text style={styles.line}>{selectedAddress.house}, {selectedAddress.area}, {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}</Text>
          <Text style={styles.line}>{selectedAddress.phone}</Text>
        </View>

        <View style={styles.block}>
          <Text style={[styles.blockTitle, { marginBottom: 10 }]}>Order summary ({totals.count})</Text>
          {cart.map((i) => (
            <View key={i.key} style={styles.item}>
              <View style={{ width: 54 }}><ProductImage product={i.product} size={54} rounded={8} /></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text numberOfLines={1} style={{ fontSize: 13 }}>{i.product.title}</Text>
                <Text style={styles.line}>{i.variant ? `${i.variant} · ` : ''}Qty {i.qty}</Text>
              </View>
              <Text style={{ fontWeight: '800' }}>{formatPrice(i.product.price * i.qty)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.block}>
          <Text style={[styles.blockTitle, { marginBottom: 6 }]}>Payment method</Text>
          {METHODS.map((m) => {
            const on = method === m.id;
            return (
              <Pressable key={m.id} style={[styles.method, on && { borderColor: colors.black }]} onPress={() => setMethod(m.id)}>
                <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={20} color={colors.black} />
                <Ionicons name={m.icon} size={20} color={colors.ink} style={{ marginLeft: 12 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontWeight: '700' }}>{m.title}</Text>
                  <Text style={styles.line}>{m.sub}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <PriceDetails totals={totals} style={{ marginTop: 10, borderRadius: 0 }} />
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>Total payable</Text>
          <Text style={{ fontSize: 20, fontWeight: '900' }}>{formatPrice(totals.grandTotal)}</Text>
        </View>
        <Button
          title={method === 'COD' ? 'Place Order' : `Pay ${formatPrice(totals.grandTotal)}`}
          style={{ flex: 1.4 }}
          loading={loading}
          onPress={pay}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  steps: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingVertical: 14, paddingHorizontal: 24 },
  step: { alignItems: 'center' },
  stepDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 11, fontWeight: '800' },
  stepText: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  stepLine: { flex: 1, height: 1.5, marginHorizontal: 6, marginBottom: 16 },
  block: { backgroundColor: colors.white, padding: 16, marginTop: 10 },
  blockHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  blockTitle: { fontSize: 15, fontWeight: '800' },
  link: { color: colors.accent, fontWeight: '800' },
  tag: { fontSize: 10, backgroundColor: colors.soft, color: colors.muted },
  line: { fontSize: 12, color: colors.muted, marginTop: 3, lineHeight: 17 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  method: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: 12, marginTop: 10,
  },
  bottom: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border,
  },
});
