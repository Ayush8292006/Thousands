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
  accent: '#2B50E0', // commercial blue — CTAs, active tab, links
  accentDark: '#1F3DB8',
  accentSoft: '#EEF2FF',
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
  softBg: '#F4F9FF',       // Ice Blue
  text: '#172B45',         // Deep Navy
  textMuted: '#5C728A',    // Slate Navy Muted
  accent: '#397FC1',       // Accent Blue
  accentDark: '#1E5A96',   // Rich Blue
  border: '#E4EDF6',       // Soft Blue Grey
  darkBg: '#0F1D30',       // Deep Navy Obsidian
  darkLogoBg: '#000000',   // Black background for original geometric logo
  shadow: 'rgba(57, 127, 193, 0.08)',
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
  hero: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, color: colors.black, letterSpacing: -0.4 },
  h1: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.black, letterSpacing: -0.3 },
  h2: { fontFamily: fonts.display, fontSize: 17, lineHeight: 22, color: colors.black, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.displayMedium, fontSize: 15, lineHeight: 20, color: colors.black },
  price: { fontFamily: fonts.display, fontSize: 17, color: colors.black, letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 21, color: colors.ink },
  small: { fontSize: 13, lineHeight: 18, color: colors.muted },
  tiny: { fontSize: 11, color: colors.muted },
  kicker: { fontSize: 13, fontWeight: '600', color: colors.accent },
};

// Design flat hai — shadow sirf compatibility ke liye.
export const shadow = {};

export const TAB_BAR_SPACE = 0; // standard tab bar apni jagah leta hai

// Soft light-blue and ice-blue backgrounds for category tiles and brand circles (HomeScreen)
export const pastels = ['#DCEEFF', '#F4F9FF', '#E5F1FC', '#EBF4FC', '#E3F0FC', '#F0F7FF', '#D6E8FA', '#E8F2FB'];