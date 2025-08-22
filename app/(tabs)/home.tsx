import { BlockedView } from '@/components/BlockView'
import { Separator } from '@/components/Seperator'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity'
import { ThemedView } from '@/components/ThemedView'
import { useState } from 'react'
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from "@react-native-firebase/auth"
import { router } from 'expo-router'

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
  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
      <View style={{ gap: 10 }}>
        <Button title='Sign Out' onPress={() => auth().signOut()} color={'#ff0000ff'} />
        <Button title='Clear data' onPress={clearAllData} />
        <Button title='Chat bot' onPress={() => {router.push('/(screen)/chat_bot')}} />
      </View>
      <ScrollView style={styles.scrollView}>

        <View style={styles.featureGrid}>
          <FeatureBlock title="Emotion Recognition ✅" />
          <FeatureBlock title="Recommendations" />
          <FeatureBlock title="Daily Tracker" />
          <FeatureBlock title="Journal Keeper" />
          <FeatureBlock title="Multilingual Chatbot" />
          <FeatureBlock title="Analysis Dashboard" />
          <FeatureBlock title="Learning Zone" />
          <FeatureBlock title="Supportive Community" />
        </View>


      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    height:'100%'
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
  }
})

export default HomeScreen
