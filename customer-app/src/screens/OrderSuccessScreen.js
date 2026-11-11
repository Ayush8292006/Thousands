import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/ui';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { formatDate, formatPrice } from '../utils/format';

export default function OrderSuccessScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === route.params.orderId);

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.ring}>
          <View style={styles.circle}>
            <Ionicons name="checkmark" size={54} color={colors.white} />
          </View>
        </View>
        <Text style={styles.title}>Order placed!</Text>
        <Text style={styles.sub}>Thank you for shopping with Thousands.</Text>
        {order ? (
          <View style={styles.box}>
            <Row k="Order ID" v={order.id} />
            <Row k="Amount" v={formatPrice(order.totals.grandTotal)} />
            <Row k="Payment" v={order.payment} />
            <Row k="Expected by" v={formatDate(order.expectedBy)} />
          </View>
        ) : null}
      </View>
      <Button title="View order details" disabled={!order} onPress={() => navigation.replace('OrderDetail', { id: order.id })} />
      <Button
        title="Continue shopping"
        variant="outline"
        style={{ marginTop: 10 }}
        onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
      />
    </View>
  );
}

function Row({ k, v }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ color: colors.muted }}>{k}</Text>
      <Text style={{ fontWeight: '700' }}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 24 },
  ring: { width: 130, height: 130, borderRadius: 0, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 96, height: 96, borderRadius: 0, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '900', marginTop: 24 },
  sub: { color: colors.muted, marginTop: 6 },
  box: { alignSelf: 'stretch', backgroundColor: colors.bg, borderRadius: 0, padding: 16, marginTop: 28 },
});
