import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, FlatList, ImageBackground, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeHeader from '../components/HomeHeader';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { colors, fonts, font, TAB_BAR_SPACE } from '../theme';
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

  const inner = width - 32;
  const cardW = (inner - 12) / 2;

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
  const [c0, c1, c2, c3, c4, c5, c6, c7] = cats;
  const bigW = (inner - 10) / 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE + 24 }}>
        {/* Hero — full-width auto slider */}
        <HeroCarousel banners={banners} onPress={(b) => openCat(b.link.category, b.title.replace('\n', ' '))} />

        {/* Category bento */}
        <SectionTitle title="Shop by category" />
        {cats.length === 8 ? (
          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <BentoTile cat={c0} w={bigW} h={150} big onPress={openCat} />
              <View style={{ gap: 10 }}>
                <BentoTile cat={c1} w={bigW} h={70} onPress={openCat} />
                <BentoTile cat={c2} w={bigW} h={70} onPress={openCat} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[c3, c4, c5].map((c) => <BentoTile key={c.id} cat={c} w={(inner - 20) / 3} h={82} onPress={openCat} />)}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[c6, c7].map((c) => <BentoTile key={c.id} cat={c} w={(inner - 10) / 2} h={72} onPress={openCat} />)}
            </View>
          </View>
        ) : null}

        {/* Deals band */}
        <View style={styles.deals}>
          <View style={styles.dealsHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dealsTitle}>Deals of the day</Text>
              <Text style={styles.dealsSub}>Prices reset at midnight</Text>
            </View>
            <View style={styles.timer} accessibilityLabel={`Ends in ${hh} hours ${mm} minutes`}>
              {[hh, mm, ss].map((v, i) => (
                <React.Fragment key={i}>
                  <View style={styles.timeBox}><Text style={styles.timeText}>{v}</Text></View>
                  {i < 2 ? <Text style={styles.timeSep}>:</Text> : null}
                </React.Fragment>
              ))}
            </View>
          </View>
          <FlatList
            horizontal
            data={sections.deals}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
            renderItem={({ item }) => <ProductCard product={item} width={124} imageSize={110} onDark />}
          />
          <Pressable style={styles.dealsAll} onPress={() => navigation.navigate('ProductList', { title: 'Deals of the day', sort: 'discount' })}>
            <Text style={styles.dealsAllText}>See all deals</Text>
          </Pressable>
        </View>

        {/* Trending */}
        <SectionTitle title="Trending now" onAll={() => navigation.navigate('ProductList', { title: 'Trending now', tag: 'trending' })} />
        <FlatList
          horizontal
          data={sections.trending}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
          renderItem={({ item }) => <ProductCard product={item} width={124} imageSize={115} />}
        />

        {/* Promo pair */}
        <View style={styles.promoRow}>
          {promos.map((p) => (
            <Pressable key={p.id} style={{ flex: 1 }} onPress={() => openCat(p.link.category, p.title)}>
              <ImageBackground source={{ uri: p.image }} style={[styles.promo, { height: 120 }]} imageStyle={{ borderRadius: 24 }}>
                <View style={styles.promoTag}>
                  <Text style={styles.promoTitle}>{p.title}</Text>
                  <Text style={styles.promoSub}>{p.subtitle}</Text>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        {/* Under 999 */}
        <View style={styles.under}>
          <SectionTitle title="Under ₹999" inline onAll={() => navigation.navigate('ProductList', { title: 'Under ₹999', maxPrice: 999 })} />
          <FlatList
            horizontal
            data={sections.under999}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
            renderItem={({ item }) => <ProductCard product={item} width={120} imageSize={105} />}
          />
        </View>

        {/* Brands — double ring, logo motif */}
        <SectionTitle title="Brands on Thousands" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}>
          {brands.map((b) => (
            <Pressable key={b} style={{ alignItems: 'center', width: 62 }} onPress={() => navigation.navigate('ProductList', { brand: b, title: b })}>
              <View style={styles.brandRing}>
                <View style={styles.brandDot}><Text style={styles.brandInitial}>{b[0]}</Text></View>
              </View>
              <Text style={styles.brandText} numberOfLines={1}>{b}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {recent.length ? (
          <>
            <SectionTitle title="Continue browsing" />
            <FlatList
              horizontal
              data={recent}
              keyExtractor={(i) => i.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
              renderItem={({ item }) => <ProductCard product={item} width={110} imageSize={95} />}
            />
          </>
        ) : null}

        {/* Top picks */}
        <SectionTitle title="Loved by thousands" onAll={() => navigation.navigate('ProductList', { title: 'Top rated', sort: 'rating' })} />
        <View style={styles.grid}>
          {sections.topPicks.map((p) => (
            <ProductCard key={p.id} product={p} width={cardW} imageSize={cardW * 0.78} style={{ marginBottom: 20 }} />
          ))}
        </View>

        {/* Promise row */}
        <View style={styles.trust}>
          {[
            ['shield-checkmark-outline', 'Genuine products'],
            ['lock-closed-outline', 'Secure payments'],
            ['refresh-outline', '7-day returns'],
          ].map(([ic, t]) => (
            <View key={t} style={styles.trustItem}>
              <Ionicons name={ic} size={22} color={colors.black} />
              <Text style={styles.trustTitle}>{t}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.sell} onPress={() => navigation.navigate('Support', { seller: true })}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sellTitle}>Sell on {BRAND.name}</Text>
            <Text style={styles.sellSub}>No registration fee. Weekly payouts to your bank.</Text>
          </View>
          <View style={styles.sellGo}><Ionicons name="storefront" size={20} color={colors.white} /></View>
        </Pressable>

        <View style={styles.footer}>
          <Image source={require('../../assets/logo-black.png')} style={{ width: 20, height: 23, opacity: 0.2 }} resizeMode="contain" />
          <Text style={styles.footerText}>{BRAND.tagline}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function BentoTile({ cat, w, h, big, onPress }) {
  return (
    <Pressable onPress={() => onPress(cat.id, cat.name)} style={({ pressed }) => [{ width: w, height: h }, pressed && { opacity: 0.85 }]} accessibilityLabel={cat.name}>
      <ImageBackground source={{ uri: cat.image }} style={styles.bento} imageStyle={{ borderRadius: big ? 26 : 20 }}>
        {big ? (
          <View style={styles.bentoBig}>
            <Text style={styles.bentoBigText}>{cat.name}</Text>
            <Text style={styles.bentoBigSub}>{cat.subs.slice(0, 3).join(', ')}</Text>
          </View>
        ) : (
          <View style={styles.bentoPill}><Text style={styles.bentoPillText} numberOfLines={1}>{cat.name}</Text></View>
        )}
      </ImageBackground>
    </Pressable>
  );
}

function SectionTitle({ title, onAll, inline }) {
  return (
    <View style={[styles.secHead, inline && { marginTop: 0 }]}>
      <Text style={[font.h2, { flex: 1 }]}>{title}</Text>
      {onAll ? (
        <Pressable onPress={onAll} hitSlop={8}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({

  secHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  seeAll: { color: colors.accent, fontWeight: '700', fontSize: 14 },

  bento: { flex: 1, justifyContent: 'flex-end', padding: 8, backgroundColor: colors.mist, borderRadius: 20 },
  bentoPill: { alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, maxWidth: '100%' },
  bentoPillText: { fontSize: 12, fontWeight: '700', color: colors.black },
  bentoBig: { backgroundColor: colors.black, borderRadius: 14, padding: 9 },
  bentoBigText: { fontFamily: fonts.displayHeavy, color: colors.white, fontSize: 15, letterSpacing: -0.4 },
  bentoBigSub: { color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 },

  deals: { backgroundColor: colors.accent, marginTop: 32, paddingTop: 22, paddingBottom: 16 },
  dealsHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  dealsTitle: { fontFamily: fonts.displayHeavy, color: colors.white, fontSize: 24, letterSpacing: -0.6 },
  dealsSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  timer: { flexDirection: 'row', alignItems: 'center' },
  timeBox: { backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 6, minWidth: 36, alignItems: 'center' },
  timeText: { fontFamily: fonts.display, color: colors.black, fontSize: 16, fontVariant: ['tabular-nums'] },
  timeSep: { color: colors.white, fontFamily: fonts.display, fontSize: 16, marginHorizontal: 3 },
  dealsAll: { alignSelf: 'center', marginTop: 16, borderWidth: 1.5, borderColor: colors.white, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 8 },
  dealsAllText: { color: colors.white, fontWeight: '700', fontSize: 13 },

  promoRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 32 },
  promo: { justifyContent: 'flex-end', padding: 8, backgroundColor: colors.mist, borderRadius: 24 },
  promoTag: { backgroundColor: colors.white, borderRadius: 16, padding: 10 },
  promoTitle: { fontFamily: fonts.display, fontSize: 15, color: colors.black },
  promoSub: { color: colors.accent, fontWeight: '700', fontSize: 12, marginTop: 2 },

  under: { backgroundColor: colors.mist, marginTop: 32, paddingTop: 22, paddingBottom: 22 },

  brandRing: { width: 54, height: 54, borderRadius: 27, borderWidth: 1.5, borderColor: colors.black, padding: 3 },
  brandDot: { flex: 1, borderRadius: 30, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  brandInitial: { fontFamily: fonts.displayHeavy, color: colors.white, fontSize: 18 },
  brandText: { fontSize: 12, fontWeight: '600', marginTop: 6, color: colors.ink },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16 },

  trust: { flexDirection: 'row', marginHorizontal: 16, marginTop: 8, paddingVertical: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  trustItem: { flex: 1, alignItems: 'center' },
  trustTitle: { fontSize: 12, fontWeight: '600', marginTop: 6, color: colors.ink },

  sell: { marginHorizontal: 16, marginTop: 20, backgroundColor: colors.black, borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center' },
  sellTitle: { fontFamily: fonts.displayHeavy, color: colors.white, fontSize: 20, letterSpacing: -0.4 },
  sellSub: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4, lineHeight: 18 },
  sellGo: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },

  footer: { alignItems: 'center', marginTop: 28 },
  footerText: { fontSize: 12, color: colors.faint, marginTop: 8 },
});
