// components/Avatar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  username?: string;
  size?: number;
}

export default function Avatar({ username = 'Guest', size = 44 }: AvatarProps) {
  const initial = (username[0] || 'G').toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={{ color: '#111', fontWeight: '800' }}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(0,0,0,0.06)' },
});
