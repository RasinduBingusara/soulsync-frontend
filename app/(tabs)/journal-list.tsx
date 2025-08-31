import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, FlatList, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Used for icons
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { JournalEntry } from '@/components/JournalEntry';
import { IJournalDataResponse } from '@/components/custom-interface/CustomProps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "@react-native-firebase/auth"
import { useTranslation } from 'react-i18next';
import '@/components/translation/i18n';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function JournalList() {
  const { t } = useTranslation();
  const [allJournals, setAllJournals] = useState<IJournalDataResponse[]>([]);
  const [displayedJournals, setDisplayedJournals] = useState<IJournalDataResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // Start at page 0
  const pageSize = 10;

  const user = getAuth().currentUser;

  const fetchAllJournals = async () => {
    setLoading(true);
    try {
      const existingJournals = await AsyncStorage.getItem('Journals');
      let journals: IJournalDataResponse[] = existingJournals ? JSON.parse(existingJournals) : [];

      if (user?.uid) {
        journals = journals.filter(journal => journal.uid === user.uid);
      }
      // Sort all journals by date
      journals.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());

      setAllJournals(journals);
      setDisplayedJournals(journals.slice(0, pageSize));
      setPage(1);
    } catch (error) {
      console.error("Failed to load journals from AsyncStorage:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJournals();
  }, []);

  const loadMoreJournals = () => {
    if (loading) {
      return;
    }

    const newPage = page + 1;
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;

    // Check if there are more journals to load
    if (startIndex >= allJournals.length) {
      return; // No more journals
    }

    setLoading(true);
    const nextBatch = allJournals.slice(startIndex, endIndex);
    setDisplayedJournals(prevJournals => [...prevJournals, ...nextBatch]);
    setPage(newPage);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setLoading(true);
    try {
      fetchAllJournals();
    } catch (error) {
      console.error("Failed to fetch new entries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJournalEntry = async (id: string) => {
    setLoading(true);
    try {
      const existingJournals = await AsyncStorage.getItem('Journals');
      let journals: IJournalDataResponse[] = existingJournals ? JSON.parse(existingJournals) : [];
      journals = journals.filter(journal => journal.id !== id);
      await AsyncStorage.setItem('Journals', JSON.stringify(journals));
      fetchAllJournals();
    }
    catch (err) {
      console.log('Error deleting journal entry: ', err);
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <ThemedSafeAreaView style={styles.safeArea} darkColor='#000000ff'>
      <ThemedView style={styles.headerContainer} backgroundVisible={false}>
        <ThemedText style={styles.headerTitle}>{t('journal_list.title')}</ThemedText>
      </ThemedView>
      {displayedJournals.length > 0 ? (
        <FlatList
          data={displayedJournals}
          renderItem={({ item }) => <JournalEntry
            id={item.id}
            createAt={item.createAt}
            content={item.content}
            mood={item.mood}
            onDelete={() => deleteJournalEntry(item.id)}

          />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={onRefresh}
              colors={['#0059ffff']}
            />
          }
          onEndReached={loadMoreJournals}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.entriesList}
        />
      ) :
        (
          <ThemedText style={{ textAlign: 'center'}}>{t('journal_list.no_entries')}</ThemedText>
        )
      }
      <TouchableOpacity style={styles.fab} onPress={() => { router.push('/(screen)/journal_create') }}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 10
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
