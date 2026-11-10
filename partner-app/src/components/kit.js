import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts } from '../theme';
import { noOutline } from '../utils/platform';
import { ORDER_STATUS } from '../context/SellerContext';

// Blue gradient app header (tabs ke liye)
export function TopBar({ title, subtitle, right, back }) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  return (
    <LinearGradient colors={[colors.accentDark, colors.accent]} style={[s.topBar, { paddingTop: insets.top + 8 }]}>
      <StatusBar style="light" />
      <View style={s.topRow}>
        {back ? (
          <Pressable onPress={() => nav.goBack()} hitSlop={10} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
        ) : (
          <View style={s.logoBadge}><Image source={require('../../assets/logo-white.png')} style={s.logo} resizeMode="contain" /></View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={s.topTitle} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={s.topSub} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
    </LinearGradient>
  );
}

export function Panel({ title, action, onAction, children, style }) {
  return (
    <View style={[s.panel, style]}>
      {title ? (
        <View style={s.panelHead}>
          <Text style={s.panelTitle}>{title}</Text>
          {action ? (
            <Pressable onPress={onAction} hitSlop={8}>
              <Text style={s.panelAction}>{action}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function Field({ label, hint, error, style, inputStyle, prefix, ...rest }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <View style={[s.inputWrap, error && { backgroundColor: '#FDECF1' }]}>
        {prefix ? <Text style={s.prefix}>{prefix}</Text> : null}
        <TextInput style={[s.input, inputStyle, noOutline]} placeholderTextColor={colors.faint} {...rest} />
      </View>
      {error ? <Text style={s.err}>{error}</Text> : hint ? <Text style={s.hint}>{hint}</Text> : null}
    </View>
  );
}

export function StatusBadge({ status }) {
  const st = ORDER_STATUS[status] || ORDER_STATUS.cancelled;
  return (
    <View style={[s.badge, { backgroundColor: st.bg }]}>
      <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
    </View>
  );
}

export function Pill({ label, color = colors.accent, bg = colors.accentSoft }) {
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={[s.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function SegmentTabs({ tabs, value, onChange }) {
  return (
    <View style={s.segWrap}>
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <Pressable key={t.id} onPress={() => onChange(t.id)} style={[s.seg, on && s.segOn]}>
            <Text style={[s.segText, on && s.segTextOn]}>{t.label}</Text>
            {t.count !== undefined ? (
              <View style={[s.segCount, on && { backgroundColor: colors.white }]}>
                <Text style={[s.segCountText, on && { color: colors.accent }]}>{t.count}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function MoneyRow({ label, value, bold, negative, muted }) {
  return (
    <View style={s.moneyRow}>
      <Text style={[s.moneyLabel, bold && s.moneyBold, muted && { color: colors.muted }]}>{label}</Text>
      <Text style={[s.moneyLabel, bold && s.moneyBold, negative && { color: colors.sale }, muted && { color: colors.muted }]}>{value}</Text>
    </View>
  );
}

export function ListRow({ icon, title, subtitle, onPress, right, last }) {
  return (
    <Pressable onPress={onPress} style={[s.row, last && { borderBottomWidth: 0 }]}>
      {icon ? (
        <View style={s.rowIcon}><Ionicons name={icon} size={18} color={colors.accent} /></View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        {subtitle ? <Text style={s.rowSub} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      {right !== undefined ? right : <Ionicons name="chevron-forward" size={18} color={colors.faint} />}
    </Pressable>
  );
}

const s = StyleSheet.create({
  topBar: { paddingHorizontal: 16, paddingBottom: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', minHeight: 40 },
  logoBadge: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#FFF8E7', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  logo: { width: 21, height: 23 },
  topTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  topSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1 },

  panel: { backgroundColor: colors.white, borderRadius: 14, padding: 14, marginHorizontal: 12, marginTop: 12 },
  panelHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  panelTitle: { fontFamily: fonts.display, fontSize: 15, color: colors.black },
  panelAction: { fontSize: 13, fontWeight: '700', color: colors.accent },

  label: { fontSize: 12, color: colors.muted, marginBottom: 6, fontWeight: '600' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: 10, paddingHorizontal: 12, minHeight: 46 },
  prefix: { fontSize: 15, fontWeight: '700', color: colors.ink, marginRight: 6 },
  input: { flex: 1, fontSize: 15, color: colors.black, paddingVertical: 10 },
  hint: { fontSize: 11, color: colors.muted, marginTop: 4 },
  err: { fontSize: 11, color: colors.sale, marginTop: 4, fontWeight: '600' },

  badge: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  segWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingVertical: 10 },
  seg: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: colors.white },
  segOn: { backgroundColor: colors.accent },
  segText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  segTextOn: { color: colors.white },
  segCount: { marginLeft: 6, minWidth: 20, height: 18, borderRadius: 9, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  segCountText: { fontSize: 11, fontWeight: '800', color: colors.ink },

  moneyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  moneyLabel: { fontSize: 14, color: colors.ink },
  moneyBold: { fontFamily: fonts.display, fontSize: 16, color: colors.black },

  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: colors.black },
  rowSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
