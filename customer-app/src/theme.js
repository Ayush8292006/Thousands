// Thousands design tokens
// Identity: logo ka double-line "T" -> double-stroke outlines (search, active
// states, brand rings). Pure black & white + ek bold ultramarine signal colour.
// Display type: Plus Jakarta Sans (headings, prices, wordmark). Body: system font.

export const colors = {
  header: '#F6F0E1', // champagne ivory — logo ke cream background se match
  headerGradient: ['#FFFCF2', '#F7EFDA', '#EEE2C3'], // glossy champagne (top → bottom)
  headerMuted: '#8A7F66', // header par secondary text / icons
  headerLine: '#E6DCC2', // header ke borders / dividers
  gold: '#B8920A', // logo gold — active state
  olive: '#5A4B02', // logo ka dark olive — brand name
  page: '#FAF7F0', // home content background (warm ivory)
  black: '#1F1B16', // rich charcoal (primary text / dark surfaces)
  ink: '#26221B', // charcoal body text
  white: '#FFFFFF',
  bg: '#FAF7F0', // warm ivory inner pages
  mist: '#F4EEDF', // warm surface (inputs, image backdrops)
  soft: '#F4EEDF',
  card: '#FFFFFF',
  border: '#ECE3CC', // refined warm border
  muted: '#6E6658', // warm grey
  faint: '#A59D8C',
  accent: '#9A7300', // logo gold-brown
  accentDark: '#7A5A00',
  accentSoft: '#FBF1CF',
  sale: '#C8323B',
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

// Refined soft shadows (warm tint)
export const shadow = {
  card: { shadowColor: '#5A4B02', shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  float: { shadowColor: '#3B2F00', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
};

export const TAB_BAR_SPACE = 96; // floating glass tab bar ke liye content ke neeche jagah

// Soft light-blue and ice-blue backgrounds for category tiles and brand circles (HomeScreen)
export const pastels = ['#FBF1DC', '#F6EAD3', '#FFF4E0', '#F3EDE0', '#F8EFD9', '#FFF7E6', '#F1E9D6', '#F7F1E4'];