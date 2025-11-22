// components/PickerWrapper.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PickerWrapperProps {
  selectedValue: string;
  onValueChange: (v: string) => void;
  options: { label: string; value: string }[];
}

export default function PickerWrapper({ selectedValue, onValueChange, options }: PickerWrapperProps) {
  return (
    <View style={styles.wrap}>
      <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={styles.picker} mode="dropdown">
        {options.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 10, overflow: 'hidden', alignSelf: 'flex-end' },
  picker: { width: 180, height: 44, color: '#ddd', backgroundColor: '#121212' },
});
