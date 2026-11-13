import React, { useRef } from 'react';
import { Animated, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const native = Platform.OS !== 'web';

// Animated wishlist heart: tap par chhota sa "pop"
export default function HeartButton({ liked, onToggle, size = 16, style, color = colors.espresso }) {
  const v = useRef(new Animated.Value(1)).current;
  const press = () => {
    v.setValue(0.7);
    Animated.spring(v, { toValue: 1, friction: 4, tension: 200, useNativeDriver: native }).start();
    onToggle();
  };
  return (
    <Pressable onPress={press} hitSlop={8} accessibilityRole="button" accessibilityLabel={liked ? 'Remove from wishlist' : 'Add to wishlist'} style={style}>
      <Animated.View style={{ transform: [{ scale: v }] }}>
        <Ionicons name={liked ? 'heart' : 'heart-outline'} size={size} color={liked ? colors.terracotta : color} />
      </Animated.View>
    </Pressable>
  );
}
