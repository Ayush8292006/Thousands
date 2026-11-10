# Thousands — Customer (Ecommerce) App

React Native + Expo (SDK 57) prototype. Android + iOS dono. Dummy data ke saath, backend ke liye API layer ready hai.

## Run kaise karein (pehli baar)

```bash
cd customer-app
npm install          # expo install hoga
npm run setup        # baaki packages SDK ke compatible versions ke saath
npx expo start       # QR code scan karo Expo Go app se
```

Agar version mismatch ka warning aaye: `npx expo install --fix`

## Folder structure

```
App.js                     Navigation + providers
src/
  theme.js                 Colors, fonts (monochrome + gold accent, logo se)
  config/app.js            Brand naam, support email/phone, delivery rules
  config/tax.js            Generic tax engine (abhi India GST, baad mein VAT/other)
  data/catalog.js          Dummy categories, products, banners
  services/api.js          ⚠️ Backend yahan connect hoga (sirf yahi file badlegi)
  context/AppContext.js    Cart, wishlist, addresses, orders state
  utils/                   Price format, totals + tax calculation
  components/              ProductCard, PriceDetails, header, buttons...
  screens/                 16 screens
```

## Screens

Login (OTP) · Home · Categories · Search · Product List (sort/filter) · Product Detail ·
Cart · Addresses · Checkout (payment select) · Order Success · My Orders · Order Detail
(tracking) · Tax Invoice · Wishlist · Account · Help & Support / Sell on Thousands

## Backend team ke liye notes

- Saare data calls `src/services/api.js` mein hain — `getProducts`, `getCategories`,
  `getBanners`, `sendOtp`, `verifyOtp`, `createOrder`. Inke andar `fetch()` daalna hai.
- Product object ke fields `src/data/catalog.js` mein dekh lo (id, title, brand, category,
  price, mrp, sellerId, sellerName, sellerState, variants, highlights, image).
- `image` field mein URL aate hi real photo dikhegi (abhi icon placeholder hai).
- Tax: `config/tax.js` — country-wise rate, inclusive/exclusive, CGST/SGST/IGST split.
  Production mein rates backend se aane chahiye. Rates abhi dummy hain, CA se confirm karna hai.
- Payment gateway (Razorpay etc.) `CheckoutScreen.js` ke `pay()` mein integrate hoga.
- Invoice PDF: abhi screen pe dikhta hai; PDF backend ya `expo-print` se banega.

## Support contacts (config/app.js)

- Customer: thousandsupport@gmail.com
- Seller: thousandssellersspace@gmail.com
- Phone: 9862982051
