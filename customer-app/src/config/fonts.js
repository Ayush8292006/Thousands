import * as Font from 'expo-font';

// Indian calligraphy-style font: "Yatra One" (Mumbai hand-painted signage style, OFL license).
// Remote se load hota hai (koi npm package nahi chahiye). Fail ho to system font use hota hai.
export const CALLI = 'YatraOne';

const SOURCES = [
  'https://raw.githubusercontent.com/google/fonts/main/ofl/yatraone/YatraOne-Regular.ttf',
  'https://cdn.jsdelivr.net/fontsource/fonts/yatra-one@latest/latin-400-normal.ttf',
];

let ready = false;
export const fontReady = () => ready;

export async function loadBrandFonts() {
  for (const uri of SOURCES) {
    try {
      await Font.loadAsync({ [CALLI]: uri });
      ready = true;
      return true;
    } catch {
      // next source try karo
    }
  }
  return false;
}

// Calligraphy style — font load na ho to bhi text bold dikhta hai
export const calli = (size, color) => ({
  fontFamily: ready ? CALLI : undefined,
  fontWeight: ready ? 'normal' : '800',
  fontSize: size,
  color,
});
