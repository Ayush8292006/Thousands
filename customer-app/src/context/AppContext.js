import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { computeTotals } from '../utils/pricing';
import { getProductById, createOrder } from '../services/api';
import { DELIVERY } from '../config/app';
import { addDays } from '../utils/format';

const AppContext = createContext(null);

export const ORDER_STEPS = ['Ordered', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];

const initialAddresses = [
  {
    id: 'a1',
    name: 'Ayush Kumar',
    phone: '9876543210',
    house: 'Flat 204, Tower B',
    area: 'Knowledge Park III',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    pincode: '201306',
    type: 'Home',
  },
];

function buildOrder({ id, items, address, payment, placedAt, stepIndex }) {
  const totals = computeTotals(items, address.state);
  return {
    id,
    invoiceNo: 'INV-' + id.slice(-6),
    placedAt,
    expectedBy: addDays(DELIVERY.days, new Date(placedAt)).toISOString(),
    items: totals.lines.map((l) => ({
      key: l.key,
      product: l.product,
      variant: l.variant,
      qty: l.qty,
      amount: l.amount,
      rate: l.rate,
      taxable: l.taxable,
      tax: l.tax,
      parts: l.parts,
    })),
    address,
    payment,
    totals,
    stepIndex,
    cancelled: false,
  };
}

const seedOrders = () => {
  const p1 = getProductById('e3');
  const p2 = getProductById('g2');
  return [
    buildOrder({
      id: 'TH482019377',
      items: [
        { key: 'e3|Black', product: p1, variant: 'Black', qty: 1 },
        { key: 'g2|', product: p2, variant: null, qty: 2 },
      ],
      address: initialAddresses[0],
      payment: 'UPI',
      placedAt: addDays(-9).toISOString(),
      stepIndex: 4,
    }),
  ];
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // { key, product, variant, qty }
  const [wishlist, setWishlist] = useState([]); // product ids
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState('a1');
  const [orders, setOrders] = useState(seedOrders);
  const [recentlyViewed, setRecentlyViewed] = useState([]); // product ids
  const [recentSearches, setRecentSearches] = useState(['headphones', 'running shoes', 'almonds']);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const addToCart = useCallback((product, variant = null, qty = 1) => {
    const key = `${product.id}|${variant || ''}`;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i));
      return [...prev, { key, product, variant, qty }];
    });
  }, []);

  const updateQty = useCallback((key, qty) => {
    setCart((prev) => (qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))));
  }, []);

  const removeFromCart = useCallback((key) => setCart((prev) => prev.filter((i) => i.key !== key)), []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  const addAddress = useCallback((addr) => {
    const id = 'a' + Date.now();
    setAddresses((prev) => [...prev, { ...addr, id }]);
    setSelectedAddressId(id);
  }, []);

  const addRecentlyViewed = useCallback((id) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 10));
  }, []);

  const addRecentSearch = useCallback((q) => {
    setRecentSearches((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 6));
  }, []);

  const placeOrder = useCallback(
    async (payment) => {
      const res = await createOrder({});
      const order = buildOrder({
        id: res.id,
        items: cart,
        address: selectedAddress,
        payment,
        placedAt: new Date().toISOString(),
        stepIndex: 0,
      });
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart, selectedAddress]
  );

  const cancelOrder = useCallback((id) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, cancelled: true } : o)));
  }, []);

  const totals = useMemo(() => computeTotals(cart, selectedAddress?.state), [cart, selectedAddress]);

  const value = {
    user, setUser,
    cart, addToCart, updateQty, removeFromCart, totals,
    cartCount: totals.count,
    wishlist, toggleWishlist,
    addresses, addAddress, selectedAddress, setSelectedAddressId,
    orders, placeOrder, cancelOrder,
    recentSearches, addRecentSearch,
    recentlyViewed, addRecentlyViewed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
