import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { TopBar, Panel } from '../components/kit';
import { colors, fonts } from '../theme';
import { healthMetrics, TIERS } from '../data/hub';
import { useSeller } from '../context/SellerContext';

export default function HealthScreen() {
  const { products } = useSeller();
  const sold = products.reduce((s, p) => s + p.sold, 0);
  const tierIdx = TIERS.reduce((acc, t, i) => (sold >= t.min ? i : acc), 0);
  const tier = TIERS[tierIdx];
  const nextTier = TIERS[tierIdx + 1];
  const ok = healthMetrics.filter((m) => (m.lowerIsBetter ? m.value <= m.target : m.value >= m.target)).length;
  const progress = nextTier ? Math.min(1, (sold - tier.min) / (nextTier.min - tier.min)) : 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Account health" subtitle="Last 30 days" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <LinearGradient colors={[tier.color, '#1F2A4D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tier}>
          <Ionicons name="trophy" size={34} color={colors.yellow} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tierLabel}>Seller tier</Text>
            <Text style={styles.tierName}>{tier.name}</Text>
            {nextTier ? (
              <>
                <View style={styles.bar}><View style={[styles.barFill, { width: `${progress * 100}%` }]} /></View>
                <Text style={styles.tierSub}>{nextTier.min - sold} more units sold to reach {nextTier.name}</Text>
              </>
            ) : <Text style={styles.tierSub}>Highest tier unlocked</Text>}
          </View>
        </LinearGradient>

        <View style={styles.summary}>
          <Ionicons name={ok === healthMetrics.length ? 'checkmark-circle' : 'alert-circle'} size={22} color={ok === healthMetrics.length ? colors.success : '#E67E00'} />
          <Text style={styles.summaryText}>{ok} of {healthMetrics.length} metrics are on target. Keep all green to unlock lower fees and sale-event access.</Text>
        </View>

        <Panel title="Performance metrics">
          {healthMetrics.map((m, i) => {
            const good = m.lowerIsBetter ? m.value <= m.target : m.value >= m.target;
            const pct = m.lowerIsBetter ? Math.min(1, m.value / (m.target * 1.5)) : Math.min(1, m.value / 5);
            return (
              <View key={m.id} style={[styles.metric, i === healthMetrics.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.mLabel}>{m.label}</Text>
                  <Text style={[styles.mValue, { color: good ? colors.success : colors.sale }]}>{m.value}{m.unit}</Text>
                </View>
                <View style={styles.track}><View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: good ? colors.success : colors.sale }]} /></View>
                <Text style={styles.mHelp}>{m.help} · Target {m.lowerIsBetter ? 'below' : 'above'} {m.target}{m.unit}</Text>
              </View>
            );
          })}
        </Panel>

        <Panel title="Tier benefits">
          {TIERS.map((t, i) => (
            <View key={t.id} style={styles.benefit}>
              <View style={[styles.tierDot, { backgroundColor: t.color }]} />
              <Text style={[styles.benefitName, i === tierIdx && { color: colors.accent }]}>{t.name}{i === tierIdx ? ' (you)' : ''}</Text>
              <Text style={styles.benefitText}>{['Standard fees', 'Priority support', 'Lower fixed fee, sale badges', 'Dedicated account manager'][i]}</Text>
            </View>
          ))}
        </Panel>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tier: { flexDirection: 'row', alignItems: 'center', margin: 12, borderRadius: 16, padding: 18 },
  tierLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  tierName: { fontFamily: fonts.display, color: colors.white, fontSize: 24 },
  bar: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 8 },
  barFill: { height: 6, borderRadius: 3, backgroundColor: colors.yellow },
  tierSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 6 },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 12, borderRadius: 12, padding: 12 },
  summaryText: { flex: 1, marginLeft: 10, fontSize: 12, color: colors.ink, lineHeight: 17 },
  metric: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  mLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.black },
  mValue: { fontFamily: fonts.display, fontSize: 16 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.mist, marginTop: 8 },
  fill: { height: 6, borderRadius: 3 },
  mHelp: { fontSize: 11, color: colors.muted, marginTop: 6 },
  benefit: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  tierDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  benefitName: { width: 110, fontSize: 13, fontWeight: '700', color: colors.ink },
  benefitText: { flex: 1, fontSize: 12, color: colors.muted },
});
