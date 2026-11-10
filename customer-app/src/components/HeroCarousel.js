import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { useAppWidth } from '../utils/platform';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../theme';

// Full-width, edge-to-edge auto-sliding banner (professional storefront style)
export default function HeroCarousel({ banners, onPress, interval = 4000 }) {
  const { width } = useAppWidth();
  const height = Math.round(width * 0.52);
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const touching = useRef(false);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => {
      if (touching.current) return;
      setIndex((i) => {
        const next = (i + 1) % banners.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, interval);
    return () => clearInterval(t);
  }, [banners.length, interval]);

  if (!banners.length) return <View style={{ height, backgroundColor: colors.mist }} />;

  return (
    <View style={{ width, height }}>
      <FlatList
        ref={listRef}
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
          <Pressable onPress={() => onPress(item)} accessibilityLabel={item.title.replace('\n', ' ')}>
            <ImageBackground source={{ uri: item.image }} style={{ width, height, backgroundColor: colors.mist }} resizeMode="cover">
              <LinearGradient
                colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.45)', 'rgba(0,0,0,0)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0.85, y: 0.5 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.content}>
                <Text style={styles.sub} numberOfLines={1}>{item.subtitle}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.cta}>
                  <Text style={styles.ctaText}>{item.cta}</Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />
      <View style={styles.dots} pointerEvents="none">
        {banners.map((b, i) => (
          <View key={b.id} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, maxWidth: '68%' },
  sub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontFamily: fonts.displayMedium },
  title: { color: colors.white, fontSize: 24, lineHeight: 29, fontFamily: fonts.displayHeavy, marginTop: 6, letterSpacing: -0.4 },
  cta: { alignSelf: 'flex-start', backgroundColor: colors.white, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 9, marginTop: 14 },
  ctaText: { color: colors.black, fontSize: 13, fontFamily: fonts.display },
  dots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  dotOn: { width: 20, backgroundColor: colors.white },
});
