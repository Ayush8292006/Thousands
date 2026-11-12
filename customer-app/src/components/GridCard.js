import React, { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductImage from './ProductImage';
import Stars from './Stars';
import { colors } from '../theme';
import { discountPct, formatPrice } from '../utils/format';
import { DELIVERY } from '../config/app';

// Flipkart-style 2-column result card: clean image, title, stars + Assured, ↓% MRP price, delivery date
export function deliveryLabel(days = DELIVERY.days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const n = d.getDate();
  const suf = n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
  return `${n}${suf} ${d.toLocaleString('en-US', { month: 'short' })}`;
}

function GridCard({ product: p, width, liked, onToggleLike, onOpen, index = 0 }) {
  const off = discountPct(p.mrp, p.price);
  return (
    <Pressable style={[styles.card, { width }, index % 2 === 0 && styles.left]} onPress={() => onOpen(p.id)} accessibilityLabel={p.title}>
      <View style={styles.imgWrap}>
        <ProductImage product={p} size={Math.round(width * 0.82)} rounded={12} resizeMode="cover" />
        <Pressable style={styles.like} onPress={() => onToggleLike(p.id)} hitSlop={8} accessibilityLabel="Wishlist">
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={19} color={liked ? colors.danger : colors.ink} />
        </Pressable>
      </View>
      <Text style={styles.title} numberOfLines={2}>{p.title}</Text>
      <View style={styles.rateRow}>
        <Stars value={p.rating} />
        {p.assured ? (
          <View style={styles.assured}>
            <Ionicons name="shield-checkmark" size={13} color={colors.accent} />
            <Text style={styles.assuredText}>Assured</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.priceRow}>
        {off > 0 ? (
          <>
            <Ionicons name="arrow-down" size={15} color={colors.success} />
            <Text style={styles.off}>{off}%</Text>
            <Text style={styles.mrp}>{formatPrice(p.mrp)}</Text>
          </>
        ) : null}
        <Text style={styles.price}>{formatPrice(p.price)}</Text>
      </View>
      <Text style={styles.delivery}>
        Delivery by <Text style={{ fontWeight: '700', color: colors.ink }}>{deliveryLabel()}</Text>
      </Text>
    </Pressable>
  );
}

export default memo(GridCard);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, paddingHorizontal: 12, paddingTop: 14, paddingBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#DADDE2' },
  left: { borderRightWidth: StyleSheet.hairlineWidth },
  imgWrap: { marginBottom: 10 },
  like: {
    position: 'absolute', top: 6, right: 6, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E6E8EC',
  },
  title: { fontSize: 14, lineHeight: 19, color: colors.ink },
  rateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  assured: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  assuredText: { fontSize: 12, fontWeight: '700', fontStyle: 'italic', color: colors.accent },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap', gap: 4 },
  off: { fontSize: 15, fontWeight: '700', color: colors.success },
  mrp: { fontSize: 13, color: colors.faint, textDecorationLine: 'line-through' },
  price: { fontSize: 16, fontWeight: '800', color: colors.ink },
  delivery: { fontSize: 12.5, color: colors.muted, marginTop: 6 },
});
