import { BlockedView } from '@/components/BlockView'
import { Separator } from '@/components/Seperator'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity'
import { ThemedView } from '@/components/ThemedView'
import { useEffect, useState } from 'react'
import { Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { getAuth } from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router'
import { CustomTextInput } from '@/components/custom-components/CustomText'
import { CustomButton } from '@/components/custom-components/CustomButton'
import { PredictMood } from '@/components/custom-function/MoodPredictor'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { FontAwesome } from '@expo/vector-icons'
import { saveDailyMood } from '@/components/custom-function/FireBaseFunctions'
import { ActionSuggest } from '@/components/custom-function/SuggestionProvider'
import { useTranslation } from 'react-i18next';
import '@/components/translation/i18n';

interface IfeatureBlock {
  title: string
}

interface IInteractiveBlock {
  title: string,
  iconName: any,
  subtitle?: string,
  isMain?: boolean,
  suggestion?: string,
  onPress?: () => void
}

const InteractiveBlock = ({ title, iconName, subtitle, isMain = false, onPress, suggestion }: IInteractiveBlock) => {
  return (
    <TouchableOpacity style={isMain ? styles.mainBlock : styles.interactiveBlock} onPress={onPress}>
      {isMain ? (
        <View style={styles.mainBlockContent}>
          <View>
            <FontAwesome name={iconName} size={24} color="white" />
            <Text style={styles.mainBlockTitle}>{title}</Text>
            <Text style={styles.mainBlockSubtitle}>{subtitle}</Text>
            {suggestion !== '' && (
                <Text style={{ color: 'white', fontSize: 12 }}>AI Suggestion: {suggestion}</Text>
            )}

          </View>
        </View>
      ) : (
        <View style={styles.interactiveBlockContent}>
          <FontAwesome name={iconName} size={32} color="#4f46e5" />
          <Text style={styles.interactiveBlockTitle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

function HomeScreen() {
  const { t } = useTranslation();

  const [userName, setUserName] = useState('Beebyte')
  const [emotionSummary, setEmotionSummary] = useState(t('home.how_are_you'))
  const [suggestedAction, setSuggestedAction] = useState('')
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [aboutToday, setAboutToday] = useState('')
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Async Storage data cleared successfully!');
    } catch (e) {
      console.error('Failed to clear Async Storage:', e);
    }
  };

  const getTodayMood = async () => {
    setLoading(true);
    try {
      console.log('Predicting mood for input:', aboutToday);
      const mood = await PredictMood(aboutToday);
      if (mood) {
        setEmotionSummary(`You seem to be feeling ${mood} today!`);
        console.log(`Predicted mood: ${mood}`);
        const action = await ActionSuggest(aboutToday);
        setSuggestedAction(action || '');

        const today = new Date().toISOString().slice(0, 10);
        const uid = auth.currentUser?.uid || '';
        const newEntry = { uid, mood, aboutToday, date: today };

        try {
          const stored = await AsyncStorage.getItem('DailyMoods');
          let moods = stored ? JSON.parse(stored) : [];
          const index = moods.findIndex((item: any) => item.date === today && item.uid === uid);

          if (index !== -1) {
            moods[index] = newEntry;
          } else {
            moods.push(newEntry);
          }

          await AsyncStorage.setItem('DailyMoods', JSON.stringify(moods));
        } catch (e) {
          console.error('Failed to save daily mood:', e);
        }
      } else {
        setEmotionSummary("Couldn't predict your mood. Please try again.");
        console.log('No mood predicted.');
      }
    } catch (error) {
      console.error('Error predicting mood:', error);
      setEmotionSummary("Error predicting mood. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   setIsPopUpVisible(true);
  // }, [])
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const nameParts = (currentUser.displayName || '').split(' ');
      setUserName(nameParts[0] || 'User');
    } else {
      router.push('/')
    }
  }, [auth]);

  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{t('home.greeting', { name: userName })}</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => { router.push('/(screen)/profile') }}>
              <FontAwesome name="user-circle" size={28} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => { router.push('/(screen)/settings') }}>
              <FontAwesome name="cog" size={28} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* Daily Check-in */}
          <InteractiveBlock
            title={t('home.checkin_today')}
            subtitle={emotionSummary}
            iconName="edit"
            isMain={true}
            onPress={() => setIsPopUpVisible(true)}
            suggestion={suggestedAction}
          />

          {/* Grid for other features */}
          <View style={styles.gridContainer}>
            <InteractiveBlock title={t('home.chatbot')} iconName="comments" onPress={() => { router.push('/(screen)/chat_bot') }} />
            <InteractiveBlock title={t('home.dashboard')} iconName="pie-chart" onPress={() => { router.push('/(screen)/dashboard') }} />
            <InteractiveBlock title={t('home.journal')} iconName="book" onPress={() => { router.push('/(screen)/journal_create') }} />
            <InteractiveBlock title={t('home.tasks')} iconName="tasks" onPress={() => { router.push('/(screen)/task_create') }} />
            <InteractiveBlock title={t('home.community')} iconName="commenting" onPress={() => { router.push('/(screen)/post_create') }} />
            <InteractiveBlock title={t('home.learning_zone')} iconName="graduation-cap" />
          </View>
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

            <Text style={styles.modalHeader}>{t('home.how_about_your_day')}</Text>
            <ScrollView style={styles.messageScrollView}>
              <CustomTextInput
                type='area'
                label={t('home.tell_us_about_your_day')}
                placeholder={t('home.enter_message_placeholder')}
                value={aboutToday}
                setValue={(value) => setAboutToday(value)}
              />
              <CustomButton
                text={t('home.submit')}
                pressable={aboutToday.length > 0 ? true : false}
                fontSize={16}
                onPress={() => {
                  getTodayMood();
                  setIsPopUpVisible(false);
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  mainCard: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  mainBlock: {
    marginBottom: 24,
  },
  mainBlockContent: {
    backgroundColor: '#4f46e5',
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainBlockTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  mainBlockSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  interactiveBlock: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 24,
    width: '48%', // Approx. 2 columns with a small gap
    alignItems: 'center',
  },
  interactiveBlockContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  interactiveBlockTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#374151',
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
