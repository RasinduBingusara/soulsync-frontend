import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Used for icons
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DatePicker from 'react-native-date-picker';
import { getAuth } from "@react-native-firebase/auth";
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, where, doc } from '@react-native-firebase/firestore';
import { TPriority } from '@/components/custom-interface/type';
import { PredictSuggestion } from '@/components/custom-function/SuggestionProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import '@/components/translation/i18n';
import { ThemedView } from '@/components/ThemedView';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedLabel } from '@/components/ThemedLabel';

interface ICheckBox {
  text: string,
  completed: boolean
}


export default function TaskCreate() {
  const {t} = useTranslation();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskContent, setTaskContent] = useState('');

  const [dateTime, setDateTime] = useState(new Date());
  const [datetimeOpen, setdatetimeOpen] = useState(false);

  const [priority, setPriority] = useState<TPriority>('medium');
  const [subTaskText, setSubTaskText] = useState('');
  const [checklist, setCheklist] = useState<ICheckBox[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

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
      // Generate a random key for each subtask
      const newSubtaskKey = Math.random().toString(36).substring(2, 15);
      subtasksMap[newSubtaskKey] = {
        completed: item.completed,
        text: item.text,
      };
    });

    try {
      setIsPredicting(true);
      const suggestion = await PredictSuggestion(taskTitle, taskContent);
      setIsPredicting(false);

      // Create a new task object
      const newTask = {
        id: Math.random().toString(36).substring(2, 15), 
        uid:user?.uid,
        content: taskContent,
        priority: priority,
        subtasks: subtasksMap,
        title: taskTitle,
        aiSuggestion: suggestion,
        dateTime: dateTime.toISOString(),
        // uid: user?.uid // Remove user id
      };

      // Get existing tasks from AsyncStorage
      const existingTasks = await AsyncStorage.getItem('Tasks');
      let tasksArray = [];
      if (existingTasks) {
        tasksArray = JSON.parse(existingTasks);
      }
      // Add new task
      tasksArray.push(newTask);
      await AsyncStorage.setItem('Tasks', JSON.stringify(tasksArray));

      console.log("Task saved locally:", newTask);
    } catch (e) {
      console.error("Error saving task: ", e);
    }
    finally {
      setTaskTitle('');
      setTaskContent('');
      setLoading(false);
      router.push('/(tabs)/task-list')
    }
  }

  return (
    <ThemedSafeAreaView style={styles.safeArea} darkColor='#000000'>
      <ScrollView style={styles.scrollView}>

        <ThemedView style={styles.headerContainer} backgroundVisible={false}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('..')}>
            <FontAwesome name="arrow-left" size={24} color="#6b7280" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>{t('task.create_new_task')}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.formSection}>

          <ThemedView style={styles.inputGroup}>
            <ThemedLabel style={styles.inputLabel}>{t('task.task_title')}</ThemedLabel>
            <ThemedInput
              style={styles.textInput}
              placeholder={t('task.finish_project_report')}
              placeholderTextColor="#9ca3af"
              onChangeText={setTaskTitle}
              value={taskTitle}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedLabel style={styles.inputLabel}>{t('task.description')}</ThemedLabel>
            <ThemedInput
              style={styles.textArea}
              placeholder={t('task.add_more_details')}
              placeholderTextColor="#9ca3af"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              onChangeText={setTaskContent}
              value={taskContent}
            />
          </ThemedView>

          {/* Sub tasks */}
          <ThemedView style={styles.checklistSection}>
            <ThemedText style={styles.checklistTitle}>{t('task.subtasks_checklist')}</ThemedText>
            <ThemedView style={styles.checklistContainer}>

              {checklist.map((item, index) => (
                <ThemedView key={index} style={styles.checklistItem}>
                  <ThemedView style={styles.checkitem}>
                    <TouchableOpacity style={styles.checkbox} onPress={() => { toggleSubTask(index) }}>
                      {item.completed && (<FontAwesome name="check" size={10} color="green" />)}
                    </TouchableOpacity>
                    <ThemedText style={[styles.checklistText, item.completed && ({ textDecorationLine: 'line-through' })]}>{item.text}</ThemedText>
                  </ThemedView>
                  <TouchableOpacity style={[styles.addButton, { backgroundColor: '#e54646ff', width: 30, height: 30 }]} onPress={() => removeSubTask(index)}>
                    <FontAwesome name="minus" size={10} color="white" />
                  </TouchableOpacity>
                </ThemedView>
              ))}

            </ThemedView>
            <ThemedView style={styles.addChecklistContainer}>
              <ThemedInput
                style={styles.subTaskInput}
                placeholder={t('task.add_subtask')}
                placeholderTextColor="#9ca3af"
                onChangeText={setSubTaskText}
                value={subTaskText}
              />
              <TouchableOpacity style={[styles.addButton, { backgroundColor: '#4b46e5ff' }]} onPress={addSubTask}>
                <FontAwesome name="plus" size={16} color="white" />
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.gridContainer}>
            <ThemedView style={styles.relativeInput}>
              <ThemedLabel style={styles.inputLabel}>{t('task.due_date')}</ThemedLabel>
              <ThemedInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                value={dateTime.toLocaleDateString()}
                onPress={() => setdatetimeOpen(true)}
              />
            </ThemedView>
            <ThemedView style={styles.relativeInput}>
              <ThemedLabel style={styles.inputLabel}>{t('task.due_time')}</ThemedLabel>
              <ThemedInput
                style={styles.textInput}
                placeholder="HH:MM"
                placeholderTextColor="#9ca3af"
                value={dateTime.toLocaleTimeString()}
                onPress={() => setdatetimeOpen(true)}
              />
            </ThemedView>
            <ThemedView style={styles.priorityList}>
              <ThemedLabel style={styles.inputLabel}>{t('task.priority')}</ThemedLabel>
              <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#9e9e9eff' }]} onPress={() => { setPriority('low') }}>
                <ThemedText style={styles.createButtonText}>{t('task.low')}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#1264deff' }]} onPress={() => { setPriority('medium') }}>
                <ThemedText style={styles.createButtonText}>{t('task.medium')}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.priorityButton, { backgroundColor: '#e54646ff' }]} onPress={() => { setPriority('high') }}>
                <ThemedText style={styles.createButtonText}>{t('task.high')}</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>

          {
            loading || isPredicting ? <ThemedText style={{ textAlign: 'center', marginBottom: 10, color: '#6b7280' }}>{t('task.creating_task')}</ThemedText> : (
              <TouchableOpacity style={styles.createButton} onPress={() => createTask(checklist)}>
                <ThemedText style={styles.createButtonText}>{t('task.create_task')}</ThemedText>
              </TouchableOpacity>
            )
          }

        </ThemedView>

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
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    shadowColor: '#aaaaaaff',
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
    position: 'absolute',
    top: -8,
    left: 12,
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
  },
  textArea: {
    height: 120,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 14,
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
