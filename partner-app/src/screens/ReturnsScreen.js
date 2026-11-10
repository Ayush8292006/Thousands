import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, SegmentTabs } from '../components/kit';
import ProductImage from '../components/ProductImage';
import { EmptyState } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { RETURN_REASONS, RETURN_STATUS } from '../data/hub';
import { formatPrice, formatDate } from '../utils/format';
import { confirmAction, notify } from '../utils/platform';

const TABS = [
  { id: 'action', label: 'Needs action', match: ['requested', 'received'] },
  { id: 'transit', label: 'In transit', match: ['in_transit'] },
  { id: 'claims', label: 'Claims', match: ['claim_raised'] },
  { id: 'closed', label: 'Closed', match: ['completed', 'rejected'] },
];

export default function ReturnsScreen() {
  const { returns, updateReturn, productById } = useSeller();
  const [tab, setTab] = useState('action');
  const cur = TABS.find((t) => t.id === tab);
  const list = returns.filter((r) => cur.match.includes(r.status));
  const tabs = TABS.map((t) => ({ ...t, count: returns.filter((r) => t.match.includes(r.status)).length }));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Returns & claims" subtitle={`${tabs[0].count} need your action`} />
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SegmentTabs tabs={tabs} value={tab} onChange={setTab} />
        </ScrollView>
      </View>
      <View style={styles.spf}>
        <Ionicons name="shield-checkmark" size={18} color={colors.success} />
        <Text style={styles.spfText}>Seller Protection: raise a claim within 48 hours if a returned item is damaged, used or wrong.</Text>
      </View>
      <FlatList
        data={list}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
        ListEmptyComponent={<EmptyState icon="return-down-back-outline" title="Nothing here" subtitle="Return requests from buyers will appear here." />}
        renderItem={({ item: r }) => {
          const p = productById(r.productId);
          const st = RETURN_STATUS[r.status];
          return (
            <View style={styles.card}>
              <View style={styles.head}>
                <Text style={styles.id}>{r.id} · {r.type}</Text>
                <View style={[styles.badge, { backgroundColor: st.bg }]}><Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text></View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ width: 56 }}>{p ? <ProductImage product={p} size={56} rounded={8} /> : null}</View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.title} numberOfLines={1}>{p?.title}</Text>
                  <Text style={styles.meta}>Order #{r.orderId} · {r.buyer}, {r.city}</Text>
                  <Text style={styles.meta}>Requested {formatDate(r.requestedAt)} · Refund {formatPrice(r.refund)}</Text>
                </View>
              </View>
              <View style={styles.reason}>
                <Text style={styles.reasonTitle}>{RETURN_REASONS[r.reason]}</Text>
                {r.comment ? <Text style={styles.reasonText}>“{r.comment}”</Text> : null}
              </View>
              {r.claimId ? <Text style={styles.claim}>Claim {r.claimId} under review — usually resolved in 3–5 days</Text> : null}

              {r.status === 'requested' ? (
                <View style={styles.actions}>
                  <Pressable style={[styles.btn, styles.btnOutline]} onPress={() => confirmAction('Reject return?', 'Only reject if the request breaks the return policy.', 'Reject', () => updateReturn(r.id, { status: 'rejected' }))}>
                    <Text style={[styles.btnText, { color: colors.sale }]}>Reject</Text>
                  </Pressable>
                  <Pressable style={styles.btn} onPress={() => updateReturn(r.id, { status: 'in_transit' })}>
                    <Text style={styles.btnText}>Approve & schedule pickup</Text>
                  </Pressable>
                </View>
              ) : null}
              {r.status === 'received' ? (
                <View style={styles.actions}>
                  <Pressable style={[styles.btn, styles.btnOutline]} onPress={() => { updateReturn(r.id, { status: 'claim_raised', claimId: 'SPF-' + Date.now().toString().slice(-5) }); notify('Claim raised', 'Upload photos of the item from the claim page. Our team will review it within 3–5 days.'); }}>
                    <Text style={[styles.btnText, { color: colors.accent }]}>Raise claim</Text>
                  </Pressable>
                  <Pressable style={styles.btn} onPress={() => updateReturn(r.id, { status: 'completed' })}>
                    <Text style={styles.btnText}>Item is fine — close</Text>
                  </Pressable>
                </View>
              ) : null}
              {r.status === 'in_transit' ? (
                <Pressable style={[styles.btn, { marginTop: 12 }]} onPress={() => updateReturn(r.id, { status: 'received' })}>
                  <Text style={styles.btnText}>Mark as received (demo)</Text>
                </Pressable>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  spf: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successSoft, marginHorizontal: 12, borderRadius: 10, padding: 10 },
  spfText: { flex: 1, marginLeft: 8, fontSize: 12, color: colors.ink, lineHeight: 17 },
  card: { backgroundColor: colors.white, borderRadius: 14, padding: 12, marginBottom: 10 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: 12, fontWeight: '700', color: colors.muted },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  title: { fontSize: 13, fontWeight: '600', color: colors.black },
  meta: { fontSize: 11, color: colors.muted, marginTop: 3 },
  reason: { backgroundColor: colors.mist, borderRadius: 8, padding: 10, marginTop: 10 },
  reasonTitle: { fontSize: 13, fontWeight: '700', color: colors.ink },
  reasonText: { fontSize: 12, color: colors.muted, marginTop: 3, fontStyle: 'italic' },
  claim: { fontSize: 12, color: '#7C3AED', marginTop: 8, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btn: { flex: 1, backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, flex: 0.7 },
  btnText: { color: colors.white, fontFamily: fonts.display, fontSize: 12 },
});
