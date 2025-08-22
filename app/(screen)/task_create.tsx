import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Used for icons
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DatePicker from 'react-native-date-picker';
import { getAuth } from "@react-native-firebase/auth";
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, where, doc } from '@react-native-firebase/firestore';
import { TPriority } from '@/components/custom-interface/type';

interface ICheckBox {
  text: string,
  completed: boolean
}


export default function TaskCreate() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState('');

  const [dateTime, setDateTime] = useState(new Date());
  const [datetimeOpen, setdatetimeOpen] = useState(false);

  const [priority, setPriority] = useState<TPriority>('medium');
  const [subTaskText, setSubTaskText] = useState('');
  const [checklist, setCheklist] = useState<ICheckBox[]>([]);
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const user = getAuth().currentUser;


  const addSubTask = () => {
    if (subTaskText.trim() !== '') {
      setCheklist([...checklist, { text: subTaskText, completed: false }]);
      setSubTaskText('');
    }
  };

  const removeSubTask = (indexToRemove: number) => {
    const newChecklist = checklist.filter((_, index) => index !== indexToRemove);
    setCheklist(newChecklist);
  }

  const toggleSubTask = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setCheklist(newChecklist);
  };



  const createTask = async (checklist: ICheckBox[]) => {

    if (!taskTitle) {
      Alert.alert('No Title');
      return;
    }
    else if (!taskContent)
      setLoading(true);

    const subtasksMap: { [key: string]: ICheckBox } = {};
    checklist.forEach((item) => {
      const newSubtaskKey = doc(collection(db, 'temp')).id;

      subtasksMap[newSubtaskKey] = {
        completed: item.completed,
        text: item.text,
      };
    });


    try {
      const docRef = await addDoc(collection(db, 'Tasks'), {
        content: taskContent,
        priority: priority,
        subtasks: subtasksMap,
        title: taskTitle,
        dateTime:dateTime.toISOString(),
        uid:user?.uid
      });
      console.log("Document added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    finally {
      setTaskTitle('');
      setTaskContent('');
      setLoading(false);
      router.push('/(tabs)/task-list')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>

        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('..')}>
            <FontAwesome name="arrow-left" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Task</Text>
        </View>

        <View style={styles.formSection}>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Task Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Finish Project Report"
              placeholderTextColor="#9ca3af"
              onChangeText={setTaskTitle}
              value={taskTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Add more details about your task..."
              placeholderTextColor="#9ca3af"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={setTaskContent}
              value={taskContent}
            />
          </View>

          {/* Sub tasks */}
          <View style={styles.checklistSection}>
            <Text style={styles.checklistTitle}>Sub-tasks / Checklist</Text>
            <View style={styles.checklistContainer}>

              {checklist.map((item, index) => (
                <View key={index} style={styles.checklistItem}>
                  <View style={styles.checkitem}>
                    <TouchableOpacity style={styles.checkbox} onPress={() => { toggleSubTask(index) }}>
                      {item.completed && (<FontAwesome name="check" size={10} color="green" />)}
                    </TouchableOpacity>
                    <Text style={[styles.checklistText, item.completed && ({ textDecorationLine: 'line-through' })]}>{item.text}</Text>
                  </View>
                  <TouchableOpacity style={[styles.addButton, { backgroundColor: '#e54646ff', width: 30, height: 30 }]} onPress={() => removeSubTask(index)}>
                    <FontAwesome name="minus" size={10} color="white" />
                  </TouchableOpacity>
                </View>
              ))}

            </View>
            <View style={styles.addChecklistContainer}>
              <TextInput
                style={styles.subTaskInput}
                placeholder="Add a sub-task"
                placeholderTextColor="#9ca3af"
                onChangeText={setSubTaskText}
                value={subTaskText}
              />
              <TouchableOpacity style={[styles.addButton, { backgroundColor: '#4b46e5ff' }]} onPress={addSubTask}>
                <FontAwesome name="plus" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.relativeInput}>
              <Text style={styles.inputLabel}>Due Date</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                value={dateTime.toLocaleDateString()}
                onPress={() => setdatetimeOpen(true)}
              />
            </View>
            <View style={styles.relativeInput}>
              <Text style={styles.inputLabel}>Due Time</Text>
              <TextInput
                style={styles.textInput}
                placeholder="HH:MM"
                placeholderTextColor="#9ca3af"
                value={dateTime.toLocaleTimeString()}
                onPress={() => setdatetimeOpen(true)}
              />
            </View>
            <View style={styles.priorityList}>
              <Text style={styles.inputLabel}>Priority</Text>
              <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#9e9e9eff' }]} onPress={() => { setPriority('low') }}>
                <Text style={styles.createButtonText}>Low</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#1264deff' }]} onPress={() => { setPriority('medium') }}>
                <Text style={styles.createButtonText}>Medium</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#e54646ff' }]} onPress={() => { setPriority('high') }}>
                <Text style={styles.createButtonText}>High</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={() => createTask(checklist)}>
            <Text style={styles.createButtonText}>Create Task</Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          modal
          open={datetimeOpen}
          date={dateTime}
          onConfirm={(date) => {
            setdatetimeOpen(false)
            setDateTime(date)
          }}
          onCancel={() => {
            setdatetimeOpen(false)
          }}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  formSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    color: '#6b7280',
    position: 'absolute',
    top: -8,
    left: 12,
    backgroundColor: 'white',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  textInput: {
    height: 48,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1f2937',
  },
  textArea: {
    height: 120,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  checklistSection: {
    marginBottom: 24,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  checklistContainer: {
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 50
  },
  checkitem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checklistText: {
    fontSize: 14,
    color: '#374151',
  },
  addChecklistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subTaskInput: {
    flex: 1,
    height: 48,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1f2937',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  relativeInput: {
    flex: 1,
    minWidth: '45%',

  },
  priorityList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
  },
  priorityButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 20
  },
  createButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
