import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { useAppWidth } from '../utils/platform';
import { colors } from '../theme';
import Shine from './Shine';

// Rounded banner carousel with Flipkart-style dash indicator
export default function HeroCarousel({ banners, onPress, interval = 4000 }) {
  const { width } = useAppWidth();
  const cardW = width - 32;
  const height = Math.round(cardW * 0.48);
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

  if (!banners.length) return <View style={{ height: height + 22 }} />;

  return (
    <View style={{ paddingTop: 12 }}>
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
              <ImageBackground source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover">
                <View style={styles.scrim} />
                <View style={styles.content}>
                  {item.kicker ? <Text style={styles.kicker}>{item.kicker}</Text> : null}
                  <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.sub} numberOfLines={1}>{item.subtitle}</Text>
                  <View style={styles.cta}><Text style={styles.ctaText}>{item.cta || 'Shop now'}</Text></View>
                </View>
                <Shine intensity={0.2} duration={1500} pause={5000} delay={900} />
              </ImageBackground>
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
  card: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.mist },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 20, 40, 0.38)' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, maxWidth: '72%' },
  kicker: { color: '#FFE27A', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  title: { color: colors.white, fontSize: 22, fontWeight: '800', lineHeight: 26, marginTop: 4 },
  sub: { color: 'rgba(255,255,255,0.9)', fontSize: 12.5, marginTop: 4 },
  cta: { alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, marginTop: 12 },
  ctaText: { fontSize: 12.5, fontWeight: '700', color: colors.ink },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  dot: { width: 14, height: 4, borderRadius: 2, backgroundColor: '#D5D9DF' },
  dotOn: { width: 34, backgroundColor: colors.ink },
});
