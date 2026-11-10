import React, { memo, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Real photo (product.images / product.thumb).
// No spinner / no fade: image blink nahi karegi. Jo URL ek baar load ho gaya,
// uska placeholder dobara nahi dikhta (re-render / re-mount pe bhi).
const loaded = new Set();

function ProductImage({ product, size = 120, style, index = 0, rounded = 14, thumb = true, uri: forced, resizeMode = 'cover' }) {
  const [failed, setFailed] = useState(false);
  const uri = forced || (thumb && index === 0 ? product.thumb : product.images?.[index]) || product.images?.[0];

  return (
    <View style={[styles.box, { height: size, borderRadius: rounded }, style]}>
      {uri && !failed ? (
        <Image
          source={{ uri, cache: 'force-cache' }}
          style={StyleSheet.absoluteFill}
          resizeMode={resizeMode}
          fadeDuration={0}
          onLoad={() => loaded.add(uri)}
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
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
