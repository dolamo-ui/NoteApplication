
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ value, placeholder, onChangeText, secureTextEntry, multiline }) => (
  <TextInput
    value={value}
    placeholder={placeholder}
    placeholderTextColor="#888"
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    multiline={multiline}
    style={[styles.input, multiline && { minHeight: 100, textAlignVertical: 'top' }]}
  />
);

export default InputField;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#1b2433',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff3e6c',
    padding: 12,
    color: '#fff',
    marginVertical: 6,
  },
});
