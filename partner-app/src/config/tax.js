// ---------------------------------------------------------------
// Generic tax engine config.
// Abhi sirf India (GST) active hai. Naya country add karna ho to
// TAX_REGIONS mein ek entry daalo aur ACTIVE_REGION badlo —
// app ka baaki code change nahi hoga.
// NOTE: rates dummy/prototype ke liye hain — final rates client ke CA
// se confirm karne hain. Production mein ye backend se aayenge.
// ---------------------------------------------------------------

export const TAX_REGIONS = {
  IN: {
    country: 'India',
    currency: 'INR',
    symbol: '₹',
    locale: 'en-IN',
    taxName: 'GST',
    taxIdLabel: 'GSTIN',
    priceInclusive: true, // MRP / selling price tax ke saath dikhta hai
    // same state -> CGST + SGST, alag state -> IGST
    splitRule: 'intra-inter',
    defaultRate: 18,
    categoryRates: {
      electronics: 18,
      fashion: 5,
      footwear: 5,
      beauty: 18,
      home: 18,
      grocery: 5,
      sports: 5,
      accessories: 18,
    },
  },
  // Example (future):
  // GB: { country: 'United Kingdom', currency: 'GBP', symbol: '£', locale: 'en-GB',
  //       taxName: 'VAT', taxIdLabel: 'VAT No.', priceInclusive: true,
  //       splitRule: 'single', defaultRate: 20, categoryRates: { books: 0 } },
};

export const ACTIVE_REGION = 'IN';
export const region = TAX_REGIONS[ACTIVE_REGION];

export function getTaxRate(category) {
  const r = region.categoryRates[category];
  return r === undefined ? region.defaultRate : r;
}

// amount = line total jo customer pay karta hai
export function calcLineTax(amount, rate) {
  if (region.priceInclusive) {
    const taxable = (amount * 100) / (100 + rate);
    return { taxable, tax: amount - taxable, total: amount };
  }
  const tax = (amount * rate) / 100;
  return { taxable: amount, tax, total: amount + tax };
}

// Tax ko components mein todna (invoice ke liye)
export function splitTax(tax, rate, sellerState, buyerState) {
  if (region.splitRule === 'intra-inter') {
    const same =
      sellerState && buyerState &&
      sellerState.trim().toLowerCase() === buyerState.trim().toLowerCase();
    if (same) {
      return [
        { label: 'CGST', rate: rate / 2, amount: tax / 2 },
        { label: 'SGST', rate: rate / 2, amount: tax / 2 },
      ];
    }
    return [{ label: 'IGST', rate, amount: tax }];
  }
  return [{ label: region.taxName, rate, amount: tax }];
}
