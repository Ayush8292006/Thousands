import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, Animated, Easing, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Glass from './Glass';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';

const native = Platform.OS !== 'web';

// Delivery location dropdown — smooth fade/slide from the navbar; uses the saved addresses
export default function LocationDropdown({ visible, onClose, onManage, top = 70 }) {
  const insets = useSafeAreaInsets();
  const { addresses, selectedAddress, setSelectedAddressId } = useApp();
  const a = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(a, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: native }).start();
    } else if (mounted) {
      Animated.timing(a, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: native }).start(() => setMounted(false));
    }
  }, [visible, a, mounted]);

  if (!mounted) return null;
  const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: a }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>
      <Animated.View style={[styles.panelWrap, { top: insets.top + top, opacity: a, transform: [{ translateY }] }]}>
        <Glass tint="rgba(255, 253, 246, 0.94)" radius={20} style={styles.panel}>
          <Text style={styles.title}>My Addresses</Text>
          {addresses.map((ad) => {
            const on = selectedAddress?.id === ad.id;
            return (
              <Pressable key={ad.id} style={[styles.row, on && styles.rowOn]} onPress={() => { setSelectedAddressId(ad.id); onClose(); }}>
                <View style={[styles.pin, on && styles.pinOn]}>
                  <Ionicons name="location" size={14} color={on ? colors.olive : colors.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name} numberOfLines={1}>{ad.type} · {ad.name}</Text>
                  <Text style={styles.addr} numberOfLines={2}>{ad.house}, {ad.area}, {ad.city} {ad.pincode}</Text>
                </View>
                <Ionicons name={on ? 'radio-button-on' : 'radio-button-off'} size={20} color={on ? colors.olive : colors.faint} />
              </Pressable>
            );
          })}
          <Pressable style={styles.manage} onPress={() => { onClose(); onManage(); }}>
            <Ionicons name="add-circle-outline" size={18} color={colors.olive} />
            <Text style={styles.manageText}>Add / manage addresses</Text>
          </Pressable>
        </Glass>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: 'rgba(48, 39, 25, 0.18)' },
  panelWrap: { position: 'absolute', left: 14, right: 14, alignSelf: 'center', maxWidth: 452 },
  panel: { padding: 12, borderColor: 'rgba(214, 180, 92, 0.5)' },
  title: { fontSize: 13, fontWeight: '800', color: colors.espresso, marginBottom: 8, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 14 },
  rowOn: { backgroundColor: 'rgba(214, 180, 92, 0.14)' },
  pin: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mist },
  pinOn: { backgroundColor: 'rgba(214, 180, 92, 0.35)' },
  name: { fontSize: 13, fontWeight: '700', color: colors.espresso },
  addr: { fontSize: 12, color: colors.muted, marginTop: 1 },
  manage: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, padding: 10 },
  manageText: { fontSize: 13, fontWeight: '700', color: colors.olive },
});
