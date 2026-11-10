// Login ke liye country codes. `len` = mobile number ki digits (min, max).
export const countries = [
  { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳', len: [10, 10], pattern: /^[6-9]\d{9}$/ },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪', len: [9, 9] },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966', flag: '🇸🇦', len: [9, 9] },
  { code: 'QA', name: 'Qatar', dial: '+974', flag: '🇶🇦', len: [8, 8] },
  { code: 'KW', name: 'Kuwait', dial: '+965', flag: '🇰🇼', len: [8, 8] },
  { code: 'OM', name: 'Oman', dial: '+968', flag: '🇴🇲', len: [8, 8] },
  { code: 'BH', name: 'Bahrain', dial: '+973', flag: '🇧🇭', len: [8, 8] },
  { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸', len: [10, 10] },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦', len: [10, 10] },
  { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧', len: [10, 10] },
  { code: 'AU', name: 'Australia', dial: '+61', flag: '🇦🇺', len: [9, 9] },
  { code: 'SG', name: 'Singapore', dial: '+65', flag: '🇸🇬', len: [8, 8] },
  { code: 'MY', name: 'Malaysia', dial: '+60', flag: '🇲🇾', len: [9, 10] },
  { code: 'NP', name: 'Nepal', dial: '+977', flag: '🇳🇵', len: [10, 10] },
  { code: 'BD', name: 'Bangladesh', dial: '+880', flag: '🇧🇩', len: [10, 10] },
  { code: 'LK', name: 'Sri Lanka', dial: '+94', flag: '🇱🇰', len: [9, 9] },
  { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪', len: [10, 11] },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷', len: [9, 9] },
  { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦', len: [9, 9] },
  { code: 'NZ', name: 'New Zealand', dial: '+64', flag: '🇳🇿', len: [8, 10] },
];

export function isValidMobile(country, number) {
  if (country.pattern) return country.pattern.test(number);
  return number.length >= country.len[0] && number.length <= country.len[1];
}
