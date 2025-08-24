import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TPriority } from '@/components/custom-interface/type';
import { TaskProps } from './custom-interface/CustomProps';


interface IDateTime {
  date: string,
  time: string
}

const getDate = (timestamp: string): string => {

  const dateObject = new Date(timestamp);

  const datePart = dateObject.toISOString().split('T')[0];

  return datePart;
}

const getTime = (timestamp: string): string => {

  const dateObject = new Date(timestamp);

  const localTime = dateObject.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return localTime;
}

const TaskItem = ({ task, onEdit, onRemoveTask }: TaskProps) => {

  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getPriorityStyle = (priority: TPriority) => {
    switch (priority) {
      case 'high':
        return styles.highPriority;
      case 'medium':
        return styles.mediumPriority;
      case 'low':
        return styles.lowPriority;
      default:
        return {};
    }
  };

  const confirmDelete = () => {
    onRemoveTask(task.id);
    setShowDeleteModal(false);
  };


  return (
    <View style={[styles.taskItem, true && styles.completedTask]}>
      <View style={styles.taskItemContent}>

        <View style={styles.taskDetails}>

          <Text style={styles.taskTitle}>
            {task.title}
          </Text>

          <View style={styles.taskMeta}>
            <Text style={styles.dueDateText}>Due: {getDate(task.dateTime)} / {getTime(task.dateTime)}</Text>
            <View style={[styles.priorityTag, getPriorityStyle(task.priority)]}>
              <Text style={styles.priorityText}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</Text>
            </View>
          </View>
          <Text style={styles.contentTitle}>
            {task.content}
          </Text>
          <Text style={{color: '#6b7280', fontSize: 12 }}>
            AI Suggestion: {task.aiSuggestion}
          </Text>
        </View>
      </View>


      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={styles.removeButton}>
          <FontAwesome name="trash" size={25} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonDelete]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  completedTask: {
    backgroundColor: '#e5e7eb',
    opacity: 0.6,
  },
  taskItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskDetails: {
    marginLeft: 16,
    flexShrink: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentTitle: {
    fontSize: 14,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDateText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  highPriority: {
    backgroundColor: '#fecaca',
  },
  mediumPriority: {
    backgroundColor: '#fde68a',
  },
  lowPriority: {
    backgroundColor: '#d1fae5',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  optionsButton: {
    marginLeft: 16,
  },
  removeButton: {
    marginLeft: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 30
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: "#ef4444",
  },
  buttonCancel: {
    backgroundColor: "#d1d5db",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TaskItem;
