import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, addDoc, getFirestore } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';

interface checkBoxInter {
  isChecked: boolean;
  onToggle: () => void;
  label: string;
}

const Checkbox = ({ isChecked, onToggle, label }: checkBoxInter) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymouse, setIsAnonymouse] = useState(false);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const user = getAuth().currentUser;

  const createPost = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      
      const docRef = await addDoc(collection(db, 'Posts'), {
        uid: user.uid,
        email: user.email,
        content: content,
        title: title,
        isAnonymouse: isAnonymouse,
        profileName: user.displayName,
        likesCount: 0, // Initialize likes count
        commentsCount: 0 // Initialize comments count
      });
      console.log('Post created with ID: ', docRef.id);
      setTitle('');
      setContent('');
    } catch (err) {
      console.log('Error creating post: ', err);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
      router.push('/(tabs)/community');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create a New Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Post Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
      />
      <Checkbox
        isChecked={isAnonymouse}
        onToggle={() => { setIsAnonymouse(!isAnonymouse) }}
        label='Anonymouse'
      />
      {
        loading ? (
          <ActivityIndicator size={'small'} style={{ margin: 28 }} />
        ) : (
          <Button
            title="Create Post"
            onPress={createPost}
            color="#007AFF"
          />
        )
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (Your existing styles)
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  contentInput: {
    minHeight: 150,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
  },
});

export default CreatePost;