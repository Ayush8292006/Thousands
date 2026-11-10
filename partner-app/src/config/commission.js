// ---------------------------------------------------------------
// Marketplace fee structure (Flipkart-style). Dummy rates — client
// final karega; production mein ye backend se aayenge.
//   Seller payout = Sale price − Commission − Fixed fee − Collection fee
//                   − Shipping fee − GST on all fees
// ---------------------------------------------------------------
import { region } from './tax';

export const COMMISSION = {
  categoryRates: {
    electronics: 8,
    fashion: 15,
    footwear: 14,
    beauty: 12,
    home: 10,
    grocery: 6,
    sports: 10,
    accessories: 12,
  },
  defaultRate: 10,
  // Fixed fee per unit, order value ke slab ke hisaab se
  fixedFeeSlabs: [
    { upto: 500, fee: 10 },
    { upto: 1000, fee: 20 },
    { upto: 5000, fee: 35 },
    { upto: Infinity, fee: 60 },
  ],
  collectionFeePct: 2, // payment gateway / COD handling
  shippingFeePerOrder: 45, // forward shipping (dummy flat)
  gstOnFeesPct: 18, // India: fees pe 18% GST
  payoutCycleDays: 7, // weekly settlement
};

export function commissionRate(category) {
  const r = COMMISSION.categoryRates[category];
  return r === undefined ? COMMISSION.defaultRate : r;
}

export function fixedFee(unitPrice) {
  return COMMISSION.fixedFeeSlabs.find((s) => unitPrice <= s.upto).fee;
}

// Ek order line ka settlement breakdown
export function settlement(unitPrice, qty, category) {
  const sale = unitPrice * qty;
  const rate = commissionRate(category);
  const commission = (sale * rate) / 100;
  const fixed = fixedFee(unitPrice) * qty;
  const collection = (sale * COMMISSION.collectionFeePct) / 100;
  const shipping = COMMISSION.shippingFeePerOrder;
  const feesBeforeTax = commission + fixed + collection + shipping;
  const gst = (feesBeforeTax * COMMISSION.gstOnFeesPct) / 100;
  const totalFees = feesBeforeTax + gst;
  return {
    sale,
    rate,
    commission,
    fixed,
    collection,
    shipping,
    gst,
    taxName: region.taxName,
    totalFees,
    net: sale - totalFees,
    netPct: sale ? ((sale - totalFees) / sale) * 100 : 0,
  };
}
