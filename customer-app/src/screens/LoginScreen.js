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
import { useApp } from '../context/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import Shine from '../components/Shine';
import { calli } from '../config/fonts';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { setUser } = useApp();
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
    setUser(res.user);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.headerGradient[2] }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={colors.headerGradient} style={[styles.hero, { paddingTop: insets.top + 40 }]}>
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
          style={styles.gloss}
        />
        <Shine intensity={0.35} duration={1600} pause={4200} delay={600} />
        <View style={styles.logoRing}>
          <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={[calli(28, colors.olive), { marginTop: 14 }]}>Welcome</Text>
        <Text style={styles.brand}>{BRAND.name}</Text>
        <Text style={styles.tag}>{BRAND.tagline}</Text>
      </LinearGradient>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        {step === 'phone' ? (
          <>
            <Text style={font.h1}>Login or Sign up</Text>
            <Text style={[font.small, { marginTop: 6 }]}>Enter your mobile number and we will send you an OTP.</Text>
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
        <Text style={styles.terms}>
          By continuing, you agree to the Thousands Terms of Use and Privacy Policy.
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
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  gloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%' },
  logoRing: {
    width: 112, height: 112, borderRadius: 34, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.65)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.95)',
  },
  logo: { width: 64, height: 70 },
  brand: { color: colors.olive, fontSize: 30, fontWeight: '800', fontStyle: 'italic', marginTop: 2 },
  tag: { color: colors.headerMuted, marginTop: 6, fontSize: 13 },
  sheet: {
    backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24,
    shadowColor: '#3B2F00', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: -4 }, elevation: 10,
  },
  inputRow: {
    marginTop: 22, height: 54, borderRadius: radius.md, backgroundColor: colors.mist,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
  },
  ccBtn: { flexDirection: 'row', alignItems: 'center', height: '100%', paddingRight: 4 },
  flag: { fontSize: 20, marginRight: 6 },
  cc: { fontSize: 16, fontWeight: '700', marginRight: 4, color: colors.black },
  divider: { width: 1, height: 26, backgroundColor: colors.border, marginHorizontal: 10 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  picker: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '75%' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 8 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: colors.black },
  countryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  countryName: { flex: 1, fontSize: 15, color: colors.ink },
  countryDial: { fontSize: 15, fontWeight: '600', color: colors.muted },
  input: { flex: 1, fontSize: 16, color: colors.black },
  otp: { fontSize: 22, letterSpacing: 10, textAlign: 'center', fontWeight: '700', color: colors.black },
  err: { color: colors.danger, marginTop: 8, fontSize: 12 },
  terms: { fontSize: 11, color: colors.faint, textAlign: 'center', marginTop: 20 },
});
