import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Button, EmptyState } from '../components/ui';
import { colors , fonts, TAB_BAR_SPACE } from '../theme';
import { getProductById } from '../services/api';

export default function WishlistScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { wishlist, addToCart, toggleWishlist } = useApp();
  const items = wishlist.map(getProductById).filter(Boolean);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.title}>My Wishlist{items.length ? ` (${items.length})` : ''}</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 10, paddingHorizontal: 12 }}
        contentContainerStyle={{ gap: 18, paddingTop: 8, paddingBottom: TAB_BAR_SPACE + 20, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Your wishlist is empty"
            subtitle="Tap the heart on any product to save it here."
            actionTitle="Explore products"
            onAction={() => navigation.navigate('Home')}
          />
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProductCard product={item} />
            <Button
              title="Move to cart"
              variant="outline"
              style={{ height: 40, marginTop: 6 }}
              onPress={() => {
                addToCart(item, item.variants ? item.variants.options[0] : null);
                toggleWishlist(item.id);
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 12 },
  title: { color: colors.black, fontFamily: fonts.displayHeavy, fontSize: 26, letterSpacing: -0.6 },
});
