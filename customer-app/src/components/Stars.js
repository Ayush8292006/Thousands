import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 5 green stars (half supported) — Flipkart jaisa rating row
export default function Stars({ value = 0, size = 13, color = '#0F9D58' }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const name = value >= i ? 'star' : value >= i - 0.5 ? 'star-half' : 'star-outline';
        return <Ionicons key={i} name={name} size={size} color={value >= i - 0.5 ? color : '#C9CDD3'} />;
      })}
    </View>
  );
}
