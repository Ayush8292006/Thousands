// Seller Hub modules ka demo data (returns, promotions, ads, reviews, warehouses...)
const U = (id, w = 400) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&fm=jpg&fit=crop`;

const ago = (d, h = 11) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, 0, 0, 0);
  return t.toISOString();
};
const ahead = (d) => ago(-d);

// Master catalog — products jo Thousands pe already listed hain (dusre sellers ke).
// Seller "Sell this" karke apna price/stock daal ke same listing pe bech sakta hai.
export const masterCatalog = [
  { id: 'c1', title: 'Velocity Runner — Lightweight Running Shoes', brand: 'Kinetic', category: 'footwear', mrp: 4999, lowestPrice: 1999, sellers: 6, image: U('1542291026-7eec264c27ff') },
  { id: 'c2', title: 'Eau de Parfum — Aqua Noir 100 ml', brand: 'Maison T', category: 'beauty', mrp: 2999, lowestPrice: 1299, sellers: 3, image: U('1458538977777-0549b2370168') },
  { id: 'c3', title: 'Triply Stainless Steel Cookware Set (3 pcs)', brand: 'Kitchora', category: 'home', mrp: 4999, lowestPrice: 2499, sellers: 4, image: U('1584990347193-6bebebfeaeee') },
  { id: 'c4', title: 'Heritage Leather Backpack — Tan Brown', brand: 'Carry', category: 'accessories', mrp: 6999, lowestPrice: 3499, sellers: 2, image: U('1622560480605-d83c853bc5c3') },
  { id: 'c5', title: 'Minimal Smartwatch — Silver Aluminium', brand: 'Stride', category: 'electronics', mrp: 7999, lowestPrice: 3999, sellers: 5, image: U('1609096458733-95b38583ac4e') },
  { id: 'c6', title: 'Anti-Skid Yoga Mat 6 mm with Strap', brand: 'FlexFit', category: 'sports', mrp: 1499, lowestPrice: 599, sellers: 9, image: U('1763004871583-4183d64096b1') },
  { id: 'c7', title: 'California Almonds Premium 500 g', brand: 'NutriBite', category: 'grocery', mrp: 699, lowestPrice: 429, sellers: 12, image: U('1642337241968-48094a7709ea') },
  { id: 'c8', title: 'Men Regular Fit Solid Casual Shirt — Sky Blue', brand: 'Northline', category: 'fashion', mrp: 1999, lowestPrice: 799, sellers: 7, image: U('1740711152088-88a009e877bb') },
];

export const RETURN_REASONS = {
  damaged: 'Product damaged',
  wrong: 'Wrong item received',
  notWorking: 'Not working as expected',
  sizeIssue: 'Size or fit issue',
  changedMind: 'No longer needed',
};

export const seedReturns = [
  { id: 'RT-2201', orderId: 'TH482019690', productId: 'p4', buyer: 'Rahul V.', city: 'Indore', reason: 'notWorking', comment: 'Bluetooth calling not connecting with my phone.', requestedAt: ago(1), status: 'requested', refund: 2499, type: 'Return' },
  { id: 'RT-2196', orderId: 'TH482019655', productId: 'p3', buyer: 'Sneha L.', city: 'Pune', reason: 'damaged', comment: 'Left ear cup cracked on arrival.', requestedAt: ago(3), status: 'in_transit', refund: 2999, type: 'Return' },
  { id: 'RT-2188', orderId: 'TH482019610', productId: 'p6', buyer: 'Aman G.', city: 'Delhi', reason: 'changedMind', comment: '', requestedAt: ago(6), status: 'received', refund: 1299, type: 'Return' },
  { id: 'RT-2170', orderId: 'TH482019580', productId: 'p1', buyer: 'Divya N.', city: 'Kochi', reason: 'wrong', comment: 'Received 128 GB instead of 256 GB.', requestedAt: ago(9), status: 'claim_raised', refund: 17999, type: 'Replacement', claimId: 'SPF-88412' },
];

export const RETURN_STATUS = {
  requested: { label: 'Awaiting your action', color: '#B45309', bg: '#FFF4E0' },
  in_transit: { label: 'Return in transit', color: '#4338CA', bg: '#EEF2FF' },
  received: { label: 'Received — inspect', color: '#0E7490', bg: '#E6F7F8' },
  claim_raised: { label: 'Claim raised', color: '#7C3AED', bg: '#F1EBFF' },
  completed: { label: 'Completed', color: '#0F9D58', bg: '#E3F5EC' },
  rejected: { label: 'Return rejected', color: '#E11D48', bg: '#FDECF1' },
};

// Account health metrics (Flipkart-style thresholds)
export const healthMetrics = [
  { id: 'cancel', label: 'Cancellation rate', value: 1.2, target: 2.5, unit: '%', lowerIsBetter: true, help: 'Orders you cancelled in the last 30 days' },
  { id: 'late', label: 'Late dispatch rate', value: 3.8, target: 4, unit: '%', lowerIsBetter: true, help: 'Orders shipped after the dispatch deadline' },
  { id: 'return', label: 'Return rate', value: 6.4, target: 8, unit: '%', lowerIsBetter: true, help: 'Delivered orders returned by buyers' },
  { id: 'rating', label: 'Product rating', value: 4.3, target: 3.8, unit: '★', lowerIsBetter: false, help: 'Average rating across your listings' },
  { id: 'response', label: 'Query response time', value: 5.2, target: 24, unit: ' hrs', lowerIsBetter: true, help: 'Average time to answer buyer questions' },
];

export const TIERS = [
  { id: 'bronze', name: 'Bronze', min: 0, color: '#B7791F' },
  { id: 'silver', name: 'Silver', min: 50, color: '#8A94A6' },
  { id: 'gold', name: 'Gold', min: 200, color: '#D4A017' },
  { id: 'platinum', name: 'Platinum', min: 1000, color: '#3B4A6B' },
];

export const seedPromotions = [
  { id: 'PR-31', name: 'Big Thousand Days', type: 'Platform sale', discount: 15, products: ['p3', 'p4'], start: ago(1), end: ahead(4), status: 'live', orders: 86, revenue: 214300 },
  { id: 'PR-29', name: 'Weekend audio fest', type: 'Seller offer', discount: 10, products: ['p3', 'p7'], start: ahead(3), end: ahead(5), status: 'scheduled', orders: 0, revenue: 0 },
  { id: 'PR-22', name: 'Diwali dhamaka', type: 'Platform sale', discount: 20, products: ['p1', 'p6'], start: ago(20), end: ago(14), status: 'ended', orders: 402, revenue: 1840500 },
];

export const upcomingEvents = [
  { id: 'ev1', name: 'Republic Day Sale', dates: 'Jan 20 – 26', minDiscount: 10, image: U('1505740420928-5e560c06d30e') },
  { id: 'ev2', name: 'Electronics Bonanza', dates: 'Dec 12 – 15', minDiscount: 15, image: U('1511707171634-5f897ff02aa9') },
];

export const seedCampaigns = [
  { id: 'AD-701', name: 'Headphones — top of search', productIds: ['p3'], dailyBudget: 500, cpc: 4, status: 'active', views: 48200, clicks: 1930, orders: 96, spend: 7720, revenue: 287900 },
  { id: 'AD-688', name: 'Smartwatch boost', productIds: ['p4'], dailyBudget: 300, cpc: 3, status: 'paused', views: 21400, clicks: 760, orders: 31, spend: 2280, revenue: 77469 },
];

export const seedReviews = [
  { id: 'rv1', productId: 'p3', buyer: 'Rohit S.', rating: 5, text: 'Noise cancellation is excellent for the price. Battery lasts the whole week.', date: ago(2), reply: '' },
  { id: 'rv2', productId: 'p4', buyer: 'Neha K.', rating: 3, text: 'Display is bright but the strap feels cheap.', date: ago(4), reply: '' },
  { id: 'rv3', productId: 'p1', buyer: 'Arjun M.', rating: 4, text: 'Fast phone, camera is decent in daylight.', date: ago(6), reply: 'Thank you, Arjun! Try the Night mode for low light shots.' },
  { id: 'rv4', productId: 'p6', buyer: 'Pooja T.', rating: 2, text: 'Zip broke within two weeks.', date: ago(8), reply: '' },
];

export const seedQueries = [
  { id: 'q1', productId: 'p3', buyer: 'Kunal', question: 'Does it support wired mode with a 3.5 mm cable?', date: ago(0, 9), answer: '' },
  { id: 'q2', productId: 'p1', buyer: 'Farah', question: 'Is the charger included in the box?', date: ago(1), answer: '' },
  { id: 'q3', productId: 'p2', buyer: 'Sameer', question: 'Can the RAM be upgraded later?', date: ago(3), answer: 'No, the RAM is soldered. Storage can be upgraded.' },
];

export const seedWarehouses = [
  { id: 'wh1', name: 'Okhla main warehouse', line1: 'Plot 22, Okhla Industrial Area Phase 2', city: 'New Delhi', state: 'Delhi', pincode: '110020', primary: true, active: true },
  { id: 'wh2', name: 'Noida store', line1: 'B-14, Sector 63', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', primary: false, active: true },
];

export const seedBrands = [
  { id: 'br1', name: 'Pulse', status: 'approved', category: 'electronics', date: ago(40) },
  { id: 'br2', name: 'Nova', status: 'approved', category: 'electronics', date: ago(38) },
  { id: 'br3', name: 'Boom', status: 'pending', category: 'electronics', date: ago(2) },
  { id: 'br4', name: 'SonicX', status: 'rejected', category: 'electronics', date: ago(12), note: 'Brand authorisation letter was not signed.' },
];

export const seedNotifications = [
  { id: 'n1', icon: 'receipt', color: '#2B50E0', title: '3 new orders', body: 'Accept them within 24 hours to avoid auto-cancellation.', time: ago(0, 9), read: false, go: 'Orders' },
  { id: 'n2', icon: 'return-down-back', color: '#B45309', title: 'Return request on Stride Pro', body: 'Rahul V. requested a return: Not working as expected.', time: ago(1), read: false, go: 'Returns' },
  { id: 'n3', icon: 'wallet', color: '#0F9D58', title: 'Payout of ₹48,210 sent', body: 'Credited to HDFC Bank ••7890. UTR HDFC00048213.', time: ago(3), read: false, go: 'Payments' },
  { id: 'n4', icon: 'megaphone', color: '#7C3AED', title: 'Republic Day Sale — register now', body: 'Offer at least 10% off to get featured on the home page.', time: ago(4), read: true, go: 'Promotions' },
  { id: 'n5', icon: 'alert-circle', color: '#E11D48', title: 'Boom 40W Speaker is out of stock', body: 'Add stock to keep the listing visible to buyers.', time: ago(5), read: true, go: 'Products' },
];

export const reports = [
  { id: 'r1', icon: 'document-text', title: 'GST sales report (GSTR-1 ready)', sub: 'B2C / B2B invoice-wise tax summary', period: 'Monthly' },
  { id: 'r2', icon: 'cash', title: 'Settlement statement', sub: 'Order-wise sale, fees and payout', period: 'Weekly' },
  { id: 'r3', icon: 'receipt', title: 'Commission invoices', sub: 'Thousands fee invoices with GST for input credit', period: 'Monthly' },
  { id: 'r4', icon: 'shield-checkmark', title: 'TCS & TDS certificates', sub: 'Tax collected / deducted at source by the marketplace', period: 'Quarterly' },
  { id: 'r5', icon: 'cube', title: 'Inventory report', sub: 'Stock by SKU and warehouse', period: 'On demand' },
  { id: 'r6', icon: 'return-down-back', title: 'Returns report', sub: 'Returns, reasons and claim status', period: 'Monthly' },
];

// Growth insights
export const funnel = { views: 46200, clicks: 9800, addToCart: 2140, orders: 612 };
export const priceSuggestions = [
  { productId: 'p2', competitor: 52990, note: 'Your price is ₹2,000 higher than the lowest seller' },
  { productId: 'p5', competitor: 3299, note: 'Back in stock at ₹3,299 could win the Buy Box' },
];
