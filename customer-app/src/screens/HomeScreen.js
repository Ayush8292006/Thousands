import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image, Animated, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import HeroCarousel from '../components/HeroCarousel';
import ShopTiles from '../components/ShopTiles';
import GridCard from '../components/GridCard';
import ProductImage from '../components/ProductImage';
import Reveal from '../components/Reveal';
import { colors } from '../theme';
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

function SecHead({ title, onAll }) {
  return (
    <View style={styles.secHead}>
      <Text style={styles.secTitle}>{title}</Text>
      {onAll ? (
        <Pressable style={styles.arrowBtn} onPress={onAll} accessibilityLabel={`See all ${title}`}>
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
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
  const firstName = (user?.name || '').trim().split(' ')[0];

  const trio = useMemo(() => {
    const pick = (c) => all.find((p) => p.category === c);
    return [
      { key: 'beauty', p: pick('beauty'), title: 'Shop now', sub: 'Skincare routine', cat: 'beauty' },
      { key: 'fashion', p: pick('fashion'), title: 'Min. 50% Off', sub: 'Everyday fashion', cat: 'fashion' },
      { key: 'footwear', p: pick('footwear'), title: 'Shop now', sub: 'Sneakers & more', cat: 'footwear' },
    ].filter((x) => x.p);
  }, [all]);

  const quick = [
    { key: 'express', icon: 'flash', color: '#E8590C', label: 'Express', go: () => navigation.navigate('ProductList', { title: 'Express Delivery', sort: 'rating' }) },
    { key: 'deals', icon: 'pricetags', color: '#D6336C', label: 'Deals', go: () => navigation.navigate('ProductList', { tag: 'deal', title: 'Top Deals', sort: 'discount' }) },
    { key: 'rewards', icon: 'gift', color: '#7048E8', label: 'Rewards', go: () => navigation.navigate('Account') },
  ];

  const tabs = [{ id: 'foryou', name: 'For You', icon: 'bag-handle-outline' }, ...cats.map((c) => ({ id: c.id, name: SHORT[c.id] || c.name, icon: c.icon }))];
  const cardW = width / 2;
  const lookW = 132;
  const trioW = (width - 32 - 20) / 3;

  return (
    <View style={{ flex: 1, backgroundColor: colors.header }}>
      {focused ? <StatusBar style="dark" /> : null}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      >
        {/* 0: top area */}
        <View style={[styles.top, { paddingTop: insets.top + 10 }]}>
          <Animated.View style={[styles.quickRow, { opacity: tilesFade, transform: [{ translateY: tilesShift }] }]}>
            <View style={[styles.quick, styles.brandTile]}>
              <Image source={require('../../assets/logo-white.png')} style={styles.brandLogo} resizeMode="contain" />
              <Text style={styles.brandName}>{BRAND.name}</Text>
            </View>
            {quick.map((q) => (
              <Pressable key={q.key} style={({ pressed }) => [styles.quick, pressed && { transform: [{ scale: 0.96 }] }]} onPress={q.go} accessibilityLabel={q.label}>
                <Ionicons name={q.icon} size={24} color={q.color} />
                <Text style={styles.quickText}>{q.label}</Text>
              </Pressable>
            ))}
          </Animated.View>

          <View style={styles.addrRow}>
            <Pressable style={styles.address} onPress={() => navigation.navigate('Addresses')} accessibilityLabel="Change delivery address">
              <Ionicons name="home" size={15} color={colors.ink} />
              <Text style={styles.addrTag}>HOME</Text>
              <Text style={styles.addrText} numberOfLines={1}>
                {selectedAddress ? `${selectedAddress.city} ${selectedAddress.pincode}` : 'Select delivery address'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={colors.ink} />
            </Pressable>
            <Pressable style={styles.coins} onPress={() => navigation.navigate('Account')} accessibilityLabel="Thousands coins">
              <View style={styles.coinDot}><Ionicons name="flash" size={11} color={colors.white} /></View>
              <Text style={styles.coinText}>0</Text>
            </Pressable>
          </View>
        </View>

        {/* 1: sticky category tabs */}
        <View style={styles.tabsWrap}>
          <Pressable style={styles.search} onPress={() => navigation.navigate('Search')} accessibilityLabel="Search">
            <Ionicons name="search" size={21} color={colors.ink} />
            <Text style={styles.searchText}>Search for products</Text>
            <Ionicons name="mic-outline" size={21} color={colors.muted} />
          </Pressable>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
            {tabs.map((t) => {
              const on = tab === t.id;
              return (
                <Pressable key={t.id} style={styles.tab} onPress={() => setTab(t.id)} accessibilityState={{ selected: on }}>
                  <View style={[styles.tabIcon, on && styles.tabIconOn]}>
                    <Ionicons name={t.icon} size={22} color={on ? colors.accent : colors.ink} />
                  </View>
                  <Text style={[styles.tabText, on && styles.tabTextOn]} numberOfLines={1}>{t.name}</Text>
                  <View style={[styles.tabLine, on && styles.tabLineOn]} />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 2: content (sections reveal on scroll) */}
        <View style={{ backgroundColor: colors.page }} onLayout={(e) => setContentY(e.nativeEvent.layout.y)}>
          <HeroCarousel banners={banners} onPress={(b) => openCat(b.link.category, b.title.replace('\n', ' '))} />

          <ShopTiles navigation={navigation} />

          <Reveal {...R}>
          <Pressable style={({ pressed }) => [styles.offer, pressed && { opacity: 0.9 }]} onPress={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Big Thousand Days' })}>
            <View style={styles.offerIcon}><Ionicons name="pricetags" size={16} color={colors.accent} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.offerTitle}>The Big Thousand Days are live</Text>
              <Text style={styles.offerSub}>Top brands at their lowest prices</Text>
            </View>
            <View style={styles.offerBadge}><Text style={styles.offerBadgeText}>Up to 80% off</Text></View>
          </Pressable>
          </Reveal>

          {lookingFor.length ? (
            <Reveal {...R} style={styles.looking}>
              <Text style={styles.lookingTitle}>{firstName ? `${firstName}, still looking for these?` : 'Still looking for these?'}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 14 }}>
                {lookingFor.map((p) => (
                  <Pressable key={p.id} style={[styles.lookCard, { width: lookW }]} onPress={() => openProduct(p.id)}>
                    <ProductImage product={p} size={lookW - 16} rounded={10} />
                    <Text style={styles.lookSub} numberOfLines={1}>{p.sub}</Text>
                    <Text style={styles.lookPrice}>{formatPrice(p.price)}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Reveal>
          ) : null}

          {trio.length ? (
            <Reveal {...R} style={styles.trio}>
              {trio.map((x) => (
                <Pressable key={x.key} style={{ width: trioW }} onPress={() => openCat(x.cat, x.sub)}>
                  <ProductImage product={x.p} size={Math.round(trioW * 1.05)} rounded={16} />
                  <Text style={styles.trioTitle} numberOfLines={1}>{x.title}</Text>
                  <Text style={styles.trioSub} numberOfLines={1}>{x.sub}</Text>
                </Pressable>
              ))}
            </Reveal>
          ) : null}

          {deals.length ? (
            <Reveal {...R} style={{ marginTop: 22 }}>
              <View style={styles.secHead}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={styles.secTitle}>Deals of the Day</Text>
                  <DealTimer />
                </View>
                <Pressable style={styles.arrowBtn} onPress={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Deals of the Day', sort: 'discount' })} accessibilityLabel="See all deals">
                  <Ionicons name="arrow-forward" size={18} color={colors.white} />
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}>
                {deals.map((p) => (
                  <Pressable key={p.id} style={styles.dealCard} onPress={() => openProduct(p.id)}>
                    <ProductImage product={p} size={124} rounded={14} />
                    <Text style={styles.dealName} numberOfLines={1}>{p.sub || p.brand}</Text>
                    <Text style={styles.dealOff}>Min. {Math.max(10, Math.floor(discountPct(p.mrp, p.price) / 10) * 10)}% Off</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Reveal>
          ) : null}

          <View style={{ marginTop: 22 }} onLayout={(e) => setSuggY(e.nativeEvent.layout.y)}>
            <SecHead title="Suggested For You" onAll={() => navigation.navigate('ProductList', { title: 'Suggested For You', sort: 'rating', category: tab === 'foryou' ? undefined : tab })} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  top: { backgroundColor: colors.header, paddingHorizontal: 12, paddingBottom: 10 },
  quickRow: { flexDirection: 'row', gap: 8 },
  quick: {
    flex: 1, height: 78, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#EFE3BC',
  },
  quickText: { fontSize: 13, fontWeight: '800', fontStyle: 'italic', color: colors.ink, marginTop: 4 },
  brandTile: { backgroundColor: '#FFF3C2', borderColor: '#E3C565', borderWidth: 1.5 },
  brandLogo: { width: 28, height: 30 },
  brandName: { fontSize: 13.5, fontWeight: '800', fontStyle: 'italic', color: '#4A3D00', marginTop: 2 },
  addrRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  address: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  addrTag: { fontSize: 13, fontWeight: '800', color: colors.ink },
  addrText: { flex: 1, fontSize: 13, color: colors.ink },
  coins: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 14, paddingHorizontal: 12, height: 40 },
  coinDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#E0A800', alignItems: 'center', justifyContent: 'center' },
  coinText: { fontSize: 14, fontWeight: '800', color: colors.ink },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, marginHorizontal: 12, marginBottom: 10, backgroundColor: colors.white,
    borderRadius: 14, borderWidth: 2, borderColor: colors.accent, paddingHorizontal: 14,
  },
  searchText: { flex: 1, fontSize: 15, color: colors.muted },
  tabsWrap: { backgroundColor: colors.header, borderBottomWidth: 1, borderBottomColor: '#EFE3BC', paddingTop: 2 },
  tab: { alignItems: 'center', paddingHorizontal: 9, minWidth: 68 },
  tabIcon: { width: 44, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabIconOn: { backgroundColor: colors.accentSoft },
  tabText: { fontSize: 12.5, color: colors.ink, marginTop: 3 },
  tabTextOn: { fontWeight: '700' },
  tabLine: { height: 3, width: '80%', borderRadius: 2, marginTop: 7, backgroundColor: 'transparent' },
  tabLineOn: { backgroundColor: colors.accent },
  offer: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 4, padding: 14,
    backgroundColor: '#FFF1DA', borderRadius: 18,
  },
  offerIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: 14, fontWeight: '800', color: '#4A3200' },
  offerSub: { fontSize: 12, color: '#7A6440', marginTop: 2 },
  offerBadge: { backgroundColor: colors.accent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  offerBadgeText: { color: colors.white, fontSize: 11.5, fontWeight: '700' },
  looking: { marginHorizontal: 16, marginTop: 20, paddingVertical: 18, backgroundColor: '#FFF4D6', borderRadius: 22 },
  lookingTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, paddingHorizontal: 16, marginBottom: 14 },
  lookCard: { backgroundColor: colors.white, borderRadius: 16, padding: 8 },
  lookSub: { fontSize: 13, color: colors.muted, marginTop: 8 },
  lookPrice: { fontSize: 14.5, fontWeight: '800', color: colors.ink, marginTop: 1 },
  trio: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 22 },
  trioTitle: { fontSize: 14, fontWeight: '800', color: colors.ink, textAlign: 'center', marginTop: 8 },
  trioSub: { fontSize: 12.5, color: colors.ink, textAlign: 'center', marginTop: 1 },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 12 },
  secTitle: { fontSize: 20, fontWeight: '800', color: colors.ink },
  arrowBtn: { width: 52, height: 34, borderRadius: 17, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FDECEF', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  timerText: { fontSize: 12, fontWeight: '700', color: colors.sale },
  dealCard: { width: 140, backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 8 },
  dealName: { fontSize: 13, color: colors.ink, marginTop: 8, textAlign: 'center' },
  dealOff: { fontSize: 13, fontWeight: '800', color: colors.success, textAlign: 'center', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#DADDE2' },
});
