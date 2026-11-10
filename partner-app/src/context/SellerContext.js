import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { seedProducts, seedOrders, seedPayouts } from '../data/seed';
import { settlement } from '../config/commission';
import {
  seedReturns, seedPromotions, seedCampaigns, seedReviews, seedQueries,
  seedWarehouses, seedBrands, seedNotifications, masterCatalog,
} from '../data/hub';

const Ctx = createContext(null);

export const ORDER_FLOW = ['new', 'accepted', 'packed', 'ready', 'shipped', 'delivered'];

export const ORDER_STATUS = {
  new: { label: 'New', color: '#2B50E0', bg: '#E8F0FF' },
  accepted: { label: 'Accepted', color: '#7C3AED', bg: '#F1EBFF' },
  packed: { label: 'Packed', color: '#B45309', bg: '#FFF4E0' },
  ready: { label: 'Ready to ship', color: '#0E7490', bg: '#E6F7F8' },
  shipped: { label: 'Shipped', color: '#4338CA', bg: '#EEF2FF' },
  delivered: { label: 'Delivered', color: '#0F9D58', bg: '#E3F5EC' },
  returned: { label: 'Returned', color: '#E11D48', bg: '#FDECF1' },
  cancelled: { label: 'Cancelled', color: '#6B6F76', bg: '#F2F3F5' },
};

// Next step ka button text (seller ke point of view se)
export const NEXT_ACTION = {
  new: 'Accept order',
  accepted: 'Mark as packed',
  packed: 'Generate label & mark ready',
  ready: 'Hand over to courier',
  shipped: 'Mark as delivered (demo)',
};

const emptyKyc = {
  status: 'not_started', // not_started | in_review | approved
  business: { storeName: '', legalName: '', type: 'Proprietorship', category: 'electronics' },
  tax: { country: 'India', taxId: '', pan: '' },
  bank: { holder: '', account: '', ifsc: '', bankName: '' },
  address: { line1: '', city: '', state: '', pincode: '' },
  docs: { idProof: false, addressProof: false, cheque: false, signature: false },
};

// Demo ke liye pre-filled KYC (Skip to dashboard ke liye)
const demoKyc = {
  status: 'approved',
  business: { storeName: 'UrbanTech Retail', legalName: 'UrbanTech Retail Pvt Ltd', type: 'Private Limited', category: 'electronics' },
  tax: { country: 'India', taxId: '07ABCDE1234F1Z5', pan: 'ABCDE1234F' },
  bank: { holder: 'UrbanTech Retail Pvt Ltd', account: '50100234567890', ifsc: 'HDFC0001234', bankName: 'HDFC Bank' },
  address: { line1: 'Plot 22, Okhla Industrial Area Phase 2', city: 'New Delhi', state: 'Delhi', pincode: '110020' },
  docs: { idProof: true, addressProof: true, cheque: true, signature: true },
};

export function SellerProvider({ children }) {
  const [seller, setSeller] = useState(null); // { phone }
  const [kyc, setKyc] = useState(emptyKyc);
  const [products, setProducts] = useState(seedProducts);
  const [orders, setOrders] = useState(seedOrders);
  const [payouts] = useState(seedPayouts);
  const [vacation, setVacation] = useState(false);
  const [returns, setReturns] = useState(seedReturns);
  const [promotions, setPromotions] = useState(seedPromotions);
  const [campaigns, setCampaigns] = useState(seedCampaigns);
  const [reviews, setReviews] = useState(seedReviews);
  const [queries, setQueries] = useState(seedQueries);
  const [warehouses, setWarehouses] = useState(seedWarehouses);
  const [brands, setBrands] = useState(seedBrands);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [fulfilment, setFulfilment] = useState(false); // Thousands Fulfilment (FBF jaisa)

  // ---- Hub modules
  const patch = (setter) => (id, values) => setter((l) => l.map((x) => (x.id === id ? { ...x, ...values } : x)));
  const updateReturn = useCallback(patch(setReturns), []);
  const addPromotion = useCallback((p) => setPromotions((l) => [{ ...p, id: 'PR-' + Date.now().toString().slice(-3), orders: 0, revenue: 0 }, ...l]), []);
  const updatePromotion = useCallback(patch(setPromotions), []);
  const addCampaign = useCallback((c) => setCampaigns((l) => [{ ...c, id: 'AD-' + Date.now().toString().slice(-3), views: 0, clicks: 0, orders: 0, spend: 0, revenue: 0 }, ...l]), []);
  const updateCampaign = useCallback(patch(setCampaigns), []);
  const replyReview = useCallback((id, reply) => setReviews((l) => l.map((x) => (x.id === id ? { ...x, reply } : x))), []);
  const answerQuery = useCallback((id, answer) => setQueries((l) => l.map((x) => (x.id === id ? { ...x, answer } : x))), []);
  const addWarehouse = useCallback((w) => setWarehouses((l) => [...l, { ...w, id: 'wh' + Date.now(), primary: false, active: true }]), []);
  const setPrimaryWarehouse = useCallback((id) => setWarehouses((l) => l.map((w) => ({ ...w, primary: w.id === id }))), []);
  const updateWarehouse = useCallback(patch(setWarehouses), []);
  const requestBrand = useCallback((b) => setBrands((l) => [{ ...b, id: 'br' + Date.now(), status: 'pending', date: new Date().toISOString() }, ...l]), []);
  const markAllRead = useCallback(() => setNotifications((l) => l.map((n) => ({ ...n, read: true }))), []);
  const markRead = useCallback((id) => setNotifications((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))), []);
  const sellFromCatalog = useCallback((c, { price, stock }) => {
    setProducts((list) => [
      {
        id: 'p' + Date.now(), sku: `UT-${c.brand.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        title: c.title, brand: c.brand, category: c.category, mrp: c.mrp, price, stock, status: 'active',
        views: 0, sold: 0, variants: '', description: '', images: [c.image], catalogId: c.id,
      },
      ...list,
    ]);
  }, []);

  const productById = useCallback((id) => products.find((p) => p.id === id), [products]);

  // ---- KYC
  const updateKyc = useCallback((section, values) => setKyc((k) => ({ ...k, [section]: { ...k[section], ...values } })), []);
  const submitKyc = useCallback(() => setKyc((k) => ({ ...k, status: 'in_review' })), []);
  const approveKyc = useCallback(() => setKyc((k) => ({ ...k, status: 'approved' })), []);
  const useDemoStore = useCallback(() => setKyc(demoKyc), []);

  // ---- Products
  const saveProduct = useCallback((p) => {
    setProducts((list) => {
      if (p.id && list.some((x) => x.id === p.id)) return list.map((x) => (x.id === p.id ? { ...x, ...p } : x));
      return [{ ...p, id: 'p' + Date.now(), views: 0, sold: 0 }, ...list];
    });
  }, []);
  const toggleProduct = useCallback((id) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p)));
  }, []);
  const deleteProduct = useCallback((id) => setProducts((list) => list.filter((p) => p.id !== id)), []);
  const updateStock = useCallback((id, stock) => {
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)));
  }, []);

  // ---- Orders
  const advanceOrder = useCallback((id) => {
    setOrders((list) =>
      list.map((o) => {
        if (o.id !== id) return o;
        const i = ORDER_FLOW.indexOf(o.status);
        return i >= 0 && i < ORDER_FLOW.length - 1 ? { ...o, status: ORDER_FLOW[i + 1] } : o;
      })
    );
  }, []);
  const cancelOrder = useCallback((id) => setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o))), []);

  // ---- Money
  const orderSettlement = useCallback(
    (o) => {
      const p = productById(o.productId);
      return p ? settlement(p.price, o.qty, p.category) : null;
    },
    [productById]
  );

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todays = orders.filter((o) => new Date(o.placedAt).toDateString() === today && o.status !== 'cancelled');
    const salesToday = todays.reduce((s, o) => s + (productById(o.productId)?.price || 0) * o.qty, 0);
    const pendingShip = orders.filter((o) => ['new', 'accepted', 'packed', 'ready'].includes(o.status)).length;
    const newOrders = orders.filter((o) => o.status === 'new').length;
    const lowStock = products.filter((p) => p.status === 'active' && p.stock > 0 && p.stock <= 5).length;
    const outOfStock = products.filter((p) => p.status === 'active' && p.stock === 0).length;
    const wallet = orders
      .filter((o) => o.status === 'delivered')
      .reduce((s, o) => s + (orderSettlement(o)?.net || 0), 0);
    const inTransit = orders
      .filter((o) => ['shipped', 'ready', 'packed', 'accepted'].includes(o.status))
      .reduce((s, o) => s + (orderSettlement(o)?.net || 0), 0);
    const next = new Date();
    next.setDate(next.getDate() + ((5 - next.getDay() + 7) % 7 || 7)); // agla Friday
    return { salesToday, ordersToday: todays.length, pendingShip, newOrders, lowStock, outOfStock, wallet, inTransit, nextPayout: next.toISOString(), rating: 4.6 };
  }, [orders, products, productById, orderSettlement]);

  const value = {
    seller, setSeller,
    kyc, updateKyc, submitKyc, approveKyc, useDemoStore,
    products, productById, saveProduct, toggleProduct, deleteProduct, updateStock,
    orders, advanceOrder, cancelOrder, orderSettlement,
    payouts, stats,
    vacation, setVacation,
    returns, updateReturn,
    promotions, addPromotion, updatePromotion,
    campaigns, addCampaign, updateCampaign,
    reviews, replyReview, queries, answerQuery,
    warehouses, addWarehouse, setPrimaryWarehouse, updateWarehouse,
    brands, requestBrand,
    notifications, markAllRead, markRead, unread: notifications.filter((n) => !n.read).length,
    fulfilment, setFulfilment,
    masterCatalog, sellFromCatalog,
    logout: () => { setSeller(null); setKyc(emptyKyc); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSeller = () => useContext(Ctx);
