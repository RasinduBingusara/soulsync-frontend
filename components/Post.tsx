import { getAuth } from '@react-native-firebase/auth';
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, setDoc, runTransaction } from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PostProps } from './custom-interface/CustomProps';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { ThemedInput } from './ThemedInput';
import { ThemedTouchableOpacity } from './ThemedTouchableOpacity';
import { FontAwesome } from '@expo/vector-icons';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: Date;
}

const Post = ({ id, content, mood, uid, email, isAnonymouse, profileName }: PostProps) => {
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const user = getAuth().currentUser;

  // Listen for real-time updates to likes and comments
  useEffect(() => {
    if (!id) return;

    // Likes Listener
    const likesRef = collection(db, `Posts/${id}/likes`);
    const likesUnsubscribe = onSnapshot(likesRef, (querySnapshot) => {
      setLikesCount(querySnapshot.size);
      const userLiked = querySnapshot.docs.some((doc: any) => doc.id === user?.uid);
      setIsLiked(userLiked);
    });

    // Comments Listener
    const commentsCountRef = collection(db, `Posts/${id}/comments`);
    const commentsCountUnsubscribe = onSnapshot(commentsCountRef, (querySnapshot) => {
      setCommentsCount(querySnapshot.size);
    });

    const commentsRef = collection(db, 'Posts', id, 'comments');
    const commentsUnsubscribe = onSnapshot(commentsRef, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(), // Convert Firestore Timestamp to Date object
      })) as Comment[];

      // Sort comments by timestamp
      fetchedComments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setComments(fetchedComments);
    }, (error) => {
      console.error("Error fetching comments: ", error);
    });

    // Clean up listeners on unmount
    return () => {
      likesUnsubscribe();
      commentsUnsubscribe();
      commentsCountUnsubscribe();
    };
  }, [id, db, user]);

  const handleLike = async () => {
    if (!user || !id) return;
    const likeRef = doc(db, `Posts/${id}/likes`, user.uid);

    try {
      if (isLiked) {
        // Unlike the post
        await deleteDoc(likeRef);
      } else {
        // Like the post
        await setDoc(likeRef, {
          userId: user.uid,
          timestamp: new Date(),
        });
      }
    } catch (err) {
      console.error('Error handling like:', err);
    }
  };

  const handleComment = async () => {
    if (!user || !id || !commentText.trim()) return;

    setLoading(true);
    const postRef = doc(db, "Posts", id);
    try {
      await runTransaction(db, async (transaction) => {
        // Get the current state of the post
        const postDoc: any = await transaction.get(postRef);
        if (!postDoc.exists()) {
          return;
        }

        // Read the current comment count
        const currentCount = postDoc.data().commentCount || 0;

        await addDoc(collection(db, 'Posts', id, 'comments'), {
          userId: user.uid,
          userName: user.displayName,
          comment: commentText.trim(),
          timestamp: new Date(),
        });
        transaction.update(postRef, { commentsCount: currentCount + 1 });
      });
      setCommentText(''); // Clear the input field
      console.log('Comment added successfully!');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
    finally {
      setLoading(false);
    }
  };

  const renderCommentItem = ({ item }: any) => (
    <ThemedView style={styles.commentItem} darkColor='#3f3f3fff'>
      <ThemedText style={styles.commentUser}>{item.userName || 'Anonymous'}</ThemedText>
      <ThemedText style={styles.commentText}>{item.comment}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container} darkColor='#292929ff'>
      {/* Header Section */}
      <ThemedView style={styles.header} darkColor='#292929ff'>
        <ThemedView style={styles.profileContainer} darkColor='#292929ff'>
          <ThemedText style={styles.profileName}>
            {isAnonymouse ? 'Anonymouse' : profileName}
          </ThemedText>
        </ThemedView>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedText style={styles.description}>{content}</ThemedText>
      <ThemedText style={{ fontStyle: 'italic', color: '#6b7280', marginBottom: 10 }}>Mood: {mood}</ThemedText>

      {/* Action Buttons */}
      <ThemedView style={styles.actionsContainer} darkColor='#292929ff'>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <ThemedText style={[styles.actionText, isLiked && styles.likedActionText]}>
            {isLiked ? '♥ Liked' : '♡ Like'} ({likesCount})
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => { setIsModalVisible(true) }}>
          <ThemedText style={styles.actionText}>
            Comment ({commentsCount})
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => { setIsModalVisible(false) }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <ThemedView style={styles.modalContent}>
            <ThemedView style={styles.modalHeader}>
              <ThemedText style={styles.headerTitle}>Comments</ThemedText>
              <ThemedTouchableOpacity onPress={() => { setIsModalVisible(false) }}>
                <FontAwesome name="close" size={25} color="#990000ff" />
              </ThemedTouchableOpacity>
            </ThemedView>

            <FlatList
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.commentsList}
              inverted
            />

            <ThemedView style={styles.commentInputContainer}>
              <ThemedInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChangeText={setCommentText}
                onSubmitEditing={handleComment}
              />
              {
                loading ? (
                  <ActivityIndicator size={'small'} />
                ) :
                  (
                    <ThemedTouchableOpacity onPress={handleComment} disabled={!commentText.trim()}>
                      <FontAwesome name="send" size={25} color="#005499ff" />
                    </ThemedTouchableOpacity>
                  )
              }

            </ThemedView>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  // ... (Your existing styles)
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: '#555',
  },
  likedActionText: {
    color: '#E0115F',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%', // Adjust height as needed
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    flexGrow: 1,
    padding: 15,
  },
  commentItem: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
});

export default Post;