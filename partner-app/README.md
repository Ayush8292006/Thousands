# Thousands Partner — Seller App

React Native + Expo (SDK 58) prototype for sellers on the Thousands marketplace. Works on Android, iOS and web (Vercel).

## Run

```bash
cd partner-app
npm install --legacy-peer-deps
npx expo start -c          # phone (Expo Go) / emulator
npx expo start --web       # browser
```

Login: any valid mobile number + any 6-digit OTP. Tap **"Skip and open demo store"** to jump straight to a ready store (UrbanTech Retail).

## Flow

1. **Login** — mobile OTP with country code picker
2. **Onboarding / KYC** — 5 steps: business details → GSTIN & PAN → bank (IFSC auto-detects bank) → pickup address → documents
3. **Under review** — status timeline (demo: "Approve now")
4. **Seller Hub**
   - **Dashboard** — today's sales, orders, to-ship, rating, next payout, attention items, 7-day sales chart, vacation mode
   - **Products** — search, status filters (active / low stock / out of stock / inactive / drafts), quick stock +/−, live/pause toggle, add & edit with live "what you'll earn" breakdown
   - **Orders** — New → Accept → Packed → Ready to ship (label + AWB) → Shipped → Delivered; reject; settlement and invoice tax (CGST/SGST vs IGST) per order
   - **Payments** — wallet, next Friday payout, in-transit, payout history with UTR, fee calculator
   - **Seller Hub (More tab)** — every module in one colourful grid:
     - **Sell existing product** (catalog search → "Sell this" → price & stock) and **Bulk upload** (Excel template → validation → list)
     - **Promotions** — join platform sale events, create seller offers (discount %, duration, products), pause/resume
     - **Thousands Ads** — campaigns with daily budget and CPC, ROAS, views, CTR, orders, pause/resume
     - **Growth insights** — conversion funnel, price recommendations, top products by revenue
     - **Account health** — cancellation, late dispatch, return rate, rating, response time vs targets; seller tier (Bronze → Platinum)
     - **Reviews & questions** — rating summary, reply to reviews, answer buyer questions
     - **Returns & claims** — approve/reject returns, mark received, raise a Seller Protection claim
     - **Warehouses** — multiple pickup locations, primary, pause pickups; Thousands Fulfilment opt-in
     - **Brand approval** — request a brand with authorisation documents; approved / in review / rejected
     - **Reports** — GST sales, settlement statement, commission invoices, TCS & TDS, inventory, returns
     - **Notifications** — orders, returns, payouts, sale events, stock alerts
     - **Store & account** — store profile, KYC details, commission rates, seller support

## Config (change here, not in screens)

| File | What |
|---|---|
| `src/config/commission.js` | Category commission %, fixed-fee slabs, collection %, shipping, GST on fees, payout cycle |
| `src/config/tax.js` | Country tax rules (India GST now; add VAT etc. later) |
| `src/config/app.js` | Seller support email / phone |
| `src/services/api.js` | Backend endpoints to implement |
| `src/data/seed.js` | Demo products, orders, payouts |
| `src/data/hub.js` | Demo data for returns, promotions, ads, reviews, warehouses, brands, reports, notifications, catalog |

All rates are placeholders for the prototype — final numbers come from the client / CA.

## Deploy to Vercel

Push this folder to GitHub and import it on Vercel. `vercel.json` is included (build: `npx expo export -p web`, output: `dist`). If the repo contains both apps, set **Root Directory** to `partner-app`.
