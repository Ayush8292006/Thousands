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
import GlossHeader from '../components/GlossHeader';
import Glass from '../components/Glass';
import CalliBanner from '../components/CalliBanner';
import OfferPopup from '../components/OfferPopup';
import { calli } from '../config/fonts';
import Shine from '../components/Shine';
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
        {kicker ? <Text style={calli(14, colors.gold)}>{kicker}</Text> : null}
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
            <Glass tint="light" radius={22} style={styles.navCapsule}>
              <View style={styles.brandBlock}>
                <Image source={require('../../assets/logo-white.png')} style={styles.brandLogo} resizeMode="contain" />
                <Text style={styles.brandName}>{BRAND.name}</Text>
              </View>
              <View style={styles.navDivider} />
              <Pressable style={styles.deliver} onPress={() => navigation.navigate('Addresses')} accessibilityLabel="Change delivery address">
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliverLabel}>Deliver to</Text>
                  <Text style={styles.deliverStrong} numberOfLines={1}>
                    {selectedAddress ? `${selectedAddress.city} ${selectedAddress.pincode}` : 'Select address'}
                  </Text>
                </View>
                <View style={styles.pinDot}><Ionicons name="location" size={14} color={colors.white} /></View>
              </Pressable>
            </Glass>
          </Animated.View>
        </GlossHeader>

        {/* 1: sticky category tabs */}
        <Glass tint="cream" radius={0} highlight={false} style={styles.tabsWrap}>
          <Glass tint="light" radius={22} style={styles.search}>
            <Pressable style={styles.searchInner} onPress={() => navigation.navigate('Search')} accessibilityLabel="Search">
              <Ionicons name="search" size={18} color={colors.ink} />
              <Text style={styles.searchText}>Search for products</Text>
              <Ionicons name="mic-outline" size={18} color={colors.muted} />
            </Pressable>
          </Glass>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingBottom: 10 }}>
            {tabs.map((t) => {
              const on = tab === t.id;
              return (
                <Pressable key={t.id} style={[styles.tab, on && styles.tabOn]} onPress={() => setTab(t.id)} accessibilityState={{ selected: on }}>
                  <Ionicons name={t.icon} size={15} color={on ? colors.white : '#5E5643'} />
                  <Text style={[styles.tabText, on && styles.tabTextOn]} numberOfLines={1}>{t.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Glass>

        {/* 2: content (sections reveal on scroll) */}
        <View style={{ backgroundColor: colors.page }} onLayout={(e) => setContentY(e.nativeEvent.layout.y)}>
          <HeroCarousel banners={banners} onPress={(b) => openCat(b.link.category, b.title.replace('\n', ' '))} />

          <ShopTiles navigation={navigation} />

          <Reveal {...R}>
            <CalliBanner onPress={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Festive Offers', sort: 'discount' })} />
          </Reveal>

          <Reveal {...R}>
          <Pressable style={({ pressed }) => [styles.offer, pressed && { opacity: 0.9 }]} onPress={() => navigation.navigate('ProductList', { tag: 'deal', title: 'Big Thousand Days' })}>
            <View style={styles.offerIcon}><Ionicons name="pricetags" size={16} color={colors.accent} /></View>
            <View style={{ flex: 1 }}>
              <Text style={calli(14, colors.gold)}>Mega savings</Text>
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
                  <ProductImage product={x.p} size={Math.round(trioW * 0.85)} rounded={14} />
                  <Text style={styles.trioTitle} numberOfLines={1}>{x.title}</Text>
                  <Text style={styles.trioSub} numberOfLines={1}>{x.sub}</Text>
                </Pressable>
              ))}
            </Reveal>
          ) : null}

          {deals.length ? (
            <Reveal {...R} style={{ marginTop: 18 }}>
              <View style={styles.secHead}>
                <View>
                  <Text style={calli(14, colors.gold)}>Today's picks</Text>
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
                  <Pressable key={p.id} style={styles.dealCard} onPress={() => openProduct(p.id)}>
                    <ProductImage product={p} size={96} rounded={12} />
                    <Text style={styles.dealName} numberOfLines={1}>{p.sub || p.brand}</Text>
                    <Text style={styles.dealOff}>Min. {Math.max(10, Math.floor(discountPct(p.mrp, p.price) / 10) * 10)}% Off</Text>
                  </Pressable>
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
  navCapsule: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  brandBlock: { alignItems: 'center', minWidth: 70 },
  brandLogo: { width: 24, height: 26 },
  brandName: { fontSize: 12, fontWeight: '800', fontStyle: 'italic', color: colors.olive, marginTop: 1 },
  navDivider: { width: 1, height: 30, backgroundColor: 'rgba(90, 75, 2, 0.15)', marginHorizontal: 12 },
  deliver: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  pinDot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.olive, alignItems: 'center', justifyContent: 'center' },
  deliverLabel: { fontSize: 10.5, color: colors.headerMuted },
  deliverStrong: { fontSize: 13, color: colors.ink, fontWeight: '700', marginTop: 1 },
  search: { marginHorizontal: 14, marginTop: 8, marginBottom: 10 },
  searchInner: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 42, paddingHorizontal: 14 },
  searchText: { flex: 1, fontSize: 14, color: colors.muted },
  tabsWrap: { borderWidth: 0, borderBottomWidth: 1, borderBottomColor: 'rgba(230, 220, 194, 0.9)', shadowOpacity: 0.06, elevation: 2 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6, height: 34, paddingHorizontal: 12, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(230, 220, 194, 0.9)',
  },
  tabOn: { backgroundColor: colors.olive, borderColor: colors.olive },
  tabText: { fontSize: 12.5, color: '#5E5643', fontWeight: '600' },
  tabTextOn: { color: colors.white, fontWeight: '700' },
  offer: {
    overflow: 'hidden',
    flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginTop: 4, padding: 14,
    backgroundColor: '#FFF1DA', borderRadius: 18,
  },
  offerIcon: { width: 32, height: 32, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: 13, fontWeight: '800', color: '#4A3200' },
  offerSub: { fontSize: 11.5, color: '#7A6440', marginTop: 2 },
  offerBadge: { backgroundColor: colors.accent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  offerBadgeText: { color: colors.white, fontSize: 11.5, fontWeight: '700' },
  looking: { marginHorizontal: 16, marginTop: 16, paddingVertical: 14, backgroundColor: '#FFF4D6', borderRadius: 22 },
  lookingTitle: { fontSize: 15.5, fontWeight: '800', color: colors.ink, paddingHorizontal: 14, marginBottom: 10 },
  lookCard: { backgroundColor: colors.white, borderRadius: 14, padding: 6 },
  lookSub: { fontSize: 12, color: colors.muted, marginTop: 8 },
  lookPrice: { fontSize: 13.5, fontWeight: '800', color: colors.ink, marginTop: 1 },
  trio: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 },
  trioTitle: { fontSize: 13, fontWeight: '800', color: colors.ink, textAlign: 'center', marginTop: 8 },
  trioSub: { fontSize: 11.5, color: colors.ink, textAlign: 'center', marginTop: 1 },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  secTitle: { fontSize: 17, fontWeight: '800', color: colors.ink },
  arrowBtn: { width: 44, height: 30, borderRadius: 15, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FDECEF', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  timerText: { fontSize: 12, fontWeight: '700', color: colors.sale },
  dealCard: { width: 112, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 7 },
  dealName: { fontSize: 12, color: colors.ink, marginTop: 8, textAlign: 'center' },
  dealOff: { fontSize: 12, fontWeight: '800', color: colors.success, textAlign: 'center', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#DADDE2' },
});
