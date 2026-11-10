import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeHeader from '../components/HomeHeader';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { colors, fonts, font } from '../theme';
import { getBanners, getCategories, getProducts, getPromos, getProductById } from '../services/api';
import { brands } from '../data/catalog';
import { discountPct } from '../utils/format';
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

export default function HomeScreen({ navigation }) {
  const { width } = useAppWidth();
  const { recentlyViewed } = useApp();
  const [cats, setCats] = useState([]);
  const [banners, setBanners] = useState([]);
  const [promos, setPromos] = useState([]);
  const [all, setAll] = useState([]);
  const [hh, mm, ss] = useCountdown();
  const cardW = (width - 32 - 10) / 2;

  useEffect(() => {
    getCategories().then(setCats);
    getBanners().then(setBanners);
    getPromos().then(setPromos);
    getProducts().then(setAll);
  }, []);

  const openCat = (id, title) => navigation.navigate('ProductList', { category: id, title });

  const sections = useMemo(() => {
    const byDiscount = [...all].sort((a, b) => discountPct(b.mrp, b.price) - discountPct(a.mrp, a.price));
    return {
      deals: byDiscount.slice(0, 8),
      trending: all.filter((p) => p.tags.includes('trending')),
      under999: all.filter((p) => p.price <= 999).slice(0, 8),
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
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      renderItem={({ item }) => <ProductCard product={item} width={w} imageSize={img} />}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.mist }}>
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <HeroCarousel banners={banners} onPress={(b) => openCat(b.link.category, b.title.replace('\n', ' '))} />

        {/* Offer strip */}
        <View style={styles.offerStrip}>
          {[
            ['flash-outline', '10% off on UPI'],
            ['bicycle-outline', 'Free delivery'],
            ['cash-outline', 'Cash on delivery'],
            ['refresh-outline', '7-day returns'],
          ].map(([ic, t]) => (
            <View key={t} style={styles.offerItem}>
              <Ionicons name={ic} size={18} color={colors.accent} />
              <Text style={styles.offerText} numberOfLines={2}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <Section title="Shop by category" onAll={() => navigation.navigate('Categories')}>
          <View style={styles.catGrid}>
            {cats.map((c) => (
              <Pressable key={c.id} style={styles.catItem} onPress={() => openCat(c.id, c.name)} accessibilityLabel={c.name}>
                <Image source={{ uri: c.image }} style={styles.catImg} />
                <Text style={styles.catText} numberOfLines={2}>{c.name}</Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* Deals */}
        <View style={[styles.section, { backgroundColor: colors.accentSoft }]}>
          <View style={styles.secHead}>
            <View style={{ flex: 1 }}>
              <Text style={font.h2}>Deals of the day</Text>
              <View style={styles.timerRow}>
                <Ionicons name="time-outline" size={14} color={colors.accent} />
                <Text style={styles.timerLabel}>Ends in</Text>
                {[hh, mm, ss].map((v, i) => (
                  <React.Fragment key={i}>
                    <View style={styles.timeBox}><Text style={styles.timeText}>{v}</Text></View>
                    {i < 2 ? <Text style={styles.timeSep}>:</Text> : null}
                  </React.Fragment>
                ))}
              </View>
            </View>
            <Pressable style={styles.viewAll} onPress={() => navigation.navigate('ProductList', { title: 'Deals of the day', sort: 'discount' })}>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>
          {row(sections.deals)}
        </View>

        <Section title="Trending now" onAll={() => navigation.navigate('ProductList', { title: 'Trending now', tag: 'trending' })}>
          {row(sections.trending)}
        </Section>

        {/* Promo pair */}
        <View style={[styles.section, { paddingHorizontal: 16, flexDirection: 'row', gap: 10 }]}>
          {promos.map((p) => (
            <Pressable key={p.id} style={styles.promo} onPress={() => openCat(p.link.category, p.title)}>
              <ImageBackground source={{ uri: p.image }} style={styles.promoImg} imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
              <View style={styles.promoBody}>
                <Text style={styles.promoTitle}>{p.title}</Text>
                <Text style={styles.promoSub}>{p.subtitle}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Section title="Under ₹999" onAll={() => navigation.navigate('ProductList', { title: 'Under ₹999', maxPrice: 999 })}>
          {row(sections.under999)}
        </Section>

        <Section title="Top brands">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {brands.map((b) => (
              <Pressable key={b} style={styles.brand} onPress={() => navigation.navigate('ProductList', { brand: b, title: b })}>
                <View style={styles.brandCircle}><Text style={styles.brandInitial}>{b[0]}</Text></View>
                <Text style={styles.brandText} numberOfLines={1}>{b}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Section>

        {recent.length ? <Section title="Recently viewed">{row(recent, 120, 100)}</Section> : null}

        <Section title="Top picks for you" onAll={() => navigation.navigate('ProductList', { title: 'Top rated', sort: 'rating' })}>
          <View style={styles.grid}>
            {sections.topPicks.map((p) => (
              <ProductCard key={p.id} product={p} width={cardW} imageSize={cardW * 0.8} style={{ marginBottom: 10 }} />
            ))}
          </View>
        </Section>

        {/* Trust */}
        <View style={[styles.section, styles.trust]}>
          {[
            ['shield-checkmark-outline', 'Genuine products'],
            ['lock-closed-outline', 'Secure payments'],
            ['headset-outline', '24/7 support'],
          ].map(([ic, t]) => (
            <View key={t} style={styles.trustItem}>
              <Ionicons name={ic} size={22} color={colors.accent} />
              <Text style={styles.trustTitle}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Sell */}
        <Pressable style={styles.sell} onPress={() => navigation.navigate('Support', { seller: true })}>
          <View style={styles.sellIcon}><Ionicons name="storefront-outline" size={22} color={colors.accent} /></View>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={styles.sellTitle}>Sell on {BRAND.name}</Text>
            <Text style={styles.sellSub}>No registration fee. Weekly payouts.</Text>
          </View>
          <View style={styles.sellBtn}><Text style={styles.sellBtnText}>Start selling</Text></View>
        </Pressable>

        <View style={styles.footer}>
          <Image source={require('../../assets/logo-black.png')} style={{ width: 18, height: 21, opacity: 0.25 }} resizeMode="contain" />
          <Text style={styles.footerText}>{BRAND.tagline}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, onAll, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.secHead}>
        <Text style={[font.h2, { flex: 1 }]}>{title}</Text>
        {onAll ? (
          <Pressable onPress={onAll} hitSlop={8} style={styles.viewAll}>
            <Text style={styles.viewAllText}>View all</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: colors.white, paddingVertical: 14, marginTop: 8 },
  secHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  viewAll: { backgroundColor: colors.accent, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  viewAllText: { color: colors.white, fontSize: 12, fontFamily: fonts.displayMedium },

  offerStrip: { flexDirection: 'row', backgroundColor: colors.white, paddingVertical: 12, paddingHorizontal: 8 },
  offerItem: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  offerText: { fontSize: 11, color: colors.ink, marginTop: 4, textAlign: 'center', fontWeight: '500' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  catItem: { width: '25%', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  catImg: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.mist },
  catText: { fontSize: 11, color: colors.ink, marginTop: 6, textAlign: 'center', fontWeight: '500' },

  timerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  timerLabel: { fontSize: 12, color: colors.muted, marginHorizontal: 4 },
  timeBox: { backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  timeText: { color: colors.white, fontSize: 12, fontFamily: fonts.display, fontVariant: ['tabular-nums'] },
  timeSep: { color: colors.accent, fontWeight: '700', marginHorizontal: 2 },

  promo: { flex: 1, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  promoImg: { height: 100, backgroundColor: colors.mist },
  promoBody: { padding: 10 },
  promoTitle: { fontFamily: fonts.display, fontSize: 14, color: colors.black },
  promoSub: { color: colors.success, fontWeight: '600', fontSize: 12, marginTop: 2 },

  brand: { alignItems: 'center', width: 64 },
  brandCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  brandInitial: { fontFamily: fonts.display, color: colors.accent, fontSize: 20 },
  brandText: { fontSize: 11, marginTop: 6, color: colors.ink },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },

  trust: { flexDirection: 'row' },
  trustItem: { flex: 1, alignItems: 'center' },
  trustTitle: { fontSize: 12, marginTop: 6, color: colors.ink, fontWeight: '500' },

  sell: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginTop: 8, padding: 16 },
  sellIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  sellTitle: { fontFamily: fonts.display, fontSize: 15, color: colors.black },
  sellSub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  sellBtn: { borderWidth: 1, borderColor: colors.accent, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  sellBtnText: { color: colors.accent, fontSize: 12, fontFamily: fonts.displayMedium },

  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { fontSize: 11, color: colors.faint, marginTop: 6 },
});
