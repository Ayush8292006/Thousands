import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProductImage from './ProductImage';
import { colors, fonts } from '../theme';
import { GlossOverlay } from './Gloss';
import { formatPrice, discountPct } from '../utils/format';
import { useApp } from '../context/AppContext';

// Commercial product card: white card, thin border, clear price hierarchy.
export default function ProductCard({ product, width, imageSize = 125, style }) {
  const nav = useNavigation();
  const { wishlist, toggleWishlist, addToCart, cart } = useApp();
  const off = discountPct(product.mrp, product.price);
  const liked = wishlist.includes(product.id);
  const firstVariant = product.variants ? product.variants.options[0] : null;
  const inCart = cart.some((i) => i.product.id === product.id);

  return (
    <Pressable
      onPress={() => nav.navigate('ProductDetail', { id: product.id })}
      style={({ pressed }) => [styles.card, width ? { width } : { flex: 1 }, pressed && { opacity: 0.9 }, style]}
      accessibilityLabel={`${product.title}, ${formatPrice(product.price)}`}
    >
      <GlossOverlay level="medium" radius={14} />
      <View>
        <ProductImage product={product} size={imageSize} rounded={8} />
        <Pressable hitSlop={10} onPress={() => toggleWishlist(product.id)} style={styles.heart} accessibilityLabel="Wishlist">
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={16} color={liked ? colors.sale : colors.muted} />
        </Pressable>
        {product.assured ? (
          <View style={styles.assured}>
            <Ionicons name="shield-checkmark" size={10} color={colors.accent} />
            <Text style={styles.assuredText}>Assured</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.brand} numberOfLines={1}>{product.brand}</Text>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.meta}>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <Ionicons name="star" size={9} color={colors.white} style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.reviews}>({formatCount(product.reviews)})</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {off > 0 ? <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text> : null}
        </View>
        <View style={styles.footer}>
          {off > 0 ? <Text style={styles.off}>{off}% off</Text> : <View />}
          <Pressable
            hitSlop={6}
            onPress={() => (inCart ? nav.navigate('Tabs', { screen: 'Cart' }) : addToCart(product, firstVariant))}
            style={[styles.add, inCart && styles.added]}
            accessibilityLabel={inCart ? 'Go to cart' : 'Add to cart'}
          >
            <Text style={[styles.addText, inCart && { color: colors.white }]}>{inCart ? 'Added' : 'Add'}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function formatCount(n) {
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 8, overflow: 'hidden',
    shadowColor: '#302719', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  heart: {
    position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 12,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  assured: {
    position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 5, paddingVertical: 2,
  },
  assuredText: { fontSize: 9, fontWeight: '700', color: colors.accent, marginLeft: 2 },
  body: { paddingTop: 8, paddingHorizontal: 2 },
  brand: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  title: { fontSize: 12, color: colors.ink, marginTop: 2, lineHeight: 16, minHeight: 32 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  rating: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.success, borderRadius: 12, paddingHorizontal: 5, paddingVertical: 1 },
  ratingText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  reviews: { fontSize: 11, color: colors.muted, marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 5 },
  price: { fontWeight: '700', fontSize: 15, color: colors.black },
  mrp: { color: colors.faint, textDecorationLine: 'line-through', fontSize: 11, marginLeft: 5 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  off: { color: colors.success, fontSize: 12, fontWeight: '700' },
  add: { borderWidth: 1, borderColor: colors.accent, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  added: { backgroundColor: colors.accent },
  addText: { fontSize: 11, fontWeight: '700', color: colors.accent },
});
