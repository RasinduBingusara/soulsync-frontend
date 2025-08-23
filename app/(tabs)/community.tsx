import Post from '@/components/Post'
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Button, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore'
import { getAuth } from "@react-native-firebase/auth"
import { FontAwesome } from '@expo/vector-icons';
import { PostProps } from '@/components/custom-interface/CustomProps';


function community() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const userEmail = getAuth().currentUser?.email;

  const getPostsByEmail = async () => {
    setLoading(true);
    const newPosts: PostProps[] = [];
    try {

      const q = query(collection(db, "Posts"), where("email", "==", 'rasindubingusara1@gmail.com'));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No posts found for this email.");
        return;
      }

      querySnapshot.forEach((doc: any) => {
        const postData = { id: doc.id, ...doc.data() } as PostProps;
        newPosts.push(postData);
        console.log(`Post ID: ${doc.id}`, "Data: ", doc.data());
      });

    } catch (error) {
      console.error("Error getting documents: ", error);
    }
    finally {
      setPosts(newPosts);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setLoading(true);
    try {
      getPostsByEmail();
    } catch (error) {
      console.error("Failed to fetch new entries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPostsByEmail();
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Community Posts</Text>
      </View>

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
          <Text style={styles.noEntry}>No journals yet</Text>
        )
      }
      <TouchableOpacity style={styles.fab} onPress={() => { router.push('/(screen)/post_create') }}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
    color: '#374151',
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
