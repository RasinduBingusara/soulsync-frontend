import Post from '@/components/Post'
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { collection, getDocs, getFirestore, query, where,orderBy,doc,limit,startAfter } from '@react-native-firebase/firestore'
import { getAuth } from "@react-native-firebase/auth"
import { FontAwesome } from '@expo/vector-icons';
import { PostProps } from '@/components/custom-interface/CustomProps';

import { useTranslation } from 'react-i18next';
import '@/components/translation/i18n';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedView } from '@/components/ThemedView';

function community() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const db = getFirestore();
  const userEmail = getAuth().currentUser?.email;

  const fetchInitialPosts = async () => {
        setLoading(true);
        try {
            // Create a query to get posts ordered by comment count (min to max), limited to 10
            const q = query(collection(db, "Posts"), orderBy("commentsCount", "asc"), limit(10));
            const querySnapshot = await getDocs(q);

            const fetchedPosts: PostProps[] = [];
            querySnapshot.forEach((doc:any) => {
                fetchedPosts.push({ id: doc.id, ...doc.data() });
            });
            setPosts(fetchedPosts);

            // Store the last document snapshot for the next query
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastDoc);

            // Check if there are more documents to fetch
            setHasMore(querySnapshot.docs.length === 10);
            
        } catch (error) {
            console.error("Error fetching initial posts:", error);
        }
        setLoading(false);
    };

    const fetchMorePosts = async () => {
        if (!db || !lastVisible || !hasMore) return;
        setLoading(true);
        try {
            // Create a new query that starts after the last visible document
            const q = query(
                collection(db, "Posts"),
                orderBy("comments", "asc"),
                startAfter(lastVisible),
                limit(10)
            );
            const querySnapshot = await getDocs(q);

            const newPosts: PostProps[] = [];
            querySnapshot.forEach((doc:any) => {
                newPosts.push({ id: doc.id, ...doc.data() });
            });
            
            // Append the new posts to the existing list
            setPosts(prevPosts => [...prevPosts, ...newPosts]);

            // Update the last visible document for the next pagination request
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastDoc || null);

            // Update the 'hasMore' state
            setHasMore(querySnapshot.docs.length === 10);

        } catch (error) {
            console.error("Error fetching more posts:", error);
        }
        setLoading(false);
    };

  const onRefresh = useCallback(async () => {
    setLoading(true);
    try {
      fetchInitialPosts();
    } catch (error) {
      console.error("Failed to fetch new entries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialPosts();
  }, [db])

  return (
    <ThemedSafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>{t('community_list.title')}</ThemedText>
      </ThemedView>

      {posts[0] ? (
        <FlatList
          data={posts}
          renderItem={({ item }: { item: PostProps }) => (
            <Post
              key={item.id}
              id={item.id}
              content={item.content}
              uid={item.uid}
              email={item.email}
              mood={item.mood}
              isAnonymouse={item.isAnonymouse}
              profileName={item.profileName}
              onClose={() => { console.log('close comment') }}
            />
          )}
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
          <ThemedText style={{ textAlign: 'center'}}>{t('community_list.no_entries')}</ThemedText>
        )
      }
      <TouchableOpacity style={styles.fab} onPress={() => { router.push('/(screen)/post_create') }}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </ThemedSafeAreaView>
  )
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
    justifyContent:'space-between'
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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

export default community
