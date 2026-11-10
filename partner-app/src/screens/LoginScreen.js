import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { countries, isValidMobile } from '../data/countries';
import { noOutline } from '../utils/platform';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../theme';
import { Button } from '../components/ui';
import { BRAND } from '../config/app';
import { sendOtp, verifyOtp } from '../services/api';
import { useSeller } from '../context/SellerContext';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { setSeller, useDemoStore } = useSeller();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(countries[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSend = async () => {
    if (!isValidMobile(country, phone)) {
      const n = country.len[0] === country.len[1] ? country.len[0] : `${country.len[0]}–${country.len[1]}`;
      return setError(`Enter a valid ${n}-digit mobile number`);
    }
    setError('');
    setLoading(true);
    await sendOtp(`${country.dial}${phone}`);
    setLoading(false);
    setStep('otp');
  };

  const onVerify = async () => {
    setLoading(true);
    const res = await verifyOtp(`${country.dial} ${phone}`, otp);
    setLoading(false);
    if (!res.ok) return setError('Enter the 6-digit OTP');
    setSeller({ phone: `${country.dial} ${phone}` });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.accentDark }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.hero, { paddingTop: insets.top + 40 }]}>
        <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>{BRAND.name.toLowerCase()}</Text>
        <View style={styles.partnerTag}><Text style={styles.partnerTagText}>Partner</Text></View>
        <Text style={styles.tag}>{BRAND.tagline}</Text>
        <View style={styles.perks}>
          {[['cash-outline', 'Weekly payouts'], ['cube-outline', 'Doorstep pickup'], ['trending-up-outline', 'Crores of buyers']].map(([ic, t]) => (
            <View key={t} style={styles.perk}>
              <Ionicons name={ic} size={18} color={colors.yellow} />
              <Text style={styles.perkText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        {step === 'phone' ? (
          <>
            <Text style={font.h1}>Start selling on Thousands</Text>
            <Text style={[font.small, { marginTop: 6 }]}>Log in or register with your mobile number.</Text>
            <View style={styles.inputRow}>
              <Pressable style={styles.ccBtn} onPress={() => setPickerOpen(true)} accessibilityLabel={`Country code ${country.dial}, change`}>
                <Text style={styles.flag}>{country.flag}</Text>
                <Text style={styles.cc}>{country.dial}</Text>
                <Ionicons name="chevron-down" size={14} color={colors.muted} />
              </Pressable>
              <View style={styles.divider} />
              <TextInput
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, country.len[1]))}
                placeholder="Mobile number"
                placeholderTextColor={colors.faint}
                keyboardType="phone-pad"
                style={[styles.input, noOutline]}
              />
            </View>
            {error ? <Text style={styles.err}>{error}</Text> : null}
            <Button title="Continue" onPress={onSend} loading={loading} style={{ marginTop: 20 }} />
          </>
        ) : (
          <>
            <Text style={font.h1}>Verify OTP</Text>
            <Text style={[font.small, { marginTop: 6 }]}>
              Enter the 6-digit code sent to {country.dial} {phone}.{' '}
              <Text style={{ color: colors.black, fontWeight: '700' }} onPress={() => setStep('phone')}>Change</Text>
            </Text>
            <TextInput
              value={otp}
              onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              placeholderTextColor={colors.faint}
              keyboardType="number-pad"
              style={[styles.inputRow, styles.otp, noOutline]}
              autoFocus
            />
            {error ? <Text style={styles.err}>{error}</Text> : null}
            <Text style={[font.tiny, { marginTop: 8 }]}>Demo mode: any 6 digits will work</Text>
            <Button title="Verify & Continue" onPress={onVerify} loading={loading} disabled={otp.length !== 6} style={{ marginTop: 20 }} />
            <Pressable onPress={onSend} style={{ marginTop: 14, alignSelf: 'center' }}>
              <Text style={{ fontWeight: '700', color: colors.ink }}>Resend OTP</Text>
            </Pressable>
          </>
        )}
        <Pressable
          onPress={() => {
            useDemoStore();
            setSeller({ phone: '+91 9876543210' });
          }}
          style={{ marginTop: 16, alignSelf: 'center' }}
        >
          <Text style={{ color: colors.accent, fontWeight: '700' }}>Skip and open demo store</Text>
        </Pressable>
        <Text style={styles.terms}>
          By continuing, you agree to the Thousands Seller Agreement and Privacy Policy.
        </Text>
      </View>

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setPickerOpen(false)} />
        <View style={[styles.picker, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={[font.h2, { marginBottom: 12 }]}>Select country</Text>
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search country or code"
              placeholderTextColor={colors.faint}
              style={[styles.searchInput, noOutline]}
            />
          </View>
          <FlatList
            data={countries.filter((c) => {
              const q = query.trim().toLowerCase();
              return !q || c.name.toLowerCase().includes(q) || c.dial.includes(q);
            })}
            keyExtractor={(c) => c.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const on = item.code === country.code;
              return (
                <Pressable
                  style={styles.countryRow}
                  onPress={() => {
                    setCountry(item);
                    setPhone((p) => p.slice(0, item.len[1]));
                    setError('');
                    setQuery('');
                    setPickerOpen(false);
                  }}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDial}>{item.dial}</Text>
                  {on ? <Ionicons name="checkmark" size={18} color={colors.accent} style={{ marginLeft: 8 }} /> : null}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  partnerTag: { backgroundColor: colors.yellow, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginTop: 4 },
  partnerTagText: { fontWeight: '700', fontSize: 12, color: colors.black },
  perks: { flexDirection: 'row', marginTop: 22, gap: 18 },
  perk: { alignItems: 'center' },
  perkText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 4 },
  logo: { width: 60, height: 70 },
  brand: { color: colors.white, fontSize: 40, fontWeight: '700', marginTop: 18 },
  tag: { color: 'rgba(255,255,255,0.8)', marginTop: 8, fontSize: 13 },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  inputRow: {
    marginTop: 22, height: 54, borderRadius: radius.md, backgroundColor: colors.mist,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
  },
  ccBtn: { flexDirection: 'row', alignItems: 'center', height: '100%', paddingRight: 4 },
  flag: { fontSize: 20, marginRight: 6 },
  cc: { fontSize: 16, fontWeight: '700', marginRight: 4, color: colors.black },
  divider: { width: 1, height: 26, backgroundColor: colors.border, marginHorizontal: 10 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  picker: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '75%' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: 4, paddingHorizontal: 12, height: 44, marginBottom: 8 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: colors.black },
  countryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  countryName: { flex: 1, fontSize: 15, color: colors.ink },
  countryDial: { fontSize: 15, fontWeight: '600', color: colors.muted },
  input: { flex: 1, fontSize: 16, color: colors.black },
  otp: { fontSize: 22, letterSpacing: 10, textAlign: 'center', fontWeight: '700', color: colors.black },
  err: { color: colors.danger, marginTop: 8, fontSize: 12 },
  terms: { fontSize: 11, color: colors.faint, textAlign: 'center', marginTop: 20 },
});
