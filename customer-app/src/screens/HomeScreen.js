import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList, ImageBackground, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HomeHeader from '../components/HomeHeader';
import HeroCarousel from '../components/HeroCarousel';
import HomeProductCard from '../components/HomeProductCard';
import ProductImage from '../components/ProductImage';
import { fonts, pastels, lightBlueTheme } from '../theme';
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

export default function HomeScreen({ navigation }) {
  const { width } = useAppWidth();
  const { recentlyViewed } = useApp();
  const [cats, setCats] = useState([]);
  const [banners, setBanners] = useState([]);
  const [promos, setPromos] = useState([]);
  const [all, setAll] = useState([]);
  const [hh, mm, ss] = useCountdown();
  const cardW = (width - 24 - 10) / 2;
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

  const productRow = (data, w = 150, img = 130) => (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(i) => i.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
      renderItem={({ item }) => <HomeProductCard product={item} width={w} imageSize={img} />}
    />
  );

  // Premium Fashion Offer Tile
  const OfferTile = ({ p, w }) => (
    <Pressable
      style={[styles.offerTile, { width: w }]}
      onPress={() => openProduct(p.id)}
      accessibilityLabel={`${p.title}, offer`}
    >
      <View style={styles.offerImgWrap}>
        <ProductImage product={p} size={w - 20} rounded={8} />
      </View>
      <Text style={styles.offerName} numberOfLines={1}>{p.sub || p.brand}</Text>
      <View style={styles.offerBadge}>
        <Text style={styles.offerOff}>Min. {Math.floor(discountPct(p.mrp, p.price) / 10) * 10}% Off</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: lightBlueTheme.softBg }}>
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Category Strip — Light-blue backgrounds with rounded thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catStrip}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {cats.map((c, i) => (
            <Pressable
              key={c.id}
              style={styles.catItem}
              onPress={() => openCat(c.id, c.name)}
              accessibilityLabel={c.name}
            >
              <View style={[styles.catBg, { backgroundColor: pastels[i % pastels.length] }]}>
                <Image source={{ uri: c.image }} style={styles.catImg} resizeMode="cover" />
              </View>
              <Text style={styles.catText} numberOfLines={1}>{c.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Fashion Privilege Strip — Soft Sky Blue Gradient */}
        <LinearGradient
          colors={[lightBlueTheme.secondary, lightBlueTheme.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saleStrip}
        >
          <View style={styles.saleIconBadge}>
            <Ionicons name="sparkles" size={13} color={lightBlueTheme.accent} />
          </View>
          <Text style={styles.saleText}>The Royal Fashion Edit is Live</Text>
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>Up to 75% off</Text>
          </View>
        </LinearGradient>

        {/* Hero Carousel */}
        <HeroCarousel
          banners={banners}
          onPress={(b) => openCat(b.link.category, b.title.replace('\n', ' '))}
        />

        {/* Bank & Customer Privilege Perks */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.perksRow}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
        >
          {[
            ['card-outline', '10% Instant Privilege', 'On UPI & Net Banking', lightBlueTheme.secondary],
            ['wallet-outline', '5% Member Cashback', 'With Thousands Pay Later', lightBlueTheme.secondary],
            ['bicycle-outline', 'Complimentary Delivery', 'On orders above ₹499', lightBlueTheme.secondary],
            ['refresh-outline', '7-Day Seamless Return', 'Doorstep exchange & refund', lightBlueTheme.secondary],
          ].map(([ic, t, sub, bg]) => (
            <View key={t} style={styles.perkCard}>
              <View style={[styles.perkIcon, { backgroundColor: bg }]}>
                <Ionicons name={ic} size={16} color={lightBlueTheme.accent} />
              </View>
              <View>
                <Text style={styles.perkTitle}>{t}</Text>
                <Text style={styles.perkSub}>{sub}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Deals of the Day — Deep Navy & Ice Blue Contrast Block */}
        <LinearGradient
          colors={[lightBlueTheme.darkBg, lightBlueTheme.text]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dealBlock}
        >
          <View style={styles.dealHead}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dealTitle}>Curated Deals of the Day</Text>
              <View style={styles.timerRow}>
                <Ionicons name="alarm-outline" size={13} color={lightBlueTheme.primary} />
                <Text style={styles.timerLabel}>{hh}h : {mm}m : {ss}s left</Text>
              </View>
            </View>
            <Pressable
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate('ProductList', { title: 'Deals of the Day', sort: 'discount' })}
            >
              <Text style={styles.viewAllBtnText}>View all</Text>
              <Ionicons name="chevron-forward" size={12} color={lightBlueTheme.text} style={{ marginLeft: 2 }} />
            </Pressable>
          </View>
          {productRow(s.deals, 150, 130)}
        </LinearGradient>

        {/* Best of Electronics & Tech Accessories — Light Blue Section */}
        <View style={styles.lightSection}>
          <SecHead
            title="Best of Electronics"
            sub="Flagship gadgets and acoustic sound"
            onAll={() => openCat('electronics', 'Electronics')}
          />
          <View style={styles.tileGrid}>
            {s.bestElectronics.map((p) => (
              <OfferTile key={p.id} p={p} w={tileW} />
            ))}
          </View>
        </View>

        {/* Editorial Duo Promotional Banners */}
        <View style={styles.promoRow}>
          {promos.map((p, i) => (
            <Pressable
              key={p.id}
              style={{ flex: 1 }}
              onPress={() => openCat(p.link.category, p.title)}
            >
              <ImageBackground
                source={{ uri: p.image }}
                style={styles.promo}
                imageStyle={{ borderRadius: 14 }}
              >
                <LinearGradient
                  colors={['rgba(23, 43, 69, 0.15)', 'rgba(23, 43, 69, 0.85)']}
                  style={styles.promoShade}
                >
                  <View style={[styles.promoTag, { backgroundColor: i === 0 ? lightBlueTheme.accent : lightBlueTheme.darkBg }]}>
                    <Text style={styles.promoTagText}>{i === 0 ? 'HOT EDIT' : 'NEW IN'}</Text>
                  </View>
                  <Text style={styles.promoTitle}>{p.title}</Text>
                  <Text style={styles.promoSub}>{p.subtitle}</Text>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        {/* Trending in Haute Fashion */}
        <View style={styles.section}>
          <SecHead
            title="Trending in Haute Fashion"
            sub="Most sought-after styles this week"
            onAll={() => navigation.navigate('ProductList', { title: 'Trending Now', tag: 'trending' })}
          />
          {productRow(s.trending, 150, 130)}
        </View>

        {/* Fashion Top Deals — 2x2 Grid */}
        <View style={styles.lightSection}>
          <SecHead
            title="Fashion Haute Deals"
            sub="Handpicked couture & seasonal wear"
            onAll={() => openCat('fashion', 'Fashion')}
          />
          <View style={styles.tileGrid}>
            {s.fashionFoot.map((p) => (
              <OfferTile key={p.id} p={p} w={cardW} />
            ))}
          </View>
        </View>

        {/* Curated Under ₹999 — Light Blue Luxury Budget Store */}
        <View style={styles.budgetSection}>
          <SecHead
            title="Curated Under ₹999"
            sub="Timeless elegance at accessible prices"
            onAll={() => navigation.navigate('ProductList', { title: 'Under ₹999', maxPrice: 999 })}
          />
          <FlatList
            horizontal
            data={s.under999}
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
            renderItem={({ item }) => (
              <Pressable style={styles.budgetCard} onPress={() => openProduct(item.id)}>
                <ProductImage product={item} size={98} rounded={8} />
                <Text style={styles.budgetPrice}>{formatPrice(item.price)}</Text>
                <Text style={styles.budgetName} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.budgetMrp}>{formatPrice(item.mrp)}</Text>
              </Pressable>
            )}
          />
        </View>

        {/* Featured Fashion Houses / Top Brands */}
        <View style={styles.section}>
          <SecHead
            title="Featured Fashion Houses"
            sub="World-class labels & artisan brands"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
          >
            {brands.map((b, i) => (
              <Pressable
                key={b}
                style={styles.brand}
                onPress={() => navigation.navigate('ProductList', { brand: b, title: b })}
              >
                <View style={[styles.brandCircle, { backgroundColor: pastels[i % pastels.length] }]}>
                  <Text style={styles.brandInitial}>{b[0]}</Text>
                </View>
                <Text style={styles.brandText} numberOfLines={1}>{b}</Text>
                <Text style={styles.brandOff}>Up to 60% off</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Recently Viewed */}
        {recent.length ? (
          <View style={styles.section}>
            <SecHead title="Recently Viewed" sub="Pick up where you left off" />
            {productRow(recent, 130, 110)}
          </View>
        ) : null}

        {/* Suggested For You — 2-Column Grid */}
        <View style={styles.section}>
          <SecHead
            title="Curated For You"
            sub="Tailored to your personal taste"
            onAll={() => navigation.navigate('ProductList', { title: 'Top Rated', sort: 'rating' })}
          />
          <View style={styles.grid}>
            {s.topPicks.map((p) => (
              <HomeProductCard
                key={p.id}
                product={p}
                width={cardW}
                imageSize={cardW * 0.8}
                style={{ marginBottom: 10 }}
              />
            ))}
          </View>
        </View>

        {/* Trust & Craftsmanship Pillars */}
        <View style={styles.trustWrap}>
          {[
            ['shield-checkmark', '100% Authentic', 'Direct verified sources'],
            ['lock-closed', 'Secure Checkout', 'Bank-grade encryption'],
            ['sparkles', 'Curated Quality', 'Handpicked standards'],
          ].map(([ic, t, sub]) => (
            <View key={t} style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <Ionicons name={ic} size={18} color={lightBlueTheme.accent} />
              </View>
              <Text style={styles.trustTitle}>{t}</Text>
              <Text style={styles.trustSub}>{sub}</Text>
            </View>
          ))}
        </View>

        {/* Sell on Thousands Creator Banner */}
        <Pressable onPress={() => navigation.navigate('Support', { seller: true })}>
          <LinearGradient
            colors={[lightBlueTheme.text, lightBlueTheme.darkBg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sell}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.sellBadge}>
                <Text style={styles.sellBadgeText}>CREATORS & BRANDS</Text>
              </View>
              <Text style={styles.sellTitle}>Sell on {BRAND.name}</Text>
              <Text style={styles.sellSub}>Reach millions of fashion-conscious buyers across India. Zero onboarding fee.</Text>
              <View style={styles.sellBtn}>
                <Text style={styles.sellBtnText}>Start Selling</Text>
                <Ionicons name="arrow-forward" size={13} color={lightBlueTheme.text} style={{ marginLeft: 4 }} />
              </View>
            </View>
            <Ionicons name="storefront-outline" size={54} color={lightBlueTheme.primary} style={{ opacity: 0.85, marginLeft: 10 }} />
          </LinearGradient>
        </Pressable>

        {/* Brand Footer with Original Logo in Dark Container */}
        <View style={styles.footer}>
          <View style={styles.footerLogoContainer}>
            <Image
              source={require('../../assets/brand-logo.jpg')}
              style={styles.footerLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.footerBrand}>{BRAND.name.toUpperCase()}</Text>
          <Text style={styles.footerText}>{BRAND.tagline}</Text>
          <Text style={styles.footerSubText}>Curated Fashion & Lifestyle • Crafted for Timeless Elegance</Text>
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
        <Pressable
          onPress={onAll}
          hitSlop={8}
          style={styles.arrowBtn}
          accessibilityLabel={`View all ${title}`}
        >
          <Ionicons name="chevron-forward" size={16} color={lightBlueTheme.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: lightBlueTheme.bg,
    paddingVertical: 16,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: lightBlueTheme.border,
  },
  lightSection: {
    backgroundColor: lightBlueTheme.softBg,
    paddingVertical: 16,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
  },
  secHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  secTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: lightBlueTheme.text,
    letterSpacing: -0.2,
  },
  secSub: {
    fontSize: 12,
    color: lightBlueTheme.textMuted,
    marginTop: 2,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: lightBlueTheme.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  catStrip: {
    backgroundColor: lightBlueTheme.bg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: lightBlueTheme.border,
  },
  catItem: {
    width: 76,
    alignItems: 'center',
  },
  catBg: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
    shadowColor: '#397FC1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  catImg: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  catText: {
    fontSize: 11,
    color: lightBlueTheme.text,
    marginTop: 6,
    fontWeight: '600',
    maxWidth: 72,
    textAlign: 'center',
  },

  saleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
  },
  saleIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  saleText: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 12,
    color: lightBlueTheme.text,
    letterSpacing: 0.2,
  },
  saleBadge: {
    backgroundColor: lightBlueTheme.text,
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  saleBadgeText: {
    color: lightBlueTheme.primary,
    fontSize: 10,
    fontWeight: '800',
  },

  perksRow: {
    paddingVertical: 10,
    marginTop: 4,
  },
  perkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightBlueTheme.bg,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
    gap: 8,
  },
  perkIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: lightBlueTheme.text,
  },
  perkSub: {
    fontSize: 10,
    color: lightBlueTheme.textMuted,
  },

  dealBlock: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(169, 207, 245, 0.25)',
  },
  dealHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  dealTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  timerLabel: {
    color: lightBlueTheme.primary,
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  viewAllBtn: {
    backgroundColor: lightBlueTheme.secondary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllBtnText: {
    color: lightBlueTheme.text,
    fontSize: 11,
    fontWeight: '700',
  },

  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 8,
  },
  offerTile: {
    backgroundColor: lightBlueTheme.bg,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
    shadowColor: '#397FC1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  offerImgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerName: {
    fontSize: 11,
    color: lightBlueTheme.text,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  offerBadge: {
    backgroundColor: lightBlueTheme.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
  },
  offerOff: {
    fontSize: 11,
    color: lightBlueTheme.accentDark,
    fontWeight: '800',
  },

  promoRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  promo: {
    height: 140,
  },
  promoShade: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'flex-end',
    padding: 10,
  },
  promoTag: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  promoTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: '#FFFFFF',
  },
  promoSub: {
    color: lightBlueTheme.primary,
    fontWeight: '700',
    fontSize: 11,
    marginTop: 1,
  },

  budgetSection: {
    backgroundColor: lightBlueTheme.softBg,
    paddingVertical: 14,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
  },
  budgetCard: {
    width: 114,
    backgroundColor: lightBlueTheme.bg,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
    shadowColor: '#397FC1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  budgetPrice: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: lightBlueTheme.text,
    marginTop: 6,
  },
  budgetName: {
    fontSize: 11,
    color: lightBlueTheme.textMuted,
    marginTop: 1,
  },
  budgetMrp: {
    fontSize: 10,
    color: '#8A9EB5',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },

  brand: {
    alignItems: 'center',
    width: 76,
  },
  brandCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: lightBlueTheme.primary,
  },
  brandInitial: {
    fontFamily: fonts.display,
    color: lightBlueTheme.text,
    fontSize: 20,
  },
  brandText: {
    fontSize: 11,
    marginTop: 5,
    color: lightBlueTheme.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  brandOff: {
    fontSize: 10,
    color: lightBlueTheme.accent,
    fontWeight: '700',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  trustWrap: {
    flexDirection: 'row',
    backgroundColor: lightBlueTheme.bg,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: lightBlueTheme.border,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  trustIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightBlueTheme.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    fontSize: 11,
    marginTop: 6,
    color: lightBlueTheme.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  trustSub: {
    fontSize: 9,
    marginTop: 1,
    color: lightBlueTheme.textMuted,
    textAlign: 'center',
  },

  sell: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 12,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(169, 207, 245, 0.25)',
  },
  sellBadge: {
    backgroundColor: 'rgba(169, 207, 245, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  sellBadgeText: {
    color: lightBlueTheme.secondary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sellTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: '#FFFFFF',
  },
  sellSub: {
    color: lightBlueTheme.primary,
    fontSize: 11,
    marginTop: 3,
    lineHeight: 15,
  },
  sellBtn: {
    alignSelf: 'flex-start',
    backgroundColor: lightBlueTheme.secondary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellBtnText: {
    color: lightBlueTheme.text,
    fontSize: 11,
    fontFamily: fonts.display,
  },

  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: lightBlueTheme.border,
    backgroundColor: lightBlueTheme.softBg,
  },
  footerLogoContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: lightBlueTheme.darkLogoBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(169, 207, 245, 0.5)',
    shadowColor: '#172B45',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  footerLogo: {
    width: 36,
    height: 36,
  },
  footerBrand: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: lightBlueTheme.text,
    marginTop: 8,
    letterSpacing: 2,
  },
  footerText: {
    fontSize: 11,
    color: lightBlueTheme.textMuted,
    marginTop: 2,
  },
  footerSubText: {
    fontSize: 10,
    color: '#8A9EB5',
    marginTop: 3,
  },
});
