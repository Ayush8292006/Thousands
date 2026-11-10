import { DELIVERY } from '../config/app';
import { getTaxRate, calcLineTax, splitTax } from '../config/tax';

// items: [{ product, qty, variant }]
export function computeTotals(items, buyerState) {
  let mrpTotal = 0;
  let subtotal = 0;
  let taxTotal = 0;
  let count = 0;
  const taxMap = {}; // label+rate -> amount
  const lines = items.map((it) => {
    const amount = it.product.price * it.qty;
    const rate = getTaxRate(it.product.category);
    const { taxable, tax } = calcLineTax(amount, rate);
    const parts = splitTax(tax, rate, it.product.sellerState, buyerState);
    parts.forEach((p) => {
      const k = `${p.label} @${p.rate}%`;
      taxMap[k] = (taxMap[k] || 0) + p.amount;
    });
    mrpTotal += it.product.mrp * it.qty;
    subtotal += amount;
    taxTotal += tax;
    count += it.qty;
    return { ...it, amount, rate, taxable, tax, parts };
  });
  const deliveryFee = subtotal === 0 || subtotal >= DELIVERY.freeAbove ? 0 : DELIVERY.fee;
  return {
    lines,
    count,
    mrpTotal,
    discount: mrpTotal - subtotal,
    subtotal,
    deliveryFee,
    taxTotal,
    taxBreakup: Object.entries(taxMap).map(([label, amount]) => ({ label, amount })),
    grandTotal: subtotal + deliveryFee,
  };
}
