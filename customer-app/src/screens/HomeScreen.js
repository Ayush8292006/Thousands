import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image, Animated, Easing, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import HeroCarousel from '../components/HeroCarousel';
import ShopTiles from '../components/ShopTiles';
import GridCard from '../components/GridCard';
import ProductImage from '../components/ProductImage';
import Reveal from '../components/Reveal';
import GlossHeader from '../components/GlossHeader';
import Glass from '../components/Glass';
import CalliBanner from '../components/CalliBanner';
import OfferPopup from '../components/OfferPopup';
import { calli } from '../config/fonts';
import Shine from '../components/Shine';
import PressScale from '../components/PressScale';
import CategoryChip from '../components/CategoryChip';
import LocationDropdown from '../components/LocationDropdown';
import { colors, TAB_BAR_SPACE } from '../theme';
import { getBanners, getCategories, getProducts, getProductById } from '../services/api';
import { discountPct, formatPrice } from '../utils/format';
import { useApp } from '../context/AppContext';
import { BRAND } from '../config/app';
import { useAppWidth } from '../utils/platform';

// Flipkart-style home:
// light-blue top (logo tile + address + search) -> category tabs -> banners -> category tiles
// -> offer strip -> "still looking for these?" -> shop-now trio -> deals -> Suggested For You grid

const SHORT = { home: 'Home', accessories: 'Bags', electronics: 'Electronics' };

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

// Sirf timer har second update hota hai, poora page nahi
function DealTimer() {
  const [hh, mm, ss] = useCountdown();
  return (
    <View style={styles.timer}>
      <Ionicons name="time-outline" size={13} color={colors.sale} />
      <Text style={styles.timerText}>{hh}:{mm}:{ss}</Text>
    </View>
  );
}

function SecHead({ title, kicker, onAll }) {
  return (
    <View style={styles.secHead}>
      <View>
        {kicker ? <Text style={calli(14, colors.olive)}>{kicker}</Text> : null}
        <Text style={styles.secTitle}>{title}</Text>
      </View>
      {onAll ? (
        <Pressable style={styles.arrowBtn} onPress={onAll} accessibilityLabel={`See all ${title}`}>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const { width } = useAppWidth();
  const { user, selectedAddress, recentlyViewed, wishlist, toggleWishlist } = useApp();
  const [cats, setCats] = useState([]);
  const [banners, setBanners] = useState([]);
  const [all, setAll] = useState([]);
  const [tab, setTab] = useState('foryou');
  const [locOpen, setLocOpen] = useState(false);
  // Logo entrance + search press feedback
  const enter = useRef(new Animated.Value(0)).current;
  const searchPress = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 700, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web' }).start();
  }, [enter]);
  const logoScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const pressSearch = (v) => Animated.spring(searchPress, { toValue: v, friction: 6, tension: 220, useNativeDriver: Platform.OS !== 'web' }).start();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { height: vh } = useWindowDimensions();
  const [contentY, setContentY] = useState(null);
  const [suggY, setSuggY] = useState(null);
  const [gridY, setGridY] = useState(null);
  const R = { scrollY, viewport: vh, offset: contentY };
  const tilesFade = scrollY.interpolate({ inputRange: [0, 90], outputRange: [1, 0.2], extrapolate: 'clamp' });
  const tilesShift = scrollY.interpolate({ inputRange: [0, 90], outputRange: [0, 18], extrapolate: 'clamp' });

  useEffect(() => {
    getCategories().then(setCats);
    getBanners().then(setBanners);
    getProducts().then(setAll);
  }, []);

  const openProduct = useCallback((id) => navigation.navigate('ProductDetail', { id }), [navigation]);
  const openCat = (id, title) => navigation.navigate('ProductList', { category: id, title });

  const feed = useMemo(() => (tab === 'foryou' ? all : all.filter((p) => p.category === tab)), [all, tab]);
  const deals = useMemo(() => [...feed].sort((a, b) => discountPct(b.mrp, b.price) - discountPct(a.mrp, a.price)).slice(0, 8), [feed]);
  const suggested = useMemo(
    () => [...feed].sort((a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews)),
    [feed],
  );
  const recent = recentlyViewed.map(getProductById).filter(Boolean);
  const lookingFor = (recent.length ? recent : suggested).slice(0, 8);
  const firstName = /thousands/i.test(user?.name || '') ? '' : (user?.name || '').trim().split(' ')[0];

  const trio = useMemo(() => {
    const pick = (c) => all.find((p) => p.category === c);
    return [
      { key: 'beauty', p: pick('beauty'), title: 'Shop now', sub: 'Skincare routine', cat: 'beauty' },
      { key: 'fashion', p: pick('fashion'), title: 'Min. 50% Off', sub: 'Everyday fashion', cat: 'fashion' },
      { key: 'footwear', p: pick('footwear'), title: 'Shop now', sub: 'Sneakers & more', cat: 'footwear' },
    ].filter((x) => x.p);
  }, [all]);

  const tabs = [{ id: 'foryou', name: 'For You', icon: 'bag-handle-outline' }, ...cats.map((c) => ({ id: c.id, name: SHORT[c.id] || c.name, icon: c.icon }))];
  const cardW = width / 2;
  const lookW = 104;
  const trioW = (width - 32 - 20) / 3;

  return (
    <View style={{ flex: 1, backgroundColor: colors.headerGradient[0] }}>
      {focused ? <StatusBar style="dark" /> : null}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE + 10 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      >
        {/* 0: top area */}
        <GlossHeader style={[styles.top, { paddingTop: insets.top + 10 }]}>
          <Animated.View style={{ opacity: tilesFade, transform: [{ translateY: tilesShift }] }}>
            <Glass tint="rgba(255, 253, 246, 0.82)" radius={24} style={styles.navCapsule}>
              <Animated.View style={[styles.brandBlock, { opacity: enter, transform: [{ scale: logoScale }] }]}>
                <View style={styles.logoRing}>
                  <Image source={require('../../assets/logo-white.png')} style={styles.brandLogo} resizeMode="contain" />
                </View>
                <Text style={styles.brandName}>{BRAND.name}</Text>
              </Animated.View>
              <View style={styles.navDivider} />
              <PressScale scaleTo={0.98} style={styles.deliver} onPress={() => setLocOpen(true)} accessibilityLabel="Change delivery address">
                <View style={styles.pinDot}><Ionicons name="location" size={15} color={colors.olive} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliverLabel}>Deliver to</Text>
                  <Text style={styles.deliverStrong} numberOfLines={1}>
                    {selectedAddress ? `${selectedAddress.city} ${selectedAddress.pincode}` : 'Select address'}
                  </Text>
                </View>
                <Ionicons name={locOpen ? 'chevron-up' : 'chevron-down'} size={16} color={colors.olive} />
              </PressScale>
            </Glass>
          </Animated.View>
        </GlossHeader>

        {/* 1: sticky category tabs */}
        <Glass tint="cream" radius={0} highlight={false} style={styles.tabsWrap}>
          <Animated.View style={[styles.search, { transform: [{ scale: searchPress }] }]}>
            <Pressable
              style={styles.searchInner}
              onPress={() => navigation.navigate('Search')}
              onPressIn={() => pressSearch(0.98)}
              onPressOut={() => pressSearch(1)}
              accessibilityLabel="Search"
            >
              <Ionicons name="search-outline" size={19} color={colors.olive} />
              <Text style={styles.searchText}>Search for products</Text>
              <View style={styles.searchSep} />
              <Ionicons name="mic-outline" size={19} color={colors.olive} />
            </Pressable>
          </Animated.View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingBottom: 10 }}>
            {tabs.map((t) => {
              const on = tab === t.id;
              return (
                <CategoryChip key={t.id} icon={t.icon} label={t.name} active={on} onPress={() => setTab(t.id)} />
              );
            })}
          </ScrollView>
        </Glass>

        {/* 2: content (sections reveal on scroll) */}
        <View style={{ backgroundColor: colors.page }} onLayout={(e) => setContentY(e.nativeEvent.layout.y)}>
          <HeroCarousel scrollY={scrollY} banners={banners} onPress={(b) => openCat(b.link.category, b.title.replace('\n', ' '))} />

          <ShopTiles navigation={navigation} />

          <Reveal {...R}>
            <CalliBanner onPress={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Festive Offers', sort: 'discount' })} />
          </Reveal>

          <Reveal {...R}>
          <Pressable style={({ pressed }) => [styles.offer, pressed && { opacity: 0.9 }]} onPress={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Big Thousand Days' })}>
            <View style={styles.offerIcon}><Ionicons name="pricetags" size={16} color={colors.accent} /></View>
            <View style={{ flex: 1 }}>
              <Text style={calli(14, colors.olive)}>Mega savings</Text>
              <Text style={styles.offerTitle}>The Big Thousand Days are live</Text>
              <Text style={styles.offerSub}>Top brands at their lowest prices</Text>
            </View>
            <View style={styles.offerBadge}><Text style={styles.offerBadgeText}>Up to 80% off</Text></View>
            <Shine intensity={0.4} duration={1400} pause={4600} delay={1500} />
          </Pressable>
          </Reveal>

          {lookingFor.length ? (
            <Reveal {...R} style={styles.looking}>
              <Text style={styles.lookingTitle}>{firstName ? `${firstName}, still looking for these?` : 'Still looking for these?'}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 14 }}>
                {lookingFor.map((p) => (
                  <PressScale key={p.id} style={[styles.lookCard, { width: lookW }]} onPress={() => openProduct(p.id)}>
                    <ProductImage product={p} size={lookW - 16} rounded={10} />
                    <Text style={styles.lookSub} numberOfLines={1}>{p.sub}</Text>
                    <Text style={styles.lookPrice}>{formatPrice(p.price)}</Text>
                  </PressScale>
                ))}
              </ScrollView>
            </Reveal>
          ) : null}

          {trio.length ? (
            <Reveal {...R} style={styles.trio}>
              {trio.map((x) => (
                <PressScale key={x.key} style={{ width: trioW }} onPress={() => openCat(x.cat, x.sub)}>
                  <ProductImage product={x.p} size={Math.round(trioW * 0.85)} rounded={14} />
                  <Text style={styles.trioTitle} numberOfLines={1}>{x.title}</Text>
                  <Text style={styles.trioSub} numberOfLines={1}>{x.sub}</Text>
                </PressScale>
              ))}
            </Reveal>
          ) : null}

          {deals.length ? (
            <Reveal {...R} style={{ marginTop: 18 }}>
              <View style={styles.secHead}>
                <View>
                  <Text style={calli(14, colors.olive)}>Today's picks</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={styles.secTitle}>Deals of the Day</Text>
                    <DealTimer />
                  </View>
                </View>
                <Pressable style={styles.arrowBtn} onPress={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Deals of the Day', sort: 'discount' })} accessibilityLabel="See all deals">
                  <Ionicons name="arrow-forward" size={16} color={colors.white} />
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}>
                {deals.map((p) => (
                  <PressScale key={p.id} style={styles.dealCard} onPress={() => openProduct(p.id)}>
                    <ProductImage product={p} size={96} rounded={12} />
                    <Text style={styles.dealName} numberOfLines={1}>{p.sub || p.brand}</Text>
                    <Text style={styles.dealOff}>Min. {Math.max(10, Math.floor(discountPct(p.mrp, p.price) / 10) * 10)}% Off</Text>
                  </PressScale>
                ))}
              </ScrollView>
            </Reveal>
          ) : null}

          <View style={{ marginTop: 18 }} onLayout={(e) => setSuggY(e.nativeEvent.layout.y)}>
            <SecHead title="Suggested For You" kicker="Picked for you" onAll={() => navigation.navigate('ProductList', { title: 'Suggested For You', sort: 'rating', category: tab === 'foryou' ? undefined : tab })} />
            <View style={styles.grid} onLayout={(e) => setGridY(e.nativeEvent.layout.y)}>
              {suggested.map((p, i) => (
                <Reveal
                  key={p.id}
                  scrollY={scrollY}
                  viewport={vh}
                  offset={contentY != null && suggY != null && gridY != null ? contentY + suggY + gridY : null}
                  style={{ width: cardW }}
                >
                  <GridCard product={p} index={i} width={cardW} liked={wishlist.includes(p.id)} onToggleLike={toggleWishlist} onOpen={openProduct} />
                </Reveal>
              ))}
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <LocationDropdown visible={locOpen} onClose={() => setLocOpen(false)} onManage={() => navigation.navigate('Addresses')} top={76} />

      <OfferPopup
        offer={banners[0] ? {
          image: banners[0].image,
          calligraphy: 'Mega Offer',
          title: 'Flat 20% off on your first order',
          subtitle: 'Extra savings on top brands across fashion, electronics and home. Valid for a limited time.',
          code: 'THOUSANDS20',
        } : null}
        onShop={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Offers for you', sort: 'discount' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { paddingHorizontal: 14, paddingBottom: 10, overflow: 'hidden' },
  navCapsule: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderColor: 'rgba(214, 180, 92, 0.45)',
    shadowColor: '#302719', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  brandBlock: { alignItems: 'center', minWidth: 72 },
  logoRing: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cream, borderWidth: 1, borderColor: 'rgba(214, 180, 92, 0.7)',
  },
  brandLogo: { width: 22, height: 24 },
  brandName: { fontSize: 11.5, fontWeight: '800', fontStyle: 'italic', color: colors.olive, marginTop: 3, letterSpacing: 0.3 },
  navDivider: { width: 1, height: 34, backgroundColor: colors.beige, marginHorizontal: 12 },
  deliver: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  pinDot: {
    width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(214, 180, 92, 0.25)', borderWidth: 1.5, borderColor: colors.gold,
  },
  deliverLabel: { fontSize: 10.5, color: colors.muted, letterSpacing: 0.3 },
  deliverStrong: { fontSize: 13.5, color: colors.espresso, fontWeight: '700', marginTop: 1 },
  search: {
    marginHorizontal: 14, marginTop: 8, marginBottom: 10, borderRadius: 24, backgroundColor: colors.cream,
    borderWidth: 1, borderColor: 'rgba(214, 180, 92, 0.7)',
    shadowColor: '#625000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  searchInner: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 44, paddingHorizontal: 16 },
  searchText: { flex: 1, fontSize: 14, color: colors.muted },
  searchSep: { width: 1, height: 20, backgroundColor: colors.beige },
  tabsWrap: { borderWidth: 0, borderBottomWidth: 1, borderBottomColor: 'rgba(230, 220, 194, 0.9)', shadowOpacity: 0.06, elevation: 2 },
  offer: {
    overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 4, padding: 14,
    backgroundColor: colors.beige, borderRadius: 18,
  },
  offerIcon: { width: 32, height: 32, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: 13, fontWeight: '800', color: colors.espresso },
  offerSub: { fontSize: 11.5, color: colors.muted, marginTop: 2 },
  offerBadge: { backgroundColor: colors.terracotta, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  offerBadgeText: { color: colors.white, fontSize: 11.5, fontWeight: '700' },
  looking: { marginHorizontal: 16, marginTop: 16, paddingVertical: 14, backgroundColor: colors.beige, borderRadius: 22 },
  lookingTitle: { fontSize: 15.5, fontWeight: '800', color: colors.ink, paddingHorizontal: 14, marginBottom: 10 },
  lookCard: { backgroundColor: colors.card, borderRadius: 14, padding: 6 },
  lookSub: { fontSize: 12, color: colors.muted, marginTop: 8 },
  lookPrice: { fontSize: 13.5, fontWeight: '800', color: colors.ink, marginTop: 1 },
  trio: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 },
  trioTitle: { fontSize: 13, fontWeight: '800', color: colors.ink, textAlign: 'center', marginTop: 8 },
  trioSub: { fontSize: 11.5, color: colors.ink, textAlign: 'center', marginTop: 1 },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  secTitle: { fontSize: 17, fontWeight: '800', color: colors.ink },
  arrowBtn: { width: 44, height: 30, borderRadius: 15, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F6E3DA', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  timerText: { fontSize: 12, fontWeight: '700', color: colors.sale },
  dealCard: { width: 112, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 7 },
  dealName: { fontSize: 12, color: colors.ink, marginTop: 8, textAlign: 'center' },
  dealOff: { fontSize: 12, fontWeight: '800', color: colors.terracotta, textAlign: 'center', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.beige },
});
