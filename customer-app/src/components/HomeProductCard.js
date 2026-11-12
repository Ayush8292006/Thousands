import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProductImage from './ProductImage';
import { fonts, lightBlueTheme } from '../theme';
import { formatPrice, discountPct } from '../utils/format';
import { useApp } from '../context/AppContext';

export default function HomeProductCard({ product, width, imageSize = 130, style }) {
  const nav = useNavigation();
  const { wishlist, toggleWishlist, addToCart, cart } = useApp();
  const off = discountPct(product.mrp, product.price);
  const liked = wishlist.includes(product.id);
  const firstVariant = product.variants ? product.variants.options[0] : null;
  const inCart = cart.some((i) => i.product.id === product.id);

  return (
    <Pressable
      onPress={() => nav.navigate('ProductDetail', { id: product.id })}
      style={({ pressed }) => [
        styles.card,
        width ? { width } : { flex: 1 },
        pressed && { opacity: 0.94, transform: [{ scale: 0.99 }] },
        style,
      ]}
      accessibilityLabel={`${product.title}, ${formatPrice(product.price)}`}
    >
      <View style={styles.imageWrap}>
        <ProductImage product={product} size={imageSize} rounded={10} />
        <Pressable hitSlop={10} onPress={() => toggleWishlist(product.id)} style={styles.heart} accessibilityLabel="Wishlist">
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={15} color={liked ? '#E11D48' : lightBlueTheme.textMuted} />
        </Pressable>
        {product.assured ? (
          <View style={styles.assured}>
            <Ionicons name="shield-checkmark" size={10} color={lightBlueTheme.accent} />
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
            <Ionicons name="star" size={9} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </View>
          <Text style={styles.reviews}>({formatCount(product.reviews)})</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {off > 0 ? <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text> : null}
        </View>
        <View style={styles.footer}>
          {off > 0 ? (
            <View style={styles.offBadge}>
              <Text style={styles.off}>{off}% off</Text>
            </View>
          ) : <View />}
          <Pressable
            hitSlop={6}
            onPress={() => (inCart ? nav.navigate('Tabs', { screen: 'Cart' }) : addToCart(product, firstVariant))}
            style={[styles.add, inCart && styles.added]}
            accessibilityLabel={inCart ? 'In bag' : 'Add to bag'}
          >
            <Text style={[styles.addText, inCart && { color: '#FFFFFF' }]}>{inCart ? 'Added' : 'Add'}</Text>
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
    backgroundColor: lightBlueTheme.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
    padding: 8,





  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
    alignItems: 'center',
    justifyContent: 'center',





  },
  assured: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
  },
  assuredText: {
    fontSize: 9,
    fontWeight: '700',
    color: lightBlueTheme.accent,
    marginLeft: 3,
  },
  body: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  brand: {
    fontSize: 11,
    color: lightBlueTheme.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 12,
    color: lightBlueTheme.text,
    marginTop: 2,
    lineHeight: 16,
    minHeight: 32,
    fontWeight: '500',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightBlueTheme.accent,
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  reviews: {
    fontSize: 11,
    color: lightBlueTheme.textMuted,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  price: {
    fontWeight: '700',
    fontSize: 15,
    color: lightBlueTheme.text,
  },
  mrp: {
    color: '#8A9EB5',
    textDecorationLine: 'line-through',
    fontSize: 11,
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  offBadge: {
    backgroundColor: lightBlueTheme.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  off: {
    color: lightBlueTheme.accentDark,
    fontSize: 11,
    fontWeight: '800',
  },
  add: {
    borderWidth: 1.2,
    borderColor: lightBlueTheme.accent,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  added: {
    backgroundColor: lightBlueTheme.accent,
  },
  addText: {
    fontSize: 11,
    fontWeight: '700',
    color: lightBlueTheme.accent,
  },
});

