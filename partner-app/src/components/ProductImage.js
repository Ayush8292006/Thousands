import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Real photo (product.images / product.thumb). Load hote waqt soft skeleton,
// aur URL fail ho jaye to category icon fallback.
export default function ProductImage({ product, size = 120, style, index = 0, rounded = 14, thumb = true, uri: forced, resizeMode = 'cover' }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const uri = forced || (thumb && index === 0 ? product.thumb : product.images?.[index]) || product.images?.[0];

  return (
    <View style={[styles.box, { height: size, borderRadius: rounded }, style]}>
      {uri && !failed ? (
        <>
          <Image
            source={{ uri }}
            style={StyleSheet.absoluteFill}
            resizeMode={resizeMode}
            onLoadEnd={() => setLoading(false)}
            onError={() => setFailed(true)}
          />
          {loading ? <ActivityIndicator color={colors.faint} /> : null}
        </>
      ) : (
        <Ionicons name={product.icon || 'cube-outline'} size={size * 0.34} color={colors.black} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
