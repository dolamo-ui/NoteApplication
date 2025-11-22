// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Avatar from '@/components/Avatar';
import NoteCard from '@/components/NoteCard';
import ModalWrapper from '@/components/ModalWrapper';
import PickerWrapper from '@/components/PickerWrapper';

import { FontAwesome } from "@expo/vector-icons";

/* ====================== TYPES ====================== */
export interface User {
  email: string;
  username: string;
  password: string;
}

export interface Note {
  id: number;
  title: string;
  text: string;
  category: string;
  created: string;
  updated: string | null;
}

type Category = 'All Notes' | 'Work' | 'School' | 'Personal';
type SortOrder = 'asc' | 'desc';

/* ====================== KEYS ====================== */
const USERS_KEY = 'users_v1';
const LOGGED_IN_KEY = 'loggedInUser_v1';

/* ====================== APP ====================== */
export default function App() {
  /* ---------- state ---------- */
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [category, setCategory] = useState<Category>('All Notes');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [addEditVisible, setAddEditVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [saTitle, setSaTitle] = useState('');
  const [saText, setSaText] = useState('');
  const [saCategory, setSaCategory] = useState<Category | string>('Work');

  const [profileUsername, setProfileUsername] = useState('');
  const [profilePassword, setProfilePassword] = useState('');

  /* ---------- helpers ---------- */
  const notesKey = useCallback(
    (email?: string) =>
      email || currentUser?.email ? `notes_${email ?? currentUser?.email}` : null,
    [currentUser]
  );

  const filteredAndSorted = notes
    .filter(n => (category === 'All Notes' ? true : n.category === category))
    .filter(n => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (n.title || '').toLowerCase().includes(s) || (n.text || '').toLowerCase().includes(s);
    })
    .sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.created).getTime() - new Date(b.created).getTime()
        : new Date(b.created).getTime() - new Date(a.created).getTime()
    );

  /* ---------- persistence ---------- */
  async function loadUsersAndMaybeSeed() {
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      const logged = await AsyncStorage.getItem(LOGGED_IN_KEY);

      if (!raw) {
        const demo: User = {
          email: 'demo@example.com',
          username: 'Dimitar',
          password: 'password',
        };
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify([demo]));
        await AsyncStorage.setItem(LOGGED_IN_KEY, JSON.stringify(demo));
        setUsers([demo]);
        setCurrentUser(demo);
      } else {
        const parsed: User[] = JSON.parse(raw);
        setUsers(parsed);
        if (logged) setCurrentUser(JSON.parse(logged));
        else {
          setCurrentUser(parsed[0]);
          await AsyncStorage.setItem(LOGGED_IN_KEY, JSON.stringify(parsed[0]));
        }
      }
    } catch (e) {
      console.warn('loadUsersAndMaybeSeed', e);
    }
  }

  async function loadNotesForCurrentUser() {
    try {
      if (!currentUser) {
        setNotes([]);
        return;
      }
      const key = notesKey(currentUser.email);
      if (!key) return;
      const raw = await AsyncStorage.getItem(key);
      if (!raw) {
        const now = Date.now();
        const demo: Note[] = [
          {
            id: now + 1,
            title: 'Reminder',
            text: 'Create design brief',
            category: 'Work',
            created: new Date().toISOString(),
            updated: null,
          },
          {
            id: now + 2,
            title: 'Dev Team',
            text: 'Get dev team involved early',
            category: 'Work',
            created: new Date().toISOString(),
            updated: null,
          },
          {
            id: now + 3,
            title: 'Narrative',
            text: 'Think what to share',
            category: 'School',
            created: new Date().toISOString(),
            updated: null,
          },
          {
            id: now + 4,
            title: '',
            text: 'Consider info digestibility',
            category: 'Personal',
            created: new Date().toISOString(),
            updated: null,
          },
        ];
        await AsyncStorage.setItem(key, JSON.stringify(demo));
        setNotes(demo);
        return;
      }
      setNotes(JSON.parse(raw));
    } catch (e) {
      console.warn('loadNotesForCurrentUser', e);
    }
  }

  async function persistNotes(next: Note[]) {
    try {
      if (!currentUser) {
        setNotes(next);
        return;
      }
      const key = notesKey(currentUser.email);
      if (!key) return;
      await AsyncStorage.setItem(key, JSON.stringify(next));
      setNotes(next);
    } catch (e) {
      console.warn('persistNotes', e);
    }
  }

  /* ---------- lifecycle ---------- */
  useEffect(() => {
    loadUsersAndMaybeSeed();
  }, []);
  useEffect(() => {
    loadNotesForCurrentUser();
  }, [currentUser]);

  /* ---------- profile ---------- */
  async function updateProfile() {
    if (!currentUser) return Alert.alert('Error', 'No user logged in.');
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      if (!raw) return;
      const all: User[] = JSON.parse(raw);
      const idx = all.findIndex(u => u.email === currentUser.email);
      if (idx === -1) return;

      if (profileUsername.trim()) all[idx].username = profileUsername.trim();
      if (profilePassword.trim()) all[idx].password = profilePassword.trim();

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(all));
      await AsyncStorage.setItem(LOGGED_IN_KEY, JSON.stringify(all[idx]));
      setUsers(all);
      setCurrentUser(all[idx]);
      setProfileUsername('');
      setProfilePassword('');
      setProfileVisible(false);
      Alert.alert('Saved', 'Profile updated');
    } catch (e) {
      console.warn('updateProfile', e);
      Alert.alert('Error', 'Could not update profile');
    }
  }

  async function logout() {
    setCurrentUser(null);
    setNotes([]);
    await AsyncStorage.removeItem(LOGGED_IN_KEY);
  }

  /* ---------- notes CRUD ---------- */
  function openAdd() {
    setEditId(null);
    setSaTitle('');
    setSaText('');
    setSaCategory(category === 'All Notes' ? 'Work' : category);
    setAddEditVisible(true);
  }

  function openEdit(note: Note) {
    setEditId(note.id);
    setSaTitle(note.title);
    setSaText(note.text);
    setSaCategory(note.category);
    setAddEditVisible(true);
  }

  async function saveNote() {
    if (!currentUser) return Alert.alert('Error', 'No user logged in.');
    const title = (saTitle || '').trim();
    const text = (saText || '').trim();
    const cat = saCategory || 'Work';
    const next = [...notes];

    if (editId) {
      const idx = next.findIndex(n => n.id === editId);
      if (idx !== -1)
        next[idx] = {
          ...next[idx],
          title,
          text,
          category: String(cat),
          updated: new Date().toISOString(),
        };
    } else {
      const newNote: Note = {
        id: Date.now(),
        title,
        text,
        category: String(cat),
        created: new Date().toISOString(),
        updated: null,
      };
      next.unshift(newNote);
    }

    await persistNotes(next);
    setAddEditVisible(false);
    setEditId(null);
    setSaTitle('');
    setSaText('');
    setSaCategory('Work');
  }

  async function removeNote(id: number) {
    Alert.alert('Delete', 'Delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const next = notes.filter(n => n.id !== id);
          await persistNotes(next);
        },
      },
    ]);
  }

  /* ---------- render ---------- */
  const categories: Category[] = ['All Notes', 'Work', 'School', 'Personal'];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetHi}>Welcome to Notes,</Text>
            <Text style={styles.greetUser}>{currentUser?.username || 'Guest'}!</Text>
          </View>
          <TouchableOpacity onPress={() => setProfileVisible(true)}>
            <Avatar username={currentUser?.username} />
          </TouchableOpacity>
        </View>

        {/* Button-style Tabs */}
        <ScrollView
          horizontal
          contentContainerStyle={styles.tabsScroll}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.tabsRow}>
            {categories.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setCategory(t)}
                activeOpacity={0.8}
                style={[styles.tabButton, category === t && styles.tabButtonActive]}
              >
                <Text style={[styles.tabButtonText, category === t && styles.tabButtonTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />

        {/* Top Row */}
        <View style={styles.topBarRow}>
          <Text style={styles.categoryTitle}>{category}</Text>
          <PickerWrapper
            selectedValue={sortOrder}
            onValueChange={v => setSortOrder(v as SortOrder)}
            options={[
              { label: 'Newest First', value: 'desc' },
              { label: 'Oldest First', value: 'asc' },
            ]}
          />
        </View>

        {/* Notes List */}
        <View style={{ flex: 1 }}>
          {filteredAndSorted.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={{ color: '#aaa' }}>No notes yet. Tap + to add one.</Text>
            </View>
          ) : (
            <FlatList
              data={filteredAndSorted}
              keyExtractor={i => String(i.id)}
              renderItem={({ item, index }) => (
                <NoteCard note={item} index={index} onEdit={openEdit} onDelete={removeNote} />
              )}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingBottom: 120, paddingTop: 6 }}
            />
          )}
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setCategory('All Notes')}>
            <FontAwesome name="home" size={26} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.navBtn, styles.centerBtn]} onPress={openAdd}>
            <FontAwesome name="plus" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn} onPress={() => setProfileVisible(true)}>
            <FontAwesome name="user" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Add/Edit Modal */}
        <ModalWrapper visible={addEditVisible} onClose={() => setAddEditVisible(false)}>
          <ScrollView style={{ padding: 14 }}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{editId ? 'Edit Note' : 'Add Note'}</Text>
              <TextInput
                placeholder="Title (optional)"
                placeholderTextColor="#888"
                value={saTitle}
                onChangeText={setSaTitle}
                style={styles.input}
              />
              <TextInput
                placeholder="Write your note here..."
                placeholderTextColor="#888"
                value={saText}
                onChangeText={setSaText}
                style={[styles.input, { height: 120 }]}
                multiline
              />

              <Text style={{ color: '#999', marginTop: 6 }}>Category</Text>
              <PickerWrapper
                selectedValue={saCategory}
                onValueChange={v => setSaCategory(v)}
                options={[
                  { label: 'Work', value: 'Work' },
                  { label: 'School', value: 'School' },
                  { label: 'Personal', value: 'Personal' },
                ]}
              />

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
                  <Text style={{ fontWeight: '800' }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setAddEditVisible(false)}
                >
                  <Text style={{ color: '#fff' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ModalWrapper>

        {/* Profile Modal */}
        <ModalWrapper visible={profileVisible} onClose={() => setProfileVisible(false)}>
          <ScrollView style={{ padding: 14 }}>
            <View style={styles.modalCard}>
              <TouchableOpacity onPress={() => setProfileVisible(false)} style={styles.backBtnFloating}>
                <Text style={styles.backBtnText}>←</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 24 }}>
                <Avatar username={currentUser?.username} size={84} />
                <View>
                  <Text style={{ fontWeight: '800', fontSize: 18 }}>
                    {currentUser?.username || 'Username'}
                  </Text>
                  <Text style={{ color: '#999' }}>{currentUser?.email || ''}</Text>
                </View>
              </View>

              <Text style={{ color: '#999', marginTop: 12 }}>Username</Text>
              <TextInput
                placeholder="New Username"
                placeholderTextColor="#777"
                value={profileUsername}
                onChangeText={setProfileUsername}
                style={styles.input}
              />

              <Text style={{ color: '#999' }}>Password</Text>
              <TextInput
                placeholder="New Password"
                placeholderTextColor="#777"
                value={profilePassword}
                onChangeText={setProfilePassword}
                style={styles.input}
                secureTextEntry
              />

              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <TouchableOpacity style={styles.saveBtn} onPress={updateProfile}>
                  <Text style={{ fontWeight: '800' }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={logout}>
                  <Text style={{ color: '#fff' }}>Log out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ModalWrapper>

      </View>
    </SafeAreaView>
  );
}

/* ====================== STYLES ====================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#080808' },
  container: { flex: 1, padding: 14, backgroundColor: '#080808' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -230 },
  greetHi: { color: '#ddd', fontSize: 14 },
  greetUser: { color: '#fff', fontSize: 20, fontWeight: '800' },

  /* ↓↓↓ GAP REDUCED HERE ↓↓↓ */
  tabsScroll: {
    paddingVertical: 4,   // decreased space
    marginBottom: 4,      // keeps tabs closer to search
  },

  tabsRow: { flexDirection: 'row', alignItems: 'center' },

  tabButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#ff3e6c',
    backgroundColor: 'rgba(255,214,0,0.06)',
  },
  tabButtonText: { color: '#9a9a9a', fontWeight: '700' },
  tabButtonTextActive: { color: '#fff' },

  /* ↓↓↓ SMALLER GAP ABOVE SEARCH ↓↓↓ */
  searchInput: {
    backgroundColor: '#151515',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    marginTop: -250,      // reduced gap
    marginBottom: 6,
  },

  topBarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  categoryTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },

  emptyBox: {
    padding: 22,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },

  bottomNav: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e0e0e',
  },

  centerBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    transform: [{ translateY: -8 }],
    backgroundColor: '#1f1f1f',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCard: { backgroundColor: '#fff', marginTop: 6, borderRadius: 12, padding: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },

  input: {
    backgroundColor: '#121212',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },

  saveBtn: {
    backgroundColor: '#ff3e6c',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backBtnFloating: {
    position: 'absolute',
    top: 1,
    left: 12,
    padding: 6,
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#ff3e6c',
    fontSize: 20,
    fontWeight: '800',
  },
}); 