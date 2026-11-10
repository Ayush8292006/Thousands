import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, font } from '../theme';
import { Button } from '../components/ui';
import { BRAND } from '../config/app';
import { sendOtp, verifyOtp } from '../services/api';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { setUser } = useApp();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSend = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) return setError('Enter a valid 10-digit mobile number');
    setError('');
    setLoading(true);
    await sendOtp(phone);
    setLoading(false);
    setStep('otp');
  };

  const onVerify = async () => {
    setLoading(true);
    const res = await verifyOtp(phone, otp);
    setLoading(false);
    if (!res.ok) return setError('Enter the 6-digit OTP');
    setUser(res.user);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.black }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.hero, { paddingTop: insets.top + 40 }]}>
        <Image source={require('../../assets/logo-white.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>{BRAND.name.toLowerCase()}</Text>
        <Text style={styles.tag}>{BRAND.tagline}</Text>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
        {step === 'phone' ? (
          <>
            <Text style={font.h1}>Login or Sign up</Text>
            <Text style={[font.small, { marginTop: 6 }]}>Enter your mobile number and we will send you an OTP.</Text>
            <View style={styles.inputRow}>
              <Text style={styles.cc}>+91</Text>
              <TextInput
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                placeholder="Mobile number"
                placeholderTextColor={colors.faint}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>
            {error ? <Text style={styles.err}>{error}</Text> : null}
            <Button title="Continue" onPress={onSend} loading={loading} style={{ marginTop: 20 }} />
          </>
        ) : (
          <>
            <Text style={font.h1}>Verify OTP</Text>
            <Text style={[font.small, { marginTop: 6 }]}>
              Enter the 6-digit code sent to +91 {phone}.{' '}
              <Text style={{ color: colors.black, fontWeight: '700' }} onPress={() => setStep('phone')}>Change</Text>
            </Text>
            <TextInput
              value={otp}
              onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              placeholderTextColor={colors.faint}
              keyboardType="number-pad"
              style={[styles.inputRow, styles.otp]}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 84, height: 96 },
  brand: { color: colors.white, fontSize: 40, fontFamily: 'PlusJakartaSans_800ExtraBold', letterSpacing: -1.2, marginTop: 18 },
  tag: { color: colors.faint, marginTop: 8, fontSize: 13 },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  inputRow: {
    marginTop: 22, height: 54, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
  },
  cc: { fontSize: 16, fontWeight: '700', marginRight: 10, color: colors.black },
  input: { flex: 1, fontSize: 16, color: colors.black },
  otp: { fontSize: 22, letterSpacing: 10, textAlign: 'center', fontWeight: '700', color: colors.black },
  err: { color: colors.danger, marginTop: 8, fontSize: 12 },
  terms: { fontSize: 11, color: colors.faint, textAlign: 'center', marginTop: 20 },
});
