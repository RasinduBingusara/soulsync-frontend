import { getRelativeTime } from '@/components/custom-function/DateTime';
import { getCurrentUser, SignOut } from '@/components/custom-function/FireBaseFunctions';
import { IJournalDataResponse, ITask } from '@/components/custom-interface/CustomProps';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import '@/components/translation/i18n';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';


// Component to represent a single stat block
const StatBlock = ({ value, label }: any) => (
    <ThemedView style={styles.statBlock}>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </ThemedView>
);

// Component to display a recent journal or task entry
const EntryItem = ({ icon, iconColor, text, subtext }: any) => (
    <View style={styles.entryItem}>
        <FontAwesome name={icon} size={16} color={iconColor} style={styles.entryIcon} />
        <ThemedText style={styles.entryText}>{text}</ThemedText>
        {subtext && <ThemedText style={styles.entrySubtext}>{subtext}</ThemedText>}
    </View>
);

// Component to display an emotion item
const EmotionItem = ({ icon, iconColor, text, percentage }: any) => (
    <View style={styles.emotionItem}>
        <View style={styles.emotionInfo}>
            <FontAwesome name={icon} size={16} color={iconColor} style={styles.entryIcon} />
            <ThemedText style={styles.emotionText}>{text}</ThemedText>
        </View>
        <ThemedText style={styles.emotionPercentage}>{percentage}</ThemedText>
    </View>
);



export default function Profile() {
    const { t } = useTranslation();
    const [recentEntries, setRecentEntries] = useState<IJournalDataResponse[]>([]);
    const [recentTasks, setRecentTasks] = useState<ITask[]>([]);
    const [journalCount, setJournalCount] = useState<number>(0);
    const [taskCount, setTaskCount] = useState<number>(0);
    const [postCount, setPostCount] = useState<number>(0);

    const db = getFirestore();
    const user = getAuth().currentUser;

    const getJournalEntries = async () => {
        const count = 2;
        try {
            const jsonValue = await AsyncStorage.getItem('Journals') || '[]';

            // If there's no data, or it's not a valid JSON array, return an empty array.
            if (jsonValue === null) {
                console.log("No journal entries found in AsyncStorage.");
            }

            let entries = JSON.parse(jsonValue);
            if (user?.uid) {
                entries = entries.filter((entry: any) => entry.uid === user.uid);
            }
            if (Array.isArray(entries)) {
                setJournalCount(entries.length);
                setRecentEntries(entries.slice(-count));
            } else {
                console.error("Journal entries found, but the data format is invalid (not an array).");
            }

        } catch (error) {
            // Handle potential errors during retrieval or parsing.
            console.error("Error retrieving last journal entry:", error);
        }
    };

    const getTasks = async () => {
        const count = 2;
        try {
            const jsonValue = await AsyncStorage.getItem('Tasks') || '[]';

            // If there's no data, or it's not a valid JSON array, return an empty array.
            if (jsonValue === null) {
                console.log("No tasks found in AsyncStorage.");
            }

            let tasks = JSON.parse(jsonValue);
            if (user?.uid) {
                tasks = tasks.filter((task: any) => task.uid === user.uid);
            }
            if (Array.isArray(tasks)) {
                setTaskCount(tasks.length);
                setRecentTasks(tasks.slice(-count));
            } else {
                console.error("Tasks found, but the data format is invalid (not an array).");
            }

        } catch (error) {
            // Handle potential errors during retrieval or parsing.
            console.error("Error retrieving last task:", error);
        }
    };

    const getPostCount = async () => {
        if (!db) {
            console.error("Firestore is not initialized.");
            return;
        }
        try {
            const uid = user?.uid;

            const q = query(collection(db, "Posts"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);

            const count = querySnapshot.size;
            setPostCount(count);
            console.log(`Successfully fetched post count for user ${uid}: ${count}`);
        } catch (error) {
            console.error("Error getting post count:", error);
        }
    };


    useEffect(() => {
        getJournalEntries();
        getTasks();
        getPostCount();
    }, [])
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                {/* Header Section */}
                <View style={styles.header}>
                    <ThemedText style={styles.headerTitle}>{t('profile.title')}</ThemedText>
                </View>

                {/* Profile Card */}
                <ThemedView style={styles.mainCard}>

                    {/* Profile Image */}
                    <ThemedView style={styles.profileImageContainer}>
                        <FontAwesome name="user-circle" size={100} color="#4f46e5" />
                    </ThemedView>

                    {/* User Info */}
                    <ThemedView style={styles.userInfo}>
                        <ThemedText style={styles.userName}>{getCurrentUser()?.displayName}</ThemedText>
                        <ThemedText style={styles.userEmail}>{getCurrentUser()?.email}</ThemedText>
                    </ThemedView>

                    {/* Stats Grid */}
                    <ThemedView style={styles.statsGrid}>
                        <StatBlock value={journalCount} label={t('profile.journals')} />
                        <StatBlock value={taskCount} label={t('profile.tasks')} />
                        <StatBlock value={postCount} label={t('profile.posts')} />
                    </ThemedView>

                    {/* Horizontal Rule */}
                    <ThemedView style={styles.divider} />

                    {/* Recent Journals Section */}
                    <ThemedView style={styles.sectionContainer}>
                        <ThemedView style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>{t('profile.recent_journals')}</ThemedText>
                            <TouchableOpacity onPress={() => { router.push('/(tabs)/journal-list') }}>
                                <ThemedText style={styles.viewAllLink}>{t('profile.view_all')}</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                        <ThemedView style={styles.listContainer}>

                            {recentEntries.map((entry, index) => (
                                <EntryItem
                                    key={index}
                                    icon="book"
                                    iconColor="#4f46e5"
                                    text={entry.content.length > 30 ? entry.content.substring(0, 30) + '...' : entry.content}
                                    subtext={getRelativeTime(entry.createAt)}
                                />
                            ))}

                        </ThemedView>
                    </ThemedView>

                    {/* Ongoing Tasks Section */}
                    <ThemedView style={styles.sectionContainer}>
                        <ThemedView style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>{t('profile.ongoing_tasks')}</ThemedText>
                            <TouchableOpacity onPress={() => { router.push('/(tabs)/task-list') }}>
                                <ThemedText style={styles.viewAllLink}>{t('profile.view_all')}</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                        <ThemedView style={styles.listContainer}>
                            {recentTasks.map((task, index) => (
                                <EntryItem
                                    key={index}
                                    icon="check-square"
                                    iconColor="#22c55e"
                                    text={task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title}
                                />
                            ))}

                        </ThemedView>
                    </ThemedView>

                    {/* Profile Actions */}
                    <ThemedView style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => { router.push('/(screen)/settings') }}>
                            <FontAwesome name="cog" size={18} color="#4b5563" style={styles.actionIcon} />
                            <ThemedText style={styles.actionText}>{t('profile.settings')}</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={() => { SignOut() }}>
                            <FontAwesome name="sign-out" size={18} color="white" style={styles.actionIcon} />
                            <ThemedText style={styles.logoutText}>{t('profile.logout')}</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollViewContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1f2937',
    },
    mainCard: {
        width: '95%',
        maxWidth: 512,
        backgroundColor: 'white',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
        padding: 24,
    },
    profileImageContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    userInfo: {
        marginBottom: 24,
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1f2937',
    },
    userEmail: {
        fontSize: 14,
        color: '#6b7280',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statBlock: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#374151',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#d1d5db',
        marginBottom: 24,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
    },
    viewAllLink: {
        fontSize: 12,
        fontWeight: '500',
        color: '#4f46e5',
    },
    listContainer: {
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    entryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    entryIcon: {
        width: 20,
        textAlign: 'center',
    },
    entryText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
    },
    entrySubtext: {
        fontSize: 12,
        color: '#9ca3af',
    },
    emotionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    emotionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emotionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    emotionPercentage: {
        fontSize: 12,
        color: '#6b7280',
    },
    actionsContainer: {
        gap: 12,
    },
    actionButton: {
        borderColor: '#737373ff',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionIcon: {
        // No specific styles needed here, color is set in the component
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4b5563',
    },
    logoutButton: {
        backgroundColor: '#ef4444',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});
