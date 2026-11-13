import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, Animated, Easing, ImageBackground, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Glass from './Glass';
import { calli } from '../config/fonts';
import { colors } from '../theme';
import Shine from './Shine';
import { LinearGradient } from 'expo-linear-gradient';
import { GlossOverlay, OLIVE_GLOSS } from './Gloss';

const native = Platform.OS !== 'web';
let shownThisSession = false; // ek session mein sirf ek baar

// Offer popup banner — home khulte hi ek baar, smooth scale-in
export default function OfferPopup({ offer, onShop, delay = 900 }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shownThisSession || !offer) return undefined;
    const t = setTimeout(() => {
      shownThisSession = true;
      setVisible(true);
      Animated.spring(anim, { toValue: 1, friction: 7, tension: 80, useNativeDriver: native }).start();
    }, delay);
    return () => clearTimeout(t);
  }, [offer, delay, anim]);

  const close = (cb) => {
    Animated.timing(anim, { toValue: 0, duration: 180, easing: Easing.in(Easing.quad), useNativeDriver: native }).start(() => {
      setVisible(false);
      if (typeof cb === 'function') cb();
    });
  };

  if (!offer) return null;
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={() => close()}>
      {/* separate translucent dim layer (own light blur on web) */}
      <Animated.View dataSet={Platform.OS === 'web' ? { glassdim: '1' } : undefined} style={[StyleSheet.absoluteFill, styles.dim, { opacity: anim }]} />
      <View style={styles.center} pointerEvents="box-none">
        <Pressable style={StyleSheet.absoluteFill} onPress={() => close()} accessibilityLabel="Close offer" />
        <Animated.View style={{ width: '100%', maxWidth: 380, opacity: anim, transform: [{ scale }] }}>
          <Glass tint="cream" radius={28} style={styles.card}>
            <ImageBackground source={{ uri: offer.image }} style={styles.banner} imageStyle={{ borderRadius: 22 }}>
              <View style={styles.bannerShade} />
              <Text style={calli(30, colors.cream)}>{offer.calligraphy}</Text>
              <Text style={styles.bannerTitle}>{offer.title}</Text>
            </ImageBackground>
            <Pressable style={styles.close} onPress={() => close()} hitSlop={10} accessibilityLabel="Close">
              <GlossOverlay level="high" radius={16} />
              <Ionicons name="close" size={18} color={colors.ink} />
            </Pressable>

            <Text style={styles.sub}>{offer.subtitle}</Text>
            <Pressable style={styles.code} onPress={() => setCopied(true)} accessibilityLabel={`Coupon code ${offer.code}`}>
              <GlossOverlay level="medium" radius={16} />
              <Text style={styles.codeLabel}>Use code</Text>
              <Text style={styles.codeText}>{offer.code}</Text>
              <Text style={styles.codeTap}>{copied ? 'Applied at checkout' : 'Tap to apply'}</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.shop, pressed && { opacity: 0.9 }]} onPress={() => close(onShop)}>
              <LinearGradient colors={OLIVE_GLOSS} style={StyleSheet.absoluteFill} />
              <GlossOverlay level="high" radius={25} dark />
              <Text style={styles.shopText}>Shop the offer</Text>
              <Ionicons name="arrow-forward" size={17} color={colors.white} />
              <Shine intensity={0.3} duration={1200} pause={2600} delay={500} />
            </Pressable>
            <Pressable onPress={() => close()} style={{ alignSelf: 'center', paddingVertical: 10 }}>
              <Text style={styles.later}>Maybe later</Text>
            </Pressable>
          </Glass>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { backgroundColor: 'rgba(28, 22, 10, 0.26)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { padding: 12, borderColor: 'rgba(255, 255, 255, 0.75)', borderBottomColor: 'rgba(214, 180, 92, 0.55)' },
  banner: { height: 170, justifyContent: 'flex-end', padding: 16 },
  bannerShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(25, 18, 0, 0.45)', borderRadius: 22 },
  bannerTitle: { color: colors.white, fontSize: 20, fontWeight: '800', marginTop: 2 },
  close: {
    position: 'absolute', top: 20, right: 20, width: 32, height: 32, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.95)',
    backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  sub: { fontSize: 14, color: colors.espresso, textAlign: 'center', marginTop: 14, paddingHorizontal: 8, lineHeight: 20 },
  code: {
    alignItems: 'center', marginTop: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 1.5,
    borderStyle: 'dashed', borderColor: 'rgba(214, 180, 92, 0.9)', backgroundColor: 'rgba(255,253,246,0.38)', overflow: 'hidden',
  },
  codeLabel: { fontSize: 11, color: colors.headerMuted, letterSpacing: 1 },
  codeText: { fontSize: 20, fontWeight: '800', color: colors.olive, letterSpacing: 2, marginTop: 2 },
  codeTap: { fontSize: 11.5, color: colors.gold, fontWeight: '700', marginTop: 2 },
  shop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 25,
    backgroundColor: colors.olive, marginTop: 14, overflow: 'hidden',
  },
  shopText: { color: colors.white, fontSize: 15.5, fontWeight: '800' },
  later: { fontSize: 13.5, color: colors.headerMuted, fontWeight: '600' },
});
