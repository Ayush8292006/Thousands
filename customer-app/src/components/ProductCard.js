import React, { useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProductImage from './ProductImage';
import { colors, fonts } from '../theme';
import { formatPrice, discountPct } from '../utils/format';
import { useApp } from '../context/AppContext';

// Flat card: image hi hero hai. Shadow nahi — mist backdrop + type hierarchy.
export default function ProductCard({ product, width, imageSize = 125, style, onDark = false }) {
  const nav = useNavigation();
  const { wishlist, toggleWishlist, addToCart, cart } = useApp();
  const off = discountPct(product.mrp, product.price);
  const liked = wishlist.includes(product.id);
  const firstVariant = product.variants ? product.variants.options[0] : null;
  const inCart = cart.some((i) => i.product.id === product.id);
  const pop = useRef(new Animated.Value(1)).current;

  const onAdd = () => {
    if (inCart) return nav.navigate('Tabs', { screen: 'Cart' });
    addToCart(product, firstVariant);
    // Action ka feedback: button ek baar "pop" karta hai
    Animated.sequence([
      Animated.spring(pop, { toValue: 1.25, useNativeDriver: true, speed: 50 }),
      Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();
  };

  const fg = onDark ? colors.white : colors.black;

  return (
    <Pressable
      onPress={() => nav.navigate('ProductDetail', { id: product.id })}
      style={({ pressed }) => [width ? { width } : { flex: 1 }, pressed && { opacity: 0.85 }, style]}
      accessibilityLabel={`${product.title}, ${formatPrice(product.price)}`}
    >
      <View>
        <ProductImage product={product} size={imageSize} rounded={16} />
        {off > 0 ? (
          <View style={styles.off}>
            <Text style={styles.offText}>−{off}%</Text>
          </View>
        ) : null}
        <Pressable hitSlop={10} onPress={() => toggleWishlist(product.id)} style={styles.heart} accessibilityLabel="Wishlist">
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={17} color={liked ? colors.sale : colors.black} />
        </Pressable>
        <Animated.View style={[styles.addWrap, { transform: [{ scale: pop }] }]}>
          <Pressable hitSlop={6} onPress={onAdd} style={[styles.add, inCart && { backgroundColor: colors.accent }]} accessibilityLabel={inCart ? 'Go to cart' : 'Add to cart'}>
            <Ionicons name={inCart ? 'checkmark' : 'add'} size={17} color={colors.white} />
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.body}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: fg }]}>{formatPrice(product.price)}</Text>
          {off > 0 ? <Text style={[styles.mrp, onDark && { color: 'rgba(255,255,255,0.6)' }]}>{formatPrice(product.mrp)}</Text> : null}
        </View>
        <Text style={[styles.title, onDark && { color: 'rgba(255,255,255,0.9)' }]} numberOfLines={2}>{product.title}</Text>
        <View style={styles.meta}>
          <Ionicons name="star" size={11} color={onDark ? colors.white : colors.success} />
          <Text style={[styles.rating, onDark && { color: colors.white }]}>{product.rating.toFixed(1)}</Text>
          <Text style={[styles.reviews, onDark && { color: 'rgba(255,255,255,0.6)' }]}>({formatCount(product.reviews)})</Text>
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
  off: { position: 'absolute', top: 10, left: 10, backgroundColor: colors.sale, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  offText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  heart: {
    position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
  },
  addWrap: { position: 'absolute', bottom: 8, right: 8, borderRadius: 22, borderWidth: 1.5, borderColor: colors.white, padding: 2 },
  add: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  body: { paddingTop: 10, paddingHorizontal: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontFamily: fonts.display, fontSize: 15, letterSpacing: -0.3 },
  mrp: { color: colors.faint, textDecorationLine: 'line-through', fontSize: 12, marginLeft: 6 },
  title: { fontSize: 12, color: colors.ink, marginTop: 2, lineHeight: 16, minHeight: 32 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  rating: { fontSize: 12, fontWeight: '700', color: colors.ink, marginLeft: 3 },
  reviews: { fontSize: 11, color: colors.muted, marginLeft: 3 },
});
