import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/catalog';

export default function SearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { recentSearches, addRecentSearch } = useApp();
  const [q, setQ] = useState('');

  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)).slice(0, 8);
  }, [q]);

  const submit = (term) => {
    const t = (term ?? q).trim();
    if (!t) return;
    addRecentSearch(t);
    navigation.replace('ProductList', { query: t, title: `"${t}"` });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </Pressable>
        <View style={styles.inputWrap}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            autoFocus
            placeholder="Search for products, brands and more"
            placeholderTextColor={colors.faint}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={() => submit()}
          />
          {q ? (
            <Pressable onPress={() => setQ('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.faint} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16 }}>
        {q ? (
          suggestions.map((p) => (
            <Pressable key={p.id} style={styles.sugg} onPress={() => submit(p.title)}>
              <Ionicons name="search-outline" size={16} color={colors.muted} />
              <Text style={styles.suggText} numberOfLines={1}>{p.title}</Text>
              <Ionicons name="arrow-up-outline" size={16} color={colors.faint} style={{ transform: [{ rotate: '-45deg' }] }} />
            </Pressable>
          ))
        ) : (
          <>
            {recentSearches.length ? <Text style={styles.head}>Recent searches</Text> : null}
            {recentSearches.map((r) => (
              <Pressable key={r} style={styles.sugg} onPress={() => submit(r)}>
                <Ionicons name="time-outline" size={16} color={colors.muted} />
                <Text style={styles.suggText}>{r}</Text>
              </Pressable>
            ))}
            <Text style={[styles.head, { marginTop: 22 }]}>Trending categories</Text>
            <View style={styles.chips}>
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  style={styles.chip}
                  onPress={() => navigation.replace('ProductList', { category: c.id, title: c.name })}
                >
                  <Ionicons name={c.icon} size={14} color={colors.black} />
                  <Text style={styles.chipText}>{c.name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingBottom: 12 },
  inputWrap: {
    flex: 1, marginLeft: 12, height: 46, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 14, color: colors.black },
  head: { fontSize: 13, fontWeight: '800', color: colors.muted, letterSpacing: 0.5, marginBottom: 6 },
  sugg: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  suggText: { flex: 1, marginHorizontal: 10, fontSize: 14, color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, marginBottom: 8,
  },
  chipText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: colors.ink },
});
