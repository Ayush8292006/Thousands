// Dummy catalog — backend ready hone par services/api.js se replace hoga.
// Images: Unsplash (free license) — production mein seller ki apni
// product photos backend se aayengi (product.images = [url, url, ...]).

const U = (id, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&fm=jpg&fit=crop`;

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: 'headset-outline', image: U('1505740420928-5e560c06d30e', 300), subs: ['Mobiles', 'Laptops', 'Audio', 'Wearables'] },
  { id: 'fashion', name: 'Fashion', icon: 'shirt-outline', image: U('1740711152088-88a009e877bb', 300), subs: ['Shirts', 'T-Shirts', 'Formal'] },
  { id: 'footwear', name: 'Footwear', icon: 'footsteps-outline', image: U('1542291026-7eec264c27ff', 300), subs: ['Sneakers', 'Running', 'Casual'] },
  { id: 'beauty', name: 'Beauty', icon: 'sparkles-outline', image: U('1608571423902-eed4a5ad8108', 300), subs: ['Skincare', 'Makeup', 'Fragrance'] },
  { id: 'home', name: 'Home & Kitchen', icon: 'restaurant-outline', image: U('1584990347193-6bebebfeaeee', 300), subs: ['Cookware', 'Kitchen'] },
  { id: 'grocery', name: 'Grocery', icon: 'basket-outline', image: U('1543158181-1274e5362710', 300), subs: ['Dry Fruits', 'Snacks'] },
  { id: 'sports', name: 'Sports', icon: 'barbell-outline', image: U('1591291621164-2c6367723315', 300), subs: ['Weights', 'Yoga'] },
  { id: 'accessories', name: 'Bags & More', icon: 'bag-handle-outline', image: U('1553062407-98eeb64c6a62', 300), subs: ['Backpacks', 'Watches'] },
];

const S = {
  urbantech: { sellerId: 's1', sellerName: 'UrbanTech Retail', sellerState: 'Delhi', sellerRating: 4.6 },
  stylehub: { sellerId: 's2', sellerName: 'StyleHub Fashions', sellerState: 'Maharashtra', sellerRating: 4.4 },
  homecraft: { sellerId: 's3', sellerName: 'HomeCraft Living', sellerState: 'Uttar Pradesh', sellerRating: 4.5 },
  glow: { sellerId: 's4', sellerName: 'Glow & Co.', sellerState: 'Karnataka', sellerRating: 4.3 },
  freshcart: { sellerId: 's5', sellerName: 'FreshCart Mart', sellerState: 'Delhi', sellerRating: 4.7 },
  fitzone: { sellerId: 's6', sellerName: 'FitZone Sports', sellerState: 'Punjab', sellerRating: 4.5 },
  carry: { sellerId: 's7', sellerName: 'CarryOn Store', sellerState: 'Uttar Pradesh', sellerRating: 4.6 },
};

const p = (o) => ({
  assured: true,
  stock: 25,
  highlights: [],
  variants: null,
  tags: [],
  ...o,
  images: o.imgs.map((id) => U(id)),
  thumb: U(o.imgs[0], 400),
});

export const products = [
  // ---------- Electronics
  p({ id: 'e1', title: 'Nova X5 5G (Midnight Black, 128 GB)', brand: 'Nova', category: 'electronics', sub: 'Mobiles', price: 17999, mrp: 22999, rating: 4.4, reviews: 12840, icon: 'phone-portrait-outline', ...S.urbantech, tags: ['trending'],
    imgs: ['1511707171634-5f897ff02aa9', '1598327105666-5b89351aff97', '1634403665481-74948d815f03'],
    variants: { label: 'Storage', options: ['128 GB', '256 GB'] },
    highlights: ['8 GB RAM | 128 GB ROM', '6.7" AMOLED 120Hz Display', '50MP + 8MP | 16MP Front Camera', '5000 mAh, 45W Fast Charging'] }),
  p({ id: 'e2', title: 'AeroBook 14 Thin & Light Laptop (16 GB / 512 GB SSD)', brand: 'Aero', category: 'electronics', sub: 'Laptops', price: 54990, mrp: 69990, rating: 4.3, reviews: 3210, icon: 'laptop-outline', ...S.urbantech, tags: ['trending'],
    imgs: ['1588872657578-7efd1f1555ed', '1531297484001-80022131f5a1', '1778157781167-07e0a5d5c82f'],
    highlights: ['Intel Core i5 13th Gen', '14" Full HD IPS', '1.3 kg, Backlit Keyboard', 'Windows 11 + MS Office'] }),
  p({ id: 'e3', title: 'PulseMax ANC Wireless Over-Ear Headphones', brand: 'Pulse', category: 'electronics', sub: 'Audio', price: 2999, mrp: 7999, rating: 4.4, reviews: 45120, icon: 'headset-outline', ...S.urbantech, tags: ['trending', 'deal'],
    imgs: ['1505740420928-5e560c06d30e', '1618366712010-f4ae9c647dcb', '1590658268037-6bf12165a8df'],
    variants: { label: 'Colour', options: ['Sand', 'Black', 'White'] },
    highlights: ['Active Noise Cancellation up to 35dB', '60 hrs playback', 'Bluetooth 5.3, Multipoint', 'Fast charge: 10 min = 5 hrs'] }),
  p({ id: 'e4', title: 'Stride Pro Smartwatch 1.96" AMOLED with BT Calling', brand: 'Stride', category: 'electronics', sub: 'Wearables', price: 2499, mrp: 7999, rating: 4.2, reviews: 28740, icon: 'watch-outline', ...S.urbantech, tags: ['deal'],
    imgs: ['1624096104992-9b4fa3a279dd', '1551816230-ef5deaed4a26', '1546868871-7041f2a55e12'],
    variants: { label: 'Strap', options: ['Black', 'Grey'] },
    highlights: ['Bluetooth Calling', '100+ Sports Modes', 'SpO2 & Heart Rate', '7 days battery'] }),
  p({ id: 'e5', title: 'Boom 40W Portable Bluetooth Speaker', brand: 'Boom', category: 'electronics', sub: 'Audio', price: 3499, mrp: 6999, rating: 4.4, reviews: 5400, icon: 'musical-notes-outline', ...S.urbantech,
    imgs: ['1608043152269-423dbba4e7e1', '1589256469067-ea99122bbdc4', '1582978571763-2d039e56f0c3'],
    highlights: ['40W deep bass', 'IPX7 waterproof', '20 hrs playback', 'Party pairing'] }),
  p({ id: 'e6', title: 'Retro Studio Wired Headphones — Gold Edition', brand: 'Vinyl', category: 'electronics', sub: 'Audio', price: 1799, mrp: 3499, rating: 4.1, reviews: 2300, icon: 'headset-outline', ...S.urbantech,
    imgs: ['1545127398-14699f92334b', '1484704849700-f032a568e944'],
    highlights: ['50mm drivers', 'Foldable design', '3.5mm + 6.3mm jack'] }),
  p({ id: 'e7', title: 'Pastel Wireless Headphones for Kids & Teens', brand: 'Pulse', category: 'electronics', sub: 'Audio', price: 1299, mrp: 2999, rating: 4.2, reviews: 8100, icon: 'headset-outline', ...S.urbantech,
    imgs: ['1613040809024-b4ef7ba99bc3'],
    highlights: ['85dB volume limit', '30 hrs battery', 'Soft cushions'] }),

  // ---------- Fashion
  p({ id: 'f1', title: 'Men Regular Fit Solid Casual Shirt — Sky Blue', brand: 'Northline', category: 'fashion', sub: 'Shirts', price: 799, mrp: 1999, rating: 4.2, reviews: 7600, icon: 'shirt-outline', ...S.stylehub, tags: ['trending'],
    imgs: ['1740711152088-88a009e877bb', '1564584217132-2271feaeb3c5'],
    variants: { label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
    highlights: ['100% Cotton', 'Regular fit', 'Machine wash'] }),
  p({ id: 'f2', title: 'Men Slim Fit Formal Shirt — Crisp White', brand: 'Northline', category: 'fashion', sub: 'Formal', price: 899, mrp: 2299, rating: 4.3, reviews: 5200, icon: 'shirt-outline', ...S.stylehub,
    imgs: ['1603252109303-2751441dd157'],
    variants: { label: 'Size', options: ['38', '40', '42', '44'] },
    highlights: ['Wrinkle-free cotton blend', 'Slim fit', 'Spread collar'] }),
  p({ id: 'f3', title: 'Essential Crew Neck T-Shirt — Jet Black', brand: 'Basics Co.', category: 'fashion', sub: 'T-Shirts', price: 399, mrp: 999, rating: 4.4, reviews: 21500, icon: 'shirt-outline', ...S.stylehub, tags: ['deal'],
    imgs: ['1618354691373-d851c5c3a990'],
    variants: { label: 'Size', options: ['S', 'M', 'L', 'XL'] },
    highlights: ['180 GSM bio-washed cotton', 'Pre-shrunk', 'Unisex fit'] }),

  // ---------- Footwear
  p({ id: 'sh1', title: 'Velocity Runner — Lightweight Running Shoes', brand: 'Kinetic', category: 'footwear', sub: 'Running', price: 1999, mrp: 4999, rating: 4.3, reviews: 18300, icon: 'footsteps-outline', ...S.stylehub, tags: ['trending', 'deal'],
    imgs: ['1542291026-7eec264c27ff', '1600185365483-26d7a4cc7519'],
    variants: { label: 'UK Size', options: ['6', '7', '8', '9', '10'] },
    highlights: ['Breathable knit upper', 'Responsive foam sole', 'Anti-skid grip'] }),
  p({ id: 'sh2', title: 'Urban Classic Leather Sneakers — Black', brand: 'Kinetic', category: 'footwear', sub: 'Casual', price: 2499, mrp: 4999, rating: 4.4, reviews: 6100, icon: 'footsteps-outline', ...S.stylehub,
    imgs: ['1543508282-6319a3e2621f'],
    variants: { label: 'UK Size', options: ['6', '7', '8', '9', '10'] },
    highlights: ['Genuine leather upper', 'Cushioned insole', 'Everyday wear'] }),
  p({ id: 'sh3', title: 'Cloud White Perforated Sneakers', brand: 'Strada', category: 'footwear', sub: 'Sneakers', price: 1799, mrp: 3999, rating: 4.2, reviews: 4300, icon: 'footsteps-outline', ...S.stylehub,
    imgs: ['1608231387042-66d1773070a5'],
    variants: { label: 'UK Size', options: ['5', '6', '7', '8', '9'] },
    highlights: ['Perforated breathable panels', 'Minimal design', 'Lightweight'] }),

  // ---------- Beauty
  p({ id: 'b1', title: 'Vitamin C Glow Face Serum 30 ml', brand: 'Dewy', category: 'beauty', sub: 'Skincare', price: 449, mrp: 899, rating: 4.3, reviews: 21000, icon: 'water-outline', ...S.glow,
    imgs: ['1608571423902-eed4a5ad8108', '1585945037805-5fd82c2e60b1'],
    highlights: ['10% Vitamin C', 'For glowing skin', 'Dermatologically tested'] }),
  p({ id: 'b2', title: 'Eau de Parfum — Aqua Noir 100 ml', brand: 'Maison T', category: 'beauty', sub: 'Fragrance', price: 1299, mrp: 2999, rating: 4.4, reviews: 3800, icon: 'flask-outline', ...S.glow, tags: ['trending'],
    imgs: ['1458538977777-0549b2370168', '1761659760494-32b921a2449f'],
    highlights: ['Long lasting 8+ hrs', 'Fresh aquatic notes', 'Unisex'] }),
  p({ id: 'b3', title: 'Eau de Parfum — Midnight Oud 50 ml', brand: 'Maison T', category: 'beauty', sub: 'Fragrance', price: 999, mrp: 1999, rating: 4.3, reviews: 1900, icon: 'flask-outline', ...S.glow,
    imgs: ['1760920250029-36af9369a0bb'],
    highlights: ['Woody oriental notes', 'Premium glass bottle'] }),
  p({ id: 'b4', title: 'Everyday Makeup Essentials Kit', brand: 'Velvet', category: 'beauty', sub: 'Makeup', price: 899, mrp: 1999, rating: 4.1, reviews: 8700, icon: 'color-palette-outline', ...S.glow, tags: ['deal'],
    imgs: ['1631730486572-226d1f595b68', '1583209814683-c023dd293cc6'],
    highlights: ['Lip, cheek & eye essentials', 'Cruelty free', 'Travel pouch'] }),
  p({ id: 'b5', title: 'Daily Skincare Routine Set (4 pcs)', brand: 'Dewy', category: 'beauty', sub: 'Skincare', price: 1199, mrp: 2499, rating: 4.4, reviews: 3100, icon: 'water-outline', ...S.glow,
    imgs: ['1629198688000-71f23e745b6e'],
    highlights: ['Cleanser, toner, serum, moisturiser', 'All skin types'] }),

  // ---------- Home & Kitchen
  p({ id: 'h1', title: 'Triply Stainless Steel Cookware Set (3 pcs)', brand: 'Kitchora', category: 'home', sub: 'Cookware', price: 2499, mrp: 4999, rating: 4.4, reviews: 6900, icon: 'restaurant-outline', ...S.homecraft, tags: ['trending'],
    imgs: ['1584990347193-6bebebfeaeee', '1604414499020-f9ac575bc5ec'],
    highlights: ['Triply stainless steel', 'Gas & Induction compatible', 'Lifetime warranty'] }),
  p({ id: 'h2', title: 'Chef Series Frying Pan Set with Wall Rack', brand: 'Kitchora', category: 'home', sub: 'Kitchen', price: 1799, mrp: 3499, rating: 4.2, reviews: 2100, icon: 'restaurant-outline', ...S.homecraft,
    imgs: ['1557212060-dd397c79fa5a', '1511224931379-b4e4324ea7fc'],
    highlights: ['3 pans: 20/24/28 cm', 'Heavy gauge base', 'Wall rack included'] }),

  // ---------- Grocery
  p({ id: 'g1', title: 'California Almonds Premium 500 g', brand: 'NutriBite', category: 'grocery', sub: 'Dry Fruits', price: 429, mrp: 699, rating: 4.5, reviews: 26100, icon: 'leaf-outline', ...S.freshcart, tags: ['trending'],
    imgs: ['1642337241968-48094a7709ea', '1598371624473-4d95aca694e3'],
    highlights: ['Premium quality', 'Rich in protein', 'Vacuum packed'] }),
  p({ id: 'g2', title: 'Berry Trail Mix — Nuts & Cranberries 400 g', brand: 'NutriBite', category: 'grocery', sub: 'Snacks', price: 349, mrp: 599, rating: 4.4, reviews: 9300, icon: 'leaf-outline', ...S.freshcart,
    imgs: ['1543158181-1274e5362710'],
    highlights: ['Walnuts, pecans, pistachios, almonds', 'No added sugar'] }),
  p({ id: 'g3', title: 'Festive Dry Fruits Gift Hamper 1 kg', brand: 'NutriBite', category: 'grocery', sub: 'Dry Fruits', price: 1499, mrp: 2499, rating: 4.6, reviews: 1800, icon: 'gift-outline', ...S.freshcart,
    imgs: ['1710857397974-f0617001c39e'],
    highlights: ['6 varieties', 'Premium gift box', 'Perfect for festivals'] }),

  // ---------- Sports
  p({ id: 's1', title: 'Neoprene Dumbbells Pair — 2 kg x 2', brand: 'FlexFit', category: 'sports', sub: 'Weights', price: 699, mrp: 1499, rating: 4.3, reviews: 12800, icon: 'barbell-outline', ...S.fitzone, tags: ['deal'],
    imgs: ['1591291621164-2c6367723315'],
    highlights: ['Anti-slip neoprene coat', 'Hexagon anti-roll shape'] }),
  p({ id: 's2', title: 'Home Gym Starter Kit — Dumbbells + Mat', brand: 'IronCore', category: 'sports', sub: 'Weights', price: 2299, mrp: 3999, rating: 4.2, reviews: 4100, icon: 'barbell-outline', ...S.fitzone,
    imgs: ['1683758507025-6e74ad3ca1e5'],
    highlights: ['2 dumbbells + exercise mat', 'Home workout ready'] }),
  p({ id: 's3', title: 'Anti-Skid Yoga Mat 6 mm with Strap', brand: 'FlexFit', category: 'sports', sub: 'Yoga', price: 599, mrp: 1499, rating: 4.3, reviews: 19800, icon: 'body-outline', ...S.fitzone,
    imgs: ['1763004871583-4183d64096b1', '1787089574344-e5aadc47a7a1'],
    variants: { label: 'Colour', options: ['Black', 'Grey', 'Teal'] },
    highlights: ['6 mm thick', 'Anti-skid both sides', 'Carry strap included'] }),

  // ---------- Bags & More
  p({ id: 'a1', title: 'Commuter Laptop Backpack 30L — Water Resistant', brand: 'Carry', category: 'accessories', sub: 'Backpacks', price: 1299, mrp: 2999, rating: 4.4, reviews: 15600, icon: 'bag-handle-outline', ...S.carry, tags: ['trending'],
    imgs: ['1553062407-98eeb64c6a62'],
    highlights: ['Fits 15.6" laptop', 'USB charging port', '3 compartments'] }),
  p({ id: 'a2', title: 'Heritage Leather Backpack — Tan Brown', brand: 'Carry', category: 'accessories', sub: 'Backpacks', price: 3499, mrp: 6999, rating: 4.5, reviews: 2200, icon: 'bag-handle-outline', ...S.carry,
    imgs: ['1622560480605-d83c853bc5c3', '1622560480654-d96214fdc887'],
    variants: { label: 'Colour', options: ['Tan', 'Red'] },
    highlights: ['Full-grain leather', 'Padded laptop sleeve', 'Handcrafted'] }),
  p({ id: 'a3', title: 'Minimal Smartwatch — Silver Aluminium', brand: 'Stride', category: 'accessories', sub: 'Watches', price: 3999, mrp: 7999, rating: 4.3, reviews: 3400, icon: 'watch-outline', ...S.carry,
    imgs: ['1609096458733-95b38583ac4e'],
    highlights: ['Always-on display', 'Water resistant', '10 days battery'] }),
];

export const banners = [
  { id: 'bn1', kicker: 'BIG THOUSAND DAYS', title: 'Sound that\nmoves you', subtitle: 'Headphones and speakers, up to 70% off', cta: 'Shop audio', image: U('1505740420928-5e560c06d30e', 1000), link: { category: 'electronics' } },
  { id: 'bn2', kicker: 'NEW SEASON', title: 'Step up\nyour game', subtitle: 'Sneakers & running shoes from ₹1,799', cta: 'Explore', image: U('1542291026-7eec264c27ff', 1000), link: { category: 'footwear' } },
  { id: 'bn3', kicker: 'HOME MAKEOVER', title: 'Cook like\na chef', subtitle: 'Triply cookware from ₹1,799', cta: 'Discover', image: U('1584990347193-6bebebfeaeee', 1000), link: { category: 'home' } },
  { id: 'bn4', kicker: 'GLOW EDIT', title: 'Your skin,\nbut better', subtitle: 'Serums, routine kits and fragrances', cta: 'Shop beauty', image: U('1608571423902-eed4a5ad8108', 1000), link: { category: 'beauty' } },
];

export const promos = [
  { id: 'pr1', title: 'Fitness at Home', subtitle: 'From ₹599', image: U('1683758507025-6e74ad3ca1e5', 600), link: { category: 'sports' } },
  { id: 'pr2', title: 'Carry in Style', subtitle: 'Backpacks min. 50% off', image: U('1622560480605-d83c853bc5c3', 600), link: { category: 'accessories' } },
];

export const brands = ['Nova', 'Pulse', 'Kinetic', 'Dewy', 'Maison T', 'Kitchora', 'Carry', 'FlexFit'];

export const offers = [
  '10% instant discount on UPI payments (up to ₹150)',
  '5% cashback on Thousands Pay Later',
  'Free delivery on orders above ₹499',
];

export const sampleReviews = [
  { id: 'r1', name: 'Rohit S.', rating: 5, title: 'Worth every rupee', text: 'Great quality and it arrived on time. The packaging was solid too.', date: '2 weeks ago' },
  { id: 'r2', name: 'Priya M.', rating: 4, title: 'Good product', text: 'Happy overall. The product matches the description exactly.', date: '1 month ago' },
];
