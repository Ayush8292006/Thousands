import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar, Panel, SegmentTabs } from '../components/kit';
import { colors, fonts } from '../theme';
import { useSeller } from '../context/SellerContext';
import { formatDate } from '../utils/format';
import { noOutline } from '../utils/platform';

function ReplyBox({ placeholder, onSend }) {
  const [text, setText] = useState('');
  return (
    <View style={styles.replyBox}>
      <TextInput value={text} onChangeText={setText} placeholder={placeholder} placeholderTextColor={colors.faint} style={[styles.replyInput, noOutline]} multiline />
      <Pressable onPress={() => { if (text.trim()) { onSend(text.trim()); setText(''); } }} style={[styles.send, !text.trim() && { opacity: 0.4 }]}>
        <Ionicons name="send" size={16} color={colors.white} />
      </Pressable>
    </View>
  );
}

export default function ReviewsScreen() {
  const { reviews, replyReview, queries, answerQuery, productById } = useSeller();
  const [tab, setTab] = useState('questions');
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map((n) => [n, reviews.filter((r) => r.rating === n).length]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar back title="Reviews & questions" subtitle="Reply fast to build trust" />
      <SegmentTabs
        tabs={[
          { id: 'questions', label: 'Questions', count: queries.filter((q) => !q.answer).length },
          { id: 'reviews', label: 'Reviews', count: reviews.length },
        ]}
        value={tab}
        onChange={setTab}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        {tab === 'reviews' ? (
          <>
            <Panel style={{ marginTop: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ alignItems: 'center', width: 90 }}>
                  <Text style={styles.avg}>{avg}</Text>
                  <Text style={styles.avgSub}>{reviews.length} reviews</Text>
                </View>
                <View style={{ flex: 1 }}>
                  {dist.map(([n, c]) => (
                    <View key={n} style={styles.distRow}>
                      <Text style={styles.distN}>{n}★</Text>
                      <View style={styles.distTrack}><View style={[styles.distBar, { width: `${(c / reviews.length) * 100}%`, backgroundColor: n >= 4 ? colors.success : n === 3 ? '#E67E00' : colors.sale }]} /></View>
                      <Text style={styles.distC}>{c}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Panel>
            {reviews.map((r) => (
              <Panel key={r.id} style={{ marginTop: 0, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.stars, { backgroundColor: r.rating >= 4 ? colors.success : r.rating === 3 ? '#E67E00' : colors.sale }]}>
                    <Text style={styles.starsText}>{r.rating} ★</Text>
                  </View>
                  <Text style={styles.who}>{r.buyer} · {formatDate(r.date)}</Text>
                </View>
                <Text style={styles.prod} numberOfLines={1}>{productById(r.productId)?.title}</Text>
                <Text style={styles.text}>{r.text}</Text>
                {r.reply ? (
                  <View style={styles.reply}><Text style={styles.replyLabel}>Your reply</Text><Text style={styles.replyText}>{r.reply}</Text></View>
                ) : (
                  <ReplyBox placeholder="Write a public reply" onSend={(t) => replyReview(r.id, t)} />
                )}
              </Panel>
            ))}
          </>
        ) : (
          queries.map((q) => (
            <Panel key={q.id} style={{ marginTop: 0, marginBottom: 10 }}>
              <Text style={styles.prod} numberOfLines={1}>{productById(q.productId)?.title}</Text>
              <Text style={styles.q}>Q: {q.question}</Text>
              <Text style={styles.who}>{q.buyer} · {formatDate(q.date)}</Text>
              {q.answer ? (
                <View style={styles.reply}><Text style={styles.replyLabel}>Your answer</Text><Text style={styles.replyText}>{q.answer}</Text></View>
              ) : (
                <ReplyBox placeholder="Answer this question" onSend={(t) => answerQuery(q.id, t)} />
              )}
            </Panel>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avg: { fontWeight: '700', fontSize: 32, color: colors.black },
  avgSub: { fontSize: 11, color: colors.muted },
  distRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  distN: { width: 28, fontSize: 11, color: colors.ink },
  distTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.mist },
  distBar: { height: 6, borderRadius: 3 },
  distC: { width: 22, textAlign: 'right', fontSize: 11, color: colors.muted },
  stars: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8 },
  starsText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  who: { fontSize: 11, color: colors.muted, marginTop: 2 },
  prod: { fontSize: 12, color: colors.accent, fontWeight: '600', marginTop: 8 },
  text: { fontSize: 13, color: colors.ink, marginTop: 4, lineHeight: 19 },
  q: { fontSize: 14, fontWeight: '700', color: colors.black, marginTop: 4 },
  reply: { backgroundColor: colors.accentSoft, borderRadius: 8, padding: 10, marginTop: 10 },
  replyLabel: { fontSize: 11, fontWeight: '700', color: colors.accent },
  replyText: { fontSize: 13, color: colors.ink, marginTop: 2 },
  replyBox: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.mist, borderRadius: 4, padding: 6, marginTop: 10 },
  replyInput: { flex: 1, fontSize: 13, color: colors.black, paddingHorizontal: 8, paddingVertical: 6, maxHeight: 90 },
  send: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
