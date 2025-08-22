import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, where, deleteDoc, doc } from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import TaskItem from '@/components/Task';
import { TPriority, ITask } from '@/components/custom-interface/type';


export default function TaskList() {

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
        const refreshTasks: ITask[] = [];
        try {
            const journalsRef = collection(db, "Tasks");
            const q = query(
                journalsRef,
                where("uid", "==", user?.uid),
                orderBy("dateTime", "desc"),
                limit(count)
            );

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc: any) => {
                refreshTasks.push({ id: doc.id, ...doc.data() });
                console.log('Task id: ', doc.id);
            });
        }
        catch (e) {
            console.log('Error loading tasks: ', e)
        }
        finally {
            setLatestTasks(refreshTasks);
            setLoading(false);
        }
    }

    const deleteTask = async (id: string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "Tasks", id));
            loadTasks(10);
        }
        catch (err) {
            console.log('Error deleting journal entry: ', err);
        }
        finally {
            setLoading(false);
        }
    }

    const renderTaskItem = ({ item }: { item: ITask }) => (
        <TaskItem
            key={item.id}
            task={item}
            onEdit={() => { console.log('Edit id: ', item.id) }}
            onRemoveTask={() => { deleteTask(item.id)}}
        />
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>My Tasks</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => { router.push('/(screen)/task_create') }}>
                        <FontAwesome name="plus" size={16} color="white" style={styles.addButtonIcon} />
                        <Text style={styles.addButtonText}>Add Task</Text>
                    </TouchableOpacity>
                </View>

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
                />

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
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
});
