# Thousands: cream theme + glitter + new logo + shop tiles + photo/video gallery
import re, sys, os
root = sys.argv[1]
def edit(path, fn):
    p = os.path.join(root, path); s = open(p, encoding='utf-8').read(); n = fn(s)
    if n == s: print('UNCHANGED', path)
    else: open(p, 'w', encoding='utf-8').write(n); print('ok', path)
def rep(s, a, b, must=True):
    if a not in s:
        if must: raise SystemExit('MISSING in patch: ' + a[:70])
        return s
    return s.replace(a, b)

for app in ['customer-app', 'partner-app']:
    def theme(s):
        s = rep(s, "bg: '#F2F3F5',", "bg: '#FFF8E7', // warm cream (client palette)")
        s = rep(s, "mist: '#F2F3F5',", "mist: '#FDF3DC',")
        s = rep(s, "soft: '#F2F3F5',", "soft: '#FDF3DC',")
        s = rep(s, "border: '#E4E6EA',", "border: '#EEE4CC',")
        s = rep(s, "softBg: '#F4F9FF',", "softBg: '#FFF8E7',", must=False)
        s = rep(s, "darkLogoBg: '#000000',", "darkLogoBg: '#FFF8E7',", must=False)
        return s
    edit(f'{app}/src/theme.js', theme)
    def appjs(s):
        if 'GlitterOverlay' in s: return s
        s = rep(s, "import { colors } from './src/theme';", "import { colors } from './src/theme';\nimport GlitterOverlay from './src/components/GlitterOverlay';")
        s = re.sub(r"backgroundColor: colors\.(black|accentDark), alignItems: 'center', justifyContent: 'center' \}\}>", "backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>", s)
        s = rep(s, "    </SafeAreaProvider>\n  );", "      <GlitterOverlay />\n    </SafeAreaProvider>\n  );")
        s = rep(s, "backgroundColor: '#E6E7EB', alignItems: 'center'", "backgroundColor: '#F3E5BF', alignItems: 'center'", must=False)
        s = rep(s, "overflow: 'hidden', backgroundColor: colors.white }}>", "overflow: 'hidden', backgroundColor: colors.bg }}>", must=False)
        return s
    edit(f'{app}/App.js', appjs)
    def appjson(s):
        s = re.sub(r'"backgroundColor": "#(0A0A0A|1F3DB8|000000)"', '"backgroundColor": "#FCF6D2"', s)
        return s.replace('"foregroundImage": "./assets/logo-white.png"', '"foregroundImage": "./assets/adaptive-icon.png"')
    edit(f'{app}/app.json', appjson)

def kit(s):
    if 'logoBadge' in s: return s
    s = rep(s, "<Image source={require('../../assets/logo-white.png')} style={s.logo} resizeMode=\"contain\" />", "<View style={s.logoBadge}><Image source={require('../../assets/logo-white.png')} style={s.logo} resizeMode=\"contain\" /></View>")
    return rep(s, "  logo: { width: 22, height: 26, marginRight: 10 },", "  logoBadge: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#FFF8E7', alignItems: 'center', justifyContent: 'center', marginRight: 10 },\n  logo: { width: 21, height: 23 },")
edit('partner-app/src/components/kit.js', kit)

C = 'customer-app/'
def home(s):
    if 'ShopTiles' in s: return s
    s = rep(s, "import HeroCarousel from '../components/HeroCarousel';", "import HeroCarousel from '../components/HeroCarousel';\nimport ShopTiles from '../components/ShopTiles';")
    i = s.index('<HeroCarousel'); j = s.index('/>', i) + 2
    return s[:j] + "\n\n        {/* Shop by category — arch tiles, 2 rows */}\n        <ShopTiles navigation={navigation} />" + s[j:]
edit(C + 'src/screens/HomeScreen.js', home)

def cat(s):
    if 'DEMO_VIDEO' in s: return s
    return rep(s, "const U = (id, w = 600)", "// Demo product video (seller apni video upload karega -> product.video)\nexport const DEMO_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';\n\nconst U = (id, w = 600)")
edit(C + 'src/data/catalog.js', cat)

for f in ['CategoriesScreen', 'CartScreen', 'SearchScreen']:
    edit(C + f'src/screens/{f}.js', lambda s: s.replace("flex: 1, backgroundColor: colors.white }", "flex: 1, backgroundColor: colors.bg }"))
edit(C + 'src/screens/OrderSuccessScreen.js', lambda s: s.replace("wrap: { flex: 1, backgroundColor: colors.white, paddingHorizontal: 24 }", "wrap: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24 }"))

def pdp(s):
    if 'ProductVideo' in s: return s
    s = rep(s, "import ProductImage from '../components/ProductImage';", "import ProductImage from '../components/ProductImage';\nimport ProductVideo from '../components/ProductVideo';")
    s = rep(s, "import { products, offers, sampleReviews } from '../data/catalog';", "import { products, offers, sampleReviews, DEMO_VIDEO } from '../data/catalog';")
    s = rep(s, "  const [slide, setSlide] = useState(0);", "  const [slide, setSlide] = useState(0);\n  const [media, setMedia] = useState('photos'); // 'photos' | 'video'\n  const videoUri = product.video || DEMO_VIDEO;")
    i = s.index("          <ScrollView\n            horizontal\n            pagingEnabled")
    k = s.index("<View style={styles.dots}>"); j = s.index("          </View>\n", k) + len("          </View>\n")
    new = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gallery.txt'), encoding='utf-8').read()
    s = s[:i] + new + s[j:]
    return rep(s, "  dotOn: { backgroundColor: colors.black, width: 16 },", """  dotOn: { backgroundColor: colors.black, width: 16 },
  mediaTabs: { flexDirection: 'row', alignSelf: 'center', backgroundColor: colors.mist, borderRadius: 999, padding: 3, marginBottom: 10 },
  mediaTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999 },
  mediaTabOn: { backgroundColor: colors.black },
  mediaTabText: { fontSize: 12.5, fontWeight: '600', color: colors.ink },""")
edit(C + 'src/screens/ProductDetailScreen.js', pdp)
print('DONE')
