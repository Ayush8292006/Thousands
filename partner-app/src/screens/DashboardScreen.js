import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Panel, StatusBadge } from '../components/kit';
import ProductImage from '../components/ProductImage';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { weeklySales } from '../data/seed';
import { formatPrice, formatDate } from '../utils/format';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { kyc, stats, orders, productById, vacation, setVacation, unread, returns, products } = useSeller();
  const pendingReturns = returns.filter((r) => ['requested', 'received'].includes(r.status)).length;
  const sold = products.reduce((s, p) => s + p.sold, 0);
  const tier = sold >= 1000 ? 'Platinum' : sold >= 200 ? 'Gold' : sold >= 50 ? 'Silver' : 'Bronze';
  const max = Math.max(...weeklySales);
  const weekTotal = weeklySales.reduce((a, b) => a + b, 0);
  const recent = orders.filter((o) => o.status === 'new').slice(0, 3);
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const actions = [
    stats.newOrders && { icon: 'receipt-outline', color: colors.accent, text: `${stats.newOrders} new orders waiting to be accepted`, go: () => navigation.navigate('Orders', { tab: 'new' }) },
    stats.lowStock && { icon: 'alert-circle-outline', color: '#E67E00', text: `${stats.lowStock} products are low on stock`, go: () => navigation.navigate('Products', { tab: 'low' }) },
    pendingReturns && { icon: 'return-down-back-outline', color: '#B45309', text: `${pendingReturns} return requests need your action`, go: () => navigation.navigate('Returns') },
    stats.outOfStock && { icon: 'close-circle-outline', color: colors.sale, text: `${stats.outOfStock} product is out of stock and hidden from buyers`, go: () => navigation.navigate('Products', { tab: 'out' }) },
  ].filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={[colors.accentDark, colors.accent]} style={[styles.hero, { paddingTop: insets.top + 12 }]}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greet}>{greet},</Text>
              <Text style={styles.store} numberOfLines={1}>{kyc.business.storeName}</Text>
              <Pressable onPress={() => navigation.navigate('Health')} style={styles.tier}>
                <Ionicons name="trophy" size={11} color={colors.black} />
                <Text style={styles.tierText}>{tier} seller</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => navigation.navigate('Notifications')} style={styles.bell} hitSlop={8} accessibilityLabel="Notifications">
              <Ionicons name="notifications-outline" size={24} color={colors.white} />
              {unread ? <View style={styles.bellBadge}><Text style={styles.bellText}>{unread}</Text></View> : null}
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Account')} style={styles.avatar}>
              <Text style={styles.avatarText}>{kyc.business.storeName[0]}</Text>
            </Pressable>
          </View>
          <View style={styles.liveRow}>
            <View style={[styles.liveDot, vacation && { backgroundColor: colors.yellow }]} />
            <Text style={styles.liveText}>{vacation ? 'Store paused — on vacation' : 'Store is live'}</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.liveText}>Vacation mode</Text>
            <Switch value={vacation} onValueChange={setVacation} trackColor={{ true: colors.yellow, false: 'rgba(255,255,255,0.35)' }} thumbColor={colors.white} style={{ marginLeft: 6 }} />
          </View>

          <View style={styles.kpis}>
            <Kpi label="Today's sales" value={formatPrice(stats.salesToday)} icon="trending-up" />
            <Kpi label="Orders today" value={String(stats.ordersToday)} icon="bag-handle" />
            <Kpi label="To ship" value={String(stats.pendingShip)} icon="cube" />
            <Kpi label="Rating" value={`${stats.rating} ★`} icon="star" />
          </View>
        </LinearGradient>

        {/* Payout card */}
        <Pressable style={styles.payout} onPress={() => navigation.navigate('Payments')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.payoutLabel}>Next payout · {formatDate(stats.nextPayout)}</Text>
            <Text style={styles.payoutValue}>{formatPrice(stats.wallet)}</Text>
            <Text style={styles.payoutSub}>+ {formatPrice(stats.inTransit)} from orders in transit</Text>
          </View>
          <View style={styles.payoutBtn}><Ionicons name="chevron-forward" size={18} color={colors.white} /></View>
        </Pressable>

        {/* Action items */}
        {actions.length ? (
          <Panel title="Needs your attention">
            {actions.map((a, i) => (
              <Pressable key={i} style={[styles.action, i === actions.length - 1 && { borderBottomWidth: 0 }]} onPress={a.go}>
                <Ionicons name={a.icon} size={20} color={a.color} />
                <Text style={styles.actionText}>{a.text}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.faint} />
              </Pressable>
            ))}
          </Panel>
        ) : null}

        {/* Grow your business — Flipkart-style pastel tiles */}
        <Panel title="Grow your business" action="See all" onAction={() => navigation.navigate('More')}>
          <View style={styles.grow}>
            {[
              ['pricetag', 'Promotions', 'Join sale events', '#FFF4E0', '#E67E00', 'Promotions'],
              ['megaphone', 'Ads', 'Get seen first', '#F1EBFF', '#7C3AED', 'Ads'],
              ['analytics', 'Insights', 'Views & conversion', '#E9F8EF', '#0F9D58', 'Insights'],
              ['search', 'Catalog', 'Sell existing items', '#E8F0FF', '#2B50E0', 'Catalog'],
            ].map(([ic, t, s, bg, fg, go]) => (
              <Pressable key={t} style={[styles.growTile, { backgroundColor: bg }]} onPress={() => navigation.navigate(go)}>
                <Ionicons name={ic} size={22} color={fg} />
                <Text style={styles.growT}>{t}</Text>
                <Text style={styles.growS}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </Panel>

        {/* Sales chart */}
        <Panel title="Sales — last 7 days" action={formatPrice(weekTotal)}>
          <View style={styles.chart}>
            {weeklySales.map((v, i) => {
              const today = i === weeklySales.length - 1;
              return (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.barVal}>{Math.round(v / 1000)}k</Text>
                  <View style={[styles.bar, { height: Math.max(8, (v / max) * 110) }, today && { backgroundColor: colors.accent }]} />
                  <Text style={[styles.barDay, today && { color: colors.accent, fontWeight: '700' }]}>{DAYS[(new Date().getDay() + 6 + i - 6 + 7) % 7]}</Text>
                </View>
              );
            })}
          </View>
        </Panel>

        {/* Quick actions */}
        <Panel title="Quick actions">
          <View style={styles.quick}>
            {[
              ['add-circle-outline', 'Add product', () => navigation.navigate('ProductForm')],
              ['receipt-outline', 'Orders', () => navigation.navigate('Orders')],
              ['return-down-back-outline', 'Returns', () => navigation.navigate('Returns')],
              ['pricetags-outline', 'Fee calculator', () => navigation.navigate('FeeCalculator')],
            ].map(([ic, t, go]) => (
              <Pressable key={t} style={styles.quickItem} onPress={go}>
                <View style={styles.quickIcon}><Ionicons name={ic} size={22} color={colors.accent} /></View>
                <Text style={styles.quickText}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </Panel>

        {/* New orders preview */}
        {recent.length ? (
          <Panel title="New orders" action="View all" onAction={() => navigation.navigate('Orders', { tab: 'new' })}>
            {recent.map((o) => {
              const p = productById(o.productId);
              return (
                <Pressable key={o.id} style={styles.orderRow} onPress={() => navigation.navigate('OrderDetail', { id: o.id })}>
                  <View style={{ width: 48 }}><ProductImage product={p} size={48} rounded={8} /></View>
                  <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text style={styles.orderTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.orderMeta}>{o.buyer} · {o.city} · Qty {o.qty}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.orderPrice}>{formatPrice(p.price * o.qty)}</Text>
                    <StatusBadge status={o.status} />
                  </View>
                </Pressable>
              );
            })}
          </Panel>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Kpi({ label, value, icon }) {
  return (
    <View style={styles.kpi}>
      <Ionicons name={icon} size={16} color={colors.yellow} />
      <Text style={styles.kpiValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 16, paddingBottom: 18 },
  heroTop: { flexDirection: 'row', alignItems: 'center' },
  greet: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  store: { fontFamily: fonts.display, color: colors.white, fontSize: 22, marginTop: 1 },
  bell: { marginRight: 14 },
  bellBadge: { position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  bellText: { fontSize: 9, fontWeight: '800', color: colors.black },
  tier: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: colors.yellow, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  tierText: { fontSize: 10, fontWeight: '800', color: colors.black },
  grow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  growTile: { width: '48.5%', flexGrow: 1, borderRadius: 12, padding: 12 },
  growT: { fontFamily: fonts.display, fontSize: 14, color: colors.black, marginTop: 6 },
  growS: { fontSize: 11, color: colors.muted, marginTop: 1 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 18, color: colors.accent },
  liveRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80', marginRight: 6 },
  liveText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  kpis: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 10 },
  kpi: { width: '47.5%', flexGrow: 1, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 12, padding: 12 },
  kpiValue: { fontFamily: fonts.display, color: colors.white, fontSize: 20, marginTop: 6 },
  kpiLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1 },

  payout: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 12, marginTop: -2, borderRadius: 14, padding: 16, borderLeftWidth: 4, borderLeftColor: colors.success },
  payoutLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  payoutValue: { fontFamily: fonts.display, fontSize: 24, color: colors.black, marginTop: 2 },
  payoutSub: { fontSize: 12, color: colors.success, marginTop: 2, fontWeight: '600' },
  payoutBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },

  action: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  actionText: { flex: 1, marginHorizontal: 10, fontSize: 13, color: colors.ink, fontWeight: '500' },

  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150, paddingTop: 10 },
  barCol: { alignItems: 'center', flex: 1 },
  barVal: { fontSize: 10, color: colors.muted, marginBottom: 4 },
  bar: { width: 22, borderRadius: 6, backgroundColor: '#C9D5FA' },
  barDay: { fontSize: 11, color: colors.muted, marginTop: 6 },

  quick: { flexDirection: 'row', justifyContent: 'space-between' },
  quickItem: { alignItems: 'center', flex: 1 },
  quickIcon: { width: 50, height: 50, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  quickText: { fontSize: 11, color: colors.ink, marginTop: 6, fontWeight: '600', textAlign: 'center' },

  orderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  orderTitle: { fontSize: 13, fontWeight: '600', color: colors.black },
  orderMeta: { fontSize: 11, color: colors.muted, marginTop: 2 },
  orderPrice: { fontFamily: fonts.display, fontSize: 14, color: colors.black, marginBottom: 4 },
});
