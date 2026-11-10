import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar, Field } from '../components/kit';
import { Button, Chip } from '../components/ui';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { categories } from '../data/seed';
import { region } from '../config/tax';

const STEPS = [
  { id: 'business', title: 'Business details', icon: 'storefront-outline' },
  { id: 'tax', title: 'Tax & identity', icon: 'document-text-outline' },
  { id: 'bank', title: 'Bank account', icon: 'card-outline' },
  { id: 'address', title: 'Pickup address', icon: 'location-outline' },
  { id: 'docs', title: 'Documents', icon: 'cloud-upload-outline' },
];

const BUSINESS_TYPES = ['Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Individual'];
const BANKS = { HDFC: 'HDFC Bank', ICIC: 'ICICI Bank', SBIN: 'State Bank of India', UTIB: 'Axis Bank', KKBK: 'Kotak Mahindra Bank', PUNB: 'Punjab National Bank', BARB: 'Bank of Baroda', YESB: 'Yes Bank', IDIB: 'Indian Bank', CNRB: 'Canara Bank' };
const DOCS = [
  { key: 'idProof', title: 'Identity proof', sub: 'PAN card or Aadhaar of the owner' },
  { key: 'addressProof', title: 'Business address proof', sub: 'GST certificate, rent agreement or utility bill' },
  { key: 'cheque', title: 'Cancelled cheque', sub: 'Must show account holder name and IFSC' },
  { key: 'signature', title: 'Digital signature', sub: 'Sign on white paper and upload a clear photo' },
];

const RX = {
  gstin: /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
  pan: /^[A-Z]{5}\d{4}[A-Z]$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
};

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { kyc, updateKyc, submitKyc, logout } = useSeller();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [confirmAcc, setConfirmAcc] = useState(kyc.bank.account);

  const cur = STEPS[step].id;
  const set = (section) => (key) => (v) => {
    updateKyc(section, { [key]: v });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    const b = kyc.business, t = kyc.tax, k = kyc.bank, a = kyc.address;
    if (cur === 'business') {
      if (b.storeName.trim().length < 3) e.storeName = 'Enter a store name (min. 3 characters)';
      if (!b.legalName.trim()) e.legalName = 'Enter the registered business name';
    }
    if (cur === 'tax') {
      if (!RX.gstin.test(t.taxId)) e.taxId = `Enter a valid 15-character ${region.taxIdLabel}`;
      if (!RX.pan.test(t.pan)) e.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
    }
    if (cur === 'bank') {
      if (!k.holder.trim()) e.holder = 'Enter the account holder name';
      if (!/^\d{9,18}$/.test(k.account)) e.account = 'Account number must be 9–18 digits';
      if (confirmAcc !== k.account) e.confirm = 'Account numbers do not match';
      if (!RX.ifsc.test(k.ifsc)) e.ifsc = 'Enter a valid 11-character IFSC';
    }
    if (cur === 'address') {
      if (!a.line1.trim()) e.line1 = 'Enter the pickup address';
      if (!a.city.trim()) e.city = 'Enter city';
      if (!a.state.trim()) e.state = 'Enter state';
      if (!/^\d{6}$/.test(a.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    }
    if (cur === 'docs') {
      if (DOCS.some((d) => !kyc.docs[d.key])) e.docs = 'Upload all documents to continue';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step === STEPS.length - 1) submitKyc();
    else setStep(step + 1);
  };

  const onIfsc = (v) => {
    const ifsc = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
    updateKyc('bank', { ifsc, bankName: BANKS[ifsc.slice(0, 4)] || '' });
    setErrors((e) => ({ ...e, ifsc: undefined }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TopBar
        title="Set up your store"
        subtitle={`Step ${step + 1} of ${STEPS.length} — ${STEPS[step].title}`}
        right={
          <Pressable onPress={logout} hitSlop={8}>
            <Text style={{ color: colors.white, fontWeight: '600' }}>Log out</Text>
          </Pressable>
        }
      />

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((st, i) => {
          const done = i < step, on = i === step;
          return (
            <React.Fragment key={st.id}>
              <Pressable onPress={() => i < step && setStep(i)} style={styles.stepItem} accessibilityLabel={st.title}>
                <View style={[styles.stepDot, done && styles.stepDone, on && styles.stepOn]}>
                  <Ionicons name={done ? 'checkmark' : st.icon} size={15} color={done || on ? colors.white : colors.muted} />
                </View>
              </Pressable>
              {i < STEPS.length - 1 ? <View style={[styles.stepLine, i < step && { backgroundColor: colors.success }]} /> : null}
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.h}>{STEPS[step].title}</Text>

        {cur === 'business' ? (
          <>
            <Text style={styles.p}>This is how customers will see your store on Thousands.</Text>
            <Field label="Store name" value={kyc.business.storeName} onChangeText={set('business')('storeName')} placeholder="e.g. UrbanTech Retail" error={errors.storeName} />
            <Field label="Registered business name" value={kyc.business.legalName} onChangeText={set('business')('legalName')} placeholder="As per your GST / PAN" error={errors.legalName} />
            <Text style={styles.label}>Business type</Text>
            <View style={styles.chips}>
              {BUSINESS_TYPES.map((t) => <Chip key={t} label={t} active={kyc.business.type === t} onPress={() => set('business')('type')(t)} />)}
            </View>
            <Text style={styles.label}>Main category</Text>
            <View style={styles.chips}>
              {categories.map((c) => <Chip key={c.id} label={c.name} active={kyc.business.category === c.id} onPress={() => set('business')('category')(c.id)} />)}
            </View>
          </>
        ) : null}

        {cur === 'tax' ? (
          <>
            <Text style={styles.p}>We use this for invoices and tax compliance. Your details are encrypted.</Text>
            <View style={styles.countryBox}>
              <Ionicons name="globe-outline" size={18} color={colors.accent} />
              <Text style={styles.countryText}>Selling from <Text style={{ fontWeight: '700' }}>{region.country}</Text> · Tax: {region.taxName}</Text>
            </View>
            <Field label={region.taxIdLabel} value={kyc.tax.taxId} onChangeText={(v) => set('tax')('taxId')(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15))} placeholder="07ABCDE1234F1Z5" autoCapitalize="characters" error={errors.taxId} hint="15 characters, from your GST registration certificate" />
            <Field label="PAN" value={kyc.tax.pan} onChangeText={(v) => set('tax')('pan')(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))} placeholder="ABCDE1234F" autoCapitalize="characters" error={errors.pan} />
          </>
        ) : null}

        {cur === 'bank' ? (
          <>
            <Text style={styles.p}>Your weekly payouts will be sent to this account.</Text>
            <Field label="Account holder name" value={kyc.bank.holder} onChangeText={set('bank')('holder')} placeholder="As per bank records" error={errors.holder} />
            <Field label="Account number" value={kyc.bank.account} onChangeText={(v) => set('bank')('account')(v.replace(/\D/g, '').slice(0, 18))} keyboardType="number-pad" secureTextEntry placeholder="Enter account number" error={errors.account} />
            <Field label="Confirm account number" value={confirmAcc} onChangeText={(v) => { setConfirmAcc(v.replace(/\D/g, '').slice(0, 18)); setErrors((e) => ({ ...e, confirm: undefined })); }} keyboardType="number-pad" placeholder="Re-enter account number" error={errors.confirm} />
            <Field label="IFSC" value={kyc.bank.ifsc} onChangeText={onIfsc} placeholder="HDFC0001234" autoCapitalize="characters" error={errors.ifsc} hint={kyc.bank.bankName ? `Bank: ${kyc.bank.bankName}` : 'You can find it on your cheque book'} />
          </>
        ) : null}

        {cur === 'address' ? (
          <>
            <Text style={styles.p}>Our courier partner will pick up orders from here.</Text>
            <Field label="Address" value={kyc.address.line1} onChangeText={set('address')('line1')} placeholder="Shop / warehouse no., street, area" error={errors.line1} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Field style={{ flex: 1 }} label="City" value={kyc.address.city} onChangeText={set('address')('city')} error={errors.city} />
              <Field style={{ flex: 1 }} label="Pincode" value={kyc.address.pincode} onChangeText={(v) => set('address')('pincode')(v.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" error={errors.pincode} />
            </View>
            <Field label="State" value={kyc.address.state} onChangeText={set('address')('state')} error={errors.state} hint="Used to decide CGST + SGST or IGST on invoices" />
          </>
        ) : null}

        {cur === 'docs' ? (
          <>
            <Text style={styles.p}>Upload clear photos or PDFs. Verification usually takes 1–2 business days.</Text>
            {DOCS.map((d) => {
              const up = kyc.docs[d.key];
              return (
                <Pressable key={d.key} style={[styles.doc, up && styles.docDone]} onPress={() => updateKyc('docs', { [d.key]: !up })}>
                  <View style={[styles.docIcon, up && { backgroundColor: colors.success }]}>
                    <Ionicons name={up ? 'checkmark' : 'cloud-upload-outline'} size={20} color={up ? colors.white : colors.accent} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.docTitle}>{d.title}</Text>
                    <Text style={styles.docSub}>{up ? 'Uploaded — tap to replace' : d.sub}</Text>
                  </View>
                  <Text style={[styles.docAction, up && { color: colors.success }]}>{up ? 'Done' : 'Upload'}</Text>
                </Pressable>
              );
            })}
            {errors.docs ? <Text style={styles.err}>{errors.docs}</Text> : null}
            <Text style={styles.demoNote}>Demo: tap a card to mark it uploaded. The real app opens the camera or file picker.</Text>
          </>
        ) : null}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 10 }]}>
        {step > 0 ? <Button title="Back" variant="outline" style={{ flex: 1 }} onPress={() => setStep(step - 1)} /> : null}
        <Button title={step === STEPS.length - 1 ? 'Submit for verification' : 'Continue'} style={{ flex: 2 }} onPress={next} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 20, paddingVertical: 14 },
  stepItem: { alignItems: 'center' },
  stepDot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  stepOn: { backgroundColor: colors.accent },
  stepDone: { backgroundColor: colors.success },
  stepLine: { flex: 1, height: 2, backgroundColor: colors.border, marginHorizontal: 4 },
  h: { fontFamily: fonts.display, fontSize: 20, color: colors.black },
  p: { fontSize: 13, color: colors.muted, marginTop: 4, marginBottom: 18, lineHeight: 19 },
  label: { fontSize: 12, color: colors.muted, marginBottom: 8, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8, marginBottom: 16 },
  countryBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: 10, padding: 12, marginBottom: 16 },
  countryText: { marginLeft: 8, fontSize: 13, color: colors.ink, flex: 1 },
  doc: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  docDone: { borderStyle: 'solid', borderColor: colors.success, backgroundColor: colors.successSoft },
  docIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  docTitle: { fontSize: 14, fontWeight: '700', color: colors.black },
  docSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  docAction: { fontSize: 13, fontWeight: '700', color: colors.accent },
  err: { color: colors.sale, fontSize: 12, fontWeight: '600', marginTop: 4 },
  demoNote: { fontSize: 11, color: colors.faint, marginTop: 10 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10, backgroundColor: colors.white, paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
});
