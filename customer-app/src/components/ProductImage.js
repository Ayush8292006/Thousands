import React, { memo, useRef, useState } from 'react';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Real photo (product.images / product.thumb).
// Image reveal: pehli baar load hote waqt soft fade + halka zoom-out.
// Jo URL ek baar load ho chuka hai woh seedha dikhta hai — re-render par blink nahi.
const loaded = new Set();
const native = Platform.OS !== 'web';

function ProductImage({ product, size = 120, style, index = 0, rounded = 14, thumb = true, uri: forced, resizeMode = 'cover' }) {
  const [failed, setFailed] = useState(false);
  const uri = forced || (thumb && index === 0 ? product.thumb : product.images?.[index]) || product.images?.[0];
  const seen = loaded.has(uri);
  const v = useRef(new Animated.Value(seen ? 1 : 0)).current;

  const onLoad = () => {
    if (loaded.has(uri)) return;
    loaded.add(uri);
    Animated.timing(v, { toValue: 1, duration: 320, useNativeDriver: native }).start();
  };
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [1.04, 1] });

  return (
    <View style={[styles.box, { height: size, borderRadius: rounded }, style]}>
      {uri && !failed ? (
        <Animated.Image
          source={{ uri, cache: 'force-cache' }}
          style={[StyleSheet.absoluteFill, { opacity: v, transform: [{ scale }] }]}
          resizeMode={resizeMode}
          fadeDuration={0}
          onLoad={onLoad}
          onError={() => setFailed(true)}
        />
      ) : (
        <Ionicons name={product.icon || 'cube-outline'} size={size * 0.34} color={colors.faint} />
      )}
    </View>
  );
}

export default memo(ProductImage);

const styles = StyleSheet.create({
  box: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
