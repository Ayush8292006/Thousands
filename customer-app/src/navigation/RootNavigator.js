import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { useApp } from '../context/AppContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AccountScreen from '../screens/AccountScreen';
import CartScreen from '../screens/CartScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddressScreen from '../screens/AddressScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import InvoiceScreen from '../screens/InvoiceScreen';
import SupportScreen from '../screens/SupportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: ['home', 'home-outline'],
  Categories: ['grid', 'grid-outline'],
  Wishlist: ['heart', 'heart-outline'],
  Account: ['person', 'person-outline'],
  Cart: ['bag', 'bag-outline'],
};

// Floating black pill tab bar — active tab ultramarine double-ring
function FloatingTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { cartCount } = useApp();
  return (
    <View pointerEvents="box-none" style={[tabStyles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={tabStyles.bar}>
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const onPress = () => {
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable key={route.key} onPress={onPress} style={tabStyles.item} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={route.name}>
              <View style={[tabStyles.ring, focused && tabStyles.ringOn]}>
                <View style={[tabStyles.dot, focused && tabStyles.dotOn]}>
                  <Ionicons name={tabIcons[route.name][focused ? 0 : 1]} size={20} color={focused ? colors.white : '#B9BBC0'} />
                </View>
              </View>
              {route.name === 'Cart' && cartCount > 0 ? (
                <View style={tabStyles.badge}><Text style={tabStyles.badgeText}>{cartCount}</Text></View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center' },
  bar: {
    flexDirection: 'row', backgroundColor: colors.black, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 6,
    width: '88%', justifyContent: 'space-between',
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 56 },
  ring: { width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  ringOn: { borderColor: colors.accent },
  dot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: colors.accent },
  badge: {
    position: 'absolute', top: 6, right: '22%', minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: colors.black },
});

function Tabs() {
  return (
    <Tab.Navigator tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}

const stackHeader = {
  headerStyle: { backgroundColor: colors.white },
  headerTintColor: colors.black,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: 18 },
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
};

export default function RootNavigator() {
  const { user } = useApp();

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={stackHeader}>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="ProductList" component={ProductListScreen} options={({ route }) => ({ title: route.params?.title || 'Products' })} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="Addresses" component={AddressScreen} options={{ title: 'My Addresses' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Order Details' }} />
      <Stack.Screen name="Invoice" component={InvoiceScreen} options={{ title: 'Tax Invoice' }} />
      <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Help & Support' }} />
    </Stack.Navigator>
  );
}
