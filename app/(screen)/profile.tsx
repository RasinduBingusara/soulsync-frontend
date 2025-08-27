import { getCurrentUser, SignOut } from '@/components/custom-function/FireBaseFunctions';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import '@/components/translation/i18n';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


// Component to represent a single stat block
const StatBlock = ({ value, label }:any) => (
    <ThemedView style={styles.statBlock}>
        <ThemedText style={styles.statValue}>{value}</ThemedText>
        <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </ThemedView>
);

// Component to display a recent journal or task entry
const EntryItem = ({ icon, iconColor, text, subtext }:any) => (
    <View style={styles.entryItem}>
        <FontAwesome name={icon} size={16} color={iconColor} style={styles.entryIcon} />
        <ThemedText style={styles.entryText}>{text}</ThemedText>
        {subtext && <ThemedText style={styles.entrySubtext}>{subtext}</ThemedText>}
    </View>
);

// Component to display an emotion item
const EmotionItem = ({ icon, iconColor, text, percentage }:any) => (
    <View style={styles.emotionItem}>
        <View style={styles.emotionInfo}>
            <FontAwesome name={icon} size={16} color={iconColor} style={styles.entryIcon} />
            <ThemedText style={styles.emotionText}>{text}</ThemedText>
        </View>
        <ThemedText style={styles.emotionPercentage}>{percentage}</ThemedText>
    </View>
);

// Main app component
export default function Profile() {
    const {t} = useTranslation();
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
                        <StatBlock value="14" label={t('profile.journals')} />
                        <StatBlock value="8" label={t('profile.tasks')} />
                        <StatBlock value="2" label={t('profile.posts')} />
                    </ThemedView>

                    {/* Horizontal Rule */}
                    <ThemedView style={styles.divider} />

                    {/* Recent Journals Section */}
                    <ThemedView style={styles.sectionContainer}>
                        <ThemedView style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>{t('profile.recent_journals')}</ThemedText>
                            <TouchableOpacity>
                                <ThemedText style={styles.viewAllLink}>{t('profile.view_all')}</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                        <ThemedView style={styles.listContainer}>
                            <EntryItem 
                                icon="book" 
                                iconColor="#4f46e5" 
                                text="Feeling great after a productive day." 
                                subtext="2 days ago" 
                            />
                            <EntryItem 
                                icon="book" 
                                iconColor="#4f46e5" 
                                text="I'm a little anxious about tomorrow's meeting." 
                                subtext="3 days ago" 
                            />
                        </ThemedView>
                    </ThemedView>

                    {/* Ongoing Tasks Section */}
                    <ThemedView style={styles.sectionContainer}>
                        <ThemedView style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>{t('profile.ongoing_tasks')}</ThemedText>
                            <TouchableOpacity>
                                <ThemedText style={styles.viewAllLink}>{t('profile.view_all')}</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                        <ThemedView style={styles.listContainer}>
                            <EntryItem 
                                icon="check-square" 
                                iconColor="#22c55e" 
                                text="Finish report by Friday" 
                            />
                            <EntryItem 
                                icon="square-o" 
                                iconColor="#6b7280" 
                                text="Call a friend for coffee" 
                            />
                        </ThemedView>
                    </ThemedView>

                    {/* Top Emotions Section */}
                    <ThemedView style={styles.sectionContainer}>
                        <ThemedView style={styles.sectionHeader}>
                            <ThemedText style={styles.sectionTitle}>{t('profile.top_emotions')}</ThemedText>
                            <TouchableOpacity>
                                <ThemedText style={styles.viewAllLink}>{t('profile.view_history')}</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                        <ThemedView style={styles.listContainer}>
                            <EmotionItem 
                                icon="smile-o" 
                                iconColor="#facc15" 
                                text="Happy" 
                                percentage="30%" 
                            />
                            <EmotionItem 
                                icon="meh-o" 
                                iconColor="#3b82f6" 
                                text="Calm" 
                                percentage="25%" 
                            />
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
