// Thousands design tokens — Royal Indian Luxury

// ROYAL INDIAN LUXURY palette
// Warm Ivory #F8F3E7 · Soft Beige #EDE2C8 · Champagne Gold #D6B45C · Royal Olive #625000
// Espresso Brown #302719 · Terracotta #A85E43 · Pure Cream #FFFDF6
export const colors = {
  ivory: '#F8F3E7', // main background
  beige: '#EDE2C8', // secondary surfaces / borders
  gold: '#D6B45C', // champagne gold — premium highlights
  olive: '#625000', // royal olive — primary buttons & active states
  espresso: '#302719', // text & headings
  terracotta: '#A85E43', // offers & discount accents
  cream: '#FFFDF6', // cards & glass surfaces

  header: '#F8F3E7',
  headerGradient: ['#FFFDF6', '#F8F3E7', '#F3EAD6'], // very subtle ivory wash
  headerMuted: '#7D7058',
  headerLine: '#EDE2C8',
  page: '#F8F3E7',
  black: '#302719',
  ink: '#302719',
  white: '#FFFFFF',
  bg: '#F8F3E7',
  mist: '#F3EBD8',
  soft: '#F3EBD8',
  card: '#FFFDF6',
  border: '#EDE2C8',
  muted: '#7D7058',
  faint: '#A99D84',
  accent: '#625000',
  accentDark: '#4A3C00',
  accentSoft: '#EDE2C8',
  sale: '#A85E43',
  success: '#3E7B4F',
  successSoft: '#E6F0E3',
  danger: '#B3402F',
  yellow: '#D6B45C',
  dealSoft: '#F8F3E7',
  dealInk: '#302719',
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
export const pastels = ['#F3EBD8', '#EDE2C8', '#F6EEDC', '#F1E7D1', '#F4ECDA', '#EFE5CD', '#F5EDDB', '#F2E9D4'];