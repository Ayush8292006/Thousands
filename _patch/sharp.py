# Sharp, professional theme pass for Thousands customer + partner apps
import os, re, sys
ROOT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
flat = open(os.path.join(HERE, 'Flat.js'), encoding='utf-8').read()
tpl = open(os.path.join(HERE, 'App.template.js'), encoding='utf-8').read()

W = {'displayHeavy': '800', 'displayMedium': '600', 'display': '700'}
LIT = {'PlusJakartaSans_800ExtraBold': '800', 'PlusJakartaSans_700Bold': '700', 'PlusJakartaSans_600SemiBold': '600'}
SHADOW = re.compile(r"[ \t]*(shadowColor|shadowOpacity|shadowRadius|elevation): (?:'[^']*'|\"[^\"]*\"|[^,\n}]+),?[ \t]*(\n)?")
SHADOW_OFF = re.compile(r"[ \t]*shadowOffset: \{[^}]*\},?[ \t]*(\n)?")

def radius(m):
    n = int(m.group(1))
    return f"borderRadius: {4 if (10 <= n <= 16 or n >= 999) else n}"

def transform(s):
    for k, w in W.items():
        s = s.replace(f"fontFamily: fonts.{k}", f"fontWeight: '{w}'")
    for k, w in LIT.items():
        s = s.replace(f"fontFamily: '{k}'", f"fontWeight: '{w}'")
    s = SHADOW_OFF.sub(lambda m: m.group(1) or '', s)
    s = SHADOW.sub(lambda m: m.group(2) or '', s)
    s = re.sub(r"borderRadius: (\d+)\b", radius, s)
    s = re.sub(r"letterSpacing: -[\d.]+,? ?", "", s)
    return s

for app, prov, ctx in [('customer-app', 'AppProvider', 'AppContext'), ('partner-app', 'SellerProvider', 'SellerContext')]:
    src = os.path.join(ROOT, app, 'src')
    open(os.path.join(src, 'components', 'Flat.js'), 'w', encoding='utf-8').write(flat)
    for d, _, files in os.walk(src):
        for f in files:
            if not f.endswith('.js') or f in ('Flat.js', 'GlitterOverlay.js'):
                continue
            p = os.path.join(d, f)
            s0 = open(p, encoding='utf-8').read()
            s = transform(s0)
            if "from 'expo-linear-gradient'" in s:
                rel = os.path.relpath(os.path.join(src, 'components', 'Flat'), d).replace(os.sep, '/')
                if not rel.startswith('.'):
                    rel = './' + rel
                s = s.replace("from 'expo-linear-gradient'", f"from '{rel}'")
            if s != s0:
                open(p, 'w', encoding='utf-8').write(s)
                print('ok', os.path.relpath(p, ROOT))
    # theme tokens
    p = os.path.join(src, 'theme.js'); s = open(p, encoding='utf-8').read()
    s = re.sub(r"export const radius = \{[^}]*\};", "export const radius = { sm: 2, md: 4, lg: 4, xl: 6, pill: 4 }; // sharp", s)
    s = re.sub(r"export const fonts = \{[^}]*\};", "// System font (Roboto / San Francisco) — fast, sharp, no loading\nexport const fonts = { display: undefined, displayHeavy: undefined, displayMedium: undefined };", s)
    s = re.sub(r"export const pastels = \[[^\]]*\];", "export const pastels = ['#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6', '#F1F3F6'];", s)
    s = re.sub(r"bg: '#[0-9A-Fa-f]{6}',[^\n]*", "bg: '#F1F3F6', // neutral page background", s, count=1)
    s = re.sub(r"softBg: '#[0-9A-Fa-f]{6}',[^\n]*", "softBg: '#F1F3F6',", s)
    open(p, 'w', encoding='utf-8').write(s)
    # App.js
    open(os.path.join(ROOT, app, 'App.js'), 'w', encoding='utf-8').write(tpl.replace('__PROVIDER__', prov).replace('__CTX__', ctx))
    # instant API (no fake delays)
    p = os.path.join(src, 'services', 'api.js'); s = open(p, encoding='utf-8').read()
    s = re.sub(r"const delay = \([^)]*\) => new Promise\([^;]*\);", "const delay = () => Promise.resolve(); // no fake waiting", s)
    open(p, 'w', encoding='utf-8').write(s)

# customer: hero carousel manual swipe only (no auto-slide)
p = os.path.join(ROOT, 'customer-app/src/components/HeroCarousel.js'); s = open(p, encoding='utf-8').read()
s = s.replace("export default function HeroCarousel({ banners, onPress, interval = 4500 }) {", "export default function HeroCarousel({ banners, onPress, interval = 4500, autoPlay = false }) {")
s = s.replace("    if (banners.length < 2) return;", "    if (!autoPlay || banners.length < 2) return undefined;")
s = s.replace("  }, [banners.length, interval]);", "  }, [banners.length, interval, autoPlay]);")
open(p, 'w', encoding='utf-8').write(s)
# partner: same no-spinner image as customer
open(os.path.join(ROOT, 'partner-app/src/components/ProductImage.js'), 'w', encoding='utf-8').write(open(os.path.join(ROOT, 'customer-app/src/components/ProductImage.js'), encoding='utf-8').read())
print('DONE')
