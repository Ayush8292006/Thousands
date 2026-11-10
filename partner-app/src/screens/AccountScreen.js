import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, Switch } from 'react-native';
import { TopBar, Panel, ListRow, Pill, MoneyRow } from '../components/kit';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { categories } from '../data/seed';
import { COMMISSION } from '../config/commission';
import { SUPPORT, BRAND } from '../config/app';
import { notify } from '../utils/platform';
import { goTo } from '../utils/nav';

export default function AccountScreen({ navigation }) {
  const { kyc, seller, logout, vacation, setVacation, stats } = useSeller();
  const b = kyc.business;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Store & account" subtitle={seller?.phone} />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.profile}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{b.storeName[0]}</Text></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.store}>{b.storeName}</Text>
            <Text style={styles.legal}>{b.legalName} · {b.type}</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              <Pill label="KYC verified" color={colors.success} bg={colors.successSoft} />
              <Pill label={`${stats.rating} ★ seller rating`} />
            </View>
          </View>
        </View>

        <Panel title="Store">
          <ListRow icon="airplane-outline" title="Vacation mode" subtitle="Pause your store; listings are hidden from buyers" right={<Switch value={vacation} onValueChange={setVacation} trackColor={{ true: colors.accent }} thumbColor={colors.white} />} />
          <ListRow icon="pricetags-outline" title="My listings" subtitle="Manage products, stock and prices" onPress={() => goTo(navigation, 'Products')} />
          <ListRow icon="calculator-outline" title="Fee calculator" subtitle="Commission and fees by category" onPress={() => navigation.navigate('FeeCalculator')} last />
        </Panel>

        <Panel title="Business details">
          <MoneyRow label="GSTIN" value={kyc.tax.taxId} />
          <MoneyRow label="PAN" value={kyc.tax.pan} />
          <MoneyRow label="Main category" value={categories.find((c) => c.id === b.category)?.name || '-'} />
          <MoneyRow label="Pickup" value={`${kyc.address.city}, ${kyc.address.pincode}`} />
          <MoneyRow label="Bank" value={`${kyc.bank.bankName} ••${kyc.bank.account.slice(-4)}`} />
          <MoneyRow label="IFSC" value={kyc.bank.ifsc} />
          <Text style={styles.note}>To change verified details, contact seller support.</Text>
        </Panel>

        <Panel title="Commission rates">
          {categories.map((c) => <MoneyRow key={c.id} label={c.name} value={`${COMMISSION.categoryRates[c.id]}%`} muted />)}
          <Text style={styles.note}>Plus fixed fee, {COMMISSION.collectionFeePct}% collection fee, shipping and 18% GST on fees.</Text>
        </Panel>

        <Panel title="Help">
          <ListRow icon="mail-outline" title="Email seller support" subtitle={SUPPORT.sellerEmail} onPress={() => Linking.openURL(`mailto:${SUPPORT.sellerEmail}`)} />
          <ListRow icon="call-outline" title="Call us" subtitle={`${SUPPORT.phoneDisplay} · ${SUPPORT.hours}`} onPress={() => Linking.openURL(`tel:${SUPPORT.phone}`)} />
          <ListRow icon="document-text-outline" title="Seller agreement & policies" onPress={() => notify('Policies', 'Seller agreement will be added by Thousands.')} last />
        </Panel>

        <Text style={styles.logout} onPress={logout}>Log out</Text>
        <Text style={styles.version}>{BRAND.product} · v0.1.0 (prototype)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: 16 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700', fontSize: 24, color: colors.white },
  store: { fontWeight: '700', fontSize: 18, color: colors.black },
  legal: { fontSize: 12, color: colors.muted, marginTop: 2 },
  note: { fontSize: 11, color: colors.muted, marginTop: 8 },
  logout: { textAlign: 'center', color: colors.sale, fontWeight: '700', fontSize: 15, marginTop: 20 },
  version: { textAlign: 'center', color: colors.faint, fontSize: 11, marginTop: 8 },
});
