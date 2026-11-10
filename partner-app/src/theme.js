// Thousands design tokens
// Identity: logo ka double-line "T" -> double-stroke outlines (search, active
// states, brand rings). Pure black & white + ek bold ultramarine signal colour.
// Display type: Plus Jakarta Sans (headings, prices, wordmark). Body: system font.

export const colors = {
  black: '#000000',
  ink: '#16171A',
  white: '#FFFFFF',
  bg: '#F1F3F6', // neutral page background
  mist: '#F2F3F5', // surfaces, image backdrops
  soft: '#F2F3F5',
  card: '#FFFFFF',
  border: '#E4E6EA',
  muted: '#6B6F76',
  faint: '#A0A4AB',
  accent: '#2B50E0', // commercial blue — CTAs, active tab, links
  accentDark: '#1F3DB8',
  accentSoft: '#EEF2FF',
  sale: '#E11D48', // discount
  yellow: '#FFD21F', // sale highlights (Flipkart-style)
  orange: '#FF9F1C',
  success: '#0F9D58',
  successSoft: '#E3F5EC',
  danger: '#D32F2F',
};

// Category / brand tiles ke soft backgrounds
export const pastels = ['#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6'];

// System font (Roboto / San Francisco) — fast, sharp, no loading
export const fonts = { display: undefined, displayHeavy: undefined, displayMedium: undefined };

export const radius = { sm: 2, md: 4, lg: 4, xl: 6, pill: 4 }; // sharp
export const space = (n) => n * 4;

// Type scale (~1.2): 11 / 13 / 15 / 18 / 22 / 28 / 34
export const font = {
  hero: { fontWeight: '700', fontSize: 26, lineHeight: 30, color: colors.black, },
  h1: { fontWeight: '700', fontSize: 22, lineHeight: 28, color: colors.black, },
  h2: { fontWeight: '700', fontSize: 17, lineHeight: 22, color: colors.black, },
  h3: { fontWeight: '600', fontSize: 15, lineHeight: 20, color: colors.black },
  price: { fontWeight: '700', fontSize: 17, color: colors.black, },
  body: { fontSize: 15, lineHeight: 21, color: colors.ink },
  small: { fontSize: 13, lineHeight: 18, color: colors.muted },
  tiny: { fontSize: 11, color: colors.muted },
  kicker: { fontSize: 13, fontWeight: '600', color: colors.accent },
};

// Design flat hai — shadow sirf compatibility ke liye.
export const shadow = {};

export const TAB_BAR_SPACE = 0; // standard tab bar apni jagah leta hai
