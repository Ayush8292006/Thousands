import React from 'react';
import { View } from 'react-native';

// Sharp theme: gradients ki jagah flat, solid surfaces.
// Same API as expo-linear-gradient, taaki screens mein kuch aur na badle.
function alphaOf(c) {
  const m = /rgba?\(([^)]+)\)/.exec(c || '');
  if (!m) return c === 'transparent' ? 0 : 1;
  const p = m[1].split(',').map(Number);
  return p.length > 3 ? p[3] : 1;
}

export function LinearGradient({ colors = [], style, children, start, end, locations, ...rest }) {
  let bg = colors[0];
  const alphas = colors.map(alphaOf);
  const max = Math.max(...alphas);
  if (alphas.some((a) => a < 1)) {
    // Image ke upar overlay: ek halka, even scrim
    const m = /rgba?\(([^)]+)\)/.exec(colors[alphas.indexOf(max)] || '');
    if (m) {
      const p = m[1].split(',').map((s) => s.trim());
      bg = `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${(max * 0.55).toFixed(2)})`;
    }
  }
  return (
    <View style={[{ backgroundColor: bg }, style]} {...rest}>
      {children}
    </View>
  );
}

export default LinearGradient;
