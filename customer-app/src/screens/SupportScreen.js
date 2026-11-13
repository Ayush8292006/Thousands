import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { SUPPORT, BRAND } from '../config/app';

const FAQS = [
  ['When will my order arrive?', 'Most orders arrive in 3–5 working days. You can see the exact date on the product page and in your order details.'],
  ['How do I return an item?', 'Go to My Orders, open the order and tap "Need help" to request a return. Returns are accepted within 7 days of delivery.'],
  ['When will I get my refund?', 'Refunds reach your original payment method within 5–7 working days after the return is picked up.'],
  ['Where can I find my invoice?', 'Open the order in My Orders and tap "Download Invoice".'],
];

export default function SupportScreen({ route }) {
  const sellerFocus = route.params?.seller;
  const [open, setOpen] = useState(null);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 12, paddingBottom: 30 }}>
      {!sellerFocus ? (
        <>
          <Text style={styles.head}>Contact us</Text>
          <Contact icon="call-outline" title="Call us" sub={`${SUPPORT.phoneDisplay} · ${SUPPORT.hours}`} onPress={() => Linking.openURL(`tel:${SUPPORT.phone}`)} />
          <Contact icon="mail-outline" title="Email support" sub={SUPPORT.customerEmail} onPress={() => Linking.openURL(`mailto:${SUPPORT.customerEmail}`)} />
          <Contact icon="logo-whatsapp" title="WhatsApp" sub="Chat with us" onPress={() => Linking.openURL(`https://wa.me/91${SUPPORT.phone}`)} />

          <Text style={[styles.head, { marginTop: 18 }]}>FAQs</Text>
          <View style={styles.faqBox}>
            {FAQS.map(([q, a], i) => (
              <Pressable key={q} style={[styles.faq, i === FAQS.length - 1 && { borderBottomWidth: 0 }]} onPress={() => setOpen(open === i ? null : i)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.q}>{q}</Text>
                  <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
                </View>
                {open === i ? <Text style={styles.a}>{a}</Text> : null}
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      <View style={styles.seller}>
        <Ionicons name="storefront-outline" size={28} color={colors.accent} />
        <Text style={styles.sellerTitle}>Sell on {BRAND.name}</Text>
        <Text style={styles.sellerSub}>
          No registration fee, weekly payouts and pickup from your doorstep. Take your store online with the Thousands partner app.
        </Text>
        <Pressable style={styles.sellerBtn} onPress={() => Linking.openURL(`mailto:${SUPPORT.sellerEmail}?subject=Seller%20enquiry`)}>
          <Ionicons name="mail-outline" size={16} color={colors.black} />
          <Text style={styles.sellerBtnText}>{SUPPORT.sellerEmail}</Text>
        </Pressable>
        <Pressable style={[styles.sellerBtn, { marginTop: 8 }]} onPress={() => Linking.openURL(`tel:${SUPPORT.phone}`)}>
          <Ionicons name="call-outline" size={16} color={colors.black} />
          <Text style={styles.sellerBtnText}>{SUPPORT.phoneDisplay}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Contact({ icon, title, sub, onPress }) {
  return (
    <Pressable style={styles.contact} onPress={onPress}>
      <View style={styles.cIcon}><Ionicons name={icon} size={20} color={colors.white} /></View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: '800' }}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.faint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { fontSize: 12, fontWeight: '800', color: colors.muted, letterSpacing: 0.6, margin: 4, marginBottom: 8 },
  contact: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.md, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  cIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  sub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  faqBox: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  faq: { padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  q: { flex: 1, fontWeight: '700', fontSize: 14 },
  a: { marginTop: 8, color: colors.muted, fontSize: 13, lineHeight: 19 },
  seller: { backgroundColor: colors.black, borderRadius: radius.lg, padding: 20, marginTop: 18, alignItems: 'center' },
  sellerTitle: { color: colors.white, fontSize: 18, fontWeight: '900', marginTop: 8 },
  sellerSub: { color: colors.faint, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  sellerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 10, marginTop: 16, alignSelf: 'stretch', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  sellerBtnText: { marginLeft: 8, fontWeight: '700', fontSize: 13 },
});
