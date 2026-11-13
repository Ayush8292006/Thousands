import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, Image, Animated, StyleSheet } from 'react-native';
import { useAppWidth } from '../utils/platform';
import { colors } from '../theme';

// Rounded banner carousel with Flipkart-style dash indicator
export default function HeroCarousel({ banners, onPress, interval = 4000, scrollY }) {
  const { width } = useAppWidth();
  const cardW = width - 32;
  const height = Math.round(cardW * 0.4);
  const ref = useRef(null);
  const touching = useRef(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return undefined;
    const t = setInterval(() => {
      if (touching.current) return;
      setIndex((i) => {
        const next = (i + 1) % banners.length;
        ref.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, interval);
    return () => clearInterval(t);
  }, [banners.length, interval, width]);

  // Subtle parallax: page scroll par image thoda dheere chalti hai
  const parallax = scrollY
    ? scrollY.interpolate({ inputRange: [-100, 0, 400], outputRange: [-14, 0, 46], extrapolate: 'clamp' })
    : 0;

  if (!banners.length) return <View style={{ height: height + 22 }} />;

  return (
    <View style={{ paddingTop: 10 }}>
      <FlatList
        ref={ref}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(b) => b.id}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onScrollBeginDrag={() => { touching.current = true; }}
        onMomentumScrollEnd={(e) => {
          touching.current = false;
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 16 }}>
            <Pressable onPress={() => onPress(item)} style={[styles.card, { height }]} accessibilityLabel={item.title.replace('\n', ' ')}>
              <Animated.View style={[styles.imgLayer, { transform: [{ translateY: parallax }, { scale: 1.12 }] }]}>
                <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" fadeDuration={0} />
              </Animated.View>
              <View style={StyleSheet.absoluteFill}>
                <View style={styles.scrim} />
                <View style={styles.content}>
                  {item.kicker ? <Text style={styles.kicker}>{item.kicker}</Text> : null}
                  <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.sub} numberOfLines={1}>{item.subtitle}</Text>
                  <View style={styles.cta}><Text style={styles.ctaText}>{item.cta || 'Shop now'}</Text></View>
                </View>
              </View>
            </Pressable>
          </View>
        )}
      />
      <View style={styles.dots}>
        {banners.map((b, i) => <View key={b.id} style={[styles.dot, i === index && styles.dotOn]} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#302719', shadowOpacity: 0.18, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 6,
    borderWidth: 1, borderColor: 'rgba(214, 180, 92, 0.7)', borderRadius: 18, overflow: 'hidden', backgroundColor: colors.mist },
  imgLayer: { ...StyleSheet.absoluteFillObject },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 20, 40, 0.38)' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, maxWidth: '72%' },
  kicker: { color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  title: { color: colors.white, fontSize: 18, fontWeight: '800', lineHeight: 22, marginTop: 3 },
  sub: { color: 'rgba(255,255,255,0.9)', fontSize: 11.5, marginTop: 3 },
  cta: { alignSelf: 'flex-start', backgroundColor: colors.card, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginTop: 9 },
  ctaText: { fontSize: 11.5, fontWeight: '700', color: colors.ink },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 9 },
  dot: { width: 14, height: 4, borderRadius: 2, backgroundColor: 'rgba(98, 80, 0, 0.18)' },
  dotOn: { width: 34, backgroundColor: colors.olive },
});
