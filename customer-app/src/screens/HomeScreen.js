import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from '../components/Flat';
import HomeHeader from '../components/HomeHeader';
import HeroCarousel from '../components/HeroCarousel';
import ShopTiles from '../components/ShopTiles';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { colors, fonts, pastels } from '../theme';
import { getBanners, getCategories, getProducts, getPromos, getProductById } from '../services/api';
import { brands } from '../data/catalog';
import { discountPct, formatPrice } from '../utils/format';
import { useApp } from '../context/AppContext';
import { BRAND } from '../config/app';
import { useAppWidth } from '../utils/platform';

function useCountdown() {
  const calc = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return Math.max(0, Math.floor((end - now) / 1000));
  };
  const [left, setLeft] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60].map((n) => String(n).padStart(2, '0'));
}

// Sirf timer har second re-render hota hai, poora page nahi (images blink nahi karengi)
function DealTimer({ style }) {
  const [hh, mm, ss] = useCountdown();
  return <Text style={style}>{hh}h : {mm}m : {ss}s left</Text>;
}

export default function HomeScreen({ navigation }) {
  const { width } = useAppWidth();
  const { recentlyViewed } = useApp();
  const [cats, setCats] = useState([]);
  const [banners, setBanners] = useState([]);
  const [promos, setPromos] = useState([]);
  const [all, setAll] = useState([]);
  const cardW = (width - 24 - 8) / 2;
  const tileW = (width - 24 - 16) / 3;

  useEffect(() => {
    getCategories().then(setCats);
    getBanners().then(setBanners);
    getPromos().then(setPromos);
    getProducts().then(setAll);
  }, []);

  const openCat = (id, title) => navigation.navigate('ProductList', { category: id, title });
  const openProduct = (id) => navigation.navigate('ProductDetail', { id });

  const s = useMemo(() => {
    const byDiscount = [...all].sort((a, b) => discountPct(b.mrp, b.price) - discountPct(a.mrp, a.price));
    const byCat = (c) => all.filter((p) => p.category === c);
    return {
      deals: byDiscount.slice(0, 8),
      trending: all.filter((p) => p.tags.includes('trending')),
      under999: all.filter((p) => p.price <= 999).slice(0, 8),
      bestElectronics: byCat('electronics').slice(0, 6),
      fashionFoot: [...byCat('fashion'), ...byCat('footwear')].slice(0, 4),
      topPicks: [...all].sort((a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews)).slice(0, 6),
    };
  }, [all]);

  const recent = recentlyViewed.map(getProductById).filter(Boolean);

  const row = (data, w = 140, img = 120) => (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(i) => i.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      renderItem={({ item }) => <ProductCard product={item} width={w} imageSize={img} />}
    />
  );

  // Flipkart-style offer tile: image + name + green "Min. X% off"
  const OfferTile = ({ p, w }) => (
    <Pressable style={[styles.offerTile, { width: w }]} onPress={() => openProduct(p.id)}>
      <ProductImage product={p} size={w - 16} rounded={6} />
      <Text style={styles.offerName} numberOfLines={1}>{p.sub || p.brand}</Text>
      <Text style={styles.offerOff}>Min. {Math.floor(discountPct(p.mrp, p.price) / 10) * 10}% Off</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Category tiles — pastel backgrounds */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catStrip} contentContainerStyle={{ paddingHorizontal: 8 }}>
          {cats.map((c, i) => (
            <Pressable key={c.id} style={styles.catItem} onPress={() => openCat(c.id, c.name)} accessibilityLabel={c.name}>
              <View style={[styles.catBg, { backgroundColor: pastels[i % pastels.length] }]}>
                <Image source={{ uri: c.image }} style={styles.catImg} />
              </View>
              <Text style={styles.catText} numberOfLines={1}>{c.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Sale strip */}
        <LinearGradient colors={['#FFD21F', '#FF9F1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saleStrip}>
          <Ionicons name="flash" size={18} color={colors.black} />
          <Text style={styles.saleText}>The Big Thousand Days are live</Text>
          <View style={styles.saleBadge}><Text style={styles.saleBadgeText}>Up to 80% off</Text></View>
        </LinearGradient>

        <HeroCarousel banners={banners} onPress={(b) => openCat(b.link.category, b.title.replace('\n', ' '))} />

        {/* Shop by category — arch tiles, 2 rows */}
        <ShopTiles navigation={navigation} />

        {/* Bank offers */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bankRow} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {[
            ['card', '10% instant discount', 'on UPI payments', '#E8F0FF', colors.accent],
            ['wallet', '5% cashback', 'on Thousands Pay Later', '#E9F8EF', colors.success],
            ['bicycle', 'Free delivery', 'on orders above ₹499', '#FFF4E0', '#E67E00'],
            ['refresh', '7-day returns', 'on most products', '#FDECF1', colors.sale],
          ].map(([ic, t, sub, bg, fg]) => (
            <View key={t} style={[styles.bankCard, { backgroundColor: bg }]}>
              <View style={[styles.bankIcon, { backgroundColor: fg }]}><Ionicons name={ic} size={16} color={colors.white} /></View>
              <View>
                <Text style={styles.bankTitle}>{t}</Text>
                <Text style={styles.bankSub}>{sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Deals of the day — gradient block */}
        <LinearGradient colors={['#2B50E0', '#6A3DE8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dealBlock}>
          <View style={styles.dealHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dealTitle}>Deals of the Day</Text>
              <View style={styles.timerRow}>
                <Ionicons name="alarm-outline" size={14} color={colors.yellow} />
                <DealTimer style={styles.timerLabel} />
              </View>
            </View>
            <Pressable style={styles.whiteBtn} onPress={() => navigation.navigate('ProductList', { title: 'Deals of the Day', sort: 'discount' })}>
              <Text style={styles.whiteBtnText}>View all</Text>
            </Pressable>
          </View>
          {row(s.deals)}
        </LinearGradient>

        {/* Best of Electronics — 3-col offer grid */}
        <View style={[styles.section, { backgroundColor: '#EAF2FF' }]}>
          <SecHead title="Best of Electronics" onAll={() => openCat('electronics', 'Electronics')} />
          <View style={styles.tileGrid}>
            {s.bestElectronics.map((p) => <OfferTile key={p.id} p={p} w={tileW} />)}
          </View>
        </View>

        {/* Promo banners */}
        <View style={[styles.section, { flexDirection: 'row', gap: 8, paddingHorizontal: 12 }]}>
          {promos.map((p, i) => (
            <Pressable key={p.id} style={{ flex: 1 }} onPress={() => openCat(p.link.category, p.title)}>
              <ImageBackground source={{ uri: p.image }} style={styles.promo} imageStyle={{ borderRadius: 4 }}>
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']} style={styles.promoShade}>
                  <View style={[styles.promoTag, { backgroundColor: i === 0 ? colors.sale : colors.success }]}>
                    <Text style={styles.promoTagText}>{i === 0 ? 'Hot deal' : 'New'}</Text>
                  </View>
                  <Text style={styles.promoTitle}>{p.title}</Text>
                  <Text style={styles.promoSub}>{p.subtitle}</Text>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <SecHead title="Trending Now" sub="Most bought this week" onAll={() => navigation.navigate('ProductList', { title: 'Trending Now', tag: 'trending' })} />
          {row(s.trending)}
        </View>

        {/* Fashion offers — 2x2 on pastel */}
        <View style={[styles.section, { backgroundColor: '#FFF1F4' }]}>
          <SecHead title="Fashion Top Deals" onAll={() => openCat('fashion', 'Fashion')} />
          <View style={styles.tileGrid}>
            {s.fashionFoot.map((p) => <OfferTile key={p.id} p={p} w={cardW} />)}
          </View>
        </View>

        {/* Under 999 — yellow block */}
        <View style={[styles.section, { backgroundColor: '#FFF8D6' }]}>
          <SecHead title="Budget Store" sub="Everything under ₹999" onAll={() => navigation.navigate('ProductList', { title: 'Under ₹999', maxPrice: 999 })} />
          <FlatList
            horizontal
            data={s.under999}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
            renderItem={({ item }) => (
              <Pressable style={styles.budgetCard} onPress={() => openProduct(item.id)}>
                <ProductImage product={item} size={96} rounded={8} />
                <Text style={styles.budgetPrice}>{formatPrice(item.price)}</Text>
                <Text style={styles.budgetName} numberOfLines={1}>{item.title}</Text>
              </Pressable>
            )}
          />
        </View>

        {/* Brands */}
        <View style={styles.section}>
          <SecHead title="Top Brands" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}>
            {brands.map((b, i) => (
              <Pressable key={b} style={styles.brand} onPress={() => navigation.navigate('ProductList', { brand: b, title: b })}>
                <View style={[styles.brandCircle, { backgroundColor: pastels[(i + 2) % pastels.length] }]}>
                  <Text style={styles.brandInitial}>{b[0]}</Text>
                </View>
                <Text style={styles.brandText} numberOfLines={1}>{b}</Text>
                <Text style={styles.brandOff}>Up to 60% off</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {recent.length ? (
          <View style={styles.section}>
            <SecHead title="Recently Viewed" />
            {row(recent, 120, 100)}
          </View>
        ) : null}

        <View style={styles.section}>
          <SecHead title="Suggested For You" sub="Based on top ratings" onAll={() => navigation.navigate('ProductList', { title: 'Top Rated', sort: 'rating' })} />
          <View style={styles.grid}>
            {s.topPicks.map((p) => (
              <ProductCard key={p.id} product={p} width={cardW} imageSize={cardW * 0.8} style={{ marginBottom: 8 }} />
            ))}
          </View>
        </View>

        {/* Trust */}
        <View style={[styles.section, styles.trust]}>
          {[
            ['shield-checkmark', '100% Genuine', '#E8F0FF', colors.accent],
            ['lock-closed', 'Secure Payments', '#E9F8EF', colors.success],
            ['headset', '24/7 Support', '#FFF4E0', '#E67E00'],
          ].map(([ic, t, bg, fg]) => (
            <View key={t} style={styles.trustItem}>
              <View style={[styles.trustIcon, { backgroundColor: bg }]}><Ionicons name={ic} size={20} color={fg} /></View>
              <Text style={styles.trustTitle}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Sell banner */}
        <Pressable onPress={() => navigation.navigate('Support', { seller: true })}>
          <LinearGradient colors={['#111827', '#1F2A4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sell}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellTitle}>Sell on {BRAND.name}</Text>
              <Text style={styles.sellSub}>Reach crores of customers. No registration fee.</Text>
              <View style={styles.sellBtn}><Text style={styles.sellBtnText}>Start selling</Text></View>
            </View>
            <Ionicons name="storefront" size={56} color="rgba(255,210,31,0.9)" />
          </LinearGradient>
        </Pressable>

        <View style={styles.footer}>
          <Image source={require('../../assets/logo-black.png')} style={{ width: 18, height: 21, opacity: 0.25 }} resizeMode="contain" />
          <Text style={styles.footerText}>{BRAND.tagline}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SecHead({ title, sub, onAll }) {
  return (
    <View style={styles.secHead}>
      <View style={{ flex: 1 }}>
        <Text style={styles.secTitle}>{title}</Text>
        {sub ? <Text style={styles.secSub}>{sub}</Text> : null}
      </View>
      {onAll ? (
        <Pressable onPress={onAll} hitSlop={8} style={styles.arrowBtn} accessibilityLabel={`View all ${title}`}>
          <Ionicons name="chevron-forward" size={18} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: colors.white, paddingVertical: 14, marginTop: 8 },
  secHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 12 },
  secTitle: { fontWeight: '700', fontSize: 17, color: colors.black },
  secSub: { fontSize: 12, color: colors.muted, marginTop: 1 },
  arrowBtn: { width: 30, height: 30, borderRadius: 4, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },

  catStrip: { backgroundColor: colors.white, paddingVertical: 12 },
  catItem: { width: 76, alignItems: 'center' },
  catBg: { width: 60, height: 60, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  catImg: { width: 46, height: 46, borderRadius: 4 },
  catText: { fontSize: 11, color: colors.ink, marginTop: 5, fontWeight: '600', maxWidth: 72 },

  saleStrip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9 },
  saleText: { flex: 1, marginLeft: 6, fontWeight: '700', fontSize: 13, color: colors.black },
  saleBadge: { backgroundColor: colors.black, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  saleBadgeText: { color: colors.yellow, fontSize: 11, fontWeight: '800' },

  bankRow: { backgroundColor: colors.white, paddingVertical: 10 },
  bankCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 4, paddingVertical: 9, paddingHorizontal: 10, gap: 8 },
  bankIcon: { width: 30, height: 30, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  bankTitle: { fontSize: 12, fontWeight: '700', color: colors.black },
  bankSub: { fontSize: 10, color: colors.muted },

  dealBlock: { marginTop: 8, paddingVertical: 14 },
  dealHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 12 },
  dealTitle: { fontWeight: '700', fontSize: 18, color: colors.white },
  timerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  timerLabel: { color: colors.white, fontSize: 12, marginLeft: 4, fontWeight: '600', fontVariant: ['tabular-nums'] },
  whiteBtn: { backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
  whiteBtnText: { color: colors.accent, fontSize: 12, fontWeight: '700' },

  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  offerTile: { backgroundColor: colors.white, borderRadius: 4, padding: 8, alignItems: 'center' },
  offerName: { fontSize: 12, color: colors.ink, marginTop: 6, fontWeight: '500' },
  offerOff: { fontSize: 13, color: colors.success, fontWeight: '800', marginTop: 1 },

  promo: { height: 140 },
  promoShade: { flex: 1, borderRadius: 4, justifyContent: 'flex-end', padding: 10 },
  promoTag: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 4 },
  promoTagText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  promoTitle: { fontWeight: '700', fontSize: 15, color: colors.white },
  promoSub: { color: colors.yellow, fontWeight: '700', fontSize: 11, marginTop: 1 },

  budgetCard: { width: 112, backgroundColor: colors.white, borderRadius: 4, padding: 8 },
  budgetPrice: { fontWeight: '700', fontSize: 14, color: colors.black, marginTop: 6 },
  budgetName: { fontSize: 11, color: colors.muted, marginTop: 1 },

  brand: { alignItems: 'center', width: 78 },
  brandCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  brandInitial: { fontWeight: '700', color: colors.black, fontSize: 22 },
  brandText: { fontSize: 12, marginTop: 5, color: colors.ink, fontWeight: '600' },
  brandOff: { fontSize: 10, color: colors.success, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 12 },

  trust: { flexDirection: 'row' },
  trustItem: { flex: 1, alignItems: 'center' },
  trustIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  trustTitle: { fontSize: 12, marginTop: 6, color: colors.ink, fontWeight: '600' },

  sell: { flexDirection: 'row', alignItems: 'center', marginTop: 8, padding: 18 },
  sellTitle: { fontWeight: '700', fontSize: 18, color: colors.white },
  sellSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 3 },
  sellBtn: { alignSelf: 'flex-start', backgroundColor: colors.yellow, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 7, marginTop: 10 },
  sellBtnText: { color: colors.black, fontSize: 12, fontWeight: '700' },

  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 11, color: colors.faint, marginTop: 6 },
});
