import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Used for icons
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { JournalEntry } from '@/components/JournalEntry';

import { getAuth } from "@react-native-firebase/auth";
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, where, deleteDoc, doc } from '@react-native-firebase/firestore';
import { IJournalDataResponse } from '@/components/custom-interface/CustomProps';


export default function JournalList() {
  const [journalEntries, setJournalEntries] = useState<IJournalDataResponse[]>([])
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const user = getAuth().currentUser;

  const getLastJournals = async (count: number) => {

    setLoading(true);
    const lastJournals: IJournalDataResponse[] = [];
    try {
      const journalsRef = collection(db, "Journals");
      const q = query(
        journalsRef,
        where("uid", "==", user?.uid),
        orderBy("createAt", "desc"),
        limit(count)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc: any) => {
        lastJournals.push({ id: doc.id, ...doc.data() });
      });

    }
    catch (error) {
      console.error("Failed to load tasks:", error);
    }
    finally {
      setJournalEntries(lastJournals);
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setLoading(true);
    try {
      getLastJournals(10);
    } catch (error) {
      console.error("Failed to fetch new entries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJournalEntry = async (id: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "Journals", id));
      getLastJournals(10);
    }
    catch (err) {
      console.log('Error deleting journal entry: ', err);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getLastJournals(10);
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Journal Entries</Text>
      </View>
      {journalEntries[0] ? (
        <FlatList
          data={journalEntries}
          renderItem={({ item }) => <JournalEntry
            id={item.id}
            createAt={item.createAt}
            content={item.content}
            mood={item.mood}
            onDelete={() => deleteJournalEntry(item.id)}
            moreOption={() => console.log('more option')}
            
          />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={['#0059ffff']}
            />
          }
          contentContainerStyle={styles.entriesList}
        />
      ) :
        (
          <Text style={styles.noEntry}>No journals yet</Text>
        )
      }
      <TouchableOpacity style={styles.fab} onPress={() => { router.push('/(screen)/journal_create') }}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal:10
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
  },
  entriesList: {
    gap: 16,
    paddingBottom: 10
  },
  entryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  emotionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  emotionText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  entryText: {
    fontSize: 14,
    color: '#374151',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4f46e5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  noEntry: {
    fontSize: 14,
    color: '#374151',
  }
});
