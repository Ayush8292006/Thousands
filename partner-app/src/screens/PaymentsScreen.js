import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../components/Flat';
import { TopBar, Panel, SegmentTabs, StatusBadge } from '../components/kit';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { formatMoney, formatDate } from '../utils/format';
import { COMMISSION } from '../config/commission';

export default function PaymentsScreen({ navigation }) {
  const { stats, payouts, orders, orderSettlement, productById, kyc } = useSeller();
  const [tab, setTab] = useState('upcoming');

  const delivered = orders.filter((o) => o.status === 'delivered');
  const transit = orders.filter((o) => ['accepted', 'packed', 'ready', 'shipped'].includes(o.status));
  const totalPaid = payouts.reduce((s, p) => s + p.amount, 0);

  const OrderLine = ({ o }) => {
    const st = orderSettlement(o);
    const p = productById(o.productId);
    return (
      <Pressable style={styles.line} onPress={() => navigation.navigate('OrderDetail', { id: o.id })}>
        <View style={{ flex: 1 }}>
          <Text style={styles.lineTitle} numberOfLines={1}>{p.title}</Text>
          <Text style={styles.lineMeta}>#{o.id} · Sale {formatMoney(st.sale)} · Fees {formatMoney(st.totalFees)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.lineNet}>{formatMoney(st.net)}</Text>
          <StatusBadge status={o.status} />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title="Payments" subtitle={`Payouts to ${kyc.bank.bankName || 'your bank'} ••${kyc.bank.account.slice(-4)}`} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={['#0F9D58', '#0B7A44']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wallet}>
          <Text style={styles.wLabel}>Next payout on {formatDate(stats.nextPayout)}</Text>
          <Text style={styles.wValue}>{formatMoney(stats.wallet)}</Text>
          <View style={styles.wRow}>
            <View style={styles.wStat}>
              <Text style={styles.wStatLabel}>In transit</Text>
              <Text style={styles.wStatValue}>{formatMoney(stats.inTransit)}</Text>
            </View>
            <View style={styles.wSep} />
            <View style={styles.wStat}>
              <Text style={styles.wStatLabel}>Paid (last 3)</Text>
              <Text style={styles.wStatValue}>{formatMoney(totalPaid)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.info}>
          <Ionicons name="calendar-outline" size={16} color={colors.accent} />
          <Text style={styles.infoText}>Payouts are sent every Friday for orders delivered {COMMISSION.payoutCycleDays}+ days ago.</Text>
        </View>

        <SegmentTabs
          tabs={[
            { id: 'upcoming', label: 'Upcoming', count: delivered.length },
            { id: 'transit', label: 'In transit', count: transit.length },
            { id: 'history', label: 'Payout history', count: payouts.length },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === 'upcoming' ? (
          <Panel title="Settled to wallet" style={{ marginTop: 0 }}>
            {delivered.length ? delivered.map((o) => <OrderLine key={o.id} o={o} />) : <Text style={styles.empty}>No delivered orders waiting for payout.</Text>}
          </Panel>
        ) : null}
        {tab === 'transit' ? (
          <Panel title="Will be settled after delivery" style={{ marginTop: 0 }}>
            {transit.length ? transit.map((o) => <OrderLine key={o.id} o={o} />) : <Text style={styles.empty}>No orders in transit.</Text>}
          </Panel>
        ) : null}
        {tab === 'history' ? (
          <Panel title="Payout history" style={{ marginTop: 0 }}>
            {payouts.map((p) => (
              <View key={p.id} style={styles.line}>
                <View style={styles.payIcon}><Ionicons name="checkmark-done" size={18} color={colors.success} /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.lineTitle}>{formatDate(p.date)} · {p.orders} orders</Text>
                  <Text style={styles.lineMeta}>{p.id} · UTR {p.utr}</Text>
                </View>
                <Text style={styles.lineNet}>{formatMoney(p.amount)}</Text>
              </View>
            ))}
          </Panel>
        ) : null}

        <Pressable style={styles.calc} onPress={() => navigation.navigate('FeeCalculator')}>
          <Ionicons name="calculator-outline" size={22} color={colors.accent} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.lineTitle}>Fee calculator</Text>
            <Text style={styles.lineMeta}>See your earnings before you list a product</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.faint} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wallet: { margin: 12, borderRadius: 4, padding: 18 },
  wLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600' },
  wValue: { fontWeight: '700', color: colors.white, fontSize: 30, marginTop: 4 },
  wRow: { flexDirection: 'row', marginTop: 14, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 4, padding: 10 },
  wStat: { flex: 1 },
  wSep: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 10 },
  wStatLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  wStatValue: { color: colors.white, fontWeight: '700', fontSize: 15, marginTop: 2 },
  info: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, backgroundColor: colors.accentSoft, borderRadius: 4, padding: 10 },
  infoText: { flex: 1, marginLeft: 8, fontSize: 12, color: colors.ink },
  line: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  lineTitle: { fontSize: 13, fontWeight: '600', color: colors.black },
  lineMeta: { fontSize: 11, color: colors.muted, marginTop: 2 },
  lineNet: { fontWeight: '700', fontSize: 14, color: colors.success, marginBottom: 4 },
  payIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 13, color: colors.muted, paddingVertical: 10 },
  calc: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 12, marginTop: 12, borderRadius: 4, padding: 14 },
});
