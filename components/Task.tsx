import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TPriority } from '@/components/custom-interface/type';
import { TaskProps } from './custom-interface/CustomProps';
import { getDate, getTime } from '@/components/custom-function/DateTime';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';


interface IDateTime {
  date: string,
  time: string
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

  const editTask = () => {
  // Serialize the task object to a JSON string for navigation
  router.push({ pathname: "/(screen)/task_view", params: { task: JSON.stringify(task) } });
};


  return (
    <ThemedView style={[styles.taskItem, true && styles.completedTask]} >
      <ThemedView style={styles.taskItemContent} >

        <ThemedView style={styles.taskDetails}>

          <ThemedText style={styles.taskTitle}>
            {task.title}
          </ThemedText>

          <ThemedView style={styles.taskMeta}>
            <ThemedText style={styles.dueDateText}>Due: {getDate(task.dateTime)} / {getTime(task.dateTime)}</ThemedText>
            <ThemedView style={[styles.priorityTag, getPriorityStyle(task.priority)]}>
              <ThemedText style={styles.priorityText}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.contentTitle}>
            {task.content}
          </ThemedText>
          {task.subtasks && Object.keys(task.subtasks).length > 0 && (
            <ThemedView style={styles.subtasksContainer}>
              <ThemedText style={styles.subtasksTitle}>Subtasks:</ThemedText>
              {Object.entries(task.subtasks).map(([key, subtask]: [string, any]) => (
                <ThemedView key={key} style={styles.subtaskRow}>
                  <FontAwesome
                    name={subtask.completed ? "check-square" : "square-o"}
                    size={16}
                    color={subtask.completed ? "#22c55e" : "#6b7280"}
                    style={{ marginRight: 8 }}
                  />
                  <ThemedText style={[
                    styles.subtaskText,
                    subtask.completed && styles.completedSubtaskText
                  ]}>
                    {subtask.text}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
          <ThemedText style={{ color: '#6b7280', fontSize: 12 }}>
            AI Suggestion: {task.aiSuggestion}
          </ThemedText>
        </ThemedView>
      </ThemedView>


      <ThemedView style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <TouchableOpacity onPress={editTask} style={styles.removeButton}>
          <FontAwesome name="edit" size={25} color="#039900ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={styles.removeButton}>
          <FontAwesome name="trash" size={25} color="#ef4444" />
        </TouchableOpacity>
      </ThemedView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <ThemedView style={styles.centeredView}>
          <ThemedView style={styles.modalView}>
            <ThemedText style={styles.modalText}>Are you sure you want to delete this task?</ThemedText>
            <ThemedView style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonDelete]}
                onPress={confirmDelete}
              >
                <ThemedText style={styles.buttonText}>Delete</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>

    </ThemedView>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  completedTask: {
    backgroundColor: '#e5e7eb',
    opacity: 0.7,
  },
  taskItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  taskDetails: {
    marginLeft: 12,
    flexShrink: 1,
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  contentTitle: {
    fontSize: 15,
    color: '#334155',
    marginTop: 4,
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
    gap: 8,
  },
  dueDateText: {
    fontSize: 13,
    color: '#64748b',
    marginRight: 8,
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    marginLeft: 2,
  },
  highPriority: {
    backgroundColor: '#fee2e2',
  },
  mediumPriority: {
    backgroundColor: '#fef9c3',
  },
  lowPriority: {
    backgroundColor: '#dcfce7',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b91c1c',
  },
  optionsButton: {
    marginLeft: 16,
  },
  removeButton: {
    marginLeft: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 6,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 30
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  modalText: {
    marginBottom: 18,
    textAlign: "center",
    fontSize: 17,
    color: "#334155",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
    gap: 12,
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
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
    fontSize: 15,
  },
  subtasksContainer: {
    marginTop: 10,
    marginLeft: 0,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  subtasksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingLeft: 2,
  },
  subtaskText: {
    fontSize: 13,
    color: '#334155',
  },
  completedSubtaskText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
});

export default TaskItem;