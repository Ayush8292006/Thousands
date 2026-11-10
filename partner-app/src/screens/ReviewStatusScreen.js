import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, Panel, MoneyRow } from '../components/kit';
import { Button } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { SUPPORT } from '../config/app';
import { categories } from '../data/seed';

export default function ReviewStatusScreen() {
  const { kyc, approveKyc, logout } = useSeller();
  const steps = [
    { t: 'Application submitted', s: 'We have received your details', done: true },
    { t: 'Verification in progress', s: 'Usually takes 1–2 business days', active: true },
    { t: 'Store goes live', s: 'Start listing products and receiving orders' },
  ];
  const cat = categories.find((c) => c.id === kyc.business.category)?.name;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title="Application status" subtitle={kyc.business.storeName} />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.hero}>
          <View style={styles.ring}><Ionicons name="hourglass-outline" size={38} color={colors.accent} /></View>
          <Text style={styles.title}>Your application is under review</Text>
          <Text style={styles.sub}>We will notify you by SMS and email as soon as your store is approved.</Text>
          <Text style={styles.appId}>Application ID: TPA-{(kyc.tax.pan || 'XXXX').slice(-4)}-2611</Text>
        </View>

        <Panel title="Progress">
          {steps.map((st, i) => (
            <View key={st.t} style={{ flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', width: 26 }}>
                <View style={[styles.dot, st.done && { backgroundColor: colors.success }, st.active && { backgroundColor: colors.accent }]}>
                  <Ionicons name={st.done ? 'checkmark' : st.active ? 'time' : 'ellipse-outline'} size={12} color={st.done || st.active ? colors.white : colors.faint} />
                </View>
                {i < steps.length - 1 ? <View style={styles.line} /> : null}
              </View>
              <View style={{ marginLeft: 10, paddingBottom: 16, flex: 1 }}>
                <Text style={[styles.stepT, !st.done && !st.active && { color: colors.muted }]}>{st.t}</Text>
                <Text style={styles.stepS}>{st.s}</Text>
              </View>
            </View>
          ))}
        </Panel>

        <Panel title="Submitted details">
          <MoneyRow label="Store" value={kyc.business.storeName} />
          <MoneyRow label="Business type" value={kyc.business.type} />
          <MoneyRow label="Category" value={cat || '-'} />
          <MoneyRow label="GSTIN" value={kyc.tax.taxId} />
          <MoneyRow label="Bank" value={`${kyc.bank.bankName || 'Bank'} ••${kyc.bank.account.slice(-4)}`} />
          <MoneyRow label="Pickup" value={`${kyc.address.city}, ${kyc.address.pincode}`} />
        </Panel>

        <View style={{ padding: 16, gap: 10 }}>
          <Button title="Approve now (demo)" icon="checkmark-circle-outline" onPress={approveKyc} />
          <Button title="Contact seller support" variant="outline" icon="mail-outline" onPress={() => Linking.openURL(`mailto:${SUPPORT.sellerEmail}`)} />
          <Text style={styles.support}>{SUPPORT.sellerEmail} · {SUPPORT.phoneDisplay}</Text>
          <Text style={styles.logout} onPress={logout}>Log out</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', backgroundColor: colors.white, padding: 24 },
  ring: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 19, color: colors.black, marginTop: 14, textAlign: 'center' },
  sub: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 6, lineHeight: 19, maxWidth: 300 },
  appId: { fontSize: 12, color: colors.ink, marginTop: 12, fontWeight: '600', backgroundColor: colors.mist, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 2 },
  stepT: { fontSize: 14, fontWeight: '700', color: colors.black },
  stepS: { fontSize: 12, color: colors.muted, marginTop: 2 },
  support: { textAlign: 'center', fontSize: 12, color: colors.muted },
  logout: { textAlign: 'center', color: colors.sale, fontWeight: '700', marginTop: 6 },
});
