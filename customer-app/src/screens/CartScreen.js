import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import ProductImage from '../components/ProductImage';
import QtyStepper from '../components/QtyStepper';
import PriceDetails from '../components/PriceDetails';
import { Button, EmptyState } from '../components/ui';
import { colors, radius , fonts, TAB_BAR_SPACE } from '../theme';
import { formatPrice, discountPct, formatDate, addDays } from '../utils/format';
import { DELIVERY } from '../config/app';

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cart, updateQty, removeFromCart, toggleWishlist, wishlist, totals, selectedAddress } = useApp();

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.headerTitle}>My Cart{totals.count ? ` (${totals.count})` : ''}</Text>
    </View>
  );

  if (!cart.length) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        {header}
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          subtitle="Add items you like and they will show up here."
          actionTitle="Shop now"
          onAction={() => navigation.navigate('Home')}
        />
      </View>
    );
  }

  const saveForLater = (item) => {
    if (!wishlist.includes(item.product.id)) toggleWishlist(item.product.id);
    removeFromCart(item.key);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {header}
      <ScrollView contentContainerStyle={{ paddingBottom: 110 + TAB_BAR_SPACE }}>
        <Pressable style={styles.addr} onPress={() => navigation.navigate('Addresses', { selectMode: true })}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13 }}>
              Deliver to: <Text style={{ fontWeight: '800' }}>{selectedAddress.name}, {selectedAddress.pincode}</Text>
            </Text>
            <Text style={styles.addrLine} numberOfLines={1}>
              {selectedAddress.house}, {selectedAddress.area}, {selectedAddress.city}
            </Text>
          </View>
          <View style={styles.changeBtn}><Text style={styles.changeText}>Change</Text></View>
        </Pressable>

        {totals.deliveryFee > 0 ? (
          <View style={styles.freeNote}>
            <Ionicons name="bicycle-outline" size={16} color={colors.ink} />
            <Text style={styles.freeText}>
              {formatPrice(DELIVERY.freeAbove - totals.subtotal)} more for free delivery
            </Text>
          </View>
        ) : null}

        {cart.map((item) => {
          const p = item.product;
          const off = discountPct(p.mrp, p.price);
          return (
            <View key={item.key} style={styles.item}>
              <View style={{ flexDirection: 'row' }}>
                <Pressable style={{ width: 90 }} onPress={() => navigation.navigate('ProductDetail', { id: p.id })}>
                  <ProductImage product={p} size={90} rounded={10} />
                </Pressable>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text numberOfLines={2} style={styles.title}>{p.title}</Text>
                  {item.variant ? <Text style={styles.meta}>{p.variants?.label}: {item.variant}</Text> : null}
                  <Text style={styles.meta}>Seller: {p.sellerName}</Text>
                  <View style={styles.priceRow}>
                    {off ? <Text style={styles.off}>↓{off}%</Text> : null}
                    {off ? <Text style={styles.mrp}>{formatPrice(p.mrp)}</Text> : null}
                    <Text style={styles.price}>{formatPrice(p.price)}</Text>
                  </View>
                  <Text style={styles.delivery}>Delivery by {formatDate(addDays(DELIVERY.days))}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <QtyStepper value={item.qty} onChange={(q) => updateQty(item.key, q)} />
                <View style={{ flex: 1 }} />
                <Pressable style={styles.act} onPress={() => saveForLater(item)}>
                  <Ionicons name="bookmark-outline" size={15} color={colors.ink} />
                  <Text style={styles.actText}>Save for later</Text>
                </Pressable>
                <Pressable style={styles.act} onPress={() => removeFromCart(item.key)}>
                  <Ionicons name="trash-outline" size={15} color={colors.ink} />
                  <Text style={styles.actText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        <PriceDetails totals={totals} style={{ marginTop: 10, borderRadius: 0 }} />
        <View style={styles.safe}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.muted} />
          <Text style={styles.safeText}>Safe and secure payments. Easy returns. 100% authentic products.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <View style={{ flex: 1 }}>
          <Text style={styles.mrpSmall}>{formatPrice(totals.mrpTotal)}</Text>
          <Text style={styles.total}>{formatPrice(totals.grandTotal)}</Text>
        </View>
        <Button title="Place Order" style={{ flex: 1.3 }} onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { color: colors.black, fontFamily: fonts.display, fontSize: 20 },
  addr: { backgroundColor: colors.white, padding: 14, flexDirection: 'row', alignItems: 'center' },
  addrLine: { fontSize: 12, color: colors.muted, marginTop: 2 },
  changeBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 10 },
  changeText: { fontWeight: '700', fontSize: 12 },
  freeNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accentSoft, padding: 10, paddingHorizontal: 14 },
  freeText: { marginLeft: 8, fontSize: 12, color: colors.ink, fontWeight: '600', flex: 1 },
  item: { backgroundColor: colors.white, padding: 14, marginTop: 10 },
  title: { fontSize: 14, color: colors.ink, lineHeight: 19 },
  meta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  off: { color: colors.success, fontWeight: '800', marginRight: 6 },
  mrp: { color: colors.faint, textDecorationLine: 'line-through', marginRight: 6, fontSize: 13 },
  price: { fontWeight: '900', fontSize: 16 },
  delivery: { fontSize: 11, color: colors.ink, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  act: { flexDirection: 'row', alignItems: 'center', marginLeft: 14 },
  actText: { marginLeft: 4, fontSize: 12, fontWeight: '600', color: colors.ink },
  safe: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  safeText: { marginLeft: 8, fontSize: 12, color: colors.muted, flex: 1 },
  bottom: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, flexDirection: 'row',
    alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border,
  },
  mrpSmall: { fontSize: 12, color: colors.faint, textDecorationLine: 'line-through' },
  total: { fontFamily: fonts.display, fontSize: 20 },
});
