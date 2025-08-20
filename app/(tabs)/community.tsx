import Post from '@/components/Post'
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { useEffect, useState } from 'react'
import { ActivityIndicator, Button, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore'
import { getAuth } from "@react-native-firebase/auth"

interface PostProps {
  id: string,
  title: string,
  content: string,
  uid: string,
  email: string,
  isAnonymouse: boolean,
  profileName: string
}

function community() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const userEmail = getAuth().currentUser?.email;

  const getPostsByEmail = async () => {
    setLoading(true);
    const newPosts: PostProps[] = [];
    try {

      const q = query(collection(db, "Posts"), where("email", "==", userEmail));

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

  useEffect(() => {
    getPostsByEmail();
  }, [])

  return (
    <SafeAreaView>
      <View style={{gap:10}}>
        <Button title='Create +' onPress={() => router.push('/(screen)/post_create')} />
          <Button title='Refresh' onPress={getPostsByEmail} color={'#00ca25ff'}/>
      </View>

      <ScrollView>
        {
          loading ? (
            <ActivityIndicator size={'large'} style={{ margin: 28 }} />
          ) :
            (
              <View style={{ padding: 20 }}>
                {
                  posts.map((post, index) => (
                    <Post
                      key={index}
                      id={post.id}
                      title={post.title}
                      content={post.content}
                      uid={post.uid}
                      email={post.email}
                      isAnonymouse={post.isAnonymouse}
                      profileName={post.profileName}
                      profileImage=''
                    />
                  ))
                }

              </View>
            )
        }
      </ScrollView>


    </SafeAreaView>
  )
}

export default community
