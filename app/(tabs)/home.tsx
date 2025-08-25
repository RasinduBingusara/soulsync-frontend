import { BlockedView } from '@/components/BlockView'
import { Separator } from '@/components/Seperator'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity'
import { ThemedView } from '@/components/ThemedView'
import { useEffect, useState } from 'react'
import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router'
import { CustomTextInput } from '@/components/custom-components/CustomText'
import { CustomButton } from '@/components/custom-components/CustomButton'
import { PredictMood } from '@/components/custom-function/MoodPredictor'

interface IfeatureBlock {
  title: string
}

const FeatureBlock = ({ title }: IfeatureBlock) => (
  <TouchableOpacity style={styles.featureBlock}>
    <Text style={styles.blockTitle}>{title}</Text>
  </TouchableOpacity>
);

function HomeScreen() {

  const [userName, setUserName] = useState('Beebyte')
  const [emotionSummary, setEmotionSummary] = useState('How you feeling today! 😊')
  const [isPopUpVisible, setIsPopUpVisible] = useState(false)
  const [aboutToday, setAboutToday] = useState('')
  const todayActivities = [
    { id: 1, title: 'Morning Meditation', time: '08:00 AM' },
    { id: 2, title: 'Yoga Session', time: '09:00 AM' },
    { id: 3, title: 'Healthy Breakfast', time: '09:30 AM' },
    { id: 4, title: 'Work on Project', time: '10:00 AM' },
    { id: 5, title: 'Lunch Break', time: '12:00 PM' },
    { id: 6, title: 'Afternoon Walk', time: '01:00 PM' },
    { id: 7, title: 'Read a Book', time: '02:00 PM' },
    { id: 8, title: 'Evening Reflection', time: '06:00 PM' }
  ]

  const quickTools = [
    { id: 1, title: 'Meditation' },
    { id: 2, title: 'Journal' },
    { id: 3, title: 'Mood Tracker' },
    { id: 4, title: 'Sleep Tracker' }
  ]

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Async Storage data cleared successfully!');
    } catch (e) {
      console.error('Failed to clear Async Storage:', e);
    }
  };

  const handleSignOut = async () => {
    try {

      await GoogleSignin.signOut();

      await auth().signOut();

      console.log('User signed out successfully from both Firebase and Google.');

    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const getTodayMood = async () => {
    try {
      const mood = await PredictMood(aboutToday);
      if (mood) {
        setEmotionSummary(`You seem to be feeling ${mood} today!`);
        console.log(`Predicted mood: ${mood}`);
      } else {
        setEmotionSummary("Couldn't predict your mood. Please try again.");
      }
    } catch (error) {
      console.error('Error predicting mood:', error);
      setEmotionSummary("Error predicting mood. Please try again.");
    }
  };

  useEffect(() => {
    setIsPopUpVisible(true);
  }, [])

  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
      <View style={{ gap: 10 }}>
        <Button title='Sign Out' onPress={() => handleSignOut()} color={'#ff0000ff'} />
        <Button title='Clear data' onPress={clearAllData} />
        <Button title='Chat bot' onPress={() => { router.push('/(screen)/chat_bot') }} />
        <Button title='Dashboard' onPress={() => { router.push('/(screen)/dashboard') }} />
      </View>
      <ScrollView style={styles.scrollView}>

        <View style={styles.featureGrid}>
          <FeatureBlock title="Emotion Recognition ✅" />
          <FeatureBlock title="Recommendations" />
          <FeatureBlock title="Daily Tracker ✅" />
          <FeatureBlock title="Journal Keeper ✅" />
          <FeatureBlock title="Multilingual Chatbot ✅" />
          <FeatureBlock title="Analysis Dashboard ✅" />
          <FeatureBlock title="Learning Zone" />
          <FeatureBlock title="Supportive Community ✅" />
        </View>


      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isPopUpVisible}
        onRequestClose={() => setIsPopUpVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsPopUpVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsPopUpVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalHeader}>How about your day?</Text>
            <ScrollView style={styles.messageScrollView}>
              <CustomTextInput
                type='area'
                label="Tell us about your day"
                placeholder="Enter your message here..."
                value={aboutToday}
                setValue={(value) => setAboutToday(value)}
              />
              <CustomButton
                text='Submit'
                pressable={aboutToday.length>0?true:false}
                fontSize={16}
                onPress={() => {
                  console.log(aboutToday)
                  setEmotionSummary(aboutToday)
                  setIsPopUpVisible(false)
                }}
              />
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: '100%'
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  featureBlock: {
    backgroundColor: '#5724ff',
    width: '48%', // Approx. 2 columns with a small gap
    height: 120,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blockTitle: {
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  block: {
    width: '50%',
    height: 50,
    backgroundColor: '#5724ffff'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 480,
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#9ca3af',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  messageScrollView: {
    maxHeight: 400,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
})

export default HomeScreen
