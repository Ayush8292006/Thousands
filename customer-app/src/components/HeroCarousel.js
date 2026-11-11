import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { useAppWidth } from '../utils/platform';
import { LinearGradient } from './Flat';
import Shine from './Shine';
import { Ionicons } from '@expo/vector-icons';
import { fonts, lightBlueTheme } from '../theme';

export default function HeroCarousel({ banners, onPress, interval = 4500, autoPlay = false }) {
  const { width } = useAppWidth();
  const carouselWidth = width - 24; // 12px margin each side for modern framed look
  const height = Math.round(carouselWidth * 0.54);
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const touching = useRef(false);

  useEffect(() => {
    if (!autoPlay || banners.length < 2) return undefined;
    const t = setInterval(() => {
      if (touching.current) return;
      setIndex((i) => {
        const next = (i + 1) % banners.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, interval);
    return () => clearInterval(t);
  }, [banners.length, interval, autoPlay]);

  if (!banners.length) return <View style={{ height, backgroundColor: lightBlueTheme.softBg }} />;

  return (
    <View style={[styles.wrap, { width, height }]}>
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
          <View style={{ width, paddingHorizontal: 12 }}>
            <Pressable
              onPress={() => onPress(item)}
              accessibilityLabel={item.title.replace('\n', ' ')}
              style={styles.card}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={{ width: carouselWidth, height }}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['rgba(15, 29, 48, 0.88)', 'rgba(23, 43, 69, 0.45)', 'rgba(23, 43, 69, 0.05)']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 0.82, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.content}>
                  {item.kicker ? (
                    <View style={styles.kickerBadge}>
                      <Text style={styles.kickerText}>{item.kicker}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.sub} numberOfLines={1}>{item.subtitle}</Text>
                  <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.cta}>
                    <Text style={styles.ctaText}>{item.cta || 'Explore'}</Text>
                    <Ionicons name="chevron-forward" size={13} color={lightBlueTheme.text} style={{ marginLeft: 3 }} />
                  </View>
                </View>
                <Shine intensity={0.18} pause={5200} delay={1200} />
                </ImageBackground>
            </Pressable>
          </View>
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
  wrap: {
    marginTop: 10,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightBlueTheme.border,





  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    maxWidth: '72%',
  },
  kickerBadge: {
    backgroundColor: 'rgba(169, 207, 245, 0.25)',
    borderWidth: 0.8,
    borderColor: lightBlueTheme.primary,
    borderRadius: 0,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  kickerText: {
    color: lightBlueTheme.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sub: {
    color: lightBlueTheme.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '700',
    marginTop: 4,
    
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',





  },
  ctaText: {
    color: lightBlueTheme.text,
    fontSize: 12,
    fontWeight: '700',
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    marginHorizontal: 3,
  },
  dotOn: {
    width: 22,
    height: 6,
    borderRadius: 0,
    backgroundColor: lightBlueTheme.primary,
  },
});
