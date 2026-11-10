// Thousands design tokens
// Identity: logo ka double-line "T" -> double-stroke outlines (search, active
// states, brand rings). Pure black & white + ek bold ultramarine signal colour.
// Display type: Plus Jakarta Sans (headings, prices, wordmark). Body: system font.

export const colors = {
  black: '#000000',
  ink: '#16171A',
  white: '#FFFFFF',
  bg: '#F2F3F5', // inner screens ka base; Home white rehta hai
  mist: '#F2F3F5', // surfaces, image backdrops
  soft: '#F2F3F5',
  card: '#FFFFFF',
  border: '#E4E6EA',
  muted: '#6B6F76',
  faint: '#A0A4AB',
  accent: '#3B2BFF', // ultramarine — CTAs, active, deals band
  accentDark: '#2A1FCC',
  accentSoft: '#EEEDFF',
  sale: '#E11D48', // discount
  success: '#0F9D58',
  successSoft: '#E3F5EC',
  danger: '#D32F2F',
};

export const fonts = {
  display: 'PlusJakartaSans_700Bold',
  displayHeavy: 'PlusJakartaSans_800ExtraBold',
  displayMedium: 'PlusJakartaSans_600SemiBold',
};

export const radius = { sm: 6, md: 14, lg: 20, xl: 28, pill: 999 };
export const space = (n) => n * 4;

// Type scale (~1.2): 11 / 13 / 15 / 18 / 22 / 28 / 34
export const font = {
  hero: { fontFamily: fonts.displayHeavy, fontSize: 34, lineHeight: 36, color: colors.black, letterSpacing: -0.8 },
  h1: { fontFamily: fonts.displayHeavy, fontSize: 28, lineHeight: 32, color: colors.black, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 26, color: colors.black, letterSpacing: -0.4 },
  h3: { fontFamily: fonts.display, fontSize: 18, lineHeight: 22, color: colors.black, letterSpacing: -0.2 },
  price: { fontFamily: fonts.display, fontSize: 17, color: colors.black, letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 21, color: colors.ink },
  small: { fontSize: 13, lineHeight: 18, color: colors.muted },
  tiny: { fontSize: 11, color: colors.muted },
  kicker: { fontSize: 13, fontWeight: '600', color: colors.accent },
};

// Design flat hai — shadow sirf compatibility ke liye.
export const shadow = {};

export const TAB_BAR_SPACE = 96; // floating tab bar ke liye bottom space
