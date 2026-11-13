import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Web par native-stack animation nahi hoti — isliye har naya page halka slide + fade se aata hai
export default function ScreenEnter({ children }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [v]);
  const translateX = v.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  return <Animated.View style={{ flex: 1, opacity: v, transform: [{ translateX }] }}>{children}</Animated.View>;
}
