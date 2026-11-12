import React, { useState } from 'react';
import { Animated, Platform } from 'react-native';

// Scroll pe section halka sa upar aata hai aur fade-in hota hai.
// Pure interpolation (native driver) — scroll par koi re-render nahi, isliye smooth.
// offset = parent container ka scroll-content ke andar y (null = abhi pata nahi)
export default function Reveal({ scrollY, viewport, offset, children, style }) {
  const [y, setY] = useState(null);
  const onLayout = (e) => {
    if (y === null) setY(e.nativeEvent.layout.y);
  };
  const top = y === null || offset == null ? null : y + offset;
  if (!scrollY || top === null || top < viewport - 40) {
    return <Animated.View style={style} onLayout={onLayout}>{children}</Animated.View>;
  }
  const start = top - viewport;
  const opacity = scrollY.interpolate({ inputRange: [start - 1, start + 90], outputRange: [0, 1], extrapolate: 'clamp' });
  const translateY = scrollY.interpolate({ inputRange: [start - 1, start + 120], outputRange: [28, 0], extrapolate: 'clamp' });
  return (
    <Animated.View
      style={[style, { opacity, transform: [{ translateY }] }]}
      onLayout={onLayout}
      renderToHardwareTextureAndroid={Platform.OS === 'android'}
    >
      {children}
    </Animated.View>
  );
}
