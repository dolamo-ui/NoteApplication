// components/ModalWrapper.tsx
import React from 'react';
import { Modal, SafeAreaView, StyleSheet } from 'react-native';

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalWrapper({ visible, onClose, children }: ModalWrapperProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f10' },
});
