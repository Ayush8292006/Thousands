// ---------------------------------------------------------------
// API layer — abhi dummy data return karta hai.
// Backend team ke endpoints ready hone par sirf is file ke
// functions ke andar fetch() calls daalni hain. Screens ko kuch
// change nahi karna padega.
// ---------------------------------------------------------------
import { products, categories, banners, promos } from '../data/catalog';

export const API_BASE_URL = 'https://api.thousands.example/v1'; // TODO: backend URL

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

// GET /categories
export async function getCategories() {
  await delay();
  return categories;
}

// GET /banners
export async function getBanners() {
  await delay();
  return banners;
}

// GET /promos
export async function getPromos() {
  await delay();
  return promos;
}

// GET /products?category=&sub=&q=
export async function getProducts({ category, sub, q, brand, tag, maxPrice } = {}) {
  await delay();
  let list = products;
  if (brand) list = list.filter((p) => p.brand === brand);
  if (tag) list = list.filter((p) => p.tags.includes(tag));
  if (maxPrice) list = list.filter((p) => p.price <= maxPrice);
  if (category) list = list.filter((p) => p.category === category);
  if (sub) list = list.filter((p) => p.sub === sub);
  if (q) {
    const s = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.category.includes(s) ||
        (p.sub && p.sub.toLowerCase().includes(s))
    );
  }
  return list;
}

// GET /products/:id  (sync helper bhi, offline prototype ke liye)
export function getProductById(id) {
  return products.find((p) => p.id === id);
}

// POST /auth/otp  &  POST /auth/verify
export async function sendOtp(phone) {
  await delay(400);
  return { ok: true, phone };
}
export async function verifyOtp(phone, otp) {
  await delay(400);
  return { ok: otp.length === 6, user: { id: 'u1', name: 'Thousands User', phone } };
}

// POST /orders
export async function createOrder(payload) {
  await delay(600);
  return { ok: true, id: 'TH' + Date.now().toString().slice(-9), ...payload };
}
