// Demo data for the seller "UrbanTech Retail". Backend aate hi services/api.js se aayega.
const U = (id, w = 500) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&fm=jpg&fit=crop`;

export const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'grocery', name: 'Grocery' },
  { id: 'sports', name: 'Sports' },
  { id: 'accessories', name: 'Bags & More' },
];

// Demo "gallery" — Add photo dabane pe inme se image aati hai (asli app mein camera/gallery picker)
export const sampleImages = [
  '1505740420928-5e560c06d30e', '1511707171634-5f897ff02aa9', '1624096104992-9b4fa3a279dd', '1608043152269-423dbba4e7e1',
  '1553062407-98eeb64c6a62', '1542291026-7eec264c27ff', '1608571423902-eed4a5ad8108', '1584990347193-6bebebfeaeee',
].map((id) => U(id));

const prod = (o) => ({ status: 'active', views: 0, sold: 0, variants: '', description: '', ...o, images: o.imgs.map((i) => U(i)) });

export const seedProducts = [
  prod({ id: 'p1', sku: 'UT-NOVA-X5-128', title: 'Nova X5 5G (Midnight Black, 128 GB)', brand: 'Nova', category: 'electronics', mrp: 22999, price: 17999, stock: 42, views: 8420, sold: 312, imgs: ['1511707171634-5f897ff02aa9', '1598327105666-5b89351aff97'], variants: '128 GB, 256 GB' }),
  prod({ id: 'p2', sku: 'UT-AERO-14', title: 'AeroBook 14 Thin & Light Laptop (16 GB / 512 GB SSD)', brand: 'Aero', category: 'electronics', mrp: 69990, price: 54990, stock: 6, views: 3120, sold: 58, imgs: ['1588872657578-7efd1f1555ed'] }),
  prod({ id: 'p3', sku: 'UT-PULSEMAX', title: 'PulseMax ANC Wireless Over-Ear Headphones', brand: 'Pulse', category: 'electronics', mrp: 7999, price: 2999, stock: 120, views: 15400, sold: 1240, imgs: ['1505740420928-5e560c06d30e', '1618366712010-f4ae9c647dcb'], variants: 'Sand, Black, White' }),
  prod({ id: 'p4', sku: 'UT-STRIDE-PRO', title: 'Stride Pro Smartwatch 1.96" AMOLED with BT Calling', brand: 'Stride', category: 'electronics', mrp: 7999, price: 2499, stock: 3, views: 9800, sold: 860, imgs: ['1624096104992-9b4fa3a279dd'], variants: 'Black, Grey' }),
  prod({ id: 'p5', sku: 'UT-BOOM-40', title: 'Boom 40W Portable Bluetooth Speaker', brand: 'Boom', category: 'electronics', mrp: 6999, price: 3499, stock: 0, views: 2100, sold: 140, imgs: ['1608043152269-423dbba4e7e1'] }),
  prod({ id: 'p6', sku: 'UT-CARRY-30L', title: 'Commuter Laptop Backpack 30L — Water Resistant', brand: 'Carry', category: 'accessories', mrp: 2999, price: 1299, stock: 64, views: 4300, sold: 410, imgs: ['1553062407-98eeb64c6a62'] }),
  prod({ id: 'p7', sku: 'UT-VINYL-GOLD', title: 'Retro Studio Wired Headphones — Gold Edition', brand: 'Vinyl', category: 'electronics', mrp: 3499, price: 1799, stock: 18, status: 'inactive', views: 640, sold: 22, imgs: ['1545127398-14699f92334b'] }),
  prod({ id: 'p8', sku: 'UT-PASTEL-KIDS', title: 'Pastel Wireless Headphones for Kids & Teens', brand: 'Pulse', category: 'electronics', mrp: 2999, price: 1299, stock: 25, status: 'draft', imgs: ['1613040809024-b4ef7ba99bc3'] }),
];

const daysAgo = (d, h = 10) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  t.setHours(h, 15, 0, 0);
  return t.toISOString();
};

const order = (o) => ({ payment: 'Prepaid', qty: 1, ...o });

export const seedOrders = [
  order({ id: 'TH482019801', productId: 'p3', variant: 'Black', qty: 2, buyer: 'Rohit S.', city: 'Delhi', state: 'Delhi', pincode: '110017', placedAt: daysAgo(0, 9), status: 'new' }),
  order({ id: 'TH482019802', productId: 'p4', variant: 'Black', buyer: 'Neha K.', city: 'Pune', state: 'Maharashtra', pincode: '411014', placedAt: daysAgo(0, 8), status: 'new', payment: 'COD' }),
  order({ id: 'TH482019803', productId: 'p1', variant: '128 GB', buyer: 'Arjun M.', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', placedAt: daysAgo(0, 7), status: 'new' }),
  order({ id: 'TH482019790', productId: 'p6', buyer: 'Sana A.', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010', placedAt: daysAgo(1), status: 'accepted' }),
  order({ id: 'TH482019781', productId: 'p3', variant: 'Sand', buyer: 'Vikram P.', city: 'Jaipur', state: 'Rajasthan', pincode: '302017', placedAt: daysAgo(1, 14), status: 'packed' }),
  order({ id: 'TH482019770', productId: 'p2', buyer: 'Meera J.', city: 'Hyderabad', state: 'Telangana', pincode: '500081', placedAt: daysAgo(2), status: 'ready' }),
  order({ id: 'TH482019755', productId: 'p4', variant: 'Grey', buyer: 'Karan D.', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', placedAt: daysAgo(3), status: 'shipped' }),
  order({ id: 'TH482019731', productId: 'p1', variant: '256 GB', buyer: 'Ananya R.', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', placedAt: daysAgo(5), status: 'delivered' }),
  order({ id: 'TH482019720', productId: 'p3', variant: 'White', qty: 1, buyer: 'Imran H.', city: 'Kolkata', state: 'West Bengal', pincode: '700091', placedAt: daysAgo(6), status: 'delivered', payment: 'COD' }),
  order({ id: 'TH482019702', productId: 'p6', qty: 2, buyer: 'Pooja T.', city: 'Delhi', state: 'Delhi', pincode: '110092', placedAt: daysAgo(8), status: 'delivered' }),
  order({ id: 'TH482019690', productId: 'p4', variant: 'Black', buyer: 'Rahul V.', city: 'Indore', state: 'Madhya Pradesh', pincode: '452010', placedAt: daysAgo(9), status: 'returned' }),
];

// Last 7 days sales (₹) — dashboard chart
export const weeklySales = [18400, 26900, 21300, 34800, 29700, 41200, 23600];

export const seedPayouts = [
  { id: 'PO-1042', date: daysAgo(3), amount: 48210.5, orders: 21, status: 'Paid', utr: 'HDFC00048213' },
  { id: 'PO-1035', date: daysAgo(10), amount: 39875.0, orders: 18, status: 'Paid', utr: 'HDFC00047790' },
  { id: 'PO-1028', date: daysAgo(17), amount: 52440.25, orders: 24, status: 'Paid', utr: 'HDFC00047102' },
];
