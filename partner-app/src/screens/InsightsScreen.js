import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, Panel } from '../components/kit';
import ProductImage from '../components/ProductImage';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { funnel, priceSuggestions } from '../data/hub';
import { formatPrice } from '../utils/format';

export default function InsightsScreen({ navigation }) {
  const { products, productById } = useSeller();
  const top = [...products].sort((a, b) => b.sold * b.price - a.sold * a.price).slice(0, 4);
  const steps = [
    ['Product views', funnel.views, 'eye'],
    ['Clicks to product page', funnel.clicks, 'hand-left'],
    ['Added to cart', funnel.addToCart, 'cart'],
    ['Orders', funnel.orders, 'bag-check'],
  ];
  const conv = ((funnel.orders / funnel.views) * 100).toFixed(2);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Growth insights" subtitle="Last 30 days" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.kpis}>
          {[['Conversion', conv + '%', '#E9F8EF', colors.success], ['Avg. order value', formatPrice(3480), '#E8F0FF', colors.accent], ['Repeat buyers', '18%', '#FFF4E0', '#E67E00']].map(([k, v, bg, fg]) => (
            <View key={k} style={[styles.kpi, { backgroundColor: bg }]}>
              <Text style={[styles.kpiV, { color: fg }]}>{v}</Text>
              <Text style={styles.kpiK}>{k}</Text>
            </View>
          ))}
        </View>

        <Panel title="Sales funnel">
          {steps.map(([label, v, ic], i) => (
            <View key={label} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={ic} size={14} color={colors.accent} />
                <Text style={styles.fLabel}>{label}</Text>
                <Text style={styles.fValue}>{v.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.fTrack}><View style={[styles.fBar, { width: `${Math.max(4, (v / funnel.views) * 100)}%`, opacity: 1 - i * 0.18 }]} /></View>
            </View>
          ))}
          <Text style={styles.tip}>Tip: products with 5+ photos convert about 30% better. Add more images to your top listings.</Text>
        </Panel>

        <Panel title="Price recommendations">
          {priceSuggestions.map((s) => {
            const p = productById(s.productId);
            if (!p) return null;
            return (
              <Pressable key={s.productId} style={styles.row} onPress={() => navigation.navigate('ProductForm', { id: p.id })}>
                <View style={{ width: 48 }}><ProductImage product={p} size={48} rounded={8} /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.rTitle} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.rSub}>Yours {formatPrice(p.price)} · Suggested {formatPrice(s.competitor)}</Text>
                  <Text style={styles.rNote}>{s.note}</Text>
                </View>
                <Text style={styles.link}>Update</Text>
              </Pressable>
            );
          })}
        </Panel>

        <Panel title="Top products by revenue">
          {top.map((p, i) => (
            <View key={p.id} style={styles.row}>
              <Text style={styles.rank}>{i + 1}</Text>
              <View style={{ width: 44 }}><ProductImage product={p} size={44} rounded={8} /></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.rTitle} numberOfLines={1}>{p.title}</Text>
                <Text style={styles.rSub}>{p.sold} sold · {p.views.toLocaleString('en-IN')} views</Text>
              </View>
              <Text style={styles.rev}>{formatPrice(p.sold * p.price)}</Text>
            </View>
          ))}
        </Panel>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 0 },
  kpi: { flex: 1, borderRadius: 12, padding: 12 },
  kpiV: { fontFamily: fonts.display, fontSize: 17 },
  kpiK: { fontSize: 11, color: colors.ink, marginTop: 2 },
  fLabel: { flex: 1, marginLeft: 6, fontSize: 13, color: colors.ink },
  fValue: { fontFamily: fonts.display, fontSize: 13, color: colors.black },
  fTrack: { height: 10, borderRadius: 5, backgroundColor: colors.mist, marginTop: 6 },
  fBar: { height: 10, borderRadius: 5, backgroundColor: colors.accent },
  tip: { fontSize: 12, color: colors.ink, backgroundColor: colors.accentSoft, borderRadius: 8, padding: 10 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border },
  rTitle: { fontSize: 13, fontWeight: '600', color: colors.black },
  rSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  rNote: { fontSize: 11, color: '#E67E00', marginTop: 2, fontWeight: '600' },
  link: { color: colors.accent, fontWeight: '700', fontSize: 12 },
  rank: { width: 20, fontFamily: fonts.display, fontSize: 14, color: colors.muted },
  rev: { fontFamily: fonts.display, fontSize: 13, color: colors.success },
});
