import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection, addDoc, getFirestore } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PredictMood } from '@/components/custom-function/MoodPredictor';
import { useTranslation } from 'react-i18next';
import '@/components/translation/i18n';

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('..')}>
            <FontAwesome name="arrow-left" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('post.create_post_title')}</Text>
        </View>
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder={t('post.placeholder')}
          value={content}
          onChangeText={setContent}
          placeholderTextColor="#6b7280"
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
            <View style={{ marginVertical: 10 }}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 5 }}>Predicting Mood...</Text>
            </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal:10
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
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