import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDate, getTime } from '@/components/custom-function/DateTime';

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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollView}>

                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Task Details</Text>
                </View>

                <View style={styles.contentContainer}>

                    {/* Task Title */}
                    <Text style={styles.taskTitle}>{task.title}</Text>

                    {/* Priority, Date, and Time */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Priority</Text>
                            <View style={[styles.priorityBadge, getPriorityStyle(task.priority)]}>
                                <Text style={styles.priorityText}>{task.priority}</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Due Date</Text>
                            <Text style={styles.detailValue}>{formattedDate}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Text style={styles.detailLabel}>Due Time</Text>
                            <Text style={styles.detailValue}>{formattedTime}</Text>
                        </View>
                    </View>

                    {/* Task Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.sectionContent}>{task.content || 'No description provided.'}</Text>
                    </View>

                    {/* Sub-tasks / Checklist */}
                    {subtasks.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Sub-tasks</Text>
                            {subtasks.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.checklistItem} onPress={() => toggleSubTask(index)}>
                                    <View style={styles.checkbox}>
                                        {item.completed && (<FontAwesome name="check" size={12} color="#4f46e5" />)}
                                    </View>
                                    <Text style={[styles.checklistText, item.completed && styles.completedText]}>
                                        {item.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* AI Suggestion */}
                    {task.aiSuggestion && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>AI Suggestion</Text>
                            <View style={styles.aiSuggestionBox}>
                                <Text style={styles.aiSuggestionText}>{task.aiSuggestion}</Text>
                            </View>
                        </View>
                    )}
                    <TouchableOpacity style={styles.updateButton} onPress={updateTaskInStorage}>
                        <Text style={styles.updateButtonText}>Update Task</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Stylesheet for Components ---
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
