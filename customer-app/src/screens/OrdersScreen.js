import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, ORDER_STEPS } from '../context/AppContext';
import ProductImage from '../components/ProductImage';
import { EmptyState } from '../components/ui';
import { colors } from '../theme';
import { formatDate, formatPrice } from '../utils/format';

export function orderStatus(o) {
  if (o.cancelled) return { label: 'Cancelled', color: colors.danger };
  if (o.stepIndex >= 4) return { label: `Delivered on ${formatDate(o.expectedBy)}`, color: colors.success };
  return { label: `${ORDER_STEPS[o.stepIndex]} · Arriving by ${formatDate(o.expectedBy)}`, color: colors.ink };
}

export default function OrdersScreen({ navigation }) {
  const { orders } = useApp();
  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ paddingVertical: 10, flexGrow: 1 }}
      ListEmptyComponent={<EmptyState icon="cube-outline" title="No orders yet" actionTitle="Start shopping" onAction={() => navigation.navigate('Tabs', { screen: 'Home' })} />}
      renderItem={({ item: o }) => {
        const st = orderStatus(o);
        const first = o.items[0];
        return (
          <Pressable style={styles.card} onPress={() => navigation.navigate('OrderDetail', { id: o.id })}>
            <View style={{ width: 70 }}><ProductImage product={first.product} size={70} rounded={10} /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.dot, { backgroundColor: st.color }]} />
                <Text style={[styles.status, { color: st.color }]} numberOfLines={1}>{st.label}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1}>{first.product.title}</Text>
              <Text style={styles.meta}>
                {o.items.length > 1 ? `+${o.items.length - 1} more item · ` : ''}{formatPrice(o.totals.grandTotal)} · #{o.id}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.faint} />
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: 14, marginBottom: 10 },
  dot: { width: 8, height: 8, borderRadius: 0, marginRight: 6 },
  status: { fontSize: 13, fontWeight: '800', flex: 1 },
  title: { fontSize: 13, color: colors.ink, marginTop: 4 },
  meta: { fontSize: 12, color: colors.muted, marginTop: 3 },
});
