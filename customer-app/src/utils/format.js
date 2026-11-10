import { region } from '../config/tax';

export function formatPrice(n) {
  return region.symbol + Math.round(n).toLocaleString(region.locale);
}

export function formatMoney(n) {
  return (
    region.symbol +
    n.toLocaleString(region.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

export function discountPct(mrp, price) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatDate(d) {
  const date = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
}

export function addDays(days, from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}
