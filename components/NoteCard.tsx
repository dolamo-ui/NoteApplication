// components/NoteCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Avatar from './Avatar';

/* ---------------- TYPES ---------------- */
export interface Note {
  id: number;
  title: string;
  text: string;
  category: string;
  created: string;
  updated: string | null;
}

interface NoteCardProps {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

/* ---------------- COMPONENT ---------------- */
export default function NoteCard({ note, index, onEdit, onDelete }: NoteCardProps) {
  const variants = ['#ff3e6c', '#f6f6f8', '#d9d9db', '#f1f1f2'];
  const bg = variants[index % variants.length];

  // Confirm delete
  const handleDelete = () => {
    Alert.alert('Delete', 'Delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(note.id) },
    ]);
  };

  return (
    <View style={[styles.noteCard, { backgroundColor: bg }]}>
      {/* Header row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.noteTitle}>{note.title || '(No Title)'}</Text>
          <Text style={styles.noteDate}>{new Date(note.created).toLocaleDateString()}</Text>
        </View>
        <Avatar size={28} username={note.title || 'N'} />
      </View>

      {/* Note text */}
      <Text numberOfLines={4} style={styles.noteText}>{note.text || ''}</Text>

      {/* Action buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(note)}>
          <Text style={{ fontWeight: '700' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  noteCard: { flex: 1, borderRadius: 5, padding: 12, minHeight: 120, marginBottom: 6, marginRight: 6, marginTop: 50 },
  noteTitle: { fontWeight: '800', color: '#111' },
  noteDate: { color: '#333', fontSize: 12 },
  noteText: { color: '#222', marginTop: 8, flex: 1 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btnEdit: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.06)' },
  btnDelete: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#ff6b6b' },
});
