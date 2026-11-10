import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/kit';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';

export default function MoreScreen({ navigation }) {
  const { returns, queries, reviews, brands, unread, kyc } = useSeller();
  const pendingReturns = returns.filter((r) => ['requested', 'received'].includes(r.status)).length;
  const openQs = queries.filter((q) => !q.answer).length + reviews.filter((r) => !r.reply && r.rating <= 3).length;

  const groups = [
    {
      title: 'Grow your sales',
      items: [
        { icon: 'search', label: 'Sell existing product', go: 'Catalog', bg: '#E8F0FF', fg: '#2B50E0' },
        { icon: 'cloud-upload', label: 'Bulk upload', go: 'BulkUpload', bg: '#E6F7F8', fg: '#0E7490' },
        { icon: 'pricetag', label: 'Promotions', go: 'Promotions', bg: '#FFF4E0', fg: '#E67E00' },
        { icon: 'megaphone', label: 'Thousands Ads', go: 'Ads', bg: '#F1EBFF', fg: '#7C3AED' },
      ],
    },
    {
      title: 'Performance',
      items: [
        { icon: 'analytics', label: 'Growth insights', go: 'Insights', bg: '#E9F8EF', fg: '#0F9D58' },
        { icon: 'pulse', label: 'Account health', go: 'Health', bg: '#FDECF1', fg: '#E11D48' },
        { icon: 'chatbubbles', label: 'Reviews & questions', go: 'Reviews', bg: '#FFF8D6', fg: '#B7791F', badge: openQs },
      ],
    },
    {
      title: 'Operations',
      items: [
        { icon: 'return-down-back', label: 'Returns & claims', go: 'Returns', bg: '#FFF4E0', fg: '#B45309', badge: pendingReturns },
        { icon: 'business', label: 'Warehouses', go: 'Warehouses', bg: '#E8F0FF', fg: '#2B50E0' },
        { icon: 'ribbon', label: 'Brand approval', go: 'Brands', bg: '#F1EBFF', fg: '#7C3AED', badge: brands.filter((b) => b.status === 'pending').length },
        { icon: 'document-text', label: 'Reports', go: 'Reports', bg: '#E6F7F8', fg: '#0E7490' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: 'storefront', label: 'Store & account', go: 'Account', bg: '#E8F0FF', fg: '#2B50E0' },
        { icon: 'notifications', label: 'Notifications', go: 'Notifications', bg: '#FDECF1', fg: '#E11D48', badge: unread },
        { icon: 'calculator', label: 'Fee calculator', go: 'FeeCalculator', bg: '#E9F8EF', fg: '#0F9D58' },
      ],
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar title="Seller Hub" subtitle={kyc.business.storeName} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {groups.map((g) => (
          <View key={g.title} style={styles.group}>
            <Text style={styles.groupTitle}>{g.title}</Text>
            <View style={styles.grid}>
              {g.items.map((it) => (
                <Pressable key={it.label} style={styles.tile} onPress={() => navigation.navigate(it.go)} accessibilityLabel={it.label}>
                  <View style={[styles.icon, { backgroundColor: it.bg }]}>
                    <Ionicons name={it.icon} size={24} color={it.fg} />
                    {it.badge ? <View style={styles.badge}><Text style={styles.badgeText}>{it.badge}</Text></View> : null}
                  </View>
                  <Text style={styles.label} numberOfLines={2}>{it.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { backgroundColor: colors.white, marginTop: 8, paddingTop: 14, paddingBottom: 6 },
  groupTitle: { fontFamily: fonts.display, fontSize: 15, color: colors.black, paddingHorizontal: 16, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  tile: { width: '25%', alignItems: 'center', marginBottom: 14, paddingHorizontal: 4 },
  icon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.sale, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  label: { fontSize: 11, color: colors.ink, marginTop: 6, textAlign: 'center', fontWeight: '600' },
});
