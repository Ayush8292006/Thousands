// Thousands design tokens
// Identity: logo ka double-line "T" -> double-stroke outlines (search, active
// states, brand rings). Pure black & white + ek bold ultramarine signal colour.
// Display type: Plus Jakarta Sans (headings, prices, wordmark). Body: system font.

export const colors = {
  header: '#DCEBFF', // light blue top area (home / search / results)
  black: '#000000',
  ink: '#16171A',
  white: '#FFFFFF',
  bg: '#F1F3F6', // inner pages
  mist: '#F2F3F5', // surfaces, image backdrops
  soft: '#F2F3F5',
  card: '#FFFFFF',
  border: '#E4E6EA',
  muted: '#6B6F76',
  faint: '#A0A4AB',
  accent: '#2874F0', // Flipkart-style blue
  accentDark: '#1A5DD6',
  accentSoft: '#E8F1FF',
  sale: '#E11D48', // discount
  success: '#0F9D58',
  successSoft: '#E3F5EC',
  danger: '#D32F2F',
  yellow: '#FFB800',
  dealSoft: '#F4F9FF',
  dealInk: '#172B45',
};

// Premium Light Blue Palette (Homepage Aesthetic)
export const lightBlueTheme = {
  primary: '#A9CFF5',      // Soft Premium Blue
  secondary: '#DCEEFF',    // Light Sky Blue
  bg: '#FFFFFF',           // Clean White
  softBg: '#F1F3F6',
  text: '#172B45',         // Deep Navy
  textMuted: '#5C728A',    // Slate Navy Muted
  accent: '#397FC1',       // Accent Blue
  accentDark: '#1E5A96',   // Rich Blue
  border: '#E4EDF6',       // Soft Blue Grey
  darkBg: '#0F1D30',       // Deep Navy Obsidian
  darkLogoBg: '#000000',   // Black background for original geometric logo
  shadow: 'rgba(57, 127, 193, 0.08)',
};

// Client cream palette (halke accents ke liye)
export const cream = ['#FFF8E7', '#FFF8DC', '#FFFDD0', '#FDF5C9', '#F3E5BF'];

// System font (Roboto / San Francisco) — fast, sharp, no loading
export const fonts = { display: undefined, displayHeavy: undefined, displayMedium: undefined };

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 }; // soft, Flipkart-style curves
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

// Soft light-blue and ice-blue backgrounds for category tiles and brand circles (HomeScreen)
export const pastels = ['#E8F1FF', '#FFF1E6', '#E9F8EF', '#FDECF1', '#F1EBFF', '#FFF8D6', '#E6F7F8', '#F3F4F6'];