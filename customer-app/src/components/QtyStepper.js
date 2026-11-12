import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function QtyStepper({ value, onChange, max = 10 }) {
  return (
    <View style={styles.wrap}>
      <Pressable style={styles.btn} onPress={() => onChange(value - 1)} hitSlop={6}>
        <Ionicons name={value <= 1 ? 'trash-outline' : 'remove'} size={16} color={colors.black} />
      </Pressable>
      <Text style={styles.val}>{value}</Text>
      <Pressable style={[styles.btn, value >= max && { opacity: 0.3 }]} disabled={value >= max} onPress={() => onChange(value + 1)} hitSlop={6}>
        <Ionicons name="add" size={16} color={colors.black} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    borderRadius: 8, alignSelf: 'flex-start',
  },
  btn: { width: 34, height: 32, alignItems: 'center', justifyContent: 'center' },
  val: { minWidth: 24, textAlign: 'center', fontWeight: '700', fontSize: 14 },
});
