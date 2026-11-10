import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';

import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ReviewStatusScreen from '../screens/ReviewStatusScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductFormScreen from '../screens/ProductFormScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import PaymentsScreen from '../screens/PaymentsScreen';
import FeeCalculatorScreen from '../screens/FeeCalculatorScreen';
import AccountScreen from '../screens/AccountScreen';
import MoreScreen from '../screens/MoreScreen';
import ReturnsScreen from '../screens/ReturnsScreen';
import HealthScreen from '../screens/HealthScreen';
import PromotionsScreen from '../screens/PromotionsScreen';
import AdsScreen from '../screens/AdsScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import WarehousesScreen from '../screens/WarehousesScreen';
import BrandsScreen from '../screens/BrandsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import CatalogScreen from '../screens/CatalogScreen';
import BulkUploadScreen from '../screens/BulkUploadScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icons = {
  Dashboard: ['grid', 'grid-outline'],
  Products: ['pricetags', 'pricetags-outline'],
  Orders: ['receipt', 'receipt-outline'],
  Payments: ['wallet', 'wallet-outline'],
  More: ['apps', 'apps-outline'],
};

function Tabs() {
  const { stats } = useSeller();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.border, height: 62, paddingTop: 6 },
        tabBarIcon: ({ focused, color }) => <Ionicons name={icons[route.name][focused ? 0 : 1]} size={22} color={color} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarBadge: stats.newOrders || undefined,
          tabBarBadgeStyle: { backgroundColor: colors.sale, color: colors.white, fontSize: 10 },
        }}
      />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="More" component={MoreScreen} options={{ tabBarLabel: 'Seller Hub' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { seller, kyc } = useSeller();
  const opts = { headerShown: false };

  if (!seller) {
    return (
      <Stack.Navigator screenOptions={opts}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  if (kyc.status !== 'approved') {
    return (
      <Stack.Navigator screenOptions={opts}>
        {kyc.status === 'in_review' ? (
          <Stack.Screen name="ReviewStatus" component={ReviewStatusScreen} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={opts}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="FeeCalculator" component={FeeCalculatorScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Returns" component={ReturnsScreen} />
      <Stack.Screen name="Health" component={HealthScreen} />
      <Stack.Screen name="Promotions" component={PromotionsScreen} />
      <Stack.Screen name="Ads" component={AdsScreen} />
      <Stack.Screen name="Insights" component={InsightsScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Warehouses" component={WarehousesScreen} />
      <Stack.Screen name="Brands" component={BrandsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Catalog" component={CatalogScreen} />
      <Stack.Screen name="BulkUpload" component={BulkUploadScreen} />
    </Stack.Navigator>
  );
}
