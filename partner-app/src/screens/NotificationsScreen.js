import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/kit';
import { colors } from '../theme';
import { useSeller } from '../context/SellerContext';
import { formatDate } from '../utils/format';
import { goTo } from '../utils/nav';

export default function NotificationsScreen({ navigation }) {
  const { notifications, markAllRead, markRead, unread } = useSeller();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar
        back
        title="Notifications"
        subtitle={unread ? `${unread} unread` : 'All caught up'}
        right={unread ? <Pressable onPress={markAllRead} hitSlop={8}><Text style={{ color: colors.white, fontWeight: '700', fontSize: 13 }}>Mark all read</Text></Pressable> : null}
      />
      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item: n }) => (
          <Pressable
            style={[styles.row, !n.read && styles.unread]}
            onPress={() => {
              markRead(n.id);
              goTo(navigation, n.go);
            }}
          >
            <View style={[styles.icon, { backgroundColor: n.color + '1A' }]}>
              <Ionicons name={n.icon} size={20} color={n.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.title}>{n.title}</Text>
              <Text style={styles.body}>{n.body}</Text>
              <Text style={styles.time}>{formatDate(n.time)}</Text>
            </View>
            {!n.read ? <View style={styles.dot} /> : null}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.white, padding: 14, marginHorizontal: 12, marginBottom: 8, borderRadius: 12 },
  unread: { borderLeftWidth: 3, borderLeftColor: colors.accent },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: colors.black },
  body: { fontSize: 12, color: colors.ink, marginTop: 2, lineHeight: 17 },
  time: { fontSize: 11, color: colors.faint, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6 },
});
