import { saveLanguagePreference } from '@/components/custom-function/LanguagePreference';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function LanguageSelectionScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const auth = getAuth();

  const handleSelectLanguage = async () => {

    try {
      const user = auth.currentUser;
      const uid = user?.uid || '';
      await saveLanguagePreference(uid, selectedLanguage);
    }
    catch (e) {
      console.error("Error saving language preference:", e);
    }
    finally {
      router.push('/(tabs)/home');
    }
  };

  return (
    <ThemedView style={styles.container} darkColor='#000000ff'>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Choose Your Language</ThemedText>
          <ThemedText style={styles.subtitle}>
            Please select your preferred language. This choice cannot be changed later.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.languageOptions}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedLanguage === 'en' && styles.selectedOption,
            ]}
            onPress={() => setSelectedLanguage('en')}>
            <Text style={styles.optionText}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedLanguage === 'si' && styles.selectedOption,
            ]}
            onPress={() => setSelectedLanguage('si')}>
            <Text style={styles.optionText}>සිංහල (Sinhala)</Text>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity style={styles.button} onPress={handleSelectLanguage}>
          <Text style={styles.buttonText}>Confirm Selection</Text>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
    padding: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  languageOptions: {
    marginBottom: 24,
  },
  option: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#eef2ff',
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  button: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
