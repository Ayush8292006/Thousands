# Sharp edges everywhere + glossy sheen on key surfaces (customer app)
import os, re, sys
ROOT = os.path.join(sys.argv[1], 'customer-app')
src = os.path.join(ROOT, 'src')
RAD = re.compile(r"\b(border(?:TopLeft|TopRight|BottomLeft|BottomRight)?Radius): (?!0\b)[^,}\n]+")
for d, _, files in os.walk(src):
    for f in files:
        if not f.endswith('.js'): continue
        p = os.path.join(d, f); s0 = open(p, encoding='utf-8').read()
        s = RAD.sub(lambda m: f"{m.group(1)}: 0", s0)
        s = re.sub(r"imageStyle=\{\{ borderRadius: 0 \}\}", "imageStyle={{ borderRadius: 0 }}", s)
        if s != s0:
            open(p, 'w', encoding='utf-8').write(s); print('sharp', os.path.relpath(p, ROOT))

def edit(rel, fn):
    p = os.path.join(src, rel); s = open(p, encoding='utf-8').read(); n = fn(s)
    print('ok' if n != s else 'UNCHANGED', rel); open(p, 'w', encoding='utf-8').write(n)

def must(s, a, b):
    if a not in s: raise SystemExit('missing: ' + a[:80])
    return s.replace(a, b, 1)

# theme radius tokens -> 0
edit('theme.js', lambda s: re.sub(r"export const radius = \{[^}]*\};", "export const radius = { sm: 0, md: 0, lg: 0, xl: 0, pill: 0 }; // sharp edges everywhere", s))

# Button: glossy sheen on filled buttons
def ui(s):
    if 'Shine' in s: return s
    s = must(s, "import { colors, radius, font, fonts } from '../theme';", "import { colors, radius, font, fonts } from '../theme';\nimport Shine from './Shine';")
    s = must(s, "          <Text style={[styles.btnText, { color: fg }]}>{title}</Text>\n        </>", "          <Text style={[styles.btnText, { color: fg }]}>{title}</Text>\n          {(isPrimary || isGold) && !disabled ? <Shine intensity={0.22} pause={4200} /> : null}\n        </>")
    s = re.sub(r"(\n  btn: \{)", r"\1 overflow: 'hidden',", s, count=1)
    return s
edit('components/ui.js', ui)

# Header logo badge: gold gloss
def header(s):
    if 'Shine' in s: return s
    s = must(s, "import { BRAND } from '../config/app';", "import { BRAND } from '../config/app';\nimport Shine from './Shine';")
    s = re.sub(r"(source=\{require\('../../assets/logo-white.png'\)\}\s*style=\{styles.logo\}\s*resizeMode=\"contain\"\s*/>)", r"\1\n          <Shine intensity={0.35} pause={3600} delay={600} />", s, count=1)
    return s
edit('components/HomeHeader.js', header)

# Hero banners: glossy sweep
def hero(s):
    if 'Shine' in s: return s
    s = re.sub(r"(import \{ LinearGradient \} from '[^']+';)", r"\1\nimport Shine from './Shine';", s, count=1)
    i = s.index('</ImageBackground>')
    return s[:i] + "  <Shine intensity={0.18} pause={5200} delay={1200} />\n                " + s[i:]
edit('components/HeroCarousel.js', hero)

# Home: sale strip + sell banner gloss
def home(s):
    if 'Shine' in s: return s
    s = must(s, "import ShopTiles from '../components/ShopTiles';", "import ShopTiles from '../components/ShopTiles';\nimport Shine from '../components/Shine';")
    s = must(s, "<View style={styles.saleBadge}>", "<Shine intensity={0.3} pause={4000} delay={300} />\n          <View style={styles.saleBadge}>")
    return s
edit('screens/HomeScreen.js', home)
for k in ['saleStrip: {', 'sell: {']:
    p = os.path.join(src, 'screens/HomeScreen.js'); s = open(p, encoding='utf-8').read()
    s = s.replace(k, k + " overflow: 'hidden',", 1); open(p, 'w', encoding='utf-8').write(s)
print('DONE')
