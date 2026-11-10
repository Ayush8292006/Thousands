import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import { Button, RatingChip, Card, Chip, Divider } from '../components/ui';
import { colors, font, radius } from '../theme';
import { getProductById } from '../services/api';
import { products, offers, sampleReviews } from '../data/catalog';
import { formatPrice, discountPct, formatDate, addDays } from '../utils/format';
import { region } from '../config/tax';
import { DELIVERY } from '../config/app';
import { useApp } from '../context/AppContext';
import { useAppWidth, shareText } from '../utils/platform';

export default function ProductDetailScreen({ route, navigation }) {
  const product = getProductById(route.params.id);
  const { width } = useAppWidth();
  const insets = useSafeAreaInsets();
  const { addToCart, cart, wishlist, toggleWishlist, addRecentlyViewed } = useApp();
  const [variant, setVariant] = useState(product.variants ? product.variants.options[0] : null);
  const [slide, setSlide] = useState(0);
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');
  const liked = wishlist.includes(product.id);
  const off = discountPct(product.mrp, product.price);
  const inCart = cart.some((i) => i.key === `${product.id}|${variant || ''}`);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6);

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 18 }}>
          <Pressable hitSlop={8} onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search" size={21} color={colors.black} />
          </Pressable>
          <Pressable hitSlop={8} onPress={() => navigation.navigate('Tabs', { screen: 'Cart' })}>
            <Ionicons name="bag-outline" size={22} color={colors.black} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) return setPinMsg('Enter a valid 6-digit pincode');
    setPinMsg(`Delivery by ${formatDate(addDays(DELIVERY.days))} · ${product.price >= DELIVERY.freeAbove ? 'FREE' : formatPrice(DELIVERY.fee)}`);
  };

  const onAdd = () => {
    if (inCart) return navigation.navigate('Tabs', { screen: 'Cart' });
    addToCart(product, variant);
  };
  const onBuy = () => {
    if (!inCart) addToCart(product, variant);
    navigation.navigate('Checkout');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Gallery */}
        <View style={{ backgroundColor: colors.white }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {product.images.map((u) => (
              <View key={u} style={{ width, padding: 12 }}>
                <ProductImage product={product} uri={u} size={Math.round(width * 0.78)} rounded={radius.xl} />
              </View>
            ))}
          </ScrollView>
          <View style={styles.galleryActions}>
            <Pressable style={styles.roundBtn} onPress={() => toggleWishlist(product.id)}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? colors.danger : colors.black} />
            </Pressable>
            <Pressable style={styles.roundBtn} onPress={() => shareText(`${product.title}, ${formatPrice(product.price)} on Thousands`)}>
              <Ionicons name="share-social-outline" size={19} color={colors.black} />
            </Pressable>
          </View>
          <View style={styles.dots}>
            {product.images.length > 1 ? product.images.map((u, i) => <View key={u} style={[styles.dot, i === slide && styles.dotOn]} />) : null}
          </View>

          <View style={{ padding: 16, paddingTop: 4 }}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.title}>{product.title}{variant ? ` (${variant})` : ''}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <RatingChip value={product.rating} />
              <Text style={styles.reviews}>{product.reviews.toLocaleString('en-IN')} ratings</Text>
              {product.assured ? (
                <View style={styles.assured}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.accent} />
                  <Text style={styles.assuredText}>Assured</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.priceRow}>
              {off > 0 ? <Text style={styles.off}>↓{off}%</Text> : null}
              {off > 0 ? <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text> : null}
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
            </View>
            <Text style={font.small}>
              {region.priceInclusive ? `Inclusive of all taxes (${region.taxName})` : `+ ${region.taxName} as applicable`}
            </Text>
          </View>
        </View>

        {/* Variants */}
        {product.variants ? (
          <Card style={styles.block}>
            <Text style={styles.blockTitle}>Select {product.variants.label}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 }}>
              {product.variants.options.map((o) => (
                <Chip key={o} label={o} active={variant === o} onPress={() => setVariant(o)} />
              ))}
            </View>
          </Card>
        ) : null}

        {/* Offers */}
        <Card style={styles.block}>
          <Text style={styles.blockTitle}>Available offers</Text>
          {offers.map((o) => (
            <View key={o} style={styles.offer}>
              <Ionicons name="pricetag" size={14} color={colors.accent} style={{ marginTop: 2 }} />
              <Text style={styles.offerText}>{o}</Text>
            </View>
          ))}
        </Card>

        {/* Delivery */}
        <Card style={styles.block}>
          <Text style={styles.blockTitle}>Delivery</Text>
          <View style={styles.pinRow}>
            <Ionicons name="location-outline" size={18} color={colors.muted} />
            <TextInput
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter delivery pincode"
              placeholderTextColor={colors.faint}
              keyboardType="number-pad"
              style={styles.pinInput}
            />
            <Pressable onPress={checkPin}><Text style={styles.check}>Check</Text></Pressable>
          </View>
          {pinMsg ? <Text style={[font.small, { marginTop: 8, color: colors.ink, fontWeight: '600' }]}>{pinMsg}</Text> : null}
          <Divider style={{ marginVertical: 12 }} />
          <View style={styles.feat}>
            {[['refresh-outline', '7 days return'], ['cash-outline', 'Cash on Delivery'], ['ribbon-outline', 'Warranty as per brand']].map(([i, t]) => (
              <View key={t} style={styles.featItem}>
                <Ionicons name={i} size={20} color={colors.black} />
                <Text style={styles.featText}>{t}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Seller */}
        <Card style={styles.block}>
          <Text style={styles.blockTitle}>Seller</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.sellerIcon}><Ionicons name="storefront-outline" size={20} color={colors.white} /></View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: '700', fontSize: 14 }}>{product.sellerName}</Text>
              <Text style={font.small}>Ships from {product.sellerState}</Text>
            </View>
            <RatingChip value={product.sellerRating} />
          </View>
        </Card>

        {/* Highlights */}
        {product.highlights.length ? (
          <Card style={styles.block}>
            <Text style={styles.blockTitle}>Highlights</Text>
            {product.highlights.map((h) => (
              <View key={h} style={styles.hl}>
                <View style={styles.bullet} />
                <Text style={styles.hlText}>{h}</Text>
              </View>
            ))}
          </Card>
        ) : null}

        {/* Reviews */}
        <Card style={styles.block}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={[styles.blockTitle, { flex: 1, marginBottom: 0 }]}>Ratings & Reviews</Text>
            <RatingChip value={product.rating} />
          </View>
          {sampleReviews.map((r) => (
            <View key={r.id} style={styles.review}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RatingChip value={r.rating} small />
                <Text style={{ fontWeight: '700', marginLeft: 8 }}>{r.title}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
              <Text style={font.tiny}>{r.name} · {r.date} · Certified Buyer</Text>
            </View>
          ))}
        </Card>

        {/* Similar */}
        {similar.length ? (
          <View style={{ marginTop: 10 }}>
            <Text style={[font.h2, { paddingHorizontal: 16, marginVertical: 10 }]}>Similar products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
              {similar.map((p) => <ProductCard key={p.id} product={p} width={120} imageSize={105} />)}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 10 }]}>
        <Button title={inCart ? 'Go to Cart' : 'Add to Cart'} variant="outline" icon="cart-outline" style={{ flex: 1 }} onPress={onAdd} />
        <Button title="Buy Now" icon="flash-outline" style={{ flex: 1 }} onPress={onBuy} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryActions: { position: 'absolute', top: 26, right: 26, gap: 10 },
  roundBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border, marginHorizontal: 3 },
  dotOn: { backgroundColor: colors.black, width: 16 },
  brand: { fontSize: 13, fontWeight: '600', color: colors.accent },
  title: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: colors.black, marginTop: 4, lineHeight: 25, letterSpacing: -0.3 },
  reviews: { marginLeft: 8, color: colors.muted, fontSize: 12 },
  assured: {
    flexDirection: 'row', alignItems: 'center', marginLeft: 10, backgroundColor: colors.accentSoft,
    borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
  },
  assuredText: { fontSize: 11, fontWeight: '700', color: colors.ink, marginLeft: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 12, marginBottom: 2 },
  off: { color: colors.sale, fontSize: 18, fontWeight: '800', marginRight: 8 },
  mrp: { color: colors.faint, textDecorationLine: 'line-through', fontSize: 15, marginRight: 8 },
  price: { fontSize: 28, fontFamily: 'PlusJakartaSans_700Bold', color: colors.black, letterSpacing: -0.6 },
  block: { marginHorizontal: 0, marginTop: 10, borderRadius: 0 },
  blockTitle: { fontSize: 15, fontWeight: '800', marginBottom: 12, color: colors.black },
  offer: { flexDirection: 'row', marginBottom: 8 },
  offerText: { flex: 1, marginLeft: 8, fontSize: 13, color: colors.ink, lineHeight: 18 },
  pinRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: radius.md, paddingHorizontal: 10, height: 46 },
  pinInput: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.black },
  check: { fontWeight: '800', color: colors.accent },
  feat: { flexDirection: 'row', justifyContent: 'space-between' },
  featItem: { alignItems: 'center', flex: 1 },
  featText: { fontSize: 11, color: colors.ink, marginTop: 4, textAlign: 'center' },
  sellerIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  hl: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.black, marginTop: 7, marginRight: 10 },
  hlText: { flex: 1, fontSize: 13, color: colors.ink, lineHeight: 19 },
  review: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  reviewText: { fontSize: 13, color: colors.ink, marginVertical: 6, lineHeight: 18 },
  bottom: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10,
    backgroundColor: colors.white, paddingHorizontal: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border,
  },
});
