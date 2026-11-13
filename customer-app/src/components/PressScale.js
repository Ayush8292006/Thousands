import React, { useRef } from 'react';
import { Animated, Pressable, Platform } from 'react-native';

const native = Platform.OS !== 'web';

// Premium micro-interaction: press par halka sa "sink" (scale 0.97) aur spring se wapas
export default function PressScale({ style, children, onPress, scaleTo = 0.97, ...rest }) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (value) => Animated.spring(v, { toValue: value, friction: 6, tension: 220, useNativeDriver: native }).start();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
      {...(Platform.OS === 'web' ? { onHoverIn: () => to(1.015), onHoverOut: () => to(1) } : null)}
      {...rest}
    >
      <Animated.View style={[style, { transform: [{ scale: v }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
