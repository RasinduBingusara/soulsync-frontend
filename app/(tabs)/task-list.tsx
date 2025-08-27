import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, where, deleteDoc, doc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import TaskItem from '@/components/Task';
import { TPriority } from '@/components/custom-interface/type';
import { ITask } from '@/components/custom-interface/CustomProps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import '@/components/translation/i18n';
import { ThemedView } from '@/components/ThemedView';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';

export default function TaskList() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [latestTasks, setLatestTasks] = useState<ITask[]>([]);

    const db = getFirestore();
    const user = getAuth().currentUser;

    // const toggleTaskCompletion = (taskId: number) => {
    //     setTasks(tasks.map(task =>
    //         task.id === taskId ? { ...task, completed: !task.completed } : task
    //     ));
    // };

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

    const loadTasks = async (count: number) => {
        setLoading(true);
        try {
            const tasksString = await AsyncStorage.getItem('Tasks');
            let tasks: ITask[] = [];
            if (tasksString) {
                tasks = JSON.parse(tasksString);
            }
            if (user?.uid) {
                tasks = tasks.filter(task => task.uid === user.uid);
            }
            // Sort by dateTime descending
            tasks.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
            // Limit to count
            setLatestTasks(tasks.slice(0, count));
        }
        catch (e) {
            console.log('Error loading tasks: ', e)
        }
        finally {
            setLoading(false);
        }
    }

    const deleteTask = async (id: string) => {
        console.log('Delete task id: ', id);
        setLoading(true);
        try {
            const tasksString = await AsyncStorage.getItem('Tasks');
            let tasks: ITask[] = [];
            if (tasksString) {
                tasks = JSON.parse(tasksString);
            }
            // Remove task by id
            const updatedTasks = tasks.filter(task => task.id !== id);
            await AsyncStorage.setItem('Tasks', JSON.stringify(updatedTasks));
            loadTasks(10);
        }
        catch (err) {
            console.log('Error deleting task: ', err);
        }
        finally {
            setLoading(false);
        }
    }

    const renderTaskItem = ({ item }: { item: ITask }) => (
        <ThemedView style={styles.taskItem}>
            <TaskItem
                key={item.id}
                task={item}
                onEdit={() => { console.log('Edit id: ', item.id) }}
                onRemoveTask={() => { deleteTask(item.id) }}
            />

        </ThemedView>
    );

    const onRefresh = useCallback(async () => {
        setLoading(true);
        try {
            loadTasks(5);
        } catch (error) {
            console.error("Failed to fetch new entries:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTasks(5);
    }, []);

    return (
        <ThemedSafeAreaView style={styles.safeArea}>
            <ThemedView style={styles.container}>

                {/* Header Section */}
                <ThemedView style={styles.headerContainer}>
                    <ThemedText style={styles.headerTitle}>{t('task_list.title')}</ThemedText>
                </ThemedView>

                <FlatList
                    data={latestTasks}
                    renderItem={renderTaskItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={onRefresh}
                            colors={['#0059ffff']}
                        />
                    }
                    contentContainerStyle={styles.entriesList}
                />

            </ThemedView>

            <TouchableOpacity style={styles.fab} onPress={() => { router.push('/(screen)/task_create') }}>
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#374151',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4f46e5',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    addButtonIcon: {
        marginRight: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    taskListSection: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 20,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 16,
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    taskCount: {
        fontSize: 14,
        color: '#6b7280',
    },
    taskListContainer: {
        gap: 16,
    },
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
        flexGrow: 1,
    },
    taskDetails: {
        marginLeft: 16,
        flexGrow: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
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
        color: '#b91c1c', // High
        // Overridden below by specific priority colors
    },
    // Specific priority text colors
    highPriorityText: { color: '#b91c1c' },
    mediumPriorityText: { color: '#ca8a04' },
    lowPriorityText: { color: '#065f46' },
    optionsButton: {
        marginLeft: 16,
    },
    entriesList: {
        gap: 16,
        paddingBottom: 10
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#4f46e5',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    }
});
