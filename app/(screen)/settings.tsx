import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Reusable Settings Item Component ---
const SettingsItem = ({ label, children, isLastItem }: any) => {
    return (
        <View style={[styles.item, isLastItem && styles.lastItem]}>
            <Text style={styles.itemLabel}>{label}</Text>
            <View style={styles.itemRightContent}>
                {children}
            </View>
        </View>
    );
};

// --- Main Settings Screen Component ---
export default function App() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [journalReminders, setJournalReminders] = useState(false);
    const [taskUpdates, setTaskUpdates] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [dataSharing, setDataSharing] = useState(false);

    // Function to toggle the theme
    const toggleTheme = () => setIsDarkTheme(previousState => !previousState);

    // Set up dynamic styles based on theme
    const themeStyles = isDarkTheme ? darkStyles : lightStyles;
    const combinedStyles = {
        container: { ...styles.container, ...themeStyles.container },
        headerText: { ...styles.headerText, ...themeStyles.headerText },
        card: { ...styles.card, ...themeStyles.card },
        sectionTitle: { ...styles.sectionTitle, ...themeStyles.sectionTitle },
        separator: { ...styles.separator, ...themeStyles.separator },
        linkText: { ...styles.linkText, ...themeStyles.linkText },
        deleteButtonText: { ...styles.deleteButtonText, ...themeStyles.deleteButtonText },
    };

    return (
        <SafeAreaView style={combinedStyles.container}>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={combinedStyles.headerText}>Settings</Text>
                </View>

                <View style={combinedStyles.card}>
                    <View style={styles.section}>
                        <Text style={combinedStyles.sectionTitle}>Account</Text>
                        <SettingsItem label="Theme">
                            <Switch
                                ios_backgroundColor={isDarkTheme ? '#4f46e5' : '#ccc'}
                                onValueChange={toggleTheme}
                                value={isDarkTheme}
                            />
                        </SettingsItem>
                        <SettingsItem label="Change Password">
                            <TouchableOpacity onPress={() => console.log('Change Password pressed')}>
                                <Text style={combinedStyles.linkText}>Edit</Text>
                            </TouchableOpacity>
                        </SettingsItem>
                        <SettingsItem label="Email Notifications">
                            <Switch
                                ios_backgroundColor={emailNotifications ? '#4f46e5' : '#ccc'}
                                onValueChange={setEmailNotifications}
                                value={emailNotifications}
                            />
                        </SettingsItem>
                        <SettingsItem label="Delete Account" isLastItem>
                            <TouchableOpacity onPress={() => console.log('Delete Account pressed')}>
                                <Text style={combinedStyles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </SettingsItem>
                    </View>

                    <View style={combinedStyles.separator} />

                    <View style={styles.section}>
                        <Text style={combinedStyles.sectionTitle}>Notifications</Text>
                        <SettingsItem label="Journal Reminders">
                            <Switch
                                ios_backgroundColor={journalReminders ? '#4f46e5' : '#ccc'}
                                onValueChange={setJournalReminders}
                                value={journalReminders}
                            />
                        </SettingsItem>
                        <SettingsItem label="Task Updates">
                            <Switch
                                ios_backgroundColor={taskUpdates ? '#4f46e5' : '#ccc'}
                                onValueChange={setTaskUpdates}
                                value={taskUpdates}
                            />
                        </SettingsItem>
                        <SettingsItem label="Push Notifications" isLastItem>
                            <Switch
                                ios_backgroundColor={pushNotifications ? '#4f46e5' : '#ccc'}
                                onValueChange={setPushNotifications}
                                value={pushNotifications}
                            />
                        </SettingsItem>
                    </View>

                    <View style={combinedStyles.separator} />

                    <View style={styles.section}>
                        <Text style={combinedStyles.sectionTitle}>Privacy</Text>
                        <SettingsItem label="Data Sharing">
                            <Switch
                                ios_backgroundColor={dataSharing ? '#4f46e5' : '#ccc'}
                                onValueChange={setDataSharing}
                                value={dataSharing}
                            />
                        </SettingsItem>
                        <SettingsItem label="View Privacy Policy" isLastItem>
                            <TouchableOpacity onPress={() => console.log('View Privacy Policy pressed')}>
                                <Text style={combinedStyles.linkText}>View</Text>
                            </TouchableOpacity>
                        </SettingsItem>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

// --- Stylesheet for Components ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        fontFamily: 'System', // Using a generic system font for cross-platform compatibility
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    itemLabel: {
        fontSize: 16,
        color: '#4b5563',
    },
    itemRightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 16,
    },
});

// --- Theme-specific styles ---
const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f4f6',
    },
    headerText: {
        color: '#1f2937',
    },
    card: {
        backgroundColor: '#ffffff',
    },
    sectionTitle: {
        color: '#1f2937',
    },
    linkText: {
        color: '#4f46e5',
    },
    deleteButtonText: {
        color: '#ef4444',
    },
    separator: {
        backgroundColor: '#e5e7eb',
    },
});

const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#1a202c',
    },
    headerText: {
        color: '#cbd5e0',
    },
    card: {
        backgroundColor: '#2d3748',
    },
    sectionTitle: {
        color: '#cbd5e0',
    },
    linkText: {
        color: '#9f7aea',
    },
    deleteButtonText: {
        color: '#f87171',
    },
    separator: {
        backgroundColor: '#4a5568',
    },
});
