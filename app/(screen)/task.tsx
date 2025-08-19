import { ThemedText } from '@/components/ThemedText'
import { useState } from 'react'
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Button } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


function task() {

  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [category, setCategory] = useState('');
  const [suggestion, setSuggestion] = useState('AI suggestion here');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dropDownList = [
    { label: 'Work', value: '1' },
    { label: 'Personal', value: '2' },
    { label: 'Urgent', value: '3' },
    { label: 'Later', value: '4' },
  ];

  const saveTask = async () => {
    try {
      const task = {
        id: Date.now(),
        title: title,
        description: description,
        date: date.toLocaleDateString(),
        time: time.toLocaleTimeString(),
        category: dropDownList.find(item => item.value === category)?.label || 'Uncategorized',
        suggestion: suggestion
      };

      const existingTasks = await AsyncStorage.getItem('tasks');
      const taskArray = existingTasks ? JSON.parse(existingTasks) : [];

      taskArray.push(task);
      await AsyncStorage.setItem('tasks', JSON.stringify(taskArray));

      console.log('Task:', task);
      router.push('/(tabs)/task-list')
    }
    catch (error) {
      console.error('Error saving task:', error);
    }
  }

  const getAISuggestion = async () => {
    try{
      const response = await fetch('http://192.168.8.100:8000/suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('AI Suggestion:', data.response);
      setSuggestion(data.response);
    }
    catch (error) {
      console.error('Error fetching AI suggestion:', error);
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text>title:</Text>
        <TextInput value={title} onChangeText={(value) => setTitle(value)} placeholder='text' style={styles.input} />
      </View>

      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text>Description:</Text>
        <TextInput value={description} onChangeText={(value) => setDescription(value)} multiline={true} placeholder='text' style={styles.input} />
      </View>

      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text>date/time:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text>Time</Text>
        </TouchableOpacity>
        {
          showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={(event, date) => {
                if (date) {
                  setDate(date);
                }
                setShowDatePicker(false);
              }} />
          )
        }
        {
          showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={time}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, time) => {
                if (time) {
                  console.log('Selected time:', time.toLocaleTimeString());
                  setTime(time);
                }
                setShowTimePicker(false);
              }} />
          )
        }
      </View>

      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text>Category:</Text>
        <Dropdown
          style={styles.input}
          data={dropDownList}
          labelField="label"
          valueField="value"
          placeholder="Select an option"
          value={category}
          onChange={(value) => setCategory(value.value)} />
      </View>

      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text>{suggestion}</Text>
        <Button title='Get AI Suggestion' onPress={getAISuggestion} />
      </View>

      <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Button title='Save' onPress={saveTask} />
        <Button title='Cancel' onPress={() => navigation.goBack()} />
      </View>

    </View>

  )
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
})

export default task
