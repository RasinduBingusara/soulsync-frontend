import { BlockedView } from '@/components/BlockView'
import { Separator } from '@/components/Seperator'
import { ThemedText } from '@/components/ThemedText'
import { ThemedTouchableOpacity } from '@/components/ThemedTouchableOpacity'
import { ThemedView } from '@/components/ThemedView'
import { useState } from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
    { id: 1, title: 'Meditation'},
    { id: 2, title: 'Journal'},
    { id: 3, title: 'Mood Tracker'},
    { id: 4, title: 'Sleep Tracker'}
  ]
  return (
    <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
      <ScrollView>

        <View style={{ padding: 5, alignItems: 'center', gap: 10 }}>
          <ThemedText type='title'>SoulSync</ThemedText>
          <ThemedText type='subtitle'>Welcome, {userName}!</ThemedText>
        </View>

        <View style={{ padding: 5, gap: 10, marginLeft: 20, marginRight: 20 }}>
          <ThemedText type='subtitle'>Today's Focus</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
            <ThemedView>
              {todayActivities.map((activity) => (
                <ThemedTouchableOpacity key={activity.id}>
                  <ThemedText type='default'>{activity.title}</ThemedText>
                  <ThemedText type='default'>{activity.time}</ThemedText>
                </ThemedTouchableOpacity>
              ))}
            </ThemedView>
          </ScrollView>
        </View>

        <View style={{ padding: 5, gap: 10, marginLeft: 20, marginRight: 20 }}>
          <ThemedText type='subtitle'>Quick Tools</ThemedText>

          <BlockedView margin={10} flexDirection='row' gap={10}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 10 }}>
              {quickTools.map((tool) => (
                <ThemedTouchableOpacity width={150} key={tool.id}>
                  <ThemedText type='default'>{tool.title}</ThemedText>
                </ThemedTouchableOpacity>
              ))}
            </ScrollView>

          </BlockedView>
        </View>
        
        <View style={{ padding: 5, gap: 10, marginLeft: 20, marginRight: 20 }}>
          <ThemedText type='subtitle'>Your Progress</ThemedText>

          {/* Placeholder for progress charts */}
          <BlockedView height={200} margin={10} flexDirection='column' gap={10} alignCenter='False'>
          </BlockedView>
        </View>


        {/* <BlockedView margin={10} flexDirection='column' gap={10} alignCenter='False'>
          <ThemedText type='title'>Mindful Moments</ThemedText>
          <Separator/>

          <ThemedText type="subtitle">Daily Check-in</ThemedText>
          <ThemedText type='default'>How are you feeling right now?</ThemedText>

          <ThemedView>
            {emotions.map((emotion) => (
              <ThemedTouchableOpacity key={emotion.id} width={100}>
                <ThemedText type='default'>{emotion.emoji}</ThemedText>
                <ThemedText type='default'>{emotion.emotion}</ThemedText>
              </ThemedTouchableOpacity>
            ))}
          </ThemedView>

          <ThemedText type="subtitle">Journal Your Thoughts</ThemedText>
          <ThemedText type='default'>Write about your day and get a supportive reflection.</ThemedText>

          <TextInput
            style={{ height: 80, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 10,textAlignVertical: 'top' }}
            placeholder="Type your thoughts here..."
            multiline/>

        </BlockedView> */}








        {/* <View style={styles.greetingSection}>
          <ThemedText type='title'>Hi!</ThemedText>
          <ThemedText type='subtitle'>{userName}</ThemedText>
        </View>

        <BlockedView margin={10}>
          <ThemedText style={styles.summaryHeader}>{emotionSummary}</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.emotionSelector}
          >
            {emotions.map((emotion) => (
              <View key={emotion.id}>
                <TouchableOpacity style={styles.emotionBlock}>
                  <ThemedText>{emotion.emoji}</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </BlockedView>

        <BlockedView margin={10} alignCenter='False'>
          <ThemedText type='subtitle'>Quick Actions</ThemedText>
          
          
        </BlockedView> */}

        {/* <BlockedView margin={10} alignCenter='False'>
          <ThemedText type='subtitle'>Quick Actions</ThemedText>
          
          <BlockedView margin={10} flexDirection='row' gap={10} >
            <BlockedView width={"80%"} shadow='False'>
              <ThemedText type='subtitle'>Add New Tasks</ThemedText>
            </BlockedView>
            <BlockTouchableOpacity width={"20%"} icon={require('@/assets/icons/add.png')} />
          </BlockedView>

          <BlockedView margin={10} flexDirection='row' gap={10} >
            <BlockedView width={"80%"} shadow='False'>
              <ThemedText type='subtitle'>Journal a Memory</ThemedText>
            </BlockedView>
            <BlockTouchableOpacity width={"20%"} icon={require('@/assets/icons/add.png')} />
          </BlockedView>
        </BlockedView> */}


      </ScrollView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  greetingSection: {
    paddingLeft: 20,
  },
  summaryHeader: {
    textAlign: 'center',
  },
  emotionSelector: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  emotionBlock: {
    justifyContent: 'center',
    width: 40,
    height: 40,
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  }
})

export default HomeScreen
