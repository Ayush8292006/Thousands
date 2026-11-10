import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, SegmentTabs, StatusBadge } from '../components/kit';
import ProductImage from '../components/ProductImage';
import { EmptyState } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller, NEXT_ACTION } from '../context/SellerContext';
import { formatPrice, formatDate } from '../utils/format';

const TABS = [
  { id: 'new', label: 'New', match: ['new'] },
  { id: 'toship', label: 'To ship', match: ['accepted', 'packed', 'ready'] },
  { id: 'shipped', label: 'Shipped', match: ['shipped'] },
  { id: 'delivered', label: 'Delivered', match: ['delivered'] },
  { id: 'returns', label: 'Returns & cancelled', match: ['returned', 'cancelled'] },
];

export default function OrdersScreen({ navigation, route }) {
  const { orders, productById, advanceOrder } = useSeller();
  const [tab, setTab] = useState(route.params?.tab || 'new');

  useEffect(() => {
    if (route.params?.tab) setTab(route.params.tab);
  }, [route.params?.tab]);

  const cur = TABS.find((t) => t.id === tab);
  const list = orders.filter((o) => cur.match.includes(o.status));
  const tabs = TABS.map((t) => ({ ...t, count: orders.filter((o) => t.match.includes(o.status)).length }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title="Orders" subtitle={`${orders.filter((o) => o.status === 'new').length} new · ${tabs[1].count} to ship`} />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SegmentTabs tabs={tabs} value={tab} onChange={setTab} />
        </ScrollView>
      </View>

      {tab === 'toship' && list.length ? (
        <View style={styles.tip}>
          <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
          <Text style={styles.tipText}>Ship within 24 hours of accepting to keep your seller rating high.</Text>
        </View>
      ) : null}

      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24, flexGrow: 1 }}
        ListEmptyComponent={<EmptyState icon="receipt-outline" title="No orders here" subtitle="New orders will show up here as soon as buyers place them." />}
        renderItem={({ item: o }) => {
          const p = productById(o.productId);
          if (!p) return null;
          return (
            <Pressable style={styles.card} onPress={() => navigation.navigate('OrderDetail', { id: o.id })}>
              <View style={styles.head}>
                <Text style={styles.id}>#{o.id}</Text>
                <StatusBadge status={o.status} />
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ width: 60 }}><ProductImage product={p} size={60} rounded={8} /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.title} numberOfLines={2}>{p.title}</Text>
                  <Text style={styles.meta}>{o.variant ? `${o.variant} · ` : ''}Qty {o.qty} · {o.payment}</Text>
                  <Text style={styles.meta}>{o.buyer}, {o.city} · {formatDate(o.placedAt)}</Text>
                </View>
                <Text style={styles.price}>{formatPrice(p.price * o.qty)}</Text>
              </View>
              {NEXT_ACTION[o.status] && o.status !== 'shipped' ? (
                <Pressable style={styles.cta} onPress={() => advanceOrder(o.id)}>
                  <Text style={styles.ctaText}>{NEXT_ACTION[o.status]}</Text>
                </Pressable>
              ) : null}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tip: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentSoft, marginHorizontal: 12, borderRadius: 10, padding: 10, marginBottom: 8 },
  tipText: { flex: 1, marginLeft: 6, fontSize: 12, color: colors.ink },
  card: { backgroundColor: colors.white, borderRadius: 14, padding: 12, marginBottom: 10 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 12, fontWeight: '700', color: colors.muted },
  title: { fontSize: 13, fontWeight: '600', color: colors.black, lineHeight: 18 },
  meta: { fontSize: 11, color: colors.muted, marginTop: 3 },
  price: { fontFamily: fonts.display, fontSize: 15, color: colors.black, marginLeft: 8 },
  cta: { marginTop: 12, backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  ctaText: { color: colors.white, fontFamily: fonts.display, fontSize: 13 },
});
