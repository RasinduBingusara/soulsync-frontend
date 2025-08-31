import { PredictMood } from '@/components/custom-function/MoodPredictor';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import '@/components/translation/i18n';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth } from '@react-native-firebase/auth';
import { addDoc, collection, getFirestore } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

interface checkBoxInter {
  isChecked: boolean;
  onToggle: () => void;
  label: string;
}

const Checkbox = ({ isChecked, onToggle, label }: checkBoxInter) => {
  return (
    <TouchableOpacity onPress={onToggle} style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
      <ThemedView style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
        {isChecked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
      </ThemedView>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const CreatePost = () => {
  const {t} = useTranslation();
  const [content, setContent] = useState('');
  const [isAnonymouse, setIsAnonymouse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMoodPredicting, setIsMoodPredicting] = useState(false);

  const db = getFirestore();
  const user = getAuth().currentUser;

  const createPost = async () => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not authenticated.");
      }
      setIsMoodPredicting(true);
      const mood = await PredictMood(content);
      setIsMoodPredicting(false);
      if (!mood) {
        setLoading(false);
        return;
      }

      const docRef = await addDoc(collection(db, 'Posts'), {
        uid: user.uid,
        email: user.email,
        content: content,
        mood: mood,
        createdAt: new Date(),
        isAnonymouse: isAnonymouse,
        profileName: user.displayName,
        likesCount: 0,
        commentsCount: 0 
      });
      console.log('Post created with ID: ', docRef.id);
      setContent('');
      router.push('/(tabs)/community');
    } catch (err) {
      console.log('Error creating post: ', err);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedSafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('..')}>
            <FontAwesome name="arrow-left" size={24} color="#6b7280" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('post.create_post_title')}</ThemedText>
        </ThemedView>
        <ThemedInput
          style={[styles.input, styles.contentInput]}
          placeholder={t('post.placeholder')}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        <Checkbox
          isChecked={isAnonymouse}
          onToggle={() => { setIsAnonymouse(!isAnonymouse) }}
          label={t('post.anonymous')}
        />
        {
          isMoodPredicting && (
            <ThemedView style={{ marginVertical: 10 }}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={{ textAlign: 'center', color: '#6b7280', marginTop: 5 }}>Predicting Mood...</ThemedText>
            </ThemedView>
          )
        }
        {
          loading ? (
            <ActivityIndicator size={'small'} style={{ margin: 28 }} />
          ) : (
            <Button
              title={t('post.create_post')}
              onPress={createPost}
              color="#007AFF"
            />
          )
        }
      </ScrollView>
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal:10
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 16,
    color: '#374151',
  },
  input: {
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
    borderColor: '#8b8b8bff',
    borderRadius: 5,
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