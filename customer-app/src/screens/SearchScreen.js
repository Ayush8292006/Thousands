import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { noOutline } from '../utils/platform';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/catalog';
import ProductImage from '../components/ProductImage';

// Flipkart-style search: rounded bold-border input, recent searches with images,
// recommended stores and trending today.
function imageFor(term) {
  const t = term.toLowerCase();
  const p = products.find((x) => x.title.toLowerCase().includes(t) || x.sub.toLowerCase().includes(t) || x.brand.toLowerCase().includes(t));
  if (p) return p.thumb;
  const c = categories.find((x) => x.name.toLowerCase().includes(t) || t.includes(x.id));
  return c ? c.image : null;
}

export default function SearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { recentSearches, addRecentSearch } = useApp();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(false);
  const [hidden, setHidden] = useState([]);

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.sub.toLowerCase().includes(s)).slice(0, 8);
  }, [q]);

  const trending = useMemo(() => [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8), []);
  const recents = recentSearches.filter((r) => !hidden.includes(r));

  const submit = (term) => {
    const t = (term ?? q).trim();
    if (!t) return;
    addRecentSearch(t);
    navigation.replace('ProductList', { query: t, title: t });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={[styles.bar, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.ink} />
        </Pressable>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={20} color={colors.ink} />
          <TextInput
            value={q}
            onChangeText={setQ}
            autoFocus
            placeholder="Search for products"
            placeholderTextColor={colors.faint}
            style={[styles.input, noOutline]}
            returnKeyType="search"
            onSubmitEditing={() => submit()}
          />
          {q ? (
            <Pressable onPress={() => setQ('')} hitSlop={8} accessibilityLabel="Clear">
              <Ionicons name="close" size={20} color={colors.muted} />
            </Pressable>
          ) : (
            <Ionicons name="mic-outline" size={21} color={colors.ink} />
          )}
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 30 }}>
        {q ? (
          suggestions.length ? (
            suggestions.map((p) => (
              <Pressable key={p.id} style={styles.sugg} onPress={() => submit(p.title)}>
                <View style={styles.suggImg}><ProductImage product={p} size={44} rounded={10} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.suggText} numberOfLines={1}>{p.title}</Text>
                  <Text style={styles.suggSub} numberOfLines={1}>in {p.sub}</Text>
                </View>
                <Ionicons name="arrow-up-outline" size={18} color={colors.muted} style={{ transform: [{ rotate: '-45deg' }] }} />
              </Pressable>
            ))
          ) : (
            <Pressable style={styles.sugg} onPress={() => submit()}>
              <Ionicons name="search-outline" size={18} color={colors.muted} />
              <Text style={[styles.suggText, { marginLeft: 12 }]}>Search for “{q}”</Text>
            </Pressable>
          )
        ) : (
          <>
            {recents.length ? (
              <>
                <View style={styles.head}>
                  <Text style={styles.headText}>Recent Searches</Text>
                  <Pressable onPress={() => setEditing(!editing)} hitSlop={8}>
                    <Text style={styles.edit}>{editing ? 'Done' : 'Edit'}</Text>
                  </Pressable>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                  {recents.map((r) => {
                    const img = imageFor(r);
                    return (
                      <Pressable key={r} style={styles.recent} onPress={() => (editing ? null : submit(r))}>
                        <View style={styles.recentImg}>
                          {img ? <Image source={{ uri: img }} style={StyleSheet.absoluteFill} fadeDuration={0} /> : <Ionicons name="time-outline" size={26} color={colors.muted} />}
                          {editing ? (
                            <Pressable style={styles.remove} onPress={() => setHidden([...hidden, r])} hitSlop={6} accessibilityLabel={`Remove ${r}`}>
                              <Ionicons name="close" size={13} color={colors.white} />
                            </Pressable>
                          ) : null}
                        </View>
                        <Text style={styles.recentText} numberOfLines={2}>{r}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </>
            ) : null}

            <View style={styles.stores}>
              <Text style={styles.storesTitle}>Recommended Stores</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 14 }}>
                {categories.map((c) => (
                  <Pressable key={c.id} style={styles.store} onPress={() => navigation.replace('ProductList', { category: c.id, title: c.name })}>
                    <Image source={{ uri: c.image }} style={styles.storeImg} fadeDuration={0} />
                    <Text style={styles.storeText} numberOfLines={1}>{c.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={[styles.head, { marginTop: 26 }]}>
              <Text style={styles.headText}>Trending Today</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
              {trending.map((p) => (
                <Pressable key={p.id} style={styles.trend} onPress={() => navigation.replace('ProductDetail', { id: p.id })}>
                  <ProductImage product={p} size={150} rounded={16} />
                  <Text style={styles.trendText} numberOfLines={2}>{p.brand} {p.sub}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.header, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14 },
  inputWrap: {
    flex: 1, height: 50, backgroundColor: colors.white, borderRadius: 25, borderWidth: 2, borderColor: colors.accent,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10,
  },
  input: { flex: 1, fontSize: 16, color: colors.ink },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 20, marginBottom: 14 },
  headText: { fontSize: 20, fontWeight: '800', color: colors.ink },
  edit: { fontSize: 16, fontWeight: '700', color: colors.accent },
  recent: { width: 78 },
  recentImg: {
    width: 78, height: 78, borderRadius: 16, borderWidth: 1, borderColor: '#DADDE2', backgroundColor: colors.mist,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  remove: { position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  recentText: { fontSize: 13.5, color: colors.ink, marginTop: 6, lineHeight: 18 },
  stores: { marginHorizontal: 16, marginTop: 26, paddingVertical: 18, backgroundColor: '#FFF4D6', borderRadius: 22 },
  storesTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, paddingHorizontal: 16, marginBottom: 14 },
  store: { width: 118, backgroundColor: colors.white, borderRadius: 16, padding: 8, alignItems: 'center' },
  storeImg: { width: 102, height: 102, borderRadius: 12, backgroundColor: colors.mist },
  storeText: { fontSize: 13.5, fontWeight: '700', color: colors.ink, marginTop: 8 },
  trend: { width: 150 },
  trendText: { fontSize: 14, fontWeight: '700', color: colors.ink, marginTop: 8, lineHeight: 19 },
  sugg: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  suggImg: { width: 44 },
  suggText: { fontSize: 14.5, color: colors.ink },
  suggSub: { fontSize: 12, color: colors.accent, marginTop: 2 },
});
