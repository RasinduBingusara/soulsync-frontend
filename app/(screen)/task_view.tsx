import { getDate, getTime } from '@/components/custom-function/DateTime';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

// Define the type for a single sub-task item
interface ICheckBox {
    text: string,
    completed: boolean
}

// Define the type for the task object passed as a navigation parameter
interface ITask {
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
    subtasks: { [key: string]: ICheckBox };
    aiSuggestion: string;
    dateTime: string;
}

// --- Main Task View Screen Component ---
export default function TaskViewScreen() {
    // Use useLocalSearchParams to get the task object passed from the previous screen.
    const params = useLocalSearchParams();

    // The params object is stringified by Expo Router, so we need to parse it.
    const task = JSON.parse(params.task as string) as ITask;

    // State to manage the completion status of subtasks
    // We initialize it from the passed task data
    const [subtasks, setSubtasks] = useState<ICheckBox[]>(
        Object.values(task.subtasks)
    );

    // Helper function to get a style based on priority
    const getPriorityStyle = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high':
                return { backgroundColor: '#e54646ff' };
            case 'medium':
                return { backgroundColor: '#1264deff' };
            case 'low':
                return { backgroundColor: '#9e9e9eff' };
            default:
                return { backgroundColor: '#9e9e9eff' };
        }
    };

    // Function to toggle a sub-task's completion status
    const toggleSubTask = (index: number) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index].completed = !newSubtasks[index].completed;
        setSubtasks(newSubtasks);
    };

    const updateTaskInStorage = async () => {
        try {
            const tasksString = await AsyncStorage.getItem('Tasks');
            let tasks: ITask[] = [];
            if (tasksString) {
                tasks = JSON.parse(tasksString);
            }
            // Find and update the task by matching title, dateTime, and priority (or use id if available)
            const updatedTasks = tasks.map(t =>
                t.title === task.title &&
                    t.dateTime === task.dateTime &&
                    t.priority === task.priority
                    ? { ...t, subtasks: Object.assign({}, ...subtasks.map((st, i) => ({ [Object.keys(task.subtasks)[i]]: st }))) }
                    : t
            );
            await AsyncStorage.setItem('Tasks', JSON.stringify(updatedTasks));
            router.push('/(tabs)/task-list');
        } catch (e) {
            alert('Failed to update task.');
            console.error(e);
        }
    };

    // Convert the ISO date string to a readable format
    const formattedDate = getDate(task.dateTime);
    const formattedTime = getTime(task.dateTime);

    return (
        <ThemedSafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>

                <ThemedView style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Task Details</ThemedText>
                </ThemedView>

                <ThemedView style={styles.contentContainer}>

                    {/* Task Title */}
                    <ThemedText style={styles.taskTitle}>{task.title}</ThemedText>

                    {/* Priority, Date, and Time */}
                    <ThemedView style={styles.detailsGrid}>
                        <ThemedView style={styles.detailItem}>
                            <ThemedText style={styles.detailLabel}>Priority</ThemedText>
                            <ThemedView style={[styles.priorityBadge, getPriorityStyle(task.priority)]}>
                                <ThemedText style={styles.priorityText}>{task.priority}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <ThemedView style={styles.detailItem}>
                            <ThemedText style={styles.detailLabel}>Due Date</ThemedText>
                            <ThemedText style={styles.detailValue}>{formattedDate}</ThemedText>
                        </ThemedView>
                        <ThemedView style={styles.detailItem}>
                            <ThemedText style={styles.detailLabel}>Due Time</ThemedText>
                            <ThemedText style={styles.detailValue}>{formattedTime}</ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {/* Task Description */}
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
                        <ThemedText style={styles.sectionContent}>{task.content || 'No description provided.'}</ThemedText>
                    </ThemedView>

                    {/* Sub-tasks / Checklist */}
                    {subtasks.length > 0 && (
                        <ThemedView style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Sub-tasks</ThemedText>
                            {subtasks.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.checklistItem} onPress={() => toggleSubTask(index)}>
                                    <ThemedView style={styles.checkbox}>
                                        {item.completed && (<FontAwesome name="check" size={12} color="#4f46e5" />)}
                                    </ThemedView>
                                    <ThemedText style={[styles.checklistText, item.completed && styles.completedText]}>
                                        {item.text}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ThemedView>
                    )}

                    {/* AI Suggestion */}
                    {task.aiSuggestion && (
                        <ThemedView style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>AI Suggestion</ThemedText>
                            <ThemedView style={styles.aiSuggestionBox}>
                                <ThemedText style={styles.aiSuggestionText}>{task.aiSuggestion}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                    )}
                    <TouchableOpacity style={styles.updateButton} onPress={updateTaskInStorage}>
                        <ThemedText style={styles.updateButtonText}>Update Task</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}

// --- Stylesheet for Components ---
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
    contentContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 20,
    },
    taskTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: 16,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 12,
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    priorityBadge: {
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    priorityText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 16,
        color: '#4b5563',
        lineHeight: 24,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#d1d5db',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checklistText: {
        fontSize: 16,
        color: '#374151',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    aiSuggestionBox: {
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#2563eb',
    },
    aiSuggestionText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#1f2937',
    },
    updateButton: {
        marginTop: 16,
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});
